/* ---------- 動物のデフォルメ3D（トゥーン調・大きな目・ほっぺ・短い手足・ぷにぷに動く） ---------- */
window.CUTE=(function(){
  if(typeof THREE==="undefined")return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c),V2=(x,y)=>new THREE.Vector2(x,y);
  let X=null;
  let GM=null;const grad=()=>{if(GM)return GM;const N=64,a=new Uint8Array(N),ss=(e0,e1,x)=>{const t=Math.min(1,Math.max(0,(x-e0)/(e1-e0)));return t*t*(3-2*t);};
    for(let i=0;i<N;i++){const u=i/(N-1);a[i]=Math.round(255*(.5+.3*ss(.2,.28,u)+.2*ss(.6,.68,u)));}
    const t=new THREE.DataTexture(a,N,1,THREE.LuminanceFormat);t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;return GM=t;};
  const T=(c,o={})=>new THREE.MeshToonMaterial({color:c,gradientMap:grad(),...o});
  const VT=(o={})=>new THREE.MeshToonMaterial({color:"#fff",vertexColors:true,gradientMap:grad(),...o});
  const BL=c=>new THREE.MeshBasicMaterial({color:c});
  const par=p=>p||X.root;
  function ell(rx,ry,rz,mat,pos,p,seg=36){const m=new THREE.Mesh(new THREE.SphereGeometry(1,seg,Math.round(seg*.7)),mat);m.scale.set(rx,ry,rz);m.position.copy(pos);par(p).add(m);return m;}
  // 頂点カラーの球（n=単位法線で色を決める）
  // 球面に模様を描いたテクスチャ（境界がなめらか）
  function vell(rx,ry,rz,fn,pos,p,seg=48){const W=512,H=256,cv=document.createElement("canvas");cv.width=W;cv.height=H;const cx=cv.getContext("2d"),im=cx.createImageData(W,H),d=im.data,c=C("#fff");
    for(let r=0;r<H;r++){const th=(r+.5)/H*Math.PI,st=Math.sin(th),y=Math.cos(th);for(let q=0;q<W;q++){const ph=(q+.5)/W*Math.PI*2;fn(c,-Math.cos(ph)*st,y,Math.sin(ph)*st);const k=(r*W+q)*4;d[k]=c.r*255;d[k+1]=c.g*255;d[k+2]=c.b*255;d[k+3]=255;}}
    cx.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.anisotropy=4;
    const m=new THREE.Mesh(new THREE.SphereGeometry(1,seg,Math.round(seg*.75)),new THREE.MeshToonMaterial({map:t,gradientMap:grad()}));m.scale.set(rx,ry,rz);m.position.copy(pos);par(p).add(m);return m;}
  // 太さが変わるチューブ（両端は丸く）
  function tube(pts,r0,r1,mat,p,seg=40,fn){const cu=new THREE.CatmullRomCurve3(pts);const g=new THREE.TubeGeometry(cu,seg,1,14,false);const ps=g.attributes.position;
    for(let i=0;i<=seg;i++){const u=i/seg,c=cu.getPointAt(u),r=fn?fn(u):r0+(r1-r0)*u;for(let j=0;j<=14;j++){const k=i*15+j;const v=V(ps.getX(k),ps.getY(k),ps.getZ(k)).sub(c).multiplyScalar(r).add(c);ps.setXYZ(k,v.x,v.y,v.z);}}
    g.computeVertexNormals();const m=new THREE.Mesh(g,mat);par(p).add(m);const rs=fn?fn(0):r0,re=fn?fn(1):r1;ell(rs,rs,rs,mat,pts[0],p,16);ell(re,re,re,mat,pts[pts.length-1],p,16);return m;}
  const limb=(a,b,r,mat,p)=>tube([a,a.clone().lerp(b,.5),b],r,r*.92,mat,p,8);
  function grp(pos,p){const g=new THREE.Group();g.position.copy(pos);par(p).add(g);return g;}
  function flat(pts,mat,p,map){const g=new THREE.ShapeGeometry(new THREE.Shape(pts.map(([a,b])=>V2(a,b))),16);if(map){const ps=g.attributes.position;for(let i=0;i<ps.count;i++){const v=map(ps.getX(i),ps.getY(i));ps.setXYZ(i,v[0],v[1],v[2]);}}g.computeVertexNormals();const m=new THREE.Mesh(g,mat);par(p).add(m);return m;}
  const blob=(n,r)=>{const P=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;P.push([Math.cos(a)*r,Math.sin(a)*r]);}return P;};
  // ---- 顔（頭の中心が原点、正面は +x） ----
  function eyeAt(par0,pos,n,er,s,o={}){const g=new THREE.Group();g.position.copy(pos);g.quaternion.setFromUnitVectors(V(1,0,0),n.clone().normalize());par0.add(g);
    ell(er*.42,er*1.18,er*.92,BL(o.eyeC||"#1d1622"),V(0,0,0),g,20);ell(er*.3,er*.3,er*.3,BL("#ffffff"),V(er*.38,er*.42,-s*er*.18),g,12);ell(er*.13,er*.13,er*.13,BL("#ffffff"),V(er*.36,-er*.42,s*er*.3),g,10);
    const ph=Math.random()*3;X.anims.push(t=>{g.scale.y=((t+ph)%4.2)<.13?.12:1;});return g;}
  function face(head,R,o={}){const sp=o.spread??.4,ey=o.y??.1,er=R*(o.eye??.19),eyes=[];
    const dir=(th,ph)=>V(Math.cos(ph)*Math.cos(th),Math.sin(ph),Math.cos(ph)*Math.sin(th));
    [-1,1].forEach(s=>{const n=dir(s*sp,ey);if(o.eyes===false){if(o.cheek!==false){const cn=dir(s*(sp+.36),ey-.36);const c=ell(R*.05,R*.085,R*.15,new THREE.MeshBasicMaterial({color:o.cheekC||"#ff8fae",transparent:true,opacity:.7,depthWrite:false}),cn.clone().multiplyScalar(R*.97),head,14);c.quaternion.setFromUnitVectors(V(1,0,0),cn);}return;}const g=new THREE.Group();g.position.copy(n.clone().multiplyScalar(R*(o.depth??.965)));g.quaternion.setFromUnitVectors(V(1,0,0),n);head.add(g);
      ell(er*.42,er*1.18,er*.92,BL(o.eyeC||"#1d1622"),V(0,0,0),g,20);ell(er*.3,er*.3,er*.3,BL("#ffffff"),V(er*.38,er*.42,-s*er*.18),g,12);ell(er*.13,er*.13,er*.13,BL("#ffffff"),V(er*.36,-er*.42,s*er*.3),g,10);
      if(o.irisC)ell(er*.46,er*.75,er*.6,BL(o.irisC),V(er*.12,-er*.22,0),g,14);eyes.push(g);
      if(o.cheek!==false){const cn=dir(s*(sp+.36),ey-.36);const c=ell(R*.05,R*.085,R*.15,new THREE.MeshBasicMaterial({color:o.cheekC||"#ff8fae",transparent:true,opacity:.7,depthWrite:false}),cn.clone().multiplyScalar(R*.97),head,14);c.quaternion.setFromUnitVectors(V(1,0,0),cn);}});
    if(o.mouth!==false){const m=new THREE.Mesh(new THREE.TorusGeometry(R*(o.mouthR??.1),R*.025,6,18,Math.PI),BL(o.mouthC||"#3a1a20"));const mp=o.mouthY??(ey-.34);m.rotation.set(0,Math.PI/2,Math.PI);m.position.copy(dir(0,mp).multiplyScalar(R*(o.mouthD??.985)));head.add(m);}
    const ph=Math.random()*3;X.anims.push(t=>{const b=((t+ph)%4.2)<.13?.12:1;eyes.forEach(e=>e.scale.y=b);});return eyes;}
  // ぷにぷに動き
  const bounce=(g,k=1,sp=2.4)=>{const y0=g.position.y;X.anims.push(t=>{const s=Math.sin(t*sp);g.position.y=y0+Math.abs(s)*.04*k;g.scale.set(1-.025*s*k,1+.035*s*k,1-.025*s*k);});};
  const B={};
  // ===== 四足（ゾウ・キリン・ライオン・ウマ・パンダ・イヌ） =====
  B.quad=function(p){const id=X.id,col=C(p.c),dk=C(p.patch||p.mane||p.c).multiplyScalar(p.patch?1:.85),g=grp(V(0,0,0));
    const cfg={elephant:{bx:.72,by:.56,bz:.56,hr:.5,lg:.42,lr:.2,hy:1.18,c:"#a9b6c8"},giraffe:{bx:.55,by:.4,bz:.36,hr:.3,lg:.62,lr:.11,hy:2.2,c:"#f7c85e"},lion:{bx:.56,by:.42,bz:.4,hr:.42,lg:.34,lr:.13,hy:1.15,c:"#f2b65e"},
      horse:{bx:.62,by:.42,bz:.36,hr:.34,lg:.55,lr:.12,hy:1.45,c:"#b27a4e"},panda:{bx:.58,by:.5,bz:.5,hr:.5,lg:.28,lr:.17,hy:1.15,c:"#f6f5f0"},dog:{bx:.5,by:.36,bz:.34,hr:.42,lg:.3,lr:.11,hy:1.0,c:"#e3a35e"}}[id]||{bx:.55,by:.42,bz:.4,hr:.42,lg:.34,lr:.12,hy:1.1,c:p.c};
    const base=C(cfg.c),mat=T(base),by=cfg.lg+cfg.by*.75;
    const body=ell(cfg.bx,cfg.by,cfg.bz,id==="giraffe"?VT():mat,V(0,by,0),g);
    if(id==="giraffe"){body.material=mat;}
    // 脚
    const legM=T(id==="panda"?"#26232a":base),legs=[];[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([f,s])=>{const x=f*cfg.bx*.55,z=s*cfg.bz*.55;legs.push(limb(V(x,by-cfg.by*.3,z),V(x,cfg.lr*.9,z),cfg.lr,legM,g));ell(cfg.lr*1.15,cfg.lr*.8,cfg.lr*1.1,T(id==="horse"||id==="giraffe"?"#5a3a28":id==="panda"?"#26232a":base.clone().multiplyScalar(1.05)),V(x+cfg.lr*.25,cfg.lr*.75,z),g,18);});
    // 首と頭
    const hp=V(cfg.bx*(id==="giraffe"?.95:.78),cfg.hy,0);
    if(id==="giraffe"||id==="horse")tube([V(cfg.bx*.55,by+cfg.by*.3,0),V(cfg.bx*.8,(by+cfg.hy)/2+.1,0),hp.clone().add(V(-.05,-.12,0))],id==="giraffe"?.13:.2,id==="giraffe"?.1:.16,mat,g,20);
    const head=grp(hp,g);if(id==="panda")vell(cfg.hr,cfg.hr*.95,cfg.hr,(c,x,y,z)=>{c.copy(base);if(x>.4)for(const sg of [-1,1]){const dz=z-sg*.4,dy=y-.02,a=sg*.55,u=dz*Math.cos(a)+dy*Math.sin(a),v=-dz*Math.sin(a)+dy*Math.cos(a);if((u/.16)**2+(v/.25)**2<1)c.set("#26232a");}},V(0,0,0),head,80);else ell(cfg.hr,cfg.hr*.95,cfg.hr,mat,V(0,0,0),head);
    // 口元
    if(id==="horse"||id==="giraffe"||id==="dog")ell(cfg.hr*(id==="horse"?.78:.62),cfg.hr*.45,cfg.hr*(id==="horse"?.5:.55),T(id==="dog"?"#fff3e2":id==="horse"?"#e6c4a0":base.clone().multiplyScalar(1.08)),V(cfg.hr*(id==="horse"?.85:.72),-cfg.hr*.32,0),head,24);
    if(id!=="elephant")ell(cfg.hr*.13,cfg.hr*.09,cfg.hr*.17,BL("#2a1a1c"),V(cfg.hr*(id==="horse"?1.5:id==="giraffe"||id==="dog"?1.25:.98),cfg.hr*(id==="horse"||id==="giraffe"||id==="dog"?-.18:-.08),0),head,12);
    
    face(head,cfg.hr,{spread:id==="horse"||id==="giraffe"?.55:.4,y:id==="horse"||id==="giraffe"||id==="dog"?.18:.08,mouthY:id==="horse"||id==="giraffe"||id==="dog"?-.42:-.26,mouthD:id==="horse"||id==="giraffe"||id==="dog"?1.12:.985,eye:id==="panda"?.15:.19});
    // 耳
    if(id==="elephant"){[-1,1].forEach(s=>{const e=grp(V(-cfg.hr*.15,cfg.hr*.05,s*cfg.hr*.88),head);ell(cfg.hr*.12,cfg.hr*.62,cfg.hr*.58,mat,V(0,0,s*cfg.hr*.25),e,24);ell(cfg.hr*.1,cfg.hr*.45,cfg.hr*.42,T("#f4b6c2"),V(cfg.hr*.04,0,s*cfg.hr*.27),e,20);X.anims.push(t=>{e.rotation.y=s*Math.sin(t*2.2)*.25;});});
      tube([V(cfg.hr*.85,-cfg.hr*.1,0),V(cfg.hr*1.25,-cfg.hr*.55,0),V(cfg.hr*1.2,-cfg.hr*.95,0),V(cfg.hr*1.45,-cfg.hr*1.05,0)],cfg.hr*.2,cfg.hr*.12,mat,head,30);
      ell(cfg.hr*.12,cfg.hr*.12,cfg.hr*.12,T("#c6d0de"),V(cfg.hr*1.47,-cfg.hr*1.05,0),head,14);}
    else if(id==="dog"){[-1,1].forEach(s=>{const e=ell(cfg.hr*.2,cfg.hr*.5,cfg.hr*.28,T(base.clone().multiplyScalar(.75)),V(-cfg.hr*.1,cfg.hr*.15,s*cfg.hr*.95),head,20);e.rotation.x=-s*.35;X.anims.push(t=>{e.rotation.x=-s*(.35+Math.sin(t*3+s)*.12);});});}
    else{[-1,1].forEach(s=>{const e=ell(cfg.hr*.24,cfg.hr*.28,cfg.hr*.12,T(id==="panda"?"#26232a":base),V(-cfg.hr*.15,cfg.hr*.8,s*cfg.hr*.55),head,18);e.rotation.x=s*.4;if(id!=="panda")ell(cfg.hr*.15,cfg.hr*.18,cfg.hr*.05,T("#f4b6c2"),V(cfg.hr*.08,0,0),e,12);});}
    if(p.horn)[-1,1].forEach(s=>{limb(V(-cfg.hr*.1,cfg.hr*.8,s*cfg.hr*.25),V(-cfg.hr*.12,cfg.hr*1.15,s*cfg.hr*.28),cfg.hr*.07,mat,head);ell(cfg.hr*.12,cfg.hr*.12,cfg.hr*.12,T("#6b4426"),V(-cfg.hr*.12,cfg.hr*1.2,s*cfg.hr*.28),head,12);});
    // たてがみ
    if(id==="lion"){const mm=T("#c2702e");for(let i=0;i<16;i++){const a=i/16*Math.PI*2;ell(cfg.hr*.32,cfg.hr*.32,cfg.hr*.32,mm,V(-cfg.hr*.25,Math.sin(a)*cfg.hr*.92,Math.cos(a)*cfg.hr*.92),head,16);}ell(cfg.hr*.85,cfg.hr*.85,cfg.hr*.85,mm,V(-cfg.hr*.45,0,0),head,24);}
    if(id==="horse"){const mm=T("#3a2418");for(let i=0;i<7;i++){const u=i/6;ell(.09,.12,.06,mm,V(cfg.bx*.55+u*(hp.x-cfg.bx*.55)-.12,by+cfg.by*.4+u*(cfg.hy-by-cfg.by*.4)+.12,0),g,12);}ell(cfg.hr*.3,cfg.hr*.22,cfg.hr*.15,mm,V(cfg.hr*.15,cfg.hr*.92,0),head,12);}
    if(id==="giraffe"){const sm=T("#a8632c");for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,b=Math.random()*Math.PI;const n=V(Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a));if(n.y<-.5)continue;const s=ell(.08,.08,.02,sm,V(n.x*cfg.bx,by+n.y*cfg.by,n.z*cfg.bz).multiplyScalar(1),g,10);s.lookAt(V(n.x*cfg.bx*3,by+n.y*cfg.by*3,n.z*cfg.bz*3));}
      for(let i=0;i<8;i++){const u=.15+i*.1;const pt=V(cfg.bx*.55,by+cfg.by*.3,0).lerp(hp,u);[-1,1].forEach(s=>{const sp=ell(.05,.05,.015,sm,pt.clone().add(V(0,0,s*.12)),g,10);});}}
    // 尻尾
    const tb=V(-cfg.bx*.95,by+cfg.by*.2,0),tg=grp(tb,g);
    if(p.tail!==0){if(id==="dog")tube([V(0,0,0),V(-.12,.18,0),V(-.02,.3,0)],.07,.05,mat,tg,14);else{tube([V(0,0,0),V(-.15,-.15,0),V(-.18,-.35,0)],id==="horse"?.08:.035,id==="horse"?.06:.03,id==="horse"?T("#3a2418"):mat,tg,14);if(id!=="horse")ell(.08,.1,.08,T(id==="lion"?"#c2702e":"#5a3a28"),V(-.18,-.4,0),tg,14);}}
    else ell(.1,.1,.1,mat,V(0,0,0),tg,14);
    X.anims.push(t=>{tg.rotation.x=Math.sin(t*5)*.4;head.rotation.z=Math.sin(t*1.3)*.06;head.rotation.x=Math.sin(t*.9)*.08;});bounce(g,.8,2.2);
    X.ty=cfg.hy*.55;return Math.max(cfg.hy+cfg.hr,cfg.bx*2.4)*1.05;};
  // ===== 魚（サメ・マグロ・クマノミ） =====
  B.fish=function(p){const id=X.id,g=grp(V(0,1.1,0));const cs={shark:["#8fa3b8","#f4f7fa"],tuna:["#3a5a8c","#e4eaf0"],clown:["#ff8a2a","#ff8a2a"]}[id]||[p.c,"#eee"];
    const top=C(cs[0]),bel=C(cs[1]);const L=id==="shark"?.75:.55;
    if(id==="clown"){const cv=document.createElement("canvas");cv.width=4;cv.height=512;const cx=cv.getContext("2d");for(let r=0;r<512;r++){const v=1-r/511,x=Math.cos(Math.PI*v);let col="#ff8a2a";for(const b of [.45,-.05,-.55]){const d=Math.abs(x-b);if(d<.12)col=d<.09?"#ffffff":"#2a1a1a";}cx.fillStyle=col;cx.fillRect(0,r,4,1);}
      const geo=new THREE.SphereGeometry(1,48,40);geo.rotateZ(Math.PI/2);const bm=new THREE.Mesh(geo,new THREE.MeshToonMaterial({map:new THREE.CanvasTexture(cv),gradientMap:grad()}));bm.scale.set(L,.42,.32);g.add(bm);}
    else vell(L,.42,.32,(c,x,y,z)=>c.copy(top).lerp(bel,THREE.MathUtils.smoothstep(-y,-.1,.45)),V(0,0,0),g,44);
    const fm=T(id==="clown"?"#ff8a2a":id==="tuna"?"#2c4a7a":top.clone().multiplyScalar(.92),{side:THREE.DoubleSide});
    const tg=grp(V(-L*.92,0,0),g);flat(id==="shark"?[[0,0],[-.32,.38],[-.22,.05],[-.26,-.26],[0,-.05]]:[[0,0],[-.3,.3],[-.36,.12],[-.36,-.12],[-.3,-.3]],fm,tg);
    if(id==="clown")[[-.3,.3],[-.3,-.3]].forEach(()=>{});
    const dg=flat(id==="shark"?[[-.1,0],[.05,.36],[.18,0]]:[[-.25,0],[-.1,.2],[.12,.16],[.2,0]],fm,g);dg.position.set(0,.36,0);
    [-1,1].forEach(s=>{const pf=flat([[0,0],[-.2,-.05],[-.16,-.16]],fm,g);pf.position.set(.15,-.15,s*.3);pf.rotation.x=s*.8;});
    if(id==="tuna")for(let i=0;i<4;i++){const f=flat([[0,0],[.03,.07],[.06,0]],T("#ffd23a",{side:THREE.DoubleSide}),g);f.position.set(-.18-i*.1,.3-i*.03,0);}
    const head=grp(V(L*.35,.02,0),g);face(head,.4,{spread:id==="clown"?.75:.9,y:.12,eye:.24,mouthY:-.18,mouthR:.07,mouthD:1.0,depth:.82});
    if(id==="shark"){const tm=BL("#ffffff");for(let i=-2;i<=2;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.018,.04,4),tm);t.rotation.z=Math.PI;t.position.set(.72,-.1,i*.035);g.add(t);}}
    X.anims.push(t=>{tg.rotation.y=Math.sin(t*6)*.4;g.rotation.y=Math.sin(t*1.1)*.25;g.position.y=1.1+Math.sin(t*1.6)*.08;});X.ty=1.0;return 2.2;};
  // ===== クジラ・イルカ =====
  B.whale=function(p){const id=X.id,g=grp(V(0,1.1,0)),blue=id==="bluewhale";const top=C(blue?"#5f86b8":"#8fa6c0"),bel=C(blue?"#cfe0f2":"#f2f6fa");
    vell(blue?1.05:.85,blue?.55:.42,blue?.55:.42,(c,x,y,z)=>{c.copy(top).lerp(bel,THREE.MathUtils.smoothstep(-y,0,.5));if(blue&&y<-.35&&x>.1&&Math.sin(z*40)>.6)c.multiplyScalar(.85);},V(0,0,0),g);
    const fm=T(top.clone().multiplyScalar(.95),{side:THREE.DoubleSide});const fg=grp(V(blue?-1.0:-.82,.05,0),g);
    tube([V(.15,0,0),V(-.1,.06,0),V(-.25,.12,0)],blue?.22:.16,.08,T(top),fg,12);const fl=flat([[0,0],[-.12,.35],[-.3,.42],[-.22,.05],[-.22,-.05],[-.3,-.42],[-.12,-.35]],fm,fg,(x,y)=>[x-.2,.12,y]);
    if(!blue){const d=flat([[-.15,0],[.02,.28],[.12,0]],fm,g);d.position.set(-.05,.4,0);tube([V(.8,-.05,0),V(1.0,-.08,0)],.12,.09,T(top),g,8);}
    else{const d=flat([[-.08,0],[0,.1],[.06,0]],fm,g);d.position.set(-.6,.45,0);}
    [-1,1].forEach(s=>{const f=ell(.32,.05,.13,T(top.clone().multiplyScalar(.95)),V(.25,-.3,s*(blue?.52:.4)),g,14);f.rotation.x=s*.6;f.rotation.y=s*.3;});
    const hr=blue?.52:.42,head=grp(V(blue?.5:.4,-.02,0),g);vell(hr,hr,hr,(c,x,y,z)=>c.copy(top).lerp(bel,THREE.MathUtils.smoothstep(-y,0,.5)),V(0,0,0),head);face(head,hr,{spread:.62,y:-.02,eye:.17,mouthY:-.36,mouthR:.12});
    const drops=[];if(blue){const dm=T("#bfe6ff",{transparent:true,opacity:.85});for(let i=0;i<10;i++){const d=ell(.05,.05,.05,dm,V(0,0,0),g,10);d.userData.o=i/10;drops.push(d);}}
    X.anims.push(t=>{fg.rotation.z=Math.sin(t*1.8)*.3;g.position.y=1.1+Math.sin(t*1.2)*.07;g.rotation.z=Math.sin(t*1.2)*.04;drops.forEach(d=>{const u=(t*.6+d.userData.o)%1;const a=d.userData.o*Math.PI*2;d.position.set(.15+Math.cos(a)*u*.3,.55+Math.sin(u*Math.PI)*.6,Math.sin(a)*u*.3);d.scale.setScalar(.05*(1-u*.6));});});
    X.ty=1.2;return 2.6;};
  // ===== 鳥（ワシ・フラミンゴ） =====
  B.bird=function(p){const fl=!!p.neck,g=grp(V(0,fl?0:1.0,0));
    if(!fl){const bm=T("#7a5232"),wm=T("#6a4428",{side:THREE.DoubleSide});ell(.42,.44,.38,bm,V(0,0,0),g);ell(.22,.12,.3,T("#fffaf0"),V(-.45,-.05,0),g,16);
      const head=grp(V(.32,.42,0),g);ell(.34,.32,.32,T("#fbfbf6"),V(0,0,0),head);const bk=new THREE.Mesh(new THREE.ConeGeometry(.08,.22,12),T("#ffc93a"));bk.rotation.z=-Math.PI/2-.4;bk.position.set(.34,-.05,0);head.add(bk);face(head,.34,{spread:.42,y:.15,mouth:false,eye:.2});
      const ws=[-1,1].map(s=>{const w=grp(V(0,.12,s*.3),g);const m=ell(.3,.08,.55,wm,V(-.05,0,s*.42),w,20);m.rotation.y=s*.2;return [w,s];});
      [-1,1].forEach(s=>{limb(V(.05,-.38,s*.14),V(.08,-.55,s*.15),.04,T("#ffc93a"),g);ell(.07,.03,.06,T("#ffc93a"),V(.12,-.58,s*.15),g,10);});
      X.anims.push(t=>{const f=Math.sin(t*5);ws.forEach(([w,s])=>w.rotation.x=-s*f*.6);g.position.y=1.0-f*.06;head.rotation.y=Math.sin(t*.8)*.3;});X.ty=.9;return 2.0;}
    const pm=T("#ff9fbf"),by=1.15;ell(.42,.32,.3,pm,V(0,by,0),g);ell(.3,.2,.08,T("#ff86ad"),V(-.05,by+.05,.27),g,16);ell(.3,.2,.08,T("#ff86ad"),V(-.05,by+.05,-.27),g,16);
    tube([V(.3,by+.12,0),V(.5,by+.45,0),V(.32,by+.8,0),V(.4,by+1.05,0)],.07,.06,pm,g,30);const head=grp(V(.48,by+1.12,0),g);ell(.17,.16,.16,pm,V(0,0,0),head,24);
    tube([V(.12,.0,0),V(.25,-.02,0),V(.3,-.14,0)],.05,.025,T("#f6e2e8"),head,10);ell(.04,.04,.03,BL("#1a1a1a"),V(.3,-.16,0),head,8);face(head,.17,{spread:.6,y:.15,mouth:false,eye:.26});
    const lm=T("#f07a9a");limb(V(0,by-.25,.08),V(-.02,by*.5,.08),.025,lm,g);limb(V(-.02,by*.5,.08),V(0,.02,.08),.022,lm,g);ell(.09,.02,.05,lm,V(.05,.02,.08),g,10);
    limb(V(0,by-.25,-.08),V(.18,by*.68,-.08),.025,lm,g);limb(V(.18,by*.68,-.08),V(-.05,by*.72,-.08),.022,lm,g);
    X.anims.push(t=>{head.rotation.z=Math.sin(t*1.2)*.12;});bounce(g,.4,1.6);X.ty=1.25;return 2.6;};
  // ===== ペンギン =====
  B.penguin=function(p){const g=grp(V(0,0,0));vell(.48,.62,.46,(c,x,y,z)=>{c.set(x>.12&&y<.8?(y>.5&&x>.3?"#fff0b8":"#fbfbf6"):"#2a2a36");},V(0,.62,0),g,56);
    const head=grp(V(.05,1.2,0),g);vell(.36,.33,.34,(c,x,y,z)=>{c.set(x>.3&&y<.5?"#fbfbf6":"#2a2a36");if(x<.3&&x>-.25&&y<-.1&&y>-.5&&Math.abs(z)>.8)c.set("#ffc23a");},V(0,0,0),head,56);
    const bk=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,12),T("#ff9a2a"));bk.rotation.z=-Math.PI/2;bk.position.set(.38,-.08,0);head.add(bk);face(head,.36,{spread:.45,y:.12,mouth:false,eye:.2});
    const fl=[-1,1].map(s=>{const f=grp(V(0,.85,s*.44),g);const m=ell(.08,.32,.13,T("#2a2a36"),V(0,-.25,s*.04),f,16);return [f,s];});
    [-1,1].forEach(s=>ell(.14,.05,.1,T("#ff9a2a"),V(.15,.03,s*.17),g,12));
    X.anims.push(t=>{g.rotation.x=Math.sin(t*3)*.08;fl.forEach(([f,s])=>f.rotation.x=-s*(.15+Math.max(0,Math.sin(t*3))*.5));head.rotation.y=Math.sin(t*.7)*.35;});bounce(g,.6,3);X.ty=.75;return 1.9;};
  // ===== ヘビ =====
  B.snake=function(p){const g=grp(V(0,0,0)),pts=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*3.2,r=.95-t*.62;pts.push(V(Math.cos(a)*r,.17+(t>.82?(t-.82)*3.5:0),Math.sin(a)*r));}
    const cm=VT();const cu=new THREE.CatmullRomCurve3(pts);const tg=new THREE.TubeGeometry(cu,160,1,16,false);const ps=tg.attributes.position,cl=new Float32Array(ps.count*3),c1=C("#9bd36a"),c2=C("#f6e27a"),c3=C("#5a9a3a");
    for(let i=0;i<=160;i++){const u=i/160,cc=cu.getPointAt(u),r=.17*Math.min(1,.3+u*5);for(let j=0;j<=16;j++){const k=i*17+j;const v=V(ps.getX(k),ps.getY(k),ps.getZ(k)).sub(cc);const below=v.y<-.4;v.multiplyScalar(r).add(cc);ps.setXYZ(k,v.x,v.y,v.z);const c=below?c2:(Math.sin(u*70)>.55?c3:c1);cl.set([c.r,c.g,c.b],k*3);}}
    tg.setAttribute("color",new THREE.BufferAttribute(cl,3));tg.computeVertexNormals();g.add(new THREE.Mesh(tg,cm));ell(.05,.05,.05,T("#9bd36a"),pts[0],g,8);
    const e=pts[40],dir=pts[40].clone().sub(pts[38]).normalize();const head=grp(e.clone().addScaledVector(dir,.12),g);head.quaternion.setFromUnitVectors(V(1,0,0),dir);
    ell(.3,.24,.28,T("#9bd36a"),V(0,0,0),head);face(head,.28,{spread:.5,y:.2,eye:.22,mouthY:-.25});
    const tongue=tube([V(.27,-.08,0),V(.4,-.08,0)],.012,.012,T("#ff5a7a"),head,4);X.anims.push(t=>{tongue.visible=Math.sin(t*4)>.5;head.rotation.z=Math.sin(t*1.5)*.1;});X.ty=.4;return 2.2;};
  // ===== ウミガメ =====
  B.turtle=function(p){const g=grp(V(0,1.0,0));const sh=C("#7fae5a"),ln=C("#4f7a3a");
    vell(.62,.36,.52,(c,x,y,z)=>{if(y<-.05){c.set("#f6e7b0");return;}const a=Math.atan2(z,x),r=Math.hypot(x,z);const cell=(Math.abs(Math.sin(a*3))<.12&&r>.35)||Math.abs(r-.62)<.05;c.copy(cell?ln:sh);},V(0,0,0),g);
    const head=grp(V(.68,.06,0),g);ell(.24,.22,.22,T("#a6d77a"),V(0,0,0),head,24);face(head,.24,{spread:.45,y:.15,eye:.24,mouthY:-.25});
    const fins=[[.3,1,1],[.3,-1,1],[-.42,1,0],[-.42,-1,0]].map(([x,s,f])=>{const pv=grp(V(x,-.05,s*.42),g);const m=ell(f?.15:.1,.04,f?.32:.18,T("#a6d77a"),V(0,0,s*(f?.25:.12)),pv,16);m.rotation.y=s*(f?-.4:.4);return [pv,s,f];});
    X.anims.push(t=>{fins.forEach(([pv,s,f])=>pv.rotation.x=s*Math.sin(t*2+(f?0:1))*(f?.5:.25));g.position.y=1.0+Math.sin(t*2)*.06;head.rotation.y=Math.sin(t*.6)*.25;});X.ty=.95;return 2.0;};
  // ===== タコ =====
  B.octopus=function(p){const g=grp(V(0,.55,0)),m=T("#ff7f86");const head=grp(V(0,.6,0),g);ell(.55,.6,.55,m,V(-.05,.12,0),head);
    for(let i=0;i<10;i++){const a=Math.random()*Math.PI*2,b=Math.random()*1.2;ell(.05,.05,.02,T("#ffb0b4"),V(Math.cos(a)*.52*Math.sin(b+.6)-.05,.12+Math.cos(b+.6)*.58,Math.sin(a)*.52*Math.sin(b+.6)),head,8);}
    face(head,.55,{spread:.38,y:-.25,eye:.18,mouthY:-.6,mouthR:.07});
    const arms=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;const pv=grp(V(Math.cos(a)*.3,.1,Math.sin(a)*.3),g);pv.rotation.y=-a;
      tube([V(0,0,0),V(.35,-.25,0),V(.62,-.32,0),V(.75,-.2,0),V(.7,-.08,0)],.12,.04,m,pv,24);arms.push([pv,i]);}
    X.anims.push(t=>{arms.forEach(([pv,i])=>pv.rotation.z=Math.sin(t*2+i)*.18);});bounce(g,.8,2);X.ty=.7;return 2.2;};
  // ===== クラゲ =====
  B.jelly=function(p){const g=grp(V(0,1.6,0));const bell=new THREE.Mesh(new THREE.LatheGeometry([V2(.001,.62),V2(.35,.58),V2(.6,.4),V2(.72,.12),V2(.68,0),V2(.4,.05),V2(.001,.08)],40),T("#bfe4ff",{transparent:true,opacity:.75}));g.add(bell);
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2+.78;const t=new THREE.Mesh(new THREE.TorusGeometry(.1,.03,8,20),T("#e7a8ff"));t.position.set(Math.cos(a)*.18,.42,Math.sin(a)*.18);t.rotation.x=Math.PI/2;g.add(t);}
    const fh=grp(V(0,.3,0),g);face(fh,.66,{spread:.38,y:.05,eye:.13,mouthY:-.22,mouthR:.06});
    const tm=T("#d8eeff",{transparent:true,opacity:.8});const ts=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const pv=grp(V(Math.cos(a)*.55,0,Math.sin(a)*.55),g);tube([V(0,0,0),V(.05,-.3,0),V(-.04,-.6,0),V(.03,-.9,0)],.03,.015,tm,pv,16);ts.push([pv,i]);}
    X.anims.push(t=>{const s=Math.sin(t*2.4);bell.scale.set(1-s*.07,1+s*.08,1-s*.07);g.position.y=1.6+Math.sin(t*2.4-1)*.12;ts.forEach(([pv,i])=>pv.rotation.z=Math.sin(t*2+i)*.2);});X.ty=1.4;return 2.4;};
  // ===== ワニ・カメレオン =====
  B.croc=function(p){const sm=!!p.small,g=grp(V(0,sm?1.0:0,0)),m=T(sm?"#7fd36a":"#7fb05a"),bel=T(sm?"#e8f7a0":"#e8e4a8");
    if(sm){tube([V(-1.6,.98,0),V(0,1.02,0),V(1.6,.95,0)],.07,.06,T("#8a5a3a"),X.root,20);}
    const by=sm?.3:.32;ell(sm?.5:.62,sm?.36:.3,sm?.3:.36,m,V(0,by,0),g);ell(sm?.4:.5,sm?.22:.18,sm?.22:.3,bel,V(.02,by-.1,0),g,24);
    const head=grp(V(sm?.55:.68,by+(sm?.15:.05),0),g);ell(sm?.36:.36,sm?.32:.24,sm?.3:.3,m,V(0,0,0),head);if(!sm)ell(.42,.13,.24,m,V(.38,-.08,0),head,24);
    if(sm)ell(.22,.12,.06,m,V(-.1,.3,0),head,16);
    [-1,1].forEach(s=>{const br=sm?.15:.13,bp=V(sm?.12:.02,sm?.15:.2,s*(sm?.24:.17));ell(br,br,br,m,bp,head,20);const n=V(.8,.35,s*.5).normalize();eyeAt(head,bp.clone().addScaledVector(n,br*.96),n,br*.75,s);});
    face(head,sm?.34:.3,{eyes:false,spread:sm?.5:.4,y:sm?.2:.3,mouthY:sm?-.3:-.42,mouthR:sm?.1:.16,mouthD:sm?.98:1.2});
    if(!sm)for(let i=0;i<6;i++)ell(.06,.06,.06,T("#5f8f45"),V(.35-i*.18,by+.28,0),g,10);
    const legs=[[.3,1],[.3,-1],[-.3,1],[-.3,-1]];legs.forEach(([x,s])=>limb(V(x,by-.12,s*.22),V(x+.05,.06,s*(sm?.3:.42)),sm?.06:.09,m,g));
    const tg=grp(V(sm?-.48:-.6,by,0),g);if(sm){const pts=[];for(let i=0;i<=20;i++){const u=i/20,a=u*Math.PI*2.2;const r=.28*(1-u*.7);pts.push(V(-.2-Math.sin(a)*r,-Math.cos(a)*r+.28*(1-u*.7)-.28,0));}tube(pts,.1,.03,m,tg,40);}
    else tube([V(0,0,0),V(-.5,-.05,0),V(-.95,-.15,.1)],.2,.04,m,tg,20);
    X.anims.push(t=>{tg.rotation.y=Math.sin(t*1.5)*.2;head.rotation.y=Math.sin(t*.7)*.15;});bounce(g,.4,2);X.ty=sm?1.2:.4;return sm?2.0:2.6;};
  // ===== 虫（チョウ・ハチ・アリ） =====
  B.insect=function(p){const w=p.wtype,g=grp(V(0,w==="none"?0:1.2,0));
    if(w==="none"){const m=T("#5a2a1e");ell(.22,.17,.17,m,V(-.4,.32,0),g,24);ell(.13,.1,.1,m,V(-.1,.3,0),g,18);const head=grp(V(.22,.38,0),g);ell(.25,.24,.24,m,V(0,0,0),head);face(head,.25,{spread:.45,y:.1,eye:.24,mouthY:-.3});
      [-1,1].forEach(s=>{tube([V(.05,.2,s*.08),V(.15,.45,s*.18),V(.28,.5,s*.2)],.015,.012,m,head,8);ell(.035,.035,.035,m,V(.28,.5,s*.2),head,8);});
      for(let i=0;i<3;i++)[-1,1].forEach(s=>{const x=-.25+i*.12;limb(V(x,.28,s*.08),V(x+.05,.18,s*.3),.02,m,g);limb(V(x+.05,.18,s*.3),V(x+.08,.0,s*.35),.018,m,g);});
      bounce(g,.5,4);X.ty=.35;return 1.4;}
    if(w==="bee"){vell(.42,.36,.36,(c,x,y,z)=>c.set(Math.sin((x+.5)*12)>.3?"#2a2028":"#ffcf3a"),V(-.15,0,0),g);const head=grp(V(.32,.08,0),g);ell(.28,.27,.27,T("#ffcf3a"),V(0,0,0),head);face(head,.28,{spread:.45,y:.08,eye:.22,mouthY:-.3});
      [-1,1].forEach(s=>{tube([V(.05,.2,s*.1),V(.12,.42,s*.18),V(.22,.48,s*.2)],.015,.012,T("#2a2028"),head,8);ell(.04,.04,.04,T("#2a2028"),V(.22,.48,s*.2),head,8);});
      const wm=T("#e6f6ff",{transparent:true,opacity:.6,side:THREE.DoubleSide});const ws=[-1,1].map(s=>{const pv=grp(V(-.1,.3,s*.08),g);ell(.22,.03,.32,wm,V(-.05,0,s*.28),pv,14);return [pv,s];});
      const st=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,8),T("#2a2028"));st.rotation.z=Math.PI/2;st.position.set(-.6,0,0);g.add(st);
      X.anims.push(t=>{ws.forEach(([pv,s])=>pv.rotation.x=-s*Math.sin(t*30)*.5);g.position.y=1.2+Math.sin(t*2)*.1;g.rotation.y=Math.sin(t*.8)*.4;});X.ty=1.1;return 1.8;}
    // チョウ
    const bm=T("#3a3036");ell(.32,.1,.1,bm,V(-.1,0,0),g,20);const head=grp(V(.34,.06,0),g);ell(.24,.23,.23,bm,V(0,0,0),head,24);face(head,.24,{spread:.48,y:.08,eye:.26,mouthY:-.3,cheekC:"#ff9ab8",mouthC:"#ffd0dc"});
    [-1,1].forEach(s=>{tube([V(.05,.12,s*.05),V(.15,.35,s*.12),V(.25,.45,s*.18)],.012,.01,bm,head,8);ell(.04,.04,.04,bm,V(.25,.45,s*.18),head,8);});
    const tex=(()=>{const c=document.createElement("canvas");c.width=c.height=128;const x=c.getContext("2d");x.fillStyle="#ffd84a";x.fillRect(0,0,128,128);x.fillStyle="#2a2028";x.fillRect(0,0,128,16);x.fillRect(112,0,16,128);x.fillStyle="#fff";for(let i=0;i<5;i++){x.beginPath();x.arc(20+i*22,8,4,0,7);x.fill();}x.fillStyle="#7ab0ff";x.beginPath();x.arc(40,70,12,0,7);x.fill();x.fillStyle="#ff7a9a";x.beginPath();x.arc(80,95,9,0,7);x.fill();const t=new THREE.CanvasTexture(c);return t;})();
    const wm=new THREE.MeshToonMaterial({map:tex,gradientMap:grad(),side:THREE.DoubleSide});
    const mkw=(pts,s,p0)=>{const geo=new THREE.ShapeGeometry(new THREE.Shape(pts.map(([a,b])=>V2(a,b))),16);const ps=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<ps.count;i++){const a=ps.getX(i),b=ps.getY(i);uv.setXY(i,Math.min(1,Math.max(0,a/.9)),Math.min(1,Math.max(0,(b+.8)/1.6)));ps.setXYZ(i,b,0,s*a);}geo.computeVertexNormals();const m=new THREE.Mesh(geo,wm);p0.add(m);};
    const ws=[-1,1].map(s=>{const pv=grp(V(-.12,.06,0),g);mkw(blob(18,.42).map(([a,b])=>[a+.45,b*.8+.25]),s,pv);mkw(blob(16,.32).map(([a,b])=>[a+.35,b*.9-.3]),s,pv);return [pv,s];});
    X.anims.push(t=>{const f=Math.sin(t*6);ws.forEach(([pv,s])=>pv.rotation.x=-s*(.55+f*.5));g.position.y=1.2+Math.sin(t*1.4)*.12-f*.03;g.rotation.y=Math.sin(t*.5)*.6;});X.ty=1.1;return 2.0;};
  // ===== クモ =====
  B.spider=function(p){const g=grp(V(0,.35,0)),m=T("#6a5a86");ell(.42,.38,.4,m,V(-.35,.15,0),g);const head=grp(V(.18,.05,0),g);ell(.3,.28,.3,m,V(0,0,0),head);
    face(head,.3,{spread:.35,y:.15,eye:.2,mouthY:-.3});[-1,1].forEach(s=>ell(.035,.035,.035,BL("#1d1622"),V(.27,.25,s*.06),head,8));
    const legs=[];for(let i=0;i<4;i++)[-1,1].forEach(s=>{const x=.1-i*.12;const pv=grp(V(x,.05,s*.18),g);limb(V(0,0,0),V(.05,.3,s*.35),.035,m,pv);limb(V(.05,.3,s*.35),V(.12,-.35,s*.6),.03,m,pv);legs.push([pv,i,s]);});
    X.anims.push(t=>legs.forEach(([pv,i,s])=>pv.rotation.x=s*Math.sin(t*6+i)*.08));bounce(g,.5,3);X.ty=.4;return 1.8;};
  // ===== カニ =====
  B.crab=function(p){const g=grp(V(0,.3,0)),m=T("#ff7a52");ell(.55,.26,.45,m,V(0,.15,0),g);const fg=grp(V(.3,.25,0),g);
    [-1,1].forEach(s=>{limb(V(0,.05,s*.12),V(.05,.3,s*.14),.03,m,fg);const e=grp(V(.05,.34,s*.14),fg);ell(.09,.09,.09,T("#fff"),V(0,0,0),e,14);ell(.05,.06,.05,BL("#1d1622"),V(.06,0,0),e,10);ell(.02,.02,.02,BL("#fff"),V(.1,.02,0),e,6);});
    const mo=new THREE.Mesh(new THREE.TorusGeometry(.06,.015,6,14,Math.PI),BL("#3a1a20"));mo.rotation.set(0,Math.PI/2,Math.PI);mo.position.set(.54,.12,0);g.add(mo);
    [-1,1].forEach(s=>ell(.04,.05,.07,new THREE.MeshBasicMaterial({color:"#ffb0c0",transparent:true,opacity:.8}),V(.48,.12,s*.2),g,10));
    const cl=[-1,1].map(s=>{const pv=grp(V(.35,.15,s*.42),g);limb(V(0,0,0),V(.2,.05,s*.15),.06,m,pv);const c=grp(V(.32,.1,s*.2),pv);ell(.18,.12,.12,m,V(0,0,0),c,18);const j=ell(.12,.05,.08,m,V(.12,.08,0),c,14);return [pv,j,s];});
    for(let i=0;i<3;i++)[-1,1].forEach(s=>{const x=.1-i*.2;limb(V(x,.08,s*.38),V(x-.05,.12,s*.6),.035,m,g);limb(V(x-.05,.12,s*.6),V(x-.08,-.28,s*.72),.03,m,g);});
    X.anims.push(t=>{cl.forEach(([pv,j,s])=>{pv.rotation.x=s*Math.sin(t*2)*.12;j.rotation.z=Math.abs(Math.sin(t*4))*.5;});g.position.z=Math.sin(t*.8)*.4;});X.ty=.3;return 2.0;};
  // ===== ヒトデ =====
  B.starfish=function(p){const g=grp(V(0,.12,0)),m=T("#ff9a5a");for(let i=0;i<5;i++){const a=i/5*Math.PI*2+Math.PI/2;tube([V(0,0,0),V(Math.cos(a)*.45,0,Math.sin(a)*.45),V(Math.cos(a)*.85,.05,Math.sin(a)*.85)],.24,.07,m,g,16);}
    ell(.35,.16,.35,m,V(0,0,0),g,28);for(let i=0;i<14;i++){const a=Math.random()*Math.PI*2,r=.2+Math.random()*.55;ell(.03,.03,.03,T("#ffe0b0"),V(Math.cos(a)*r,.13-r*.08,Math.sin(a)*r),g,8);}
    const head=grp(V(.02,.1,0),g);head.rotation.z=Math.PI/2-.75;ell(.22,.22,.22,m,V(0,0,0),head,24);face(head,.22,{spread:.48,y:0,eye:.36,mouthY:-.45});X.anims.push(t=>{g.rotation.y=Math.sin(t*.4)*.5;});bounce(g,.5,2);X.ty=.3;return 2.0;};
  // ===== コウモリ =====
  B.bat=function(p){const g=grp(V(0,1.3,0)),m=T("#6a5878");ell(.3,.34,.28,m,V(0,0,0),g);const head=grp(V(.18,.3,0),g);ell(.3,.28,.28,m,V(0,0,0),head);face(head,.3,{spread:.42,y:.1,eye:.24,mouthY:-.3});
    [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,12),m);e.position.set(-.05,.3,s*.16);e.rotation.x=s*.3;head.add(e);const fang=new THREE.Mesh(new THREE.ConeGeometry(.02,.05,4),BL("#fff"));fang.rotation.z=Math.PI;fang.position.set(.29,-.12,s*.04);head.add(fang);});
    const wm=T("#4a3c56",{side:THREE.DoubleSide});const ws=[-1,1].map(s=>{const pv=grp(V(0,.1,s*.22),g);flat([[0,.15],[.3,.25],[.75,.2],[.65,-.05],[.5,.05],[.4,-.12],[.25,0],[.1,-.15],[0,-.1]],wm,pv,(a,b)=>[b,0,s*a]);return [pv,s];});
    X.anims.push(t=>{const f=Math.sin(t*7);ws.forEach(([pv,s])=>pv.rotation.x=-s*f*.7);g.position.y=1.3-f*.05;});X.ty=1.2;return 2.0;};
  // ===== カエル =====
  B.frog=function(p){const g=grp(V(0,0,0)),m=T("#7fd36a");ell(.5,.36,.45,m,V(0,.36,0),g);ell(.38,.25,.35,T("#f2f8c8"),V(.12,.3,0),g,24);
    const head=grp(V(.25,.55,0),g);[-1,1].forEach(s=>{ell(.17,.17,.17,m,V(0,.22,s*.22),head,18);const n=V(.85,.25,s*.35).normalize();eyeAt(head,V(0,.22,s*.22).addScaledVector(n,.165),n,.12,s);
      const c=ell(.03,.045,.07,new THREE.MeshBasicMaterial({color:"#ff8fae",transparent:true,opacity:.7,depthWrite:false}),V(.26,-.02,s*.27),head,12);c.rotation.y=-s*.7;});
    const mo=new THREE.Mesh(new THREE.TorusGeometry(.13,.018,6,20,Math.PI),BL("#3a1a20"));mo.rotation.set(0,Math.PI/2,Math.PI);mo.position.set(.21,.02,0);head.add(mo);
    [-1,1].forEach(s=>{ell(.25,.12,.14,m,V(-.25,.15,s*.38),g,16);ell(.16,.04,.12,m,V(.2,.03,s*.42),g,14);ell(.13,.04,.1,m,V(-.15,.03,s*.48),g,14);});
    X.anims.push(t=>{const k=Math.max(0,Math.sin(t*1.7));g.position.y=k*k*.25;});X.ty=.45;return 1.8;};
  // ===== ヒト（ちびキャラ） =====
  B.human=function(p){const fig=(x,z,o)=>{const g=grp(V(x,0,z)),sk=T(o.skin),cl=T(o.shirt),pa=T(o.pants),ha=T(o.hair);
      if(o.dress){const dr=new THREE.Mesh(new THREE.ConeGeometry(.3,.5,24),cl);dr.position.set(0,.45,0);g.add(dr);}else{ell(.2,.24,.17,cl,V(0,.55,0),g,24);ell(.19,.12,.16,pa,V(0,.36,0),g,20);}
      [-1,1].forEach(s=>{limb(V(0,.3,s*.08),V(0,.1,s*.09),.06,o.dress?sk:pa,g);ell(.09,.05,.07,T("#4a3a3a"),V(.04,.05,s*.09),g,12);});
      const head=grp(V(0,1.0,0),g);ell(.32,.31,.31,sk,V(0,0,0),head);const hair=ell(.34,.3,.33,ha,V(-.05,.07,0),head);hair.scale.set(.33,.28,.335);
      ell(.12,.06,.3,ha,V(.2,.2,0),head,16);if(o.long){ell(.12,.3,.28,ha,V(-.2,-.15,0),head,18);}
      face(head,.32,{spread:.4,y:-.02,eye:.19,mouthY:-.32});
      const arm=(s,wave)=>{const pv=grp(V(0,.7,s*.2),g);if(wave){limb(V(0,0,0),V(.05,.25,s*.12),.05,cl,pv);ell(.06,.06,.06,sk,V(.06,.31,s*.13),pv,12);X.anims.push(t=>{pv.rotation.x=-s*(.3+Math.sin(t*6)*.3);});}else{limb(V(0,0,0),V(.03,-.25,s*.06),.05,cl,pv);ell(.06,.06,.06,sk,V(.03,-.3,s*.06),pv,12);}};
      arm(1,o.wave);arm(-1,false);bounce(g,.5,2.2+x);return g;};
    fig(0,-.4,{skin:"#ffd9b8",shirt:"#ff6f7f",pants:"#ff6f7f",hair:"#4a2a1a",dress:1,long:1,wave:1});fig(.1,.4,{skin:"#b9784e",shirt:"#4f9ae8",pants:"#2f3a5a",hair:"#1a1210"});X.ty=.75;return 2.0;};
  function build(type,p,ctx){if(!B[type])return null;X=ctx;const n0=ctx.root.children.length,a0=ctx.anims.length;try{return B[type](p);}catch(e){console.warn("CUTE",type,e);ctx.root.children.splice(n0);ctx.anims.length=a0;return null;}}
  return {build,has:t=>!!B[t]};
})();
