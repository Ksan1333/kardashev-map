/* ---------- ミクロの生き物・ウイルスを、より実物に近い構造で描く ---------- */
window.MICROHQ=(function(){
  if(typeof THREE==="undefined")return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c);let X=null;
  const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:.02,...o});
  const G=(c,o=.3,x={})=>new THREE.MeshStandardMaterial({color:c,roughness:.25,metalness:.05,transparent:true,opacity:o,depthWrite:false,side:THREE.DoubleSide,...x});
  const add=(m,p)=>{(p||X.root).add(m);return m;};
  const sph=(r,mat,x,y,z,sx=1,sy=1,sz=1,p,seg=32)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.round(seg*.7)),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return add(m,p);};
  const tube=(pts,r,mat,p,seg=40,rs=8,fn)=>{const cu=new THREE.CatmullRomCurve3(pts);const g=new THREE.TubeGeometry(cu,seg,r,rs,false);if(fn){const P=g.attributes.position;for(let i=0;i<=seg;i++){const u=i/seg,c=cu.getPointAt(u),k=fn(u);for(let j=0;j<=rs;j++){const q=i*(rs+1)+j;const v=V(P.getX(q),P.getY(q),P.getZ(q)).sub(c).multiplyScalar(k).add(c);P.setXYZ(q,v.x,v.y,v.z);}}g.computeVertexNormals();}return add(new THREE.Mesh(g,mat),p);};
  const grp=(x,y,z,p)=>{const g=new THREE.Group();g.position.set(x,y,z);return add(g,p);};
  const rnd=()=>X.R();
  const noiseDisp=(geo,amp,fr)=>{const P=geo.attributes.position;for(let i=0;i<P.count;i++){const v=V(P.getX(i),P.getY(i),P.getZ(i));const n=Math.sin(v.x*fr+1.3)*Math.sin(v.y*fr*1.3+.7)*Math.sin(v.z*fr*.9+2.1);v.multiplyScalar(1+n*amp);P.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();return geo;};
  // ミトコンドリア：二重膜とひだ（クリステ）が見える断面
  function mito(p,len=.9,r=.24){const g=new THREE.Group();p.add(g);    const half=new THREE.Mesh(new THREE.SphereGeometry(1,28,18,0,Math.PI),M("#ee8040",{side:THREE.DoubleSide}));half.scale.set(len,r,r);g.add(half);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(1,32),M("#ffc890",{side:THREE.DoubleSide}));inner.scale.set(len*.92,r*.9,1);g.add(inner);
    for(let i=0;i<7;i++){const x=-len*.75+i*len*.25;const cr=new THREE.Mesh(new THREE.PlaneGeometry(len*.06,r*1.2),M("#d0602a",{side:THREE.DoubleSide}));cr.position.set(x,(i%2?.25:-.25)*r,.002);g.add(cr);}
    return g;}
  const B={};
  // ===== 動物・植物の細胞（4分の1を切り取った断面） =====
  B.cell=function(p){const plant=!!p.plant;const R0=3.2;const root=grp(0,0,0);
    const memM=G(plant?"#b8f0b8":"#ffd0dc",.32,{side:THREE.DoubleSide});const mem=new THREE.Mesh(new THREE.SphereGeometry(R0,64,40,0,Math.PI*1.5),memM);mem.scale.set(plant?1.25:1.1,plant?.9:.82,1);root.add(mem);
    const cyto=new THREE.Mesh(new THREE.SphereGeometry(R0*.985,64,40,0,Math.PI*1.5),G(plant?"#e8ffe0":"#fff0f4",.12));cyto.scale.copy(mem.scale);root.add(cyto);
    if(plant){const wall=new THREE.Mesh(new THREE.BoxGeometry(8.6,6.2,7.0,1,1,1),G("#8fd08a",.18));root.add(wall);wall.add(new THREE.LineSegments(new THREE.EdgesGeometry(wall.geometry),new THREE.LineBasicMaterial({color:"#6ab06a"})));
      const vac=sph(1.9,G("#9fd8ff",.3),-.9,-.2,.6,1.3,.95,1.1,root);}
    // 核（核膜・核膜孔・核小体・クロマチン）
    const nu=grp(.9,.2,-.3,root);const env=new THREE.Mesh(new THREE.SphereGeometry(1.1,48,32,0,Math.PI*1.5),M("#8a6ad8",{side:THREE.DoubleSide,roughness:.4}));nu.add(env);
    for(let i=0;i<60;i++){const a=rnd()*Math.PI*1.5,u=rnd()*2-1;const q=V(-Math.cos(a)*Math.sqrt(1-u*u),u,Math.sin(a)*Math.sqrt(1-u*u)).multiplyScalar(1.1);const pr=new THREE.Mesh(new THREE.TorusGeometry(.05,.018,6,12),M("#5a3aa0"));pr.position.copy(q);pr.lookAt(q.clone().multiplyScalar(2));nu.add(pr);}
    const nf=new THREE.Mesh(new THREE.CircleGeometry(1.08,48,Math.PI/2,Math.PI),M("#b8a0f0",{side:THREE.DoubleSide}));nf.rotation.y=0;nu.add(nf);const nf2=nf.clone();nf2.rotation.y=-Math.PI/2;nu.add(nf2);
    sph(.38,M("#4a2a8a"),-.25,.1,-.25,1,1,1,nu);const chr=[];for(let i=0;i<9;i++){const pts=[];let q=V((rnd()-.5)*.8,(rnd()-.5)*.8,-.3-rnd()*.5);for(let k=0;k<6;k++){q=q.clone().add(V((rnd()-.5)*.3,(rnd()-.5)*.3,(rnd()-.5)*.2));if(q.length()>.95)q.multiplyScalar(.9);pts.push(q);}tube(pts,.025,M("#6a4ab0"),nu,30,5);}
    // 粗面小胞体（核を包む折りたたまれた膜＋リボソーム）
    for(let i=0;i<6;i++){const rr=1.35+i*.17;const er=new THREE.Mesh(new THREE.TorusGeometry(rr,.045,6,64,Math.PI*1.25),M("#f4a8c4"));er.rotation.set(Math.PI/2+(rnd()-.5)*.3,(rnd()-.5)*.2,.2+i*.12);er.position.copy(nu.position);er.scale.set(1,1,.6+rnd()*.6);root.add(er);
      for(let k=0;k<26;k++){const a=.2+i*.12+k/26*Math.PI*1.25;const d=sph(.035,M("#5a3a6a"),0,0,0,1,1,1,er,6);d.position.set(Math.cos(a)*rr*1.03,Math.sin(a)*rr*1.03,0);d.position.applyAxisAngle(V(0,0,1),-(.2+i*.12));}}
    // ゴルジ体（湾曲した平たい袋の積み重ね）
    const go=grp(-1.4,.9,1.2,root);go.rotation.set(.4,.6,.2);for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.TorusGeometry(.55-i*.04,.07,8,32,Math.PI*.9),M("#f4d06a"));c.scale.set(1,1,.35);c.position.y=i*.16;go.add(c);for(let k=0;k<2;k++)sph(.07,M("#f8e08a"),Math.cos(k*2.6)*.62,i*.16,Math.sin(k*2.6)*.1,1,1,1,go,10);}
    // ミトコンドリア
    for(let i=0;i<(plant?7:12);i++){const a=rnd()*Math.PI*1.5,rr=1.7+rnd()*1.0,u=(rnd()-.5)*1.4;const m=mito(root,.6+rnd()*.3,.2);m.position.set(-Math.cos(a)*rr,u,Math.sin(a)*rr*.95);m.rotation.set(rnd()*3,rnd()*3,rnd()*3);}
    // 葉緑体（チラコイドの積み重ね＝グラナ）
    if(plant)for(let i=0;i<12;i++){const a=rnd()*Math.PI*1.5,rr=2.6+rnd()*.5,u=(rnd()-.5)*1.8;const cg=grp(-Math.cos(a)*rr,u,Math.sin(a)*rr,root);cg.rotation.set(rnd()*3,rnd()*3,rnd()*3);
      const env2=new THREE.Mesh(new THREE.SphereGeometry(1,24,16,0,Math.PI),M("#3fae4a",{side:THREE.DoubleSide}));env2.scale.set(.55,.25,.3);cg.add(env2);const st=new THREE.Mesh(new THREE.CircleGeometry(1,24),M("#bfe8a0",{side:THREE.DoubleSide}));st.scale.set(.53,.23,1);cg.add(st);
      for(let k=0;k<4;k++)for(let j=0;j<4;j++){const d=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.018,12),M("#1f7a2a"));d.rotation.x=Math.PI/2;d.position.set(-.33+k*.22,-.09+j*.04,.01);cg.add(d);}}
    // リソソーム・中心体・細胞骨格・リボソーム
    if(!plant){for(let i=0;i<6;i++){const a=rnd()*Math.PI*1.5,rr=1.8+rnd()*.8;sph(.16,M("#c06ad0"),-Math.cos(a)*rr,(rnd()-.5)*1.4,Math.sin(a)*rr,1,1,1,root,14);}
      const ce=grp(-.5,-.6,1.6,root);[0,1].forEach(k=>{const cc=grp(0,0,0,ce);cc.rotation.set(k?Math.PI/2:0,0,0);for(let j=0;j<9;j++){const a=j/9*6.283;const t=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.32,6),M("#7fd0a0"));t.position.set(Math.cos(a)*.08,0,Math.sin(a)*.08);cc.add(t);}});}
    for(let i=0;i<14;i++){const pts=[];let q=V((rnd()-.5)*5,(rnd()-.5)*3,(rnd()-.5)*5);for(let k=0;k<4;k++){pts.push(q.clone());q.add(V((rnd()-.5)*1.4,(rnd()-.5)*1.,(rnd()-.5)*1.4));}tube(pts,.012,M("#e0c0ff",{transparent:true,opacity:.5}),root,20,4);}
    const rp=[];for(let i=0;i<700;i++){const a=rnd()*Math.PI*1.5,u=rnd()*2-1,rr=1.3+rnd()*1.7;rp.push(-Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr*.75,Math.sin(a)*Math.sqrt(1-u*u)*rr);}const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(rp,3));root.add(new THREE.Points(pg,new THREE.PointsMaterial({color:"#6a4a7a",size:.05})));
    X.anims.push(t=>{root.rotation.y=Math.sin(t*.15)*.4;});X.cam={th:-2.3,ph:1.05};return 9;};
  // ===== 赤血球（両面がへこんだ円盤：エバンス・ファンの形） =====
  B.rbc=function(){const R0=1.5,prof=[];const D=(x)=>{const r=x/R0;return R0*.5*Math.sqrt(Math.max(0,1-r*r))*(.207+2.003*r*r-1.123*r*r*r*r);};
    for(let i=0;i<=40;i++){const x=Math.sin(i/40*Math.PI/2)*R0;prof.push(new THREE.Vector2(x,D(x)));}for(let i=40;i>=0;i--){const x=Math.sin(i/40*Math.PI/2)*R0;prof.push(new THREE.Vector2(x,-D(x)));}
    const geo=new THREE.LatheGeometry(prof,64);const mat=new THREE.MeshPhysicalMaterial?new THREE.MeshPhysicalMaterial({color:"#b81e1e",roughness:.35,clearcoat:.4,sheen:0}):M("#b81e1e");
    const vessel=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.2,16,48,1,true),G("#ffb0a0",.12));vessel.rotation.z=Math.PI/2;add(vessel);
    const cells=[];for(let i=0;i<26;i++){const m=new THREE.Mesh(geo,mat);const y=(rnd()-.5)*5.4,z=(rnd()-.5)*5.4;if(y*y+z*z>13)continue;m.position.set((rnd()-.5)*14,y,z);m.rotation.set(rnd()*3,rnd()*3,rnd()*3);add(m);cells.push([m,.6+rnd()*.6,rnd()*3]);}
    for(let i=0;i<3;i++){const w=sph(.9,G("#f4f0ff",.85),(rnd()-.5)*10,(rnd()-.5)*3,(rnd()-.5)*3,1,1,1,null,32);w.geometry=noiseDisp(new THREE.SphereGeometry(.9,32,24),.08,6);cells.push([w,.3,0]);}
    for(let i=0;i<10;i++){const pl=sph(.18,M("#e8d0a0"),(rnd()-.5)*12,(rnd()-.5)*4,(rnd()-.5)*4,1.4,.5,1);cells.push([pl,.8,0]);}
    X.anims.push(t=>cells.forEach(([m,sp,o])=>{m.position.x+=.012*sp;if(m.position.x>7.5)m.position.x=-7.5;m.rotation.x+=.003*sp;m.rotation.y+=.002*sp;}));return 9;};
  // ===== 神経細胞（樹状突起の枝分かれ・軸索・髄鞘・ランビエ絞輪・シナプス） =====
  B.neuron=function(){const c=M("#f2a8c8",{roughness:.45});const soma=sph(.85,c,0,0,0,1,.9,1,null,48);soma.geometry=noiseDisp(new THREE.SphereGeometry(.85,48,32),.06,4);sph(.32,M("#8a4ab0"),.1,.1,.2);
    const branch=(o,dir,len,r,depth)=>{const pts=[o.clone()];let q=o.clone(),d=dir.clone();const n=5;for(let k=0;k<n;k++){d.add(V((rnd()-.5)*.6,(rnd()-.5)*.6,(rnd()-.5)*.6)).normalize();q=q.clone().addScaledVector(d,len/n);pts.push(q);}
      tube(pts,r,c,null,24,6,u=>1-u*.55);if(depth>0){const k=2;for(let i=0;i<k;i++)branch(q,d.clone().add(V((rnd()-.5)*1.4,(rnd()-.5)*1.4,(rnd()-.5)*1.4)).normalize(),len*.65,r*.5,depth-1);}
      else for(let i=0;i<6;i++){const sp=pts[1+Math.floor(rnd()*(pts.length-1))];sph(.035,c,sp.x+(rnd()-.5)*.1,sp.y+(rnd()-.5)*.1,sp.z+(rnd()-.5)*.1,1,1,1,null,6);}};
    for(let i=0;i<7;i++){const a=rnd()*6.283,u=rnd()*1.6-.8;const d=V(-Math.abs(Math.cos(a))-.2,u,Math.sin(a)).normalize();branch(d.clone().multiplyScalar(.7),d,1.6+rnd()*.8,.12,2);}
    tube([V(.8,0,0),V(1.4,-.05,0)],.13,c,null,8,8,u=>1-u*.4);const ax=[V(1.4,-.05,0),V(3,-.25,.1),V(5,.1,-.1),V(7,-.15,.05),V(8.4,0,0)];const cu=new THREE.CatmullRomCurve3(ax);tube(ax,.07,c,null,60);
    for(let i=0;i<9;i++){const u=.08+i*.1,u2=u+.085;const pts=[];for(let k=0;k<=6;k++)pts.push(cu.getPointAt(u+(u2-u)*k/6));tube(pts,.17,M("#f4f2e4",{roughness:.6}),null,12,12,v=>Math.sin(Math.max(.15,Math.min(.85,v))*Math.PI)*1+.0);}
    const tip=cu.getPointAt(1);for(let i=0;i<5;i++){const d=V(1,(rnd()-.5)*1.6,(rnd()-.5)*1.6).normalize();const e=tip.clone().addScaledVector(d,.8);tube([tip,tip.clone().addScaledVector(d,.4),e],.035,c,null,10);sph(.12,M("#f8c8e0"),e.x,e.y,e.z,1,1,1,null,12);}
    const sig=sph(.13,new THREE.MeshBasicMaterial({color:"#7ee0ff"}),0,0,0,1,1,1,null,12);const sg2=sph(.3,new THREE.MeshBasicMaterial({color:"#7ee0ff",transparent:true,opacity:.25}),0,0,0,1,1,1,sig,12);
    X.anims.push(t=>{const k=(t*.25)%1;sig.position.copy(cu.getPointAt(k));});return 10;};
  // ===== 大腸菌（周べん毛・線毛） =====
  B.bacillus=function(p){const body=M("#c9d8a0",{roughness:.5});for(let i=0;i<4;i++){const g=grp((rnd()-.5)*6,(rnd()-.5)*3,(rnd()-.5)*4);g.rotation.set(rnd()*3,rnd()*3,rnd()*3);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,1.5,24,1,true),body);g.add(cap);sph(.45,body,0,.75,0,1,1,1,g,24);sph(.45,body,0,-.75,0,1,1,1,g,24);
      sph(.25,G("#f0f8d0",.5),0,.1,0,1,2.2,1,g,16);
      for(let k=0;k<70;k++){const a=rnd()*6.283,y=(rnd()-.5)*1.9;const o=V(Math.cos(a)*.45,y,Math.sin(a)*.45);const d=o.clone().setY(0).normalize();const h=new THREE.Line(new THREE.BufferGeometry().setFromPoints([o,o.clone().addScaledVector(d,.18)]),new THREE.LineBasicMaterial({color:"#e8f0c0",transparent:true,opacity:.6}));g.add(h);}
      const fl=[];for(let k=0;k<7;k++){const a=rnd()*6.283,y=(rnd()-.5)*1.6;fl.push({o:V(Math.cos(a)*.45,y,Math.sin(a)*.45),ph:rnd()*6,m:null});}
      X.anims.push(t=>fl.forEach(f=>{if(f.m){g.remove(f.m);f.m.geometry.dispose();}const pts=[];for(let j=0;j<14;j++){const u=j/13;pts.push(V(f.o.x*(1+u*.4),f.o.y-u*2.6,f.o.z*(1+u*.4)).add(V(Math.sin(t*9+j*.9+f.ph)*.14*u,0,Math.cos(t*9+j*.9+f.ph)*.14*u)));}
        f.m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts).getPoints(40)),new THREE.LineBasicMaterial({color:"#f4f0d8"}));g.add(f.m);}));
      X.anims.push(()=>{g.translateY(.004);if(g.position.length()>6)g.position.set((rnd()-.5)*3,(rnd()-.5)*2,(rnd()-.5)*2);});}return 9;};
  // ===== ゾウリムシ（草履形・繊毛・口溝・収縮胞・大核） =====
  B.parame=function(p){const g=grp(0,0,0);const geo=new THREE.SphereGeometry(1,64,40);const P=geo.attributes.position;
    for(let i=0;i<P.count;i++){let x=P.getX(i),y=P.getY(i),z=P.getZ(i);const s=1+.18*Math.sin((x+.2)*2.8);const groove=Math.exp(-Math.pow((x-.05)/.35,2))*Math.max(0,z)*.35;P.setXYZ(i,x*2.6,y*.85*s,z*1.0*s-groove);}geo.computeVertexNormals();
    const b=new THREE.Mesh(geo,G("#d8ecb8",.55));g.add(b);sph(.45,M("#8a6ad0"),.1,0,0,1.6,.8,.8,g);sph(.15,M("#6a4ab0"),.55,.1,.1,1,1,1,g,12);
    [-1.5,1.5].forEach(x=>{const cv=grp(x,.45,0,g);sph(.16,G("#9fd8ff",.8),0,0,0,1,1,1,cv,16);for(let k=0;k<7;k++){const a=k/7*6.283;tube([V(0,0,0),V(Math.cos(a)*.18,0,Math.sin(a)*.18),V(Math.cos(a)*.38,0,Math.sin(a)*.38)],.025,G("#9fd8ff",.6),cv,6,5);}X.anims.push(t=>cv.scale.setScalar(.8+.3*Math.abs(Math.sin(t*1.5+x))));});
    for(let i=0;i<14;i++)sph(.1,M("#a8d880"),(rnd()-.5)*3.6,(rnd()-.5)*.8,(rnd()-.5)*.8,1,1,1,g,10);
    const cl=[],cs=[];for(let i=0;i<1600;i++){const a=rnd()*6.283,u=rnd()*2-1;const n=V(Math.cos(a)*Math.sqrt(1-u*u),u,Math.sin(a)*Math.sqrt(1-u*u));const s=1+.18*Math.sin((n.x+.2)*2.8);const q=V(n.x*2.6,n.y*.85*s,n.z*s);const d=q.clone().normalize();cl.push(q,q.clone().addScaledVector(d,.13));cs.push(n.x*3);}
    const lg=new THREE.BufferGeometry().setFromPoints(cl);const lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:"#f4ffe0",transparent:true,opacity:.6}));g.add(lines);const base=lg.attributes.position.array.slice();
    X.anims.push(t=>{const a=lg.attributes.position;for(let i=0;i<cs.length;i++){const k=i*2+1,j=k*3;const w=Math.sin(t*8+cs[i])*.06;a.setXYZ(k,base[j]+w,base[j+1],base[j+2]);}a.needsUpdate=true;g.rotation.x=Math.sin(t*.4)*.3;g.position.x=Math.sin(t*.25)*.6;});return 8;};
  // ===== クマムシ（4つの体節・8本の脚と爪・口の管・目点） =====
  B.tardi=function(p){const g=grp(0,.6,0);const skin=M("#d8b88a",{roughness:.85});const segs=[[-1.3,.62],[-.45,.7],[.4,.68],[1.15,.55]];
    segs.forEach(([x,r],i)=>{const s=sph(r,skin,x,0,0,1.05,.9,1,g,40);s.geometry=noiseDisp(new THREE.SphereGeometry(r,40,28),.03,9);});
    const hd=sph(.45,skin,1.75,.05,0,1.1,.85,.9,g,32);tube([V(2.1,0,0),V(2.35,-.05,0)],.08,M("#c8a070"),g,6,8);[-1,1].forEach(s=>sph(.05,M("#2a1a10"),1.95,.25,s*.22,1,1,1,g,8));
    const legs=[];segs.forEach(([x,r],i)=>[-1,1].forEach(s=>{const lg=grp(x,-.35,s*r*.7,g);const L=tube([V(0,0,0),V(0,-.25,s*.12),V(.05,-.5,s*.18)],.15,skin,lg,10,10,u=>1-u*.35);
      for(let k=0;k<4;k++){const cl=new THREE.Mesh(new THREE.ConeGeometry(.025,.2,6),M("#3a2a1a"));cl.position.set(.06+(k-1.5)*.05,-.58,s*.2);cl.rotation.z=Math.PI+.4+(k-1.5)*.25;lg.add(cl);}legs.push([lg,i,s]);}));
    X.anims.push(t=>{legs.forEach(([lg,i,s])=>{lg.rotation.z=Math.sin(t*3+i*1.2+(s>0?Math.PI:0))*.35;});g.rotation.y=Math.sin(t*.3)*.5;});return 6;};
  // ===== 珪藻（ガラスの殻：放射状のすじと小さな穴） =====
  B.diatom=function(p){const tex=(()=>{const c=document.createElement("canvas");c.width=c.height=512;const x=c.getContext("2d");x.fillStyle="#d8d0a0";x.fillRect(0,0,512,512);x.translate(256,256);
      for(let ring=0;ring<16;ring++){const r=30+ring*14;const n=Math.round(r*.55);for(let k=0;k<n;k++){const a=k/n*6.283;x.fillStyle="#6a6040";x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,2.6,0,7);x.fill();}}
      x.strokeStyle="#f4ecc8";x.lineWidth=3;for(let k=0;k<48;k++){const a=k/48*6.283;x.beginPath();x.moveTo(Math.cos(a)*28,Math.sin(a)*28);x.lineTo(Math.cos(a)*250,Math.sin(a)*250);x.stroke();}
      x.fillStyle="#f8f0d0";x.beginPath();x.arc(0,0,24,0,7);x.fill();return new THREE.CanvasTexture(c);})();
    const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.25,metalness:.2,transparent:true,opacity:.92,side:THREE.DoubleSide});
    [[0,1],[0,-1]].forEach(([_,s],k)=>{const g=grp(0,s*.32,0);const lid=new THREE.Mesh(new THREE.CircleGeometry(2,96),mat);lid.rotation.x=-s*Math.PI/2;lid.position.y=s*.25;g.add(lid);
      const band=new THREE.Mesh(new THREE.CylinderGeometry(2,2,.5,96,1,true),G("#e8e0b8",.6));g.add(band);});
    const chl=[];for(let i=0;i<10;i++)chl.push(sph(.3,M("#a07a2a"),(rnd()-.5)*2.4,0,(rnd()-.5)*2.4,1.2,.5,1));
    X.anims.push(t=>{X.root.rotation.x=.5+Math.sin(t*.3)*.3;X.root.rotation.y=t*.2;});return 6;};
  // ===== コロナウイルス（こん棒形のスパイク三量体・M/Eたんぱく質・RNA） =====
  B.corona=function(p){const R0=1.5;const env=sph(R0,M("#b8bcc4",{roughness:.8}),0,0,0,1,1,1,null,64);env.geometry=noiseDisp(new THREE.SphereGeometry(R0,64,48),.025,14);
    const sp=M("#d84a3a",{roughness:.5}),st=M("#c8605a");const n=40;for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996;const d=V(Math.cos(a)*r,y,Math.sin(a)*r);
      const g=grp(0,0,0);g.quaternion.setFromUnitVectors(V(0,1,0),d);g.position.copy(d.clone().multiplyScalar(R0*.98));
      const stalk=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,.35,8),st);stalk.position.y=.17;g.add(stalk);
      for(let k=0;k<3;k++){const a2=k/3*6.283;const lobe=sph(.1,sp,Math.cos(a2)*.06,.45,Math.sin(a2)*.06,1,1.5,1,g,14);}}
    for(let i=0;i<55;i++){const d=V(rnd()-.5,rnd()-.5,rnd()-.5).normalize();sph(.045,M(i%5?"#c8a860":"#7a9ad8"),d.x*R0,d.y*R0,d.z*R0,1,1,1,null,8);}
    const cut=new THREE.Mesh(new THREE.CircleGeometry(R0*.97,64),M("#8a7a90",{side:THREE.DoubleSide}));X.root.add(cut);cut.visible=false;
    X.anims.push(t=>{X.root.rotation.y=t*.15;X.root.rotation.x=Math.sin(t*.2)*.2;});return 6;};
  function build(type,p,ctx){if(!B[type])return null;X=ctx;const n0=ctx.root.children.length,a0=ctx.anims.length;try{return B[type](p);}catch(e){console.warn("MICROHQ",type,e);ctx.root.children.splice(n0);ctx.anims.length=a0;return null;}}
  return {build,has:t=>!!B[t]};
})();
