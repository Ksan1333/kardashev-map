/* ---------- 3Dジオラマ（three.js r128） ---------- */
const S3D=(()=>{
  if(typeof THREE==="undefined") return null;
  let renderer,scene,camera,root,el,running=false,last=0,t0=performance.now();
  let tod="n",wx="clear",type=null;
  let anims=[],walkers=[],winMats=[],lampMats=[],snowables=[],nightOnly=[],dayOnly=[],umbrellas=[],onTod=[];
  let rain,snow,hemi,sun,amb,moon,sky,stars,disc;
  const cam={th:.8,ph:1.0,r:58,auto:true,drag:null};
  let seed=1;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const C=c=>new THREE.Color(c);
  const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.85,metalness:0,...o});
  const texC={};
  function ctex(key,w,h,draw,rep=[1,1]){if(!texC[key]){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;texC[key]=t;}const t=texC[key].clone();t.needsUpdate=true;t.repeat.set(...rep);return t;}
  const facade=(lit)=>(g,w,h)=>{g.fillStyle=lit?"#000":"#ffffff";g.fillRect(0,0,w,h);for(let y=6;y<h;y+=16)for(let x=4;x<w;x+=12){if(lit){g.fillStyle=Math.random()<.55?"#ffd58a":"#000";}else g.fillStyle="#3a4252";g.fillRect(x,y,7,9);}
    if(!lit){g.fillStyle="rgba(0,0,0,.08)";for(let y=0;y<h;y+=16)g.fillRect(0,y,w,2);}};
  const groundTex=()=>ctex("ground",256,256,(g,w,h)=>{g.fillStyle="#fff";g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=200+Math.random()*55|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*5,2+Math.random()*5);}},[8,8]);
  const stoneTex=()=>ctex("stone",128,128,(g,w,h)=>{g.fillStyle="#fff";g.fillRect(0,0,w,h);g.strokeStyle="rgba(0,0,0,.18)";for(let y=0;y<h;y+=8){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();for(let x=(y/8%2)*8;x<w;x+=16){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+8);g.stroke();}}},[6,6]);
  const winMat=()=>{const m=mat("#2a2f3a",{emissive:"#ffcf7a",emissiveIntensity:0});winMats.push(m);return m;};

  function init(container){
    el=container;
    renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    
    el.appendChild(renderer.domElement);
    camera=new THREE.PerspectiveCamera(42,1,.5,600);
    // 操作
    const cv=renderer.domElement;
    cv.addEventListener("pointerdown",e=>{cam.drag={x:e.clientX,y:e.clientY,th:cam.th,ph:cam.ph};cam.auto=false;cv.setPointerCapture(e.pointerId);});
    cv.addEventListener("pointermove",e=>{if(!cam.drag)return;cam.th=cam.drag.th-(e.clientX-cam.drag.x)*.008;cam.ph=Math.min(1.45,Math.max(.25,cam.drag.ph-(e.clientY-cam.drag.y)*.006));});
    cv.addEventListener("pointerup",()=>cam.drag=null);
    cv.addEventListener("wheel",e=>{e.preventDefault();cam.r=Math.min(110,Math.max(18,cam.r*Math.exp(e.deltaY*.001)));},{passive:false});
    new ResizeObserver(resize).observe(el); resize();
  }
  function resize(){if(!el)return;const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);renderer.domElement.style.width=w+"px";renderer.domElement.style.height=h+"px";camera.aspect=w/h;camera.updateProjectionMatrix();}

  // ---- 部品 ----
  function add(m,x=0,y=0,z=0,ry=0){m.position.set(x,y,z);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
  const box=(w,h,d,c,x,y,z,ry)=>add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==="string"?mat(c):c),x,y+h/2,z,ry);
  const cyl=(rt,rb,h,c,x,y,z,seg=12)=>add(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),typeof c==="string"?mat(c):c),x,y+h/2,z);
  const cone=(r,h,c,x,y,z,seg=12,ry=0)=>add(new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),typeof c==="string"?mat(c):c),x,y+h/2,z,ry);
  const sph=(r,c,x,y,z,sx=1,sy=1,sz=1)=>{const m=add(new THREE.Mesh(new THREE.SphereGeometry(r,14,10),typeof c==="string"?mat(c):c),x,y,z);m.scale.set(sx,sy,sz);return m;};
  function ground(c,r=34){const m=mat(c,{map:groundTex()});snowables.push(m);const g=new THREE.Mesh(new THREE.CylinderGeometry(r,r+1.5,2,64),m);g.position.y=-1;g.receiveShadow=true;g.userData.noEdge=true;root.add(g);
    const s=new THREE.Mesh(new THREE.CylinderGeometry(r+1.5,r+1.5,.6,48),mat("#3b2f25"));s.position.y=-2.3;root.add(s);return m;}
  function water(x,z,w,d,c="#3d86c6",y=.06,shape="box"){const m=new THREE.MeshStandardMaterial({color:c,roughness:.12,metalness:.35,transparent:true,opacity:.9,flatShading:true});
    const g=shape==="disk"?new THREE.CircleGeometry(w,48,0,Math.PI*2):new THREE.PlaneGeometry(w,d,Math.max(2,Math.round(w/1.5)),Math.max(2,Math.round(d/1.5)));
    const p=new THREE.Mesh(g,m);p.rotation.x=-Math.PI/2;p.position.set(x,y,z);p.receiveShadow=true;root.add(p);
    const pos=g.attributes.position, base=pos.array.slice();
    anims.push(t=>{for(let i=0;i<pos.count;i++){const X=base[i*3],Y=base[i*3+1];pos.setZ(i,Math.sin(X*.35+t*1.2)*.09+Math.cos(Y*.3+t*.9)*.09);}pos.needsUpdate=true;g.computeVertexNormals();});
    return p;}
  function mountains(n,c,rmin=24,rmax=32,hmin=6,hmax=14,arc=[0,Math.PI*2]){const m=mat(c);snowables.push(m);
    for(let i=0;i<n;i++){const a=arc[0]+(arc[1]-arc[0])*(i/n)+R()*.2,r=rmin+R()*(rmax-rmin),h=hmin+R()*(hmax-hmin);
      cone(4+R()*4,h,m,Math.cos(a)*r,0,Math.sin(a)*r,6,R());}}
  function tree(x,z,kind="broad",s=1){
    if(kind==="palm"){cyl(.15*s,.2*s,3*s,"#8a6a45",x,0,z,6);for(let i=0;i<5;i++){const l=box(2.2*s,.1,.5*s,"#3f8a3a",x,3*s,z,i*1.25);l.rotation.z=-.3;}return;}
    if(kind==="conifer"){cyl(.15*s,.2*s,1*s,"#6b4a2b",x,0,z,6);const m=mat("#2f5d3a");snowables.push(m);cone(1.1*s,3*s,m,x,1*s,z,7);return;}
    cyl(.15*s,.22*s,1.4*s,"#6b4a2b",x,0,z,6);const base=kind==="red"?"#c8553d":kind==="jungle"?"#2f6b2a":"#4f8a3c";const m=mat(base),m2=mat(new THREE.Color(base).offsetHSL(0,0,.06).getStyle());snowables.push(m,m2);
    sph(1.05*s,m,x,2.1*s,z);sph(.75*s,m2,x+.55*s,2.5*s,z+.2*s);sph(.7*s,m2,x-.45*s,2.55*s,z-.3*s);sph(.6*s,m,x+.1*s,2.95*s,z+.35*s);
  }
  function trees(n,kind,inR=8,outR=30,s=1,avoid){for(let i=0;i<n;i++){const a=R()*Math.PI*2,r=inR+R()*(outR-inR),x=Math.cos(a)*r,z=Math.sin(a)*r;if(avoid&&avoid(x,z))continue;tree(x,z,kind,s*(.7+R()*.6));}}
  function building(x,z,w,d,h,c="#9aa3b2",roof){const rp=[Math.max(1,Math.round(w/1.4)),Math.max(1,Math.round(h/1.8))];
    const m=new THREE.MeshStandardMaterial({color:c,map:ctex("fac",48,64,facade(false),rp),emissiveMap:ctex("facl"+(winMats.length%4),48,64,facade(true),rp),emissive:"#ffcf7a",emissiveIntensity:0,roughness:.75,metalness:.05});winMats.push(m);
    const b=box(w,h,d,m,x,0,z);
    if(roof){const m=mat(roof);snowables.push(m);box(w+.2,.3,d+.2,m,x,h,z);}return b;}
  function house(x,z,w,d,h,wall="#e8dcc4",roof="#a8442f",ry=0){const g=new THREE.Group();
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(wall));b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
    const rr=w/1.55,rm=mat(roof);snowables.push(rm);const r=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr,d+.3,3),rm);r.rotation.x=-Math.PI/2;r.position.y=h+rr*.5;r.castShadow=true;g.add(r);
    const wm=winMat();const win=new THREE.Mesh(new THREE.PlaneGeometry(w*.35,h*.3),wm);win.position.set(0,h*.55,d/2+.02);g.add(win);
    g.position.set(x,0,z);g.rotation.y=ry;root.add(g);return g;}
  function city(n,inR,outR,hmin,hmax,colors=["#9aa3b2","#b7b0a2","#8790a3","#c2c7cf"],avoid,roof){
    for(let i=0;i<n;i++){const a=R()*Math.PI*2,r=inR+R()*(outR-inR),x=Math.cos(a)*r,z=Math.sin(a)*r;if(avoid&&avoid(x,z))continue;
      building(x,z,2+R()*2.5,2+R()*2.5,hmin+R()*(hmax-hmin),colors[i%colors.length],roof);}}
  function lamp(x,z,h=3){cyl(.07,.07,h,"#333",x,0,z,5);const m=mat("#555",{emissive:"#ffd38a",emissiveIntensity:0});lampMats.push(m);sph(.22,m,x,h,z);}
  function person(c){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.17,.21,.55,8),mat(c));b.position.y=.72;b.castShadow=true;g.add(b);
    const h=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),mat(["#e0b48c","#c58c5c","#8d5a3b","#f1c9a5"][Math.floor(R()*4)]));h.position.y=1.12;h.castShadow=true;g.add(h);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.155,10,6,0,Math.PI*2,0,Math.PI/2),mat(["#2a1d14","#5a3a22","#111","#c9a46a"][Math.floor(R()*4)]));hair.position.y=1.14;g.add(hair);
    const lm=mat("#2f3542");const legs=[];for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(.1,.46,.1),lm);l.geometry.translate(0,-.23,0);l.position.set(sx*.08,.46,0);g.add(l);legs.push(l);}
    const arms=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.BoxGeometry(.08,.42,.08),mat(c));a.geometry.translate(0,-.2,0);a.position.set(sx*.23,.95,0);g.add(a);arms.push(a);}
    g.userData.legs=legs;g.userData.arms=arms;
    const u=new THREE.Mesh(new THREE.ConeGeometry(.55,.3,12),mat(["#c0392b","#2c3e50","#27ae60","#f1c40f"][Math.floor(R()*4)]));u.position.y=1.55;u.visible=false;g.add(u);umbrellas.push(u);
    root.add(g);return g;}
  const CLOTH=["#d35d4e","#4e7ad3","#e2b84a","#4aa36b","#8e5fd1","#ededed","#333a48","#e07f3a"];
  // 歩く人：path(t)→[x,z]
  function people(n,path,speed=1,cols=CLOTH){for(let i=0;i<n;i++){const g=person(cols[i%cols.length]);walkers.push({g,path,off:R()*100,sp:(.6+R()*.8)*speed,i,n});}}
  const ring=(r,cx=0,cz=0)=>(t,o)=>{const a=t*.05+o;return [cx+Math.cos(a)*(r+(o%1)*1.5),cz+Math.sin(a)*(r+(o%1)*1.5)];};
  const line=(x1,z1,x2,z2,w=1)=>(t,o)=>{const k=((t*.03+o*.137)%2+2)%2,f=k>1?2-k:k;return [x1+(x2-x1)*f+((o*7)%1-.5)*w,z1+(z2-z1)*f+((o*13)%1-.5)*w];};
  function movers(mesh,path,sp=1){const o=R()*100;anims.push(t=>{const [x,z]=path(t*sp,o);const [x2,z2]=path(t*sp+.05,o);mesh.position.x=x;mesh.position.z=z;mesh.rotation.y=Math.atan2(x2-x,z2-z);});}
  function car(path,c){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.9,.5,1.8),mat(c));b.position.y=.35;g.add(b);
    const m=mat("#fff",{emissive:"#fff3c4",emissiveIntensity:0});lampMats.push(m);const l=new THREE.Mesh(new THREE.BoxGeometry(.7,.15,.05),m);l.position.set(0,.4,.92);g.add(l);root.add(g);movers(g,path,1.6);return g;}
  function aurora(){const m=new THREE.MeshBasicMaterial({color:"#5dffb0",transparent:true,opacity:.35,side:THREE.DoubleSide});
    for(let i=0;i<3;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(70,10,20,1),m);p.position.set(0,17+i*2.5,-24+i*3);p.rotation.x=.25;root.add(p);nightOnly.push(p);
      const pos=p.geometry.attributes.position;anims.push(t=>{for(let k=0;k<pos.count;k++){pos.setZ(k,Math.sin(pos.getX(k)*.15+t*.6+i)*2);}pos.needsUpdate=true;});}}
  function clouds(n,y=22){const m=mat("#ffffff",{transparent:true,opacity:.85});for(let i=0;i<n;i++){const g=new THREE.Group();for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.9+R()*.7,8,6),m);s.position.set(k*1.1,R()*.6,R()*.6);g.add(s);}
    g.position.set(-30+R()*60,y+R()*4,-20+R()*40);root.add(g);const o=R()*60;anims.push(t=>{g.position.x=((t*.6+o)%70)-35;});}}
  function rocket(x,z,s=1){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.7*s,.7*s,9*s,12),mat("#f2f2f2"));b.position.y=4.5*s;g.add(b);
    const n=new THREE.Mesh(new THREE.ConeGeometry(.7*s,2*s,12),mat("#d0d4dc"));n.position.y=10*s;g.add(n);
    const fm=new THREE.MeshBasicMaterial({color:"#ffb347",transparent:true,opacity:.9});const fl=new THREE.Mesh(new THREE.ConeGeometry(.8*s,3.5*s,10),fm);fl.rotation.x=Math.PI;fl.position.y=-1.7*s;fl.visible=false;g.add(fl);
    g.position.set(x,0,z);root.add(g);
    anims.push(t=>{const c=t%30;if(c<22){g.position.y=0;fl.visible=false;}else{const k=c-22;g.position.y=k*k*.9;fl.visible=true;fl.scale.y=1+Math.sin(t*30)*.2;}});
    return g;}

  // ---- シーン ----
  const SC={
    pyramid(){ground("#d9b77a");const st=c=>mat(c,{map:stoneTex()});cone(9,12,st("#cfae74"),-6,0,-4,4,Math.PI/4);cone(7.5,10,st("#c9a76d"),8,0,4,4,Math.PI/4);cone(4,5.5,st("#c4a168"),2,0,14,4,Math.PI/4);
      box(1.5,1.6,4,"#bf9d66",-14,0,8);sph(.9,"#bf9d66",-14,2.2,6.6);
      city(26,24,31,1.5,5,["#c9b48c","#d8c7a3","#b9a57f"]);people(16,ring(13),1);
      for(let i=0;i<4;i++){const c=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.9,1.8),mat("#a8794a"));b.position.y=1.1;c.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.9,.4),mat("#a8794a"));h.position.set(0,1.8,1);c.add(h);root.add(c);movers(c,ring(17,0,0),.6);}
      for(let i=0;i<6;i++)lamp(Math.cos(i)*15,Math.sin(i)*15);},
    wall(){ground("#7d9a5a");mountains(16,"#6f8a52",18,32,6,14);const m=mat("#a39b8c");snowables.push(m);
      for(let i=-28;i<=28;i+=2){const z=Math.sin(i*.12)*8,y=Math.cos(i*.08)*2+2;box(2.2,1.6,1.4,m,i,y,z,-Math.atan(Math.cos(i*.12)*.96));if(i%10===0)box(2.6,3.2,2.6,m,i,y,z);}
      trees(40,"broad",4,30,1,(x,z)=>Math.abs(z-Math.sin(x*.12)*8)<3);people(14,(t,o)=>{const x=((t*.4+o*9)%56)-28;return [x,Math.sin(x*.12)*8];},.5);
      walkers.forEach(w=>w.yfn=x=>Math.cos(x*.08)*2+3.6);},
    terraces(){ground("#5f8a46");const pk=mat("#4d7a3b");snowables.push(pk);cone(9,22,pk,-8,0,-14,8);cone(5,10,pk,10,0,-18,7);mountains(10,"#557f40",26,33,8,18);
      for(let k=0;k<6;k++){const r=16-k*2.2;const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1.2,32,1,false,0,Math.PI),mat(k%2?"#6e9a50":"#7aa65a"));t.position.set(4,.6+k*1.2,6);root.add(t);snowables.push(t.material);}
      for(let i=0;i<14;i++)box(1.4,1.2,1.4,"#9b958a",-4+R()*12,7.4,2+R()*6);
      for(let i=0;i<5;i++){const l=box(.6,.7,1.2,"#f3eee4",0,0,0);movers(l,ring(9,4,10),.3);}
      people(10,ring(6,4,8),.6);clouds(6,10);},
    temple(){ground("#6e9b4f");const w="#3c7fb0";water(0,-16,40,6,w);water(0,16,40,6,w);water(-17,0,6,26,w);water(17,0,6,26,w);
      const s="#9c8c74";box(18,1.5,18,s,0,0,0);box(13,1.5,13,s,0,1.5,0);box(8,1.5,8,s,0,3,0);
      [[0,0,9],[-5,-5,6],[5,-5,6],[-5,5,6],[5,5,6]].forEach(([x,z,h])=>{for(let k=0;k<5;k++)cyl(1.6-k*.28,1.8-k*.28,h/5,s,x,4.5+k*h/5,z,8);});
      trees(30,"palm",22,32);people(12,ring(11),.6,["#e8892b","#e8892b","#4e7ad3","#ededed"]);clouds(3);},
    columns(){ground("#c2b48f");const hill=mat("#a8977a");snowables.push(hill);cyl(12,16,6,hill,0,0,0,10);
      const mb="#e8e0cf";box(13,.8,7,mb,0,6,0);for(let i=0;i<8;i++){cyl(.35,.4,4,mb,-5.6+i*1.6,6.8,-2.8,10);cyl(.35,.4,4,mb,-5.6+i*1.6,6.8,2.8,10);}
      box(13,.7,7,mb,0,10.8,0);const roof=new THREE.Mesh(new THREE.CylinderGeometry(4,4,13,3,1),mat(mb));roof.rotation.z=Math.PI/2;roof.rotation.x=Math.PI/2*0;roof.scale.set(1,1,.45);roof.position.set(0,12.4,0);root.add(roof);
      city(50,18,31,1.5,4,["#efe9df","#e6dccb","#f3efe8"],null,"#c46d4f");people(12,ring(8),.5);for(let i=0;i<8;i++)lamp(Math.cos(i*.8)*13,Math.sin(i*.8)*13);},
    arena(){ground("#8c8a84");const tr=mat("#c9b38f",{side:THREE.DoubleSide});const a=new THREE.Mesh(new THREE.CylinderGeometry(9,9,7,36,1,true),tr);a.scale.z=.78;a.position.y=3.5;root.add(a);
      const a2=new THREE.Mesh(new THREE.CylinderGeometry(9.1,9.1,2.5,36,1,true,0,Math.PI*1.1),tr);a2.scale.z=.78;a2.position.y=8.2;root.add(a2);
      for(let i=0;i<36;i++){const ang=i/36*Math.PI*2;const m=new THREE.Mesh(new THREE.BoxGeometry(.9,1.6,.2),winMat());m.position.set(Math.cos(ang)*9.05,2+ (i%3)*2,Math.sin(ang)*9.05*.78);m.rotation.y=-ang+Math.PI/2;root.add(m);}
      water(0,0,7,7,"#b59a72",.1,"disk");city(30,18,31,2,5,["#d9a46f","#e2bb86","#c98f5c"],null,"#b5573a");
      people(18,ring(12),.8);for(let i=0;i<6;i++)car(ring(15.5),["#c0392b","#f5f5f5","#2c3e50"][i%3]);for(let i=0;i<10;i++)lamp(Math.cos(i*.63)*14,Math.sin(i*.63)*14);},
    taj(){ground("#6f9a4c");water(0,8,4,22,"#5b9bd5");box(16,1.2,10,"#f4f1ea",0,0,-8);box(8,7,8,"#f6f4ef",0,1.2,-8);
      sph(3.6,"#fbfaf6",0,9.6,-8,1,1.25,1);cone(.6,2,"#d9c47a",0,13.2,-8,8);
      [[-7,-12.5],[7,-12.5],[-7,-3.5],[7,-3.5]].forEach(([x,z])=>{cyl(.45,.55,10,"#f6f4ef",x,1.2,z,10);sph(.7,"#f6f4ef",x,11.4,z);});
      water(0,-24,70,8,"#7a9a8a");trees(26,"conifer",14,30,1.2,(x,z)=>Math.abs(x)<4||z<-18);people(16,line(0,18,0,-2,6),.6,["#e84a5f","#f8b500","#2ec4b6","#ff6b6b","#ffffff"]);},
    pagoda(){ground("#7a8f5a");const wd="#6b3b2a",rf="#3a3a3a";for(let k=0;k<5;k++){const s=4.5-k*.6;box(s,1.6,s,wd,-6,k*2.2,-4);const r=mat(rf);snowables.push(r);box(s+2.2,.4,s+2.2,r,-6,k*2.2+1.6,-4);}
      cone(.25,3,"#c9a24a",-6,11,-4,6);box(9,3,6,wd,8,0,-2);const r2=mat(rf);snowables.push(r2);box(11,.6,8,r2,8,3,-2);
      trees(26,"red",10,30);trees(16,"conifer",12,30);city(26,20,31,1.6,3.2,["#4a3a30","#5a4a3c","#3e3a36"],null,"#2f2f2f");people(14,line(-14,10,14,10,2),.6);for(let i=0;i<8;i++)lamp(-14+i*4,12,2.4);},
    dome(){ground("#7f8a74");water(0,14,70,7,"#5d8fb5");const br=mat("#8c6e55");box(9,6,7,br,0,0,0);
      const sk=new THREE.Mesh(new THREE.SphereGeometry(3,10,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:"#2b2b2b",wireframe:true}));sk.position.set(0,6.5,0);root.add(sk);cyl(3,3,.6,"#5a5a5a",0,6,0,16);
      trees(30,"broad",10,24,1,(x,z)=>z>9&&z<19);city(26,22,31,3,9);const tram=box(1.4,1.4,4,"#2f8f4e",0,0,0);movers(tram,line(-28,-12,28,-12,0),.5);
      people(14,ring(8),.5);for(let i=0;i<8;i++)lamp(-14+i*4,-9);},
    beach(){ground("#7f9b5b");water(0,10,70,30,"#3f78a8",.07);const s=mat("#e0cfa2");snowables.push(s);const sb=new THREE.Mesh(new THREE.BoxGeometry(68,.3,10),s);sb.position.set(0,.1,-2);root.add(sb);
      const cl=mat("#9b9a86");snowables.push(cl);box(68,4,5,cl,0,0,-10);box(3,1.6,3,"#7d7d7d",-8,4,-10);trees(18,"broad",20,32,1,(x,z)=>z>-12);
      for(let i=0;i<3;i++){const b=box(1.2,.8,3.2,"#e7e7e7",0,0,0);movers(b,line(-30,16+i*4,30,16+i*4,0),.3);}people(12,line(-25,-2,25,-2,6),.5);},
    spire(){ground("#c9b38a");const g=mat("#b9c6d6",{metalness:.4,roughness:.3});[[3.2,10],[2.6,10],[2,9],[1.4,8],[.9,7],[.5,6]].reduce((y,[r,h])=>{cyl(r*.8,r,h,g,0,y,0,6);return y+h;},0);cone(.35,8,"#c0ccd8",0,50,0,6);
      water(0,12,22,8,"#3e8fc4");city(40,10,30,4,22,["#9fb4c8","#c7d2dc","#7f97ad"]);for(let i=0;i<10;i++)car(ring(20),["#fff","#111","#c0392b","#e5c07b"][i%4]);people(12,ring(7,0,12),.6);
      for(let i=0;i<14;i++)lamp(Math.cos(i*.45)*18,Math.sin(i*.45)*18);},
    eiffel(){ground("#6e9a52");const ir=mat("#6e5a45");const leg=(sx,sz)=>{const l=box(1.2,12,1.2,ir,sx*4,0,sz*4);l.rotation.z=sx*.25;l.rotation.x=-sz*.25;};[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>leg(a,b));
      box(8,.8,8,ir,0,10.5,0);const lat=new THREE.MeshBasicMaterial({color:"#5a4632",wireframe:true});
      const t1=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.8,12,4,8),lat);t1.position.y=17;t1.rotation.y=Math.PI/4;root.add(t1);cyl(1.2,2.2,12,ir,0,11,0,4);box(3,.6,3,ir,0,20,0);
      const t2=new THREE.Mesh(new THREE.CylinderGeometry(.3,1.4,12,4,8),lat);t2.position.y=26.5;t2.rotation.y=Math.PI/4;root.add(t2);cyl(.2,1,12,ir,0,20.5,0,4);
      for(const [a,b] of[[1,0],[-1,0],[0,1],[0,-1]]){const ar=new THREE.Mesh(new THREE.TorusGeometry(2.6,.18,6,16,Math.PI),ir);ar.position.set(a*4,0,b*4);ar.rotation.y=a?Math.PI/2:0;ar.userData.noEdge=true;root.add(ar);}
      const sp=mat("#e0c070",{emissive:"#ffd76a",emissiveIntensity:0});nightOnly.push({m:sp});const beacon=cyl(.4,.4,1,sp,0,32,0,8);
      water(0,-18,70,6,"#4f7fa6");city(46,18,32,4,6,["#e6dcc6","#ddd2bb","#efe6d3"],(x,z)=>z<-14&&z>-22,"#5f6a76");people(16,line(0,4,0,16,5),.6);for(let i=0;i<10;i++)lamp(-3+(i%2)*6,4+i*1.2);
      onTod.push(t=>{sp.emissiveIntensity=t==="x"?2:0;});anims.push(t=>{if(tod==="x")sp.emissiveIntensity=1.2+Math.sin(t*20)*.8;});},
    statue(){ground("#4c76a0");water(0,0,34,0,"#356b9c",.1,"disk");const isl=mat("#6f8a55");snowables.push(isl);cyl(6,7,1.2,isl,0,0,0,7);box(5,1.6,5,"#a39b88",0,1.2,0,Math.PI/4);
      box(2.2,4,2.2,"#b2a994",0,2.8,0);cyl(.9,1.2,6,"#5fa48c",0,6.8,0,8);sph(.6,"#5fa48c",0,13.4,0);const arm=box(.35,3,.35,"#5fa48c",.8,12.2,0);arm.rotation.z=-.2;
      const torch=mat("#d9b64a",{emissive:"#ffb347",emissiveIntensity:0});lampMats.push(torch);cone(.4,.8,torch,1.2,15.2,0,8);
      for(let i=0;i<22;i++)building(-24+i*2.3,-22+R()*3,2,2,6+R()*16,["#8592a6","#a3adbd","#6f7d92"][i%3]);
      const f=box(1.4,1.2,3.6,"#e8a33a",0,0,0);movers(f,ring(14),.4);},
    opera(){ground("#6b8f5a");water(0,0,34,0,"#2f6fa3",.08,"disk");const pen=mat("#c9b99a");cyl(4,5,1,pen,0,0,2,12);box(6,1,10,pen,0,0,8);
      const sh=mat("#f7f5ef");[[0,-1,4],[0,1.5,3.6],[0,3.8,3],[3.2,0,2.6],[3.2,2.2,2.2]].forEach(([x,z,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,12,8,0,Math.PI,0,Math.PI/2),sh);s.position.set(x,1,z);s.rotation.y=-Math.PI/2;s.rotation.z=-.5;s.scale.set(.6,1.6,1);root.add(s);});
      const br=new THREE.Mesh(new THREE.TorusGeometry(12,.4,6,30,Math.PI),mat("#6b6f78"));br.position.set(-14,0,-14);br.rotation.y=Math.PI/4;root.add(br);
      city(30,26,33,4,14);for(let i=0;i<3;i++){const f=box(1.2,1,3,"#f2c94c",0,0,0);movers(f,ring(16+i*3),.3);}people(10,ring(4.5,0,4),.4);},
    crossing(){ground("#5a5d64");const st=mat("#e9e9e9");for(let i=-4;i<=4;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(.8,10),st);s.rotation.x=-Math.PI/2;s.position.set(i*1.4,.05,0);root.add(s);const s2=s.clone();s2.rotation.z=Math.PI/2;s2.position.set(0,.05,i*1.4);root.add(s2);}
      [[-14,-14],[14,-14],[-14,14],[14,14]].forEach(([x,z])=>{for(let k=0;k<3;k++)building(x+(k-1)*5,z,4,6,8+R()*14,["#8b93a3","#b7bcc6","#6f7686"][k]);
        const sc=mat("#111",{emissive:["#ff4fa3","#47c8ff","#ffd54a","#7dff7a"][Math.abs(x+z)%4],emissiveIntensity:.6});const p=new THREE.Mesh(new THREE.PlaneGeometry(5,3),sc);p.position.set(x,9,z-Math.sign(z)*3.05);if(z>0)p.rotation.y=Math.PI;root.add(p);});
      people(60,(t,o)=>{const k=Math.floor(o*7)%4,f=((t*.05+o)%1);const P=[[-8,-8,8,8],[8,-8,-8,8],[-8,0,8,0],[0,-8,0,8]][k];return [P[0]+(P[2]-P[0])*f+((o*17)%1-.5)*2,P[1]+(P[3]-P[1])*f+((o*29)%1-.5)*2];},.9);
      for(let i=0;i<8;i++)car(line(-32,i%2?-5:5,32,i%2?-5:5,0),["#fff","#111","#d4a017","#2e86de"][i%4]);for(let i=0;i<12;i++)lamp(-20+i*3.6,-7);},
    dam(){ground("#6f8a5a");mountains(12,"#5f7a4c",14,30,12,22);water(0,-12,60,20,"#3f7fae",3);const d=new THREE.Mesh(new THREE.BoxGeometry(46,9,3),mat("#bdbdb6"));d.position.set(0,1.5,-2);root.add(d);
      for(let i=0;i<8;i++){const sp=new THREE.Mesh(new THREE.PlaneGeometry(1.6,6),new THREE.MeshBasicMaterial({color:"#e9f4ff",transparent:true,opacity:.6}));sp.position.set(-10+i*3,2,-.4);root.add(sp);}
      water(0,14,10,30,"#4a88b8");const s=box(1.4,1.2,4,"#d9d9d9",0,0,0);movers(s,line(-2,10,2,28,0),.3);box(4,12,4,"#9a9a94",17,0,-2);people(8,line(-20,-2,20,-2,.3),.4);walkers.forEach(w=>w.yfn=()=>6.2);},
    canal(){ground("#4f7f3c");water(0,0,70,6,"#3f7d8c",.4);const c=mat("#b0aca1");box(70,1.5,1.2,c,0,0,3.6);box(70,1.5,1.2,c,0,0,-3.6);box(1.4,2.2,8,"#8c8c8c",-6,0,0);box(1.4,2.2,8,"#8c8c8c",8,0,0);
      const sh=new THREE.Group();const hull=new THREE.Mesh(new THREE.BoxGeometry(14,2,4),mat("#c0392b"));hull.position.y=1.2;sh.add(hull);for(let i=0;i<6;i++){const ct=new THREE.Mesh(new THREE.BoxGeometry(2,1.2,3.6),mat(["#2e86de","#e67e22","#16a085","#f1c40f"][i%4]));ct.position.set(-5+i*2,2.8,0);sh.add(ct);}root.add(sh);movers(sh,line(-28,0,28,0,0),.15);sh.rotation.y=Math.PI/2;
      trees(60,"jungle",8,32,1.1,(x,z)=>Math.abs(z)<6);people(8,line(-20,5.5,20,5.5,.5),.4);for(let i=0;i<10;i++)lamp(-25+i*5.5,5);},
    launch(){const k=(cur&&cur.id)||"";const gc=k==="baikonur"?"#b8b07a":k==="wenchang"?"#8aa65a":"#6f9a5a";ground(gc);if(k!=="baikonur")water(18,14,30,14,"#3f7fae");
      box(6,.8,6,"#7d7d7d",0,0,0);const tw=mat("#c0392b");box(1.6,16,1.6,tw,3.4,.8,0);for(let i=0;i<7;i++)box(2.4,.2,.2,tw,2.6,2+i*2,0);rocket(0,0,1);
      box(10,6,7,"#d8d8d8",-16,0,-10);box(5,9,5,"#bfbfbf",-8,0,-16);if(k==="wenchang")trees(30,"palm",14,30);else if(k==="ksc")trees(16,"broad",16,30);
      for(let i=0;i<5;i++)car(line(-28,-4,28,-4,0),["#fff","#555"][i%2]);people(8,line(-20,-6,-10,-6,2),.4);for(let i=0;i<8;i++)lamp(-6+i*2,6);},
    lab(){ground("#6e9a52");mountains(10,"#5c7a4a",22,32,6,12,[Math.PI*.9,Math.PI*1.9]);const rg=new THREE.Mesh(new THREE.TorusGeometry(14,.12,6,64),new THREE.MeshBasicMaterial({color:"#7fb2ff",transparent:true,opacity:.6}));rg.rotation.x=Math.PI/2;rg.position.y=.08;root.add(rg);
      sph(5,mat("#7a5a3a",{metalness:.3}),-6,0,2,1,.9,1);for(let i=0;i<8;i++)building(4+(i%4)*4,-4+Math.floor(i/4)*6,3,4,3+R()*4,"#c7ccd4");
      people(18,ring(9,4,0),.6);for(let i=0;i<6;i++)car(ring(18),["#fff","#2e86de"][i%2]);trees(20,"conifer",20,30);},
    dishes(){ground("#b57a52");mountains(8,"#8f5a3e",22,32,8,18);cone(6,14,"#9c6a4a",-20,0,-18,10);const wm=mat("#efefef",{side:THREE.DoubleSide});
      for(let i=0;i<12;i++){const x=-12+(i%4)*7,z=-6+Math.floor(i/4)*7;cyl(.4,.6,3,"#ddd",x,0,z,6);const d=new THREE.Mesh(new THREE.SphereGeometry(2.4,14,8,0,Math.PI*2,0,Math.PI/3.2),wm);d.position.set(x,5.4,z);d.rotation.x=Math.PI+.6;root.add(d);
        anims.push(t=>{d.rotation.z=Math.sin(t*.08+i)*.3;});}
      const tr=box(3,2,6,"#e2c044",0,0,0);movers(tr,line(-20,14,20,14,0),.15);people(4,line(-10,12,10,12,1),.3,["#e74c3c","#f39c12"]);},
    bunker(){ground("#e9eef3");const mt=mat("#d8dee6");snowables.push(mt);cone(18,16,mt,0,0,-18,8);mountains(10,"#cfd6df",24,33,8,16);
      const fa=box(4,6,3,"#9aa4b0",0,0,-4);fa.rotation.x=-.4;const lm=mat("#7fd3ff",{emissive:"#7fd3ff",emissiveIntensity:.5});lampMats.push(lm);box(3,.3,.2,lm,0,5.5,-2.4);
      for(let i=0;i<14;i++)building(-20+i*3,14+R()*4,2.4,3,2.5,["#c0392b","#2e86de","#f1c40f","#27ae60"][i%4],"#2f2f2f");aurora();
      for(let i=0;i<3;i++){const s=box(.8,.6,1.8,"#111",0,0,0);movers(s,line(-25,6+i*2,25,6+i*2,0),.4);}people(8,line(-20,12,20,12,2),.4);},
    peak(){ground("#d9dde4");const sn=mat("#f4f7fb");cone(12,30,sn,0,0,-6,6);cone(8,18,sn,-14,0,-12,6);cone(8,20,sn,14,0,-14,6);mountains(10,"#cfd5de",24,33,10,20);
      [["#e67e22",-6,12],["#c0392b",-3,14],["#f1c40f",0,13],["#2e86de",3,15],["#27ae60",6,12]].forEach(([c,x,z])=>cone(1.4,1.6,c,x,0,z,4));
      people(8,line(-2,10,0,-2,1),.2,["#e74c3c","#f39c12","#3498db"]);for(let i=0;i<3;i++){const y=box(1,1,2,"#3b2a1e",0,0,0);movers(y,line(-12,16,8,16,1),.15);}},
    canyon(){const r1=mat("#b8613c"),r2=mat("#d08a5a");snowables.push(r1,r2);ground("#b8613c");
      [[-1,r1],[1,r2]].forEach(([s,m])=>{for(let k=0;k<4;k++)box(30,2.5,26-k*3,k%2?r2:r1,0,k*2.5,s*(20-k*1.5));});
      water(0,0,70,4,"#4f8a8a",.1);people(10,line(-20,12.2,20,12.2,1),.4);walkers.forEach(w=>w.yfn=()=>10);trees(14,"conifer",22,32,1,(x,z)=>Math.abs(z)<14);},
    forest(){ground("#3c6b32");water(0,0,70,5,"#7a6a4a",.1);trees(90,"jungle",4,32,1.3,(x,z)=>Math.abs(z-Math.sin(x*.1)*2)<4);
      for(let i=0;i<4;i++){const x=-12+i*7;for(const dx of[-1,1])for(const dz of[-1,1])cyl(.1,.1,1.5,"#5a4030",x+dx,0,6+dz,4);box(2.8,1.4,2.8,"#8a6a45",x,1.5,6);cone(2.4,1.4,"#b59a5a",x,2.9,6,4,Math.PI/4);}
      const cn=box(.8,.4,3,"#6b4a2b",0,0,0);movers(cn,line(-28,0,28,0,0),.2);people(6,line(-12,4,10,4,1),.3);},
    reef(){ground("#e3d3a3");water(0,0,34,0,"#2bb3c0",.6,"disk").material.opacity=.6;
      for(let i=0;i<40;i++){const a=R()*6.28,r=6+R()*24;sph(.6+R()*1.2,["#ff6b6b","#ffd166","#c77dff","#06d6a0","#ff9f1c"][i%5],Math.cos(a)*r,.3,Math.sin(a)*r,1,.6,1);}
      cyl(4,5,1,"#efe2b8",0,0,0,10);trees(5,"palm",0,3);for(let i=0;i<2;i++){const b=box(1.6,1,4,"#fff",0,0,0);movers(b,ring(16+i*5),.3);b.position.y=.6;}},
    dunes(){ground("#e0b06a");const sd=mat("#d9a55e");snowables.push(sd);for(let i=0;i<14;i++){const a=R()*6.28,r=8+R()*22;sph(5+R()*4,sd,Math.cos(a)*r,0,Math.sin(a)*r,1.4,.45,1);}
      water(-6,6,3,0,"#3f8fb0",.1,"disk");for(let i=0;i<6;i++)tree(-6+Math.cos(i)*4,6+Math.sin(i)*4,"palm");
      [["#3b4a6b",4,-2],["#6b3b3b",8,-4]].forEach(([c,x,z])=>cone(2.4,2,c,x,0,z,4));
      for(let i=0;i<5;i++){const c=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.9,1.8),mat("#a8794a"));b.position.y=1.1;c.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.9,.4),mat("#a8794a"));h.position.set(0,1.8,1);c.add(h);root.add(c);
        const o=i*1.2;anims.push(t=>{const x=((t*.6+o*3)%60)-30;c.position.set(x,Math.sin(x*.2)*.3,10+Math.sin(x*.05)*3);c.rotation.y=Math.PI/2;});}
      people(5,ring(3,6,-3),.2,["#1f3b73","#1f3b73","#e6e6e6"]);},
    falls(){ground("#5f8a46");const top=mat("#6a8f4a");snowables.push(top);box(70,8,26,top,0,0,-20);water(0,-14,70,12,"#4c86b0",8.1);
      const fm=new THREE.MeshBasicMaterial({color:"#f2f8ff",transparent:true,opacity:.75});const fall=new THREE.Mesh(new THREE.PlaneGeometry(60,8),fm);fall.position.set(0,4,-7);root.add(fall);
      water(0,0,70,8,"#4c86b0",.1);for(let i=0;i<10;i++){const s=sph(2.5,new THREE.MeshBasicMaterial({color:"#ffffff",transparent:true,opacity:.25}),-25+i*5.5,2,-4);anims.push(t=>{s.position.y=2+Math.sin(t*.8+i)*1;});}
      box(70,7,20,mat("#5a7f40"),0,0,14);trees(30,"broad",10,32,1,(x,z)=>z<12);const br=new THREE.Mesh(new THREE.TorusGeometry(5,.3,6,20,Math.PI),mat("#7a7a7a"));br.position.set(26,3,0);br.rotation.y=Math.PI/2;root.add(br);
      people(8,line(-20,9,20,9,1),.3);walkers.forEach(w=>w.yfn=()=>7);},
    ice(){ground("#eef3f8");mountains(8,"#dfe6ee",24,33,4,10);for(let i=0;i<5;i++){cyl(.2,.2,1.5,"#555",-8+i*4,0,-2,5);box(3.4,2.4,6,"#e8691e",-8+i*4,1.5,-2);}box(2,6,2,"#c0392b",10,0,-8);
      for(let i=0;i<24;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CylinderGeometry(.25,.3,.8,8):new THREE.CylinderGeometry(.25,.3,.8,8),mat("#1d1d1d"));b.position.y=.4;g.add(b);
        const bl=new THREE.Mesh(new THREE.BoxGeometry(.3,.5,.1),mat("#f5f5f5"));bl.position.set(0,.4,.27);g.add(bl);root.add(g);const o=R()*10;anims.push(t=>{g.position.set(12+Math.cos(o)*5+Math.sin(t*.3+o)*.5,0,10+Math.sin(o)*5);g.rotation.y=o;});}
      const sc=box(1.6,1,2.6,"#f1c40f",0,0,0);movers(sc,line(-25,8,5,8,0),.25);aurora();people(4,line(-10,2,8,2,1),.3,["#e8691e"]);},
  };

  SC.biome=function(){
    const c=cur.country, pop=c.pop?c.pop[1]:1e6, rich=c.gdp&&c.pop?c.gdp[1]*1e9/c.pop[1]:5000;
    const dens=Math.min(1,Math.max(.2,(Math.log10(pop)-4)/4.5)), tall=rich>25000?28:rich>8000?18:9;
    const people_=n=>people(Math.round(n*dens)+4,ring(6+R()*4),.6);
    const roadRing=r=>{const m=new THREE.Mesh(new THREE.RingGeometry(r-.9,r+.9,64),mat("#4a4d55"));m.rotation.x=-Math.PI/2;m.position.y=.03;m.receiveShadow=true;root.add(m);};
    const B=c.biome;
    if(B==="tropical"){ground("#5e9a45");water(0,18,70,6,"#5a8f7a");for(let i=0;i<9;i++){sph(5+R()*4,"#3f7f35",-28+i*7,0,-24-R()*4,1,.8,1);}
      trees(40,"palm",12,30,1.1,(x,z)=>z>14&&z<22);for(let i=0;i<8;i++){const x=-14+i*4,z=12+R()*2;for(const dx of[-1,1])cyl(.08,.08,1.3,"#5a4030",x+dx*.8,0,z,4);house(x,z,2.2,2.2,1.4,"#c9a77a","#9aa1a6",R()*.3);}
      city(Math.round(30*dens),3,12,2,tall*.6,["#e7c6a1","#cfe0d0","#f0d9b5","#d7b8d8"]);for(let i=0;i<6;i++){box(1.6,.1,1.6,["#e74c3c","#f1c40f","#2ecc71","#3498db"][i%4],-6+i*2.2,1.6,-6);cyl(.05,.05,1.6,"#555",-6+i*2.2,0,-6,4);}
      roadRing(13);for(let i=0;i<8;i++)car(ring(13),["#e74c3c","#2c3e50","#f1c40f"][i%3]);people_(26);for(let i=0;i<2;i++){const b=box(.9,.4,3,"#6b4a2b",0,0,0);movers(b,line(-30,18,30,18,0),.2);}clouds(6,16);}
    else if(B==="desert"){ground("#d9b277");for(let i=0;i<12;i++){const a=R()*6.28,r=22+R()*10;sph(5+R()*3,"#d6a862",Math.cos(a)*r,0,Math.sin(a)*r,1.5,.45,1);}
      for(let i=0;i<60*dens;i++){const a=R()*6.28,r=4+R()*15;box(1.5+R()*2,1.2+R()*2,1.5+R()*2,["#d8c19a","#cdb084","#e2d1ae"][i%3],Math.cos(a)*r,0,Math.sin(a)*r);}
      box(5,4,5,"#e6dcc6",-4,0,4);sph(2.4,"#3f8f7f",-4,4,4,1,1.1,1);cyl(.5,.6,10,"#e6dcc6",0,0,7,8);cone(.6,1.4,"#3f8f7f",0,10,7,8);
      if(rich>20000)for(let i=0;i<8;i++){const a=i*.8;cyl(1.2,1.6,10+R()*tall,mat("#a9c4d8",{metalness:.4,roughness:.25}),12+Math.cos(a)*4,0,-8+Math.sin(a)*4,6);}
      water(-12,10,3,0,"#3f8fb0",.1,"disk");for(let i=0;i<7;i++)tree(-12+Math.cos(i)*4.5,10+Math.sin(i)*4.5,"palm");
      roadRing(18);for(let i=0;i<6;i++)car(ring(18),["#fff","#c9c2b4","#333"][i%3]);people_(18);}
    else if(B==="temperate"){ground("#6f9a52");water(0,-17,70,5,"#4a7fb0");roadRing(14);
      for(let i=0;i<Math.round(18*dens)+6;i++){const a=R()*6.28,r=R()*8;building(Math.cos(a)*r,Math.sin(a)*r,2.4+R()*2,2.4+R()*2,4+R()*tall,["#9aa3b2","#b7bcc6","#8b95a8","#c9ccd2"][i%4]);}
      for(let i=0;i<34;i++){const a=R()*6.28,r=16+R()*14,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(z+17)<4)continue;house(x,z,2+R(),2+R(),1.6+R()*.8,["#efe6d6","#e3d2b5","#d9d4cc"][i%3],["#8a3b2e","#4a4f5a","#6b3b2a"][i%3],R()*3);}
      trees(36,"broad",10,31,1,(x,z)=>Math.abs(z+17)<4);for(let i=0;i<10;i++)car(ring(14),["#c0392b","#ecf0f1","#2c3e50","#2e86de"][i%4]);
      const tr=new THREE.Group();for(let k2=0;k2<4;k2++){const cb=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.4,1.4),mat(["#e9edf1","#2e86de"][k2%2]));cb.position.set(k2*3.8,.9,0);tr.add(cb);}root.add(tr);movers(tr,line(-30,-12,30,-12,0),.25);
      for(let i=0;i<10;i++)lamp(-15+i*3.3,11);people_(30);clouds(5);}
    else if(B==="boreal"){ground("#557a48");water(8,6,10,0,"#3f6f9a",.08,"disk");trees(80,"conifer",6,32,1.2,(x,z)=>Math.hypot(x-8,z-6)<11);
      for(let i=0;i<16;i++){const a=R()*6.28,r=4+R()*8;house(-10+Math.cos(a)*r,-6+Math.sin(a)*r,2.2,2.6,1.8,["#b33a2e","#e0b03a","#2f6f8f","#f2efe8"][i%4],"#2f2f2f",R()*3);}
      box(2,4,4,"#f2efe8",-10,0,-6);cone(.9,4,"#3b3b3b",-10,4,-6,4,Math.PI/4);city(Math.round(10*dens),18,26,3,tall*.6);people_(14);for(let i=0;i<6;i++)lamp(-14+i*3,0);}
    else if(B==="arctic"){ground("#eef3f8");water(0,16,70,14,"#2f5f86",.07);for(let i=0;i<8;i++){const ice=box(2+R()*3,1+R()*2,2+R()*3,"#f4fbff",-28+i*7,0,14+R()*6);movers(ice,(t,o)=>[-30+((t*.15+o*7)%60),14+o%6],.3);}
      for(let i=0;i<18;i++)house(-14+(i%6)*4.6,-2-Math.floor(i/6)*4.5,2.2,2.6,1.8,["#c0392b","#2e86de","#f1c40f","#27ae60","#8e44ad"][i%5],"#2a2a2a",.1);
      mountains(10,"#dfe6ee",24,33,6,14,[Math.PI,Math.PI*2]);aurora();for(let i=0;i<2;i++){const b=box(1.2,.8,3,"#fff",0,0,0);movers(b,line(-25,12+i*3,25,12+i*3,0),.2);}people_(8);for(let i=0;i<6;i++)lamp(-14+i*5,2);}
    else if(B==="mountain"){ground("#6b8a55");const sn=mat("#f4f7fb");cone(10,24,sn,-10,0,-20,7);cone(9,20,sn,10,0,-22,7);mountains(12,"#7c8a7a",24,33,10,20);
      for(let k2=0;k2<5;k2++){const t=new THREE.Mesh(new THREE.CylinderGeometry(14-k2*2,14-k2*2,1,32,1,false,0,Math.PI*.9),mat(k2%2?"#7aa65a":"#8db66a"));t.position.set(12,.5+k2,8);t.receiveShadow=true;root.add(t);snowables.push(t.material);}
      water(-10,10,4,40,"#5f9ac8");for(let i=0;i<16;i++)house(-2+(i%4)*3.4,4+Math.floor(i/4)*3.4,2.2,2.2,1.6,"#cfc6b4","#5a4636",R()*.6);
      box(2.4,3,3.4,"#e8e1d0",3,0,-2);cone(1.2,2.6,"#c0392b",3,3,-2,4,Math.PI/4);city(Math.round(8*dens),16,22,3,tall*.5);people_(10);clouds(6,18);
      for(let i=0;i<6;i++){const gt=box(.5,.5,.9,"#f0ece2",0,0,0);movers(gt,ring(4,10,10),.2);}}
    else { // island
      ground("#2a8fb0");water(0,0,34,0,"#2bb3c0",.25,"disk");const sd=mat("#ecd9a8");snowables.push(sd);cyl(13,15,1,sd,0,-.2,0,24);const gr=mat("#5ea04a");snowables.push(gr);cyl(9,11,1.2,gr,0,.2,0,20);
      trees(30,"palm",9,13);for(let i=0;i<10;i++){const a=i/10*6.28;house(Math.cos(a)*6,Math.sin(a)*6,2,2,1.4,["#f2efe8","#ffd59e","#a8e6cf"][i%3],"#c0392b",-a);}
      city(Math.round(6*dens),0,4,3,tall*.5,["#f4f1ea","#e8f0f2"]);for(let i=0;i<4;i++){const b=box(1,.6,2.6,"#fff",0,0,0);b.position.y=.3;movers(b,ring(19+i*3),.25);}people(10,ring(11.5),.4);clouds(5);}
  };
  // ---- 時間帯と天気 ----
  const TOD={m:{sky:"#f3c79b",fog:"#f3d3b2",sun:["#ffd4a0",1.0],pos:[40,18,20],amb:.45,hemi:["#ffe2c4","#5a4a3a",.45]},
             n:{sky:"#8ec5f2",fog:"#b9dbf5",sun:["#ffffff",1.15],pos:[10,60,15],amb:.55,hemi:["#dff0ff","#6a5a48",.55]},
             e:{sky:"#e8875a",fog:"#d99a7a",sun:["#ffb070",.85],pos:[-40,14,-10],amb:.38,hemi:["#ffb88c","#3a2a3a",.4]},
             x:{sky:"#0a1430",fog:"#0d1836",sun:["#9db4ff",.22],pos:[-20,40,30],amb:.16,hemi:["#2a3a6a","#0a0a14",.25]}};
  // ---- Type I（もしも）の未来シーン ----
  const neon=(c,o=1)=>new THREE.MeshBasicMaterial({color:c,transparent:o<1,opacity:o});
  const glass=(c="#9fd8ff",o=.35)=>new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:o,roughness:.05,metalness:.6,side:THREE.DoubleSide});
  const glowM=(c)=>{const m=mat("#2a3140",{emissive:c,emissiveIntensity:.25});onTod.push(t=>m.emissiveIntensity=t==="x"?1.8:t==="e"?.8:.25);return m;};
  function turbine(x,z,h=9){cyl(.15,.25,h,"#eef2f6",x,0,z,8);const hub=new THREE.Group();hub.position.set(x,h,z+.3);root.add(hub);
    for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.25,h*.45,.08),mat("#f7f9fb"));b.position.y=h*.22;const p=new THREE.Group();p.rotation.z=i*2.094;p.add(b);hub.add(p);}
    anims.push(t=>hub.rotation.z=t*1.6+x);}
  function drone(path,c="#e8edf5",y=5){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.5,.15,.5),mat(c));g.add(b);
    [[-.35,-.35],[.35,-.35],[-.35,.35],[.35,.35]].forEach(([a,b2])=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.03,10),neon("#8fe3ff",.6));r.position.set(a,.1,b2);g.add(r);});
    const l=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6),neon("#ff4d6d"));l.position.y=-.1;g.add(l);root.add(g);const o=R()*100;
    anims.push(t=>{const [x,z]=path(t,o);g.position.set(x,y+Math.sin(t*2+o)*.4,z);});return g;}
  function maglev(r,y=1.2,c="#e9eef5"){const tr=new THREE.Mesh(new THREE.TorusGeometry(r,.25,6,96),mat("#c8ced8"));tr.rotation.x=Math.PI/2;tr.position.y=y;root.add(tr);
    for(let i=0;i<24;i++){const a=i/24*6.283;cyl(.12,.12,y,"#9aa3b2",Math.cos(a)*r,0,Math.sin(a)*r,6);}
    const g=new THREE.Group();for(let k=0;k<4;k++){const c2=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.BoxGeometry(.9,.7,2.2):new THREE.BoxGeometry(.9,.7,2.2),mat(c));c2.position.z=k*2.4;g.add(c2);const s=new THREE.Mesh(new THREE.BoxGeometry(.92,.12,2.1),glowM("#5ad0ff"));s.position.set(0,.05,k*2.4);g.add(s);}
    root.add(g);anims.push(t=>{const a=t*.25;g.position.set(Math.cos(a)*r,y+.55,Math.sin(a)*r);g.rotation.y=-a;});}
  function panelField(x0,z0,nx,nz,dx=2.2,dz=3,tilt=.45){const pm=new THREE.MeshStandardMaterial({color:"#1d2f5c",metalness:.7,roughness:.25,emissive:"#0a1530"});
    for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const p=new THREE.Mesh(new THREE.BoxGeometry(1.9,.08,1.3),pm);p.position.set(x0+i*dx,.9,z0+j*dz);p.rotation.x=-tilt;p.castShadow=true;root.add(p);
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.9,5),mat("#aab"));leg.position.set(x0+i*dx,.45,z0+j*dz);root.add(leg);}}
  function hexPad(x,z,r,h,c){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,6),mat(c));m.position.set(x,h/2-.4,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
  function domeAt(x,z,r,c="#bfe6ff",o=.35){const d=new THREE.Mesh(new THREE.SphereGeometry(r,24,12,0,6.283,0,Math.PI/2),glass(c,o));d.position.set(x,0,z);d.userData.noEdge=true;root.add(d);return d;}
  function oceanFloor(){const m=new THREE.Mesh(new THREE.CylinderGeometry(34,35.5,2,64),mat("#1c4f7a"));m.position.y=-1.4;root.add(m);water(0,0,34,0,"#2f7fc0",-.1,"disk");}
  Object.assign(SC,{
    elevator(){oceanFloor();hexPad(0,0,10,1.2,"#d7dde6");hexPad(14,6,4,.9,"#cfd6df");hexPad(-13,-8,4,.9,"#cfd6df");
      cyl(2.2,3.2,4,"#eef1f5",0,.8,0,12);const cm=new THREE.MeshStandardMaterial({color:"#c9d6e8",metalness:.8,roughness:.2,emissive:"#335",emissiveIntensity:.3});
      const cable=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,320,8),cm);cable.position.y=164;root.add(cable);
      const cl=[];for(let i=0;i<3;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,1.6,8),mat("#f2f4f8"));g.add(b);const r=new THREE.Mesh(new THREE.TorusGeometry(1.15,.1,6,16),glowM("#7ee0ff"));r.rotation.x=Math.PI/2;g.add(r);root.add(g);cl.push(g);}
      anims.push(t=>cl.forEach((g,i)=>{const k=((t*.04+i/3)%1);g.position.y=5+(i%2?1-k:k)*120;}));
      for(let i=0;i<8;i++){const a=i/8*6.283;building(Math.cos(a)*7,Math.sin(a)*7,1.8,1.8,2+R()*3,"#e4e8ee");}
      for(let i=0;i<5;i++){const b=box(1,.6,2.6,["#f5f5f5","#e74c3c","#2c3e50"][i%3],0,-.1,0);movers(b,ring(22+i*1.5),.5);}
      for(let i=0;i<2;i++){const s=box(2.2,1.2,7,"#5a6b7d",0,-.2,0);movers(s,ring(27,0,0),.15);}
      people(14,ring(5.2),.5);for(let i=0;i<10;i++)lamp(Math.cos(i*.63)*9,Math.sin(i*.63)*9,2.5);clouds(5,26);},
    solarbelt(){ground("#d8b878");mountains(8,"#c9a466",27,33,3,7);panelField(-22,-20,9,8);panelField(4,-20,9,8);panelField(-22,6,9,5);
      for(let i=0;i<5;i++){domeAt(10+(i%3)*5,10+Math.floor(i/3)*6,2.2,"#c8ffd8",.3);sph(1.6,"#4f9a45",10+(i%3)*5,.4,10+Math.floor(i/3)*6,1,.4,1);}
      for(let j=0;j<8;j++){const r=box(.8,.4,.8,"#f2f2f2",0,.9,0);movers(r,line(-22,-20+j*3,-4,-20+j*3,0),.4);}
      for(let i=0;i<4;i++){cyl(.15,.3,10,"#9aa0a8",28,0,-20+i*12,4);box(2.5,.2,.2,"#9aa0a8",28,9.4,-20+i*12);}
      const st=mat("#e8ecf2",{emissive:"#6fd2ff",emissiveIntensity:.2});box(5,3,4,st,22,0,14);cyl(1,1,3,"#c9ced6",22,3,14,10);
      for(let i=0;i<6;i++)building(16+R()*10,20+R()*6,2,2,2.5,"#e9dcc4","#d8cbb0");people(8,ring(9,15,14),.5,["#f5f5f5","#e8a33d","#2ec4b6"]);trees(10,"palm",22,30);for(let i=0;i<6;i++)lamp(14+i*2,18);},
    fusion(){ground("#7a9a5a");mountains(12,"#6e8a5a",26,33,4,10);
      const hall=mat("#e6eaf0");box(16,7,12,hall,-4,0,-4);const dm=new THREE.Mesh(new THREE.CylinderGeometry(6.5,6.5,4,32,1,false,0,Math.PI),mat("#d8dee8"));dm.rotation.z=Math.PI/2;dm.rotation.y=Math.PI/2;dm.position.set(-4,7,-4);root.add(dm);
      const tk=new THREE.Mesh(new THREE.TorusGeometry(3.4,.75,16,64),new THREE.MeshBasicMaterial({color:"#9b4dff"}));tk.rotation.x=Math.PI/2;tk.position.set(12,3.5,-6);root.add(tk);tk.material.emissiveIntensity=1;
      for(let i=0;i<14;i++){const a=i/14*6.283;const c=new THREE.Mesh(new THREE.TorusGeometry(1.35,.2,8,20),mat("#3d4656",{metalness:.6,roughness:.4}));c.position.set(12+Math.cos(a)*3.4,3.5,-6+Math.sin(a)*3.4);c.rotation.y=-a;c.castShadow=true;root.add(c);}
      const shell=domeAt(12,-6,6.5,"#cfe8ff",.18);shell.material.depthWrite=false;shell.renderOrder=2;anims.push(t=>{tk.material.color.setHSL(.75+Math.sin(t*3)*.03,1,.6+Math.sin(t*5)*.08);});
      for(let i=0;i<8;i++){const a=i/8*6.283;cyl(.25,.25,6,"#9aa3b2",12+Math.cos(a)*5.4,0,-6+Math.sin(a)*5.4,6);}
      for(let i=0;i<3;i++)cyl(2,2.6,6,"#dfe3e8",-14+i*5,0,10,16);
      for(let i=0;i<5;i++){cyl(.12,.25,11,"#8d939b",6+i*5,0,14,4);box(3,.15,.15,"#8d939b",6+i*5,10.5,14);}
      trees(30,"broad",20,31);city(12,22,30,1.5,3,["#efe7da","#e3d6c2"],null,"#b5573a");people(12,line(-8,4,10,4,2),.6);for(let i=0;i<4;i++)car(ring(18),["#2ec4b6","#f5f5f5","#3a86ff"][i%3]);for(let i=0;i<8;i++)lamp(-10+i*3,5);},
    arcology(){ground("#4f7f3c");trees(70,"broad",21,32,1.1);mountains(10,"#517a44",28,34,6,14);
      const tiers=[[17,6],[14,8],[11,10],[8,12],[5.5,12],[3,10]];let y=0;
      tiers.forEach(([r,h],k)=>{const m=new THREE.MeshStandardMaterial({color:"#dfe6ee",map:ctex("fac",48,64,facade(false),[Math.round(r*2),Math.round(h/1.2)]),emissiveMap:ctex("facl"+k%4,48,64,facade(true),[Math.round(r*2),Math.round(h/1.2)]),emissive:"#ffcf7a",emissiveIntensity:0,roughness:.6,metalness:.2});winMats.push(m);
        const c=new THREE.Mesh(new THREE.CylinderGeometry(r*.92,r,h,6),m);c.position.y=y+h/2;c.castShadow=c.receiveShadow=true;root.add(c);
        const g=new THREE.Mesh(new THREE.CylinderGeometry(r*.92,r*.92,.5,6),mat("#5d9a48"));g.position.y=y+h+.25;root.add(g);
        if(k<5)for(let i=0;i<6;i++){const a=i/6*6.283+.5;const rr=r*.92-.8;sph(.7,"#4f8a3c",Math.cos(a)*rr,y+h+1,Math.sin(a)*rr);}y+=h+.5;});
      const sp=cyl(.15,.4,14,"#e6ebf2",0,y,0,6);const tip=sph(.5,neon("#ff5d5d"),0,y+14,0);
      maglev(20,1.4);for(let i=0;i<6;i++)drone(ring(14+i,0,0),"#f2f5fa",20+i*6);people(12,ring(19),.5);clouds(5,60);},
    seacity(){oceanFloor();const P=[[0,0],[9,5.2],[-9,5.2],[0,10.4],[9,-5.2],[-9,-5.2],[0,-10.4],[18,0],[-18,0]];
      P.forEach(([x,z],i)=>{hexPad(x,z,5.1,1,i%2?"#e8edf2":"#f3efe6");if(i===0){domeAt(0,0,4,"#bdf3ff",.3);trees(6,"palm",0,3);}
        else{for(let k=0;k<3;k++){const a=R()*6.283,r=R()*2.5;building(x+Math.cos(a)*r,z+Math.sin(a)*r,1.6,1.6,1.5+R()*(i<7?6:3),["#ffffff","#e6f2f8","#f8efe4"][k%3]);}tree(x+2,z+2,"palm");}});
      for(let i=0;i<5;i++){const b=box(.8,.4,1.8,["#fff","#ffcb3d"][i%2],0,-.15,0);movers(b,ring(24+i*1.4),.6);}
      for(let i=0;i<6;i++)turbine(Math.cos(i)*29,Math.sin(i)*29,8);
      const kelp=mat("#2f8a5a");for(let i=0;i<10;i++){const a=R()*6.283;cone(.6,1.2,kelp,Math.cos(a)*15,-.5,Math.sin(a)*15,6);}
      people(14,ring(3.4),.4,["#ffffff","#ff9f1c","#2ec4b6","#e71d36"]);for(let i=0;i<10;i++)lamp(Math.cos(i*.63)*4.6,Math.sin(i*.63)*4.6,2);clouds(6,22);},
    spaceport(){ground("#b9a26a");mountains(10,"#8d7a52",26,33,4,10);
      [[-12,-10],[2,-14],[14,-8]].forEach(([x,z],i)=>{cyl(3,3.3,.8,"#9aa0a8",x,0,z,16);box(.5,11,.5,"#6b7280",x+2.4,.8,z);box(1.6,.25,.3,"#6b7280",x+1.5,8,z);const rk=rocket(x,z,i===1?1.15:.9);rk.position.y=.8;});
      const tm=new THREE.Mesh(new THREE.CylinderGeometry(9,9,16,24,1,true,Math.PI*.15,Math.PI*.7),glass("#cfefff",.55));tm.rotation.z=Math.PI/2;tm.position.set(0,0,12);tm.scale.set(1,1,.45);root.add(tm);
      box(16,1,8,"#e8ecf2",0,0,12);for(let i=0;i<4;i++)box(3,2.2,3,"#dfe5ed",-9+i*6,1,12);
      maglev(24,1.2,"#ffffff");trees(18,"broad",24,32,.9);people(16,line(-7,12,7,12,4),.6,["#f5f5f5","#ff9f1c","#2ec4b6","#3a86ff","#e71d36"]);
      for(let i=0;i<10;i++)lamp(-9+i*2,7.5,2.5);for(let i=0;i<3;i++)drone(ring(10+i*3,0,0),"#fff",8+i*2);},
    rewild(){ground("#3e6b30");water(0,0,60,6,"#4d7d6a");trees(110,"jungle",4,32,1.25,(x,z)=>Math.abs(z)<4);mountains(10,"#3a5f2d",28,34,8,16);
      const lodge=[[-6,8],[0,9],[6,8]];lodge.forEach(([x,z])=>{for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])cyl(.12,.12,3,"#6b4a2b",x+a,0,z+b,5);box(3,2,3,"#a07850",x,3,z);const r=box(3.6,.3,3.6,"#5d4a35",x,5,z);});
      for(let i=0;i<4;i++)drone(line(-25,-12+i*7,25,-12+i*7,0),"#e8edf5",8+i);
      for(let i=0;i<5;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.6,1.4),mat(["#7a5a3a","#8a7a5a"][i%2]));b.position.y=.8;g.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.5),mat("#6a4a2a"));h.position.set(0,1.1,.9);g.add(h);
        for(const[a,c]of[[-.25,-.5],[.25,-.5],[-.25,.5],[.25,.5]]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.6,4),mat("#5a3a2a"));l.position.set(a,.3,c);g.add(l);}root.add(g);movers(g,line(-20,-6+i*3,20,-6+i*3,0),.2);}
      for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(1.2,.4,3.2),mat("#c49a6c"));c.position.y=.15;root.add(c);movers(c,line(-26,0,26,0,0),.15);}
      people(5,line(-6,9,6,9,1),.3,["#d9c27a","#5a7a3a"]);clouds(8,18);},
    climate(){ground("#eef3f8");mountains(14,"#dfe7ef",22,33,4,12);const ice=mat("#e8f2fb");snowables.push(ice);
      [[0,0,7],[-12,6,4],[11,7,4.5],[-4,-13,3.5]].forEach(([x,z,r])=>{domeAt(x,z,r,"#d8f0ff",.45);const f=new THREE.Mesh(new THREE.CylinderGeometry(r*.9,r*.9,r*.6,24),mat("#f4f7fa"));f.position.set(x,r*.3,z);root.add(f);winMats.push(f.material);f.material.emissive=C("#ffcf7a");});
      for(let i=0;i<3;i++){const g=new THREE.Group();const d=new THREE.Mesh(new THREE.SphereGeometry(2.2,16,8,0,6.283,0,1.1),mat("#ffffff",{side:THREE.DoubleSide}));d.rotation.x=Math.PI*.8;g.add(d);g.position.set(-18+i*6,4,-6);root.add(g);cyl(.2,.3,4,"#c9ced6",-18+i*6,0,-6,6);anims.push(t=>g.rotation.y=Math.sin(t*.2+i)*.8);}
      for(let i=0;i<5;i++)turbine(16+i*2.5,-14+i*3,8);
      const bal=sph(1.2,"#ffffff",0,0,0);anims.push(t=>{const k=(t*.06)%1;bal.position.set(6+k*8,4+k*60,-4);bal.scale.setScalar(1+k*.6);});
      for(let i=0;i<3;i++){const s=box(1.4,.8,2.6,"#e74c3c",0,0,0);movers(s,ring(16+i*2),.3);}
      aurora();people(6,ring(9),.4,["#e8691e","#e8691e","#2f6fdb"]);for(let i=0;i<6;i++)lamp(Math.cos(i)*9.5,Math.sin(i)*9.5);},
    archive(){ground("#e6edf3");const mt=mat("#bcc7d2");snowables.push(mt);cone(16,24,mt,0,0,-20,7);mountains(12,"#cfd8e2",24,33,6,16);
      const door=new THREE.Mesh(new THREE.BoxGeometry(5,8,4),mat("#3a4352"));door.position.set(0,4,-1);root.add(door);
      const gl=new THREE.Mesh(new THREE.PlaneGeometry(3,6),neon("#7fe7ff",.85));gl.position.set(0,3.4,1.05);root.add(gl);anims.push(t=>gl.material.opacity=.6+Math.sin(t*1.5)*.25);
      box(7,.6,6,"#8c96a3",0,0,3);for(let i=0;i<6;i++){const p=box(.5,2+i%3,.5,"#9ad7ff",-3+i*1.2,.6,5);p.material=new THREE.MeshStandardMaterial({color:"#cfefff",emissive:"#5ad0ff",emissiveIntensity:.6,transparent:true,opacity:.8});}
      for(let i=0;i<8;i++)house(-20+i*5,14+R()*3,2.6,2.4,2.2,["#c0392b","#2e86de","#f1c40f","#27ae60"][i%4],"#2f2f2f");
      aurora();people(6,line(-3,8,3,8,1),.3,["#e8691e","#2f6fdb"]);for(let i=0;i<8;i++)lamp(-14+i*4,10);for(let i=0;i<2;i++)drone(ring(12+i*3,0,0),"#ffffff",10+i*2);},
  });
  function applyLook(){
    const T=TOD[tod]; let skyc=C(T.sky), fog=C(T.fog);
    if(wx==="rain"){skyc.lerp(C("#5d6670"),.6);fog.lerp(C("#6b737c"),.6);}
    if(wx==="snow"){skyc.lerp(C("#c9d3dd"),tod==="x"?.15:.6);fog.lerp(C("#dfe6ee"),tod==="x"?.15:.6);}
    const SKY={m:["#6fa8e8","#ffd2a6"],n:["#3f86de","#cfe6ff"],e:["#3a3f7a","#ff9a5c"],x:["#02040c","#10204a"]}[tod];
    let st=C(SKY[0]),sb=C(SKY[1]);if(wx==="rain"){st.lerp(C("#4b545e"),.75);sb.lerp(C("#7a838c"),.75);}if(wx==="snow"){st.lerp(C("#aeb8c4"),tod==="x"?.15:.7);sb.lerp(C("#e6ebf0"),tod==="x"?.15:.7);}
    sky.material.uniforms.top.value=st;sky.material.uniforms.bot.value=sb;scene.background=sb;
    scene.fog=new THREE.Fog(sb.clone().lerp(fog,.4),wx==="clear"?80:35,wx==="clear"?280:150);
    stars.visible=tod==="x"&&wx==="clear";disc.visible=wx==="clear";disc.position.set(...T.pos).normalize().multiplyScalar(280);disc.material.color=C(tod==="x"?"#dfe6ff":tod==="n"?"#fffbe8":"#ffc890");disc.scale.setScalar(tod==="x"?.6:1);
    sun.color=C(T.sun[0]);sun.intensity=T.sun[1]*(wx==="clear"?1:.45);sun.position.set(...T.pos);
    amb.intensity=T.amb;hemi.color=C(T.hemi[0]);hemi.groundColor=C(T.hemi[1]);hemi.intensity=T.hemi[2]*(wx==="clear"?1:1.1);
    const night=tod==="x", dusk=tod==="e";
    winMats.forEach((m,i)=>m.emissiveIntensity=night?(i%5===0?.2:1):dusk?.35:0);
    lampMats.forEach(m=>m.emissiveIntensity=night?1.6:dusk?.6:0);
    nightOnly.forEach(o=>{if(o.isObject3D)o.visible=night;});
    snowables.forEach(m=>{if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0);if(wx==="snow")m.color.lerp(C("#f4f7fb"),.75);});
    umbrellas.forEach(u=>u.visible=wx==="rain");
    walkers.forEach(w=>w.g.visible=w.i<w.n*(night?.35:wx!=="clear"?.6:1));
    rain.visible=wx==="rain";snow.visible=wx==="snow";
    onTod.forEach(f=>f(tod));
  }
  function precip(){
    const N=1800, rp=new Float32Array(N*6);
    for(let i=0;i<N;i++){const x=(R()-.5)*70,y=R()*40,z=(R()-.5)*70;rp.set([x,y,z,x+.1,y-1.1,z],i*6);}
    const rg=new THREE.BufferGeometry();rg.setAttribute("position",new THREE.BufferAttribute(rp,3));
    rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:"#c8d6e6",transparent:true,opacity:.55}));scene.add(rain);
    const sp=new Float32Array(N*3);for(let i=0;i<N;i++)sp.set([(R()-.5)*70,R()*40,(R()-.5)*70],i*3);
    const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));
    snow=new THREE.Points(sg,new THREE.PointsMaterial({color:"#ffffff",size:.35,transparent:true,opacity:.9}));scene.add(snow);
  }
  let cur=null;
  function load(place,t){
    if(!renderer)return;
    cur=place; type=t; seed=[...(place.country?place.country.c3:place.id||'x')].reduce((a,c)=>a*31+c.charCodeAt(0),7)%2147483646+1;
    if(scene){scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
    scene=new THREE.Scene(); root=new THREE.Group(); scene.add(root);
    anims=[];walkers=[];winMats=[];lampMats=[];snowables=[];nightOnly=[];umbrellas=[];onTod=[];
    hemi=new THREE.HemisphereLight("#fff","#444",.5);scene.add(hemi);amb=new THREE.AmbientLight("#ffffff",.4);scene.add(amb);
    sun=new THREE.DirectionalLight("#fff",1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-42;sc.right=42;sc.top=42;sc.bottom=-42;sc.near=1;sc.far=220;sun.shadow.bias=-.0006;sun.shadow.normalBias=.02;scene.add(sun);
    sky=new THREE.Mesh(new THREE.SphereGeometry(320,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:C("#4a8fe0")},bot:{value:C("#cfe6ff")}},
      vertexShader:"varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:"uniform vec3 top;uniform vec3 bot;varying vec3 vp;void main(){float h=clamp(vp.y*1.6+.15,0.,1.);gl_FragColor=vec4(mix(bot,top,pow(h,.8)),1.);}"}));scene.add(sky);
    const sp=new Float32Array(1500*3);for(let i=0;i<1500;i++){const a=R()*6.283,b=R()*.5*Math.PI,r=300;sp.set([Math.cos(a)*Math.cos(b)*r,Math.sin(b)*r+5,Math.sin(a)*Math.cos(b)*r],i*3);}
    const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));stars=new THREE.Points(sg,new THREE.PointsMaterial({color:"#ffffff",size:1.4,sizeAttenuation:false,fog:false,transparent:true,opacity:.9}));scene.add(stars);
    disc=new THREE.Mesh(new THREE.SphereGeometry(9,20,12),new THREE.MeshBasicMaterial({color:"#fff6d8",fog:false}));scene.add(disc);
    precip();
    try{(SC[t]||SC.pyramid)();}catch(e){console.error(e);}
    const em=new THREE.LineBasicMaterial({color:"#000",transparent:true,opacity:.16});const add2=[];
    root.traverse(o=>{if(!o.isMesh||o.userData.noEdge)return;const gp=o.geometry.type;if(!/Box|Cylinder|Cone/.test(gp))return;if(o.geometry.parameters&&o.geometry.parameters.radialSegments>12)return;
      const l=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,25),em);add2.push([o,l]);});add2.forEach(([o,l])=>o.add(l));
    cam.auto=true; cam.r=58; applyLook();
  }
  function frame(now){
    if(!running)return; requestAnimationFrame(frame);
    const t=(now-t0)/1000, dt=Math.min(.05,(now-last)/1000||0); last=now;
    if(cam.auto)cam.th+=dt*.06;
    camera.position.set(Math.sin(cam.th)*Math.sin(cam.ph)*cam.r,Math.cos(cam.ph)*cam.r,Math.cos(cam.th)*Math.sin(cam.ph)*cam.r);camera.lookAt(0,4,0);
    anims.forEach(f=>f(t));
    walkers.forEach(w=>{if(!w.g.visible)return;const [x,z]=w.path(t*w.sp,w.off);const [x2,z2]=w.path(t*w.sp+.05,w.off);w.g.position.set(x,w.yfn?w.yfn(x):0,z);w.g.rotation.y=Math.atan2(x2-x,z2-z);
      const sw=Math.sin(t*7*w.sp+w.off)*.55;const L=w.g.userData.legs,A=w.g.userData.arms;if(L){L[0].rotation.x=sw;L[1].rotation.x=-sw;A[0].rotation.x=-sw*.8;A[1].rotation.x=sw*.8;}});
    if(rain.visible){const p=rain.geometry.attributes.position;for(let i=0;i<p.count;i+=2){let y=p.getY(i)-dt*45;if(y<0)y+=40;p.setY(i,y);p.setY(i+1,y-1.1);}p.needsUpdate=true;}
    if(snow.visible){const p=snow.geometry.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i)-dt*3;if(y<0)y+=40;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(t+i)*dt*.6);}p.needsUpdate=true;}
    renderer.render(scene,camera);
  }
  return {
    init, load, _sc:()=>scene,
    setTod(v){tod=v;if(scene)applyLook();}, setWeather(v){wx=v;if(scene)applyLook();},
    get tod(){return tod;}, get wx(){return wx;},
    start(){if(running||!renderer)return;running=true;last=performance.now();requestAnimationFrame(frame);}, stop(){running=false;},
    resetCam(){cam.auto=true;cam.r=58;cam.ph=1.0;},
  };
})();
