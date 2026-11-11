/* ---------- 生き物の3Dモデル（ロフト＝断面をつないだなめらかな形・頂点カラー・アニメーション） ---------- */
window.ORG3D=(function(){
  if(typeof THREE==="undefined")return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c),V2=(x,y)=>new THREE.Vector2(x,y);
  let X=null;// {root,anims,R}
  const rnd=()=>X.R();
  const STD=(o={})=>new THREE.MeshStandardMaterial({roughness:.62,metalness:.02,side:THREE.DoubleSide,...o});
  const VC=(o={})=>STD({vertexColors:true,...o});
  const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
  // ---- ノイズ ----
  const hash=(x,y,z)=>{const s=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s);};
  function vn(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,f=t=>t*t*(3-2*t),u=f(xf),v=f(yf),w=f(zf),L=(a,b,t)=>a+(b-a)*t;
    return L(L(L(hash(xi,yi,zi),hash(xi+1,yi,zi),u),L(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),u),v),L(L(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),u),L(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),u),v),w);}
  function wor(x,y,z){let f1=9,f2=9;const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const a=xi+i,b=yi+j,c=zi+k;const d=Math.hypot(a+hash(a,b,c)-x,b+hash(b,c,a)-y,c+hash(c,a,b)-z);if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;}return [f1,f2];}
  // ---- ロフト ----
  function lgeo(N,Mr){const g=new THREE.BufferGeometry();const n=(N+1)*(Mr+1);g.setAttribute("position",new THREE.BufferAttribute(new Float32Array(n*3),3));g.setAttribute("color",new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3));
    const idx=[];for(let i=0;i<N;i++)for(let j=0;j<Mr;j++){const a=i*(Mr+1)+j,b=a+Mr+1;idx.push(a,a+1,b,b,a+1,b+1);}g.setIndex(idx);g.userData.NM=[N,Mr];return g;}
  const _s=V(0,0,0),_n=V(0,0,0),_q=V(0,0,0),_c=C("#fff");
  function lfill(g,spine,prof,col,o={}){const [N,Mr]=g.userData.NM;const cu=spine.isCurve?spine:new THREE.CatmullRomCurve3(spine,false,"catmullrom",.5);
    const P=g.attributes.position.array,Q=g.attributes.color.array,up0=o.up||V(0,1,0);let k=0;
    for(let i=0;i<=N;i++){const u=i/N,p=cu.getPointAt(u),t=cu.getTangentAt(u).normalize();let up=up0;if(Math.abs(t.dot(up))>.97)up=o.up2||V(1,0,0);
      _s.crossVectors(t,up).normalize();_n.crossVectors(_s,t).normalize();const pr=prof(u);
      for(let j=0;j<=Mr;j++){const a=j/Mr*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),m=o.rib?o.rib(u,a):1;
        _q.copy(p).addScaledVector(_n,ca*pr[0]*m+(pr[2]||0)).addScaledVector(_s,sa*pr[1]*m);P[k*3]=_q.x;P[k*3+1]=_q.y;P[k*3+2]=_q.z;
        if(col&&!o.keepColor){_c.setRGB(1,1,1);col(_c,u,a,_q,ca,sa);Q[k*3]=_c.r;Q[k*3+1]=_c.g;Q[k*3+2]=_c.b;}k++;}}
    g.attributes.position.needsUpdate=true;if(col&&!o.keepColor)g.attributes.color.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();return g;}
  function loft(spine,prof,col,o={}){const g=lfill(lgeo(o.n||36,o.m||18),spine,prof,col,o);const m=new THREE.Mesh(g,o.mat||VC(o.mo||{}));(o.parent||X.root).add(m);return m;}
  const sph=(r,mat,p,s=[1,1,1],parent)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),mat);m.position.copy(p);m.scale.set(...s);(parent||X.root).add(m);return m;};
  function eye(p,r,parent,iris="#2a1a0a"){const g=sph(r,STD({color:"#f4f1ea",roughness:.25}),p,[1,1,1],parent);const i=sph(r*.62,STD({color:iris,roughness:.15}),V(0,0,0),[1,1,1],g);i.position.set(r*.5,0,0);const h=sph(r*.18,new THREE.MeshBasicMaterial({color:"#fff"}),V(r*.85,r*.3,r*.2),[1,1,1],g);return g;}
  function pivot(p,list,parent){const g=new THREE.Group();g.position.copy(p);(parent||X.root).add(g);list.forEach(m=>{if(!m)return;m.parent&&m.parent.remove(m);m.position.sub(p);g.add(m);});return g;}
  function shapeMesh(pts,mat,map){const sh=new THREE.Shape(pts.map(([x,y])=>V2(x,y)));const g=new THREE.ShapeGeometry(sh,12);if(map)map(g.attributes.position);g.computeVertexNormals();return new THREE.Mesh(g,mat);}
  const remap=(f)=>pos=>{for(let i=0;i<pos.count;i++){const v=f(pos.getX(i),pos.getY(i),pos.getZ(i));pos.setXYZ(i,v[0],v[1],v[2]);}pos.needsUpdate=true;};
  const shade=(c,base,q,s=6,k=.22)=>{c.copy(base).multiplyScalar(1-k/2+k*vn(q.x*s,q.y*s,q.z*s));};
  let GT=null;const glowTex=()=>{if(GT)return GT;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const r=x.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.4,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=r;x.fillRect(0,0,128,128);GT=new THREE.CanvasTexture(c);return GT;};
  const B={};
  // ===== 四足の哺乳類 =====
  B.quad=function(p){const el=!!p.trunk,h=p.h,lg=p.leg,R0=h*(p.round?.42:p.neck>2?.28:el?.34:.32),L=h*(el?1.3:p.round?1.15:1.35),bh=lg+R0*.95;
    const base=C(p.c),dark=C(p.patch||p.mane||"#2a2018"),spot=p.spots?C(p.spots):null,hoof=C(el?"#7a746e":"#241a12");
    const skin=(c,q,ca)=>{shade(c,base,q,5/h,.18);c.multiplyScalar(1.02-.07*ca);if(spot){const [f1,f2]=wor(q.x*3.4/h,q.y*3.4/h,q.z*3.4/h);if(f2-f1>.13)c.lerp(spot,.88);}if(el)c.multiplyScalar(.96+.04*vn(q.x*40,q.y*40,q.z*40));};
    const parts=[];
    // 胴
    const body=loft([V(-L*.52,bh+h*.03,0),V(-L*.22,bh+h*(el?.1:.06),0),V(L*.12,bh+h*(el?.1:.05),0),V(L*.5,bh+h*.12,0)],u=>{const s=Math.pow(Math.sin(Math.PI*(.04+.92*u)),.48),r=R0*s;return [r*(1+.1*u),r*(p.round?.95:.8),-r*.05*Math.sin(Math.PI*u)];},
      (c,u,a,q,ca)=>{skin(c,q,ca);if(p.patch&&u>.6&&u<.86)c.copy(dark);});
    // 首と頭
    const rise=p.neck>2?p.neck:p.neck*.7;const nb=V(L*.43,bh+R0*.38,0),hd=nb.clone().add(V(h*.1+rise*.35,rise+h*.06,0));const hr=h*(el?.27:p.round?.27:p.neck>2?.13:.19);
    const neckR=p.neck>2?h*.1:R0*(p.round?.7:.62);
    const neck=loft([nb.clone().add(V(-h*.1,-h*.06,0)),nb.clone().lerp(hd,.5).add(V(-h*.02,0,0)),hd.clone().add(V(-h*.05,-h*.02,0))],u=>{const r=neckR*(1-.45*u)+hr*.4*u;return [r,r*.8];},(c,u,a,q,ca)=>{skin(c,q,ca);if(p.patch)c.copy(base);});
    const mz={horse:1.7,giraffe:1.35,dog:1.15,lion:.9,panda:.75,elephant:.85}[p.kind]||(p.neck>2?1.35:p.trunk?.85:p.mane&&p.neck<.5?.9:p.round?.75:p.neck>.8?1.7:1.15);
    const head=loft([hd.clone().add(V(-hr*.75,hr*.15,0)),hd.clone().add(V(hr*.2,0,0)),hd.clone().add(V(hr*(.6+mz*.65),-hr*.35,0))],u=>{const r=hr*Math.pow(Math.sin(Math.PI*(.06+.86*u)),.42)*(1-.42*u);return [r*1.05,r*.88];},
      (c,u,a,q,ca)=>{skin(c,q,ca);if(p.patch){c.copy(base);}});
    const tip=hd.clone().add(V(hr*(.6+mz*.65),-hr*.35,0));
    parts.push(neck,head);
    if(!el&&!p.neck2){const ns=sph(hr*.18,STD({color:"#1a1412",roughness:.3}),tip.clone().add(V(-hr*.05,hr*.05,0)),[.8,.8,1.2]);parts.push(ns);}
    [-1,1].forEach(s=>{parts.push(eye(hd.clone().add(V(hr*.42,hr*.32,s*hr*.62)),hr*.12));
      if(p.patch)parts.push(sph(hr*.28,STD({color:"#141414"}),hd.clone().add(V(hr*.36,hr*.24,s*hr*.55)),[.7,1.1,.5]));});
    // 耳
    if(el){[-1,1].forEach(s=>{const P=[];for(let i=0;i<28;i++){const a=i/28*Math.PI*2;const rx=.27*h,ry=.36*h;P.push([rx+Math.cos(a)*rx*(1+.12*Math.sin(a*2)),-ry*.55+Math.sin(a)*ry*(a>Math.PI?1.1:.9)]);}
      const e=shapeMesh(P,STD({color:base.clone().multiplyScalar(.92),roughness:.9}),remap((x,y)=>[x,y,Math.sin(x/(.54*h)*Math.PI)*.04*h]));const ang=s>0?-(Math.PI-.38):(Math.PI-.38);e.position.copy(hd.clone().add(V(-hr*.45,hr*.55,s*hr*.78)));e.rotation.y=ang;X.root.add(e);parts.push(e);X.anims.push(t=>{e.rotation.y=ang+s*Math.sin(t*1.6)*.1;});});}
    else{const fl=p.ears&&p.ears<.5;[-1,1].forEach(s=>{const b0=hd.clone().add(V(-hr*.35,hr*.75,s*hr*.5));const tp=b0.clone().add(fl?V(hr*.15,-hr*1.25,s*hr*.62):V(-hr*.1,hr*(p.neck>2?.6:p.round?.45:p.mane?.5:.75),s*hr*.35));
      const er=loft([b0,b0.clone().lerp(tp,.5).add(V(0,0,s*hr*.08)),tp],u=>[hr*(fl?.5:.32)*Math.sin(Math.PI*(.15+.8*u))*(1-.4*u),hr*.08],(c,u,a,q,ca)=>{c.copy(p.patch?dark:base);if(sa0(a)>0)c.multiplyScalar(.8);},{n:12,m:10});parts.push(er);});}
    // 角
    if(p.horn)[-1,1].forEach(s=>{const b0=hd.clone().add(V(-hr*.3,hr*.8,s*hr*.32));parts.push(loft([b0,b0.clone().add(V(-h*.02,h*.12,0)),b0.clone().add(V(-h*.02,h*.2,0))],u=>[h*.025*(1-.3*u),h*.025*(1-.3*u)],c=>c.copy(base),{n:8,m:8}));parts.push(sph(h*.035,STD({color:"#2a1a0a"}),b0.clone().add(V(-h*.02,h*.21,0))));});
    // 鼻（ゾウ）と牙
    if(el){const s0=tip.clone().add(V(-hr*.2,-hr*.05,0));parts.push(loft([s0,s0.clone().add(V(h*.15,-h*.35,0)),s0.clone().add(V(h*.1,-h*.72,0)),s0.clone().add(V(h*.2,-h*.98,0)),s0.clone().add(V(h*.32,-h*1.0,0))],u=>{const r=h*.085*(1-.6*u);return [r,r];},(c,u,a,q,ca)=>{c.copy(base).multiplyScalar(.92+.08*Math.sin(u*140));},{n:44,m:14}));
      if(p.tusk)[-1,1].forEach(s=>parts.push(loft([s0.clone().add(V(-h*.05,-h*.12,s*h*.13)),s0.clone().add(V(h*.16,-h*.34,s*h*.17)),s0.clone().add(V(h*.4,-h*.24,s*h*.12))],u=>{const r=h*.04*(1-.85*u);return [r,r];},c=>c.set("#f2ead8"),{n:16,m:10})));}
    // たてがみ
    if(p.mane&&p.neck<.6){const g=new THREE.IcosahedronGeometry(1,5);const ps=g.attributes.position;const cols=new Float32Array(ps.count*3);const mc=C(p.mane);
      for(let i=0;i<ps.count;i++){const x=ps.getX(i),y=ps.getY(i),z=ps.getZ(i);const n=vn(x*2.6,y*2.6,z*2.6)*.7+vn(x*7,y*7,z*7)*.3;const k=.82+.4*n;ps.setXYZ(i,x*k,y*k,z*k);_c.copy(mc).multiplyScalar(.75+.45*vn(x*9,y*9,z*9));cols.set([_c.r,_c.g,_c.b],i*3);}
      g.setAttribute("color",new THREE.BufferAttribute(cols,3));g.computeVertexNormals();const m=new THREE.Mesh(g,VC({flatShading:false}));m.scale.set(hr*1.25,hr*1.55,hr*1.6);m.position.copy(hd.clone().add(V(-hr*.55,-hr*.15,0)));X.root.add(m);parts.push(m);}
    else if(p.mane){const mc=C(p.mane);parts.push(loft([nb.clone().add(V(-h*.05,R0*.55,0)),nb.clone().lerp(hd,.5).add(V(-h*.12,h*.1,0)),hd.clone().add(V(-hr*.6,hr*.8,0))],u=>[h*.08*(1-.3*u),h*.025],(c,u,a,q)=>{c.copy(mc).multiplyScalar(.8+.3*vn(q.x*20,q.y*20,0));},{n:20,m:8}));}
    // 脚
    const lc=(c,u,a,q,ca)=>{skin(c,q,ca);if(p.patch)c.copy(dark);if(u>.9&&!p.patch&&!p.mane)c.lerp(hoof,.85);};
    const lr=h*(el?.13:p.round?.13:p.neck>2?.07:.08);
    const legs=[];[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([f,s])=>{const z=s*R0*(el?.4:.45);const pts=f>0?[V(L*.34,bh,z),V(L*.37,lg*.52,z),V(L*.36,lg*.06,z),V(L*.37,0,z)]:[V(-L*.34,bh,z),V(-L*.44,lg*.42,z),V(-L*.38,lg*.06,z),V(-L*.37,0,z)];
      legs.push(loft(pts,u=>{const r=lr*(1-.38*u)*(u>.92?1.18:1)*(1+.5*Math.max(0,.3-u));return [r,r];},lc,{n:24,m:12}));if(!el&&!p.horn&&!(p.mane&&p.neck>.8))legs.push(sph(lr*.9,STD({color:p.patch?"#141414":base}),V(pts[3].x+lr*.35,lr*.32,z),[1.45,.55,1.05]));});
    // 尾
    const tb=V(-L*.5,bh+R0*.2,0);let tail=null;
    if(p.tail!==0){const long=p.neck>.8&&p.mane;const tp=long?[tb,V(-L*.62,bh-R0*.5,0),V(-L*.6,lg*.35,0)]:p.ears&&p.ears<.5?[tb,V(-L*.62,bh+R0*.6,0),V(-L*.55,bh+R0*1.1,0)]:[tb,V(-L*.6,bh-R0*.3,0),V(-L*.62,bh-R0*.9,0)];
      tail=loft(tp,u=>{const r=(long?h*.07*(1-.3*u):h*.025*(1-.5*u));return [r,r*(long?.6:1)];},(c,u)=>{c.copy(long?C(p.mane):base);if(p.mane&&!long&&u>.85)c.copy(C(p.mane));},{n:18,m:8});
      if(!long&&(p.mane||p.horn||el))sph(h*.05,STD({color:p.mane||"#2a1a0a"}),tp[2],[1,1.4,1],tail).position.sub(V(0,0,0));
    }else{tail=sph(h*.08,STD({color:base}),tb,[1,1,1]);}
    // アニメーション
    const hg=pivot(nb.clone(),parts);const tg=tail?pivot(tb.clone(),[tail]):null;
    X.anims.push(t=>{hg.rotation.z=Math.sin(t*.8)*.06;hg.rotation.y=Math.sin(t*.5)*.12;body.scale.y=1+Math.sin(t*2.2)*.008;if(tg)tg.rotation.y=Math.sin(t*2.4)*.35;});
    return Math.max(L*1.2,h+lg+p.neck);};
  const sa0=a=>Math.sin(a);
  // ===== 魚 =====
  B.fish=function(p){const l=p.l,g=new THREE.Group();X.root.add(g);const y0=Math.max(1.3,l*.55);g.position.y=y0;
    const base=C(p.c),bel=C(p.belly||(p.shark?"#e9edf1":"#dfe5eb")),comp=p.shark?.82:p.stripe?.5:.6,R=l*(p.stripe?.2:p.shark?.12:.15);
    const body=loft([V(-l*.5,0,0),V(-l*.15,l*.012,0),V(l*.2,l*.014,0),V(l*.5,-l*.01,0)],u=>{const s=u<.68?Math.pow(Math.sin(u/.68*Math.PI/2),.9):Math.sqrt(Math.max(0,1-Math.pow((u-.68)/.32,2)));const r=R*Math.max(.07,s);return [r,r*comp];},
      (c,u,a,q,ca)=>{if(p.stripe){c.copy(base);for(const [b0,b1] of [[.16,.25],[.47,.58],[.77,.84]])if(u>b0&&u<b1){const e=Math.min(u-b0,b1-u);c.set(e<.012?"#141414":p.stripe);}}
        else{c.copy(base).lerp(bel,ss(.25,-.45,ca));if(p.shark)c.lerp(bel,ss(.0,-.3,ca)*.6);}c.multiplyScalar(.9+.15*vn(q.x*9/l,q.y*9/l,q.z*9/l));},{n:40,m:22,parent:g});
    const fm=STD({color:p.stripe?"#ff8a2a":p.shark?"#5f7080":p.c,roughness:.5,transparent:true,opacity:.92});
    const tail=p.shark?shapeMesh([[0,0],[-l*.2,l*.27],[-l*.09,l*.02],[-l*.13,-l*.12],[-.0,-l*.02]],fm):p.stripe?shapeMesh([[0,0],[-l*.12,l*.16],[-l*.2,l*.1],[-l*.22,0],[-l*.2,-l*.1],[-l*.12,-l*.16]],fm):shapeMesh([[0,0],[-l*.22,l*.22],[-l*.15,l*.02],[-l*.15,-l*.02],[-l*.22,-l*.22]],fm);
    const tg=new THREE.Group();tg.position.set(-l*.46,0,0);g.add(tg);tg.add(tail);
    const dor=p.shark?shapeMesh([[0,0],[l*.05,l*.2],[l*.12,l*.17],[l*.14,0]],fm):p.stripe?shapeMesh([[0,0],[l*.05,l*.12],[l*.3,l*.1],[l*.36,0]],fm):shapeMesh([[0,0],[l*.06,l*.14],[l*.1,l*.12],[l*.16,0]],fm);
    dor.position.set(p.shark?-l*.02:-l*.12,R*.92,0);g.add(dor);
    if(!p.shark&&!p.stripe){const d2=shapeMesh([[0,0],[l*.04,l*.08],[l*.1,0]],fm);d2.position.set(-l*.3,R*.62,0);g.add(d2);for(let i=0;i<6;i++){const f=shapeMesh([[0,0],[l*.012,l*.035],[l*.03,0]],STD({color:"#f4d03a"}));f.position.set(-l*.42+i*l*.035,R*.38-i*.0,0);g.add(f);const f2=f.clone();f2.rotation.z=Math.PI;f2.position.y=-R*.3;g.add(f2);}}
    const pecs=[-1,1].map(s=>{const f=shapeMesh([[0,0],[-l*(p.shark?.16:.1),-l*.03],[-l*(p.shark?.12:.08),-l*(p.shark?.12:.06)],[0,-l*.02]],fm);f.position.set(l*.22,-R*.35,s*R*comp*.85);f.rotation.x=s*.9;g.add(f);return [f,s];});
    [-1,1].forEach(s=>eye(V(l*.38,R*.28,s*R*comp*.72),R*(p.stripe?.18:.12),g,p.shark?"#101010":"#1a1206"));
    if(p.shark)for(let i=0;i<5;i++)[-1,1].forEach(s=>{const m=new THREE.Mesh(new THREE.BoxGeometry(l*.004,R*.42,l*.004),STD({color:"#3a4550"}));m.position.set(l*(.26-i*.022),-R*.02,s*R*comp*.95);g.add(m);});
    X.anims.push(t=>{tg.rotation.y=Math.sin(t*5)*.38;g.rotation.y=Math.sin(t*1.2)*.12;g.position.y=y0+Math.sin(t*1.1)*l*.04;pecs.forEach(([f,s])=>f.rotation.x=s*(.9+Math.sin(t*3)*.2));});
    return l*1.15;};
  // ===== クジラ・イルカ =====
  B.whale=function(p){const l=p.l,g=new THREE.Group();X.root.add(g);const y0=p.beak?1.6:Math.max(2,l*.22);g.position.y=y0;
    const base=C(p.c),bel=C(p.beak?"#e6ebf0":"#9fb2c4"),R=l*(p.beak?.11:.085);
    const body=loft([V(-l*.5,0,0),V(-l*.2,l*.01,0),V(l*.15,l*.012,0),V(l*.5,-l*.01,0)],u=>{let s=u<.72?Math.pow(Math.sin(u/.72*Math.PI/2),1.1):Math.sqrt(Math.max(0,1-Math.pow((u-.72)/.28,2.2)));if(p.beak&&u>.9)s*=1-(u-.9)*4.5;const r=R*Math.max(.05,s);return [r,r*(p.beak?.82:.92),0];},
      (c,u,a,q,ca)=>{c.copy(base).lerp(bel,ss(.1,-.55,ca));const m=vn(q.x*5/l*6,q.y*5/l*6,q.z*5/l*6);c.multiplyScalar(.82+.3*m);if(!p.beak&&ca<-.35&&u>.62&&Math.sin(a*36)>.75)c.multiplyScalar(.72);},{n:48,m:22,parent:g});
    const fm=STD({color:base.clone().multiplyScalar(.85),roughness:.5});
    const fl=shapeMesh([[0,0],[-l*.05,l*.03],[-l*.1,l*.13],[-l*.16,l*.16],[-l*.13,l*.06],[-l*.11,0],[-l*.13,-l*.06],[-l*.16,-l*.16],[-l*.1,-l*.13],[-l*.05,-l*.03]],fm);fl.rotation.x=-Math.PI/2;
    const fg=new THREE.Group();fg.position.set(-l*.47,0,0);g.add(fg);fg.add(fl);
    const dor=p.beak?shapeMesh([[0,0],[l*.02,l*.06],[-l*.03,l*.12],[l*.05,l*.07],[l*.09,0]],fm):shapeMesh([[0,0],[l*.012,l*.025],[l*.03,0]],fm);dor.position.set(p.beak?-l*.02:-l*.25,R*(p.beak?.9:.62),0);g.add(dor);
    const flp=[-1,1].map(s=>{const f=shapeMesh([[0,0],[-l*.04,-l*.02],[-l*(p.beak?.12:.17),-l*.05],[-l*(p.beak?.08:.12),-l*.01],[0,l*.015]],fm);f.position.set(l*(p.beak?.22:.2),-R*.45,s*R*.82);f.rotation.x=s*1.1;f.rotation.y=s*.25;g.add(f);return [f,s];});
    [-1,1].forEach(s=>eye(V(l*(p.beak?.37:.33),-R*(p.beak?.02:.3),s*R*(p.beak?.66:.8)),R*.07,g,"#0a0a0a"));
    if(!p.beak){const bh=loft([V(l*.31,R*.62,0),V(l*.33,R*.72,0)],u=>[R*.05*(1-u)+.01,R*.03],c=>c.set("#2a3a4a"),{n:4,m:8,parent:g});}
    X.anims.push(t=>{fg.rotation.z=Math.sin(t*1.4)*.28;g.rotation.z=Math.sin(t*1.4+1)*.05;g.position.y=y0+Math.sin(t*.7)*l*.02;flp.forEach(([f,s])=>f.rotation.x=s*(1.1+Math.sin(t*1.4)*.12));});
    return l*1.05;};
  // ===== 鳥 =====
  B.bird=function(p){if(p.neck)return flamingo(p);const w=p.wing||2,g=new THREE.Group();X.root.add(g);const y0=2.3;g.position.y=y0;
    const base=C(p.c),hc=C(p.head),bk=C(p.beak);
    loft([V(-.85,.05,0),V(-.3,.02,0),V(.25,.04,0),V(.62,.14,0),V(.8,.2,0)],u=>{const s=u<.8?Math.pow(Math.sin(Math.PI*(.06+.88*u/.8)*.5+.0),.6):1;let r=.3*Math.pow(Math.sin(Math.PI*(.05+.9*u)),.5);if(u>.72)r=Math.max(r,.19*Math.sqrt(Math.max(0,1-Math.pow((u-.86)/.14,2))));return [r*.95,r*.85];},
      (c,u,a,q,ca)=>{c.copy(base).lerp(hc,ss(.68,.76,u));c.multiplyScalar(.85+.25*vn(q.x*14,q.y*14,q.z*14));},{n:40,m:18,parent:g});
    loft([V(.88,.24,0),V(1.0,.2,0),V(1.06,.08,0),V(1.0,.02,0)],u=>{const r=.07*(1-.8*u);return [r,r*.75];},c=>c.copy(bk),{n:14,m:10,parent:g});
    [-1,1].forEach(s=>eye(V(.8,.28,s*.13),.035,g,"#3a2a08"));
    const fm=STD({color:base.clone().multiplyScalar(.95),roughness:.8}),fm2=STD({color:base.clone().multiplyScalar(1.25),roughness:.8});
    const pts=[[0,.18],[w*.45,.24],[w*.82,.12],[w*1.0,-.08],[w*.95,-.24],[w*.9,-.14],[w*.86,-.34],[w*.8,-.2],[w*.74,-.4],[w*.68,-.26],[w*.6,-.44],[w*.5,-.36],[w*.25,-.42],[0,-.3]];
    const mapW=s=>remap((x,y)=>[y,Math.sin(x/w*1.2)*.12*(x/w),s*x]);
    const wings=[-1,1].map(s=>{const wg=new THREE.Group();wg.position.set(.05,.12,s*.18);g.add(wg);const m=shapeMesh(pts,fm,mapW(s));wg.add(m);
      const c2=shapeMesh([[0,.18],[w*.45,.22],[w*.6,.05],[w*.3,-.12],[0,-.1]],fm2,remap((x,y)=>[y,Math.sin(x/w*1.2)*.12*(x/w)+.012,s*x]));wg.add(c2);return [wg,s];});
    const tl=shapeMesh([[0,.1],[-.5,.22],[-.62,.08],[-.64,-.08],[-.5,-.22],[0,-.1]],STD({color:p.head==="#f2f2f2"?"#f4f4f0":p.c}),remap((x,y)=>[x-.75,0,y]));g.add(tl);
    [-1,1].forEach(s=>{const lg=loft([V(.1,-.18,s*.1),V(.0,-.36,s*.1),V(-.15,-.42,s*.1)],u=>[.05*(1-.4*u),.05*(1-.4*u)],c=>c.copy(bk),{n:8,m:8,parent:g});});
    X.anims.push(t=>{const f=Math.sin(t*2.6);wings.forEach(([wg,s])=>wg.rotation.x=-s*(f*.38+.05));g.position.y=y0-f*.08;g.rotation.z=Math.sin(t*.6)*.06;});
    return w*2.3;};
  function flamingo(p){const g=new THREE.Group();X.root.add(g);const by=1.45,base=C(p.c),bk=C(p.beak);
    loft([V(-.62,by+.1,0),V(-.2,by,0),V(.25,by+.02,0),V(.5,by+.12,0)],u=>{const r=.3*Math.pow(Math.sin(Math.PI*(.05+.9*u)),.55);return [r*.9,r*.82];},(c,u,a,q,ca)=>{c.copy(base).multiplyScalar(.9+.2*vn(q.x*12,q.y*12,q.z*12));if(ca>.2&&u<.6&&Math.abs(Math.sin(a))>.3)c.multiplyScalar(.82);},{n:30,m:18,parent:g});
    const nk=[V(.45,by+.12,0),V(.62,by+.55,0),V(.42,by+1.05,0),V(.5,by+1.4,0),V(.7,by+1.5,0)];
    const neck=loft(nk,u=>[.075-.025*u,.07-.025*u],(c,u,a,q)=>c.copy(base).multiplyScalar(.95+.1*vn(q.x*20,q.y*20,0)),{n:40,m:10,parent:g});
    const head=loft([V(.66,by+1.5,0),V(.78,by+1.52,0),V(.88,by+1.46,0)],u=>[.075*(1-.3*u),.06*(1-.3*u)],c=>c.copy(base),{n:10,m:10,parent:g});
    const beak=loft([V(.86,by+1.48,0),V(.96,by+1.44,0),V(1.0,by+1.32,0),V(.96,by+1.24,0)],u=>[.05*(1-.75*u),.04*(1-.75*u)],(c,u)=>c.set(u>.45?"#141414":"#f0d0d8"),{n:16,m:8,parent:g});
    [-1,1].forEach(s=>eye(V(.74,by+1.55,s*.05),.018,g,"#c89a20"));
    const lc=C(p.c).multiplyScalar(.85);const leg=(pts,s)=>loft(pts,u=>[.025,.025],(c,u)=>c.copy(lc).multiplyScalar(u>.45&&u<.55?.8:1),{n:20,m:8,parent:g});
    leg([V(-.05,by-.2,.08),V(-.08,by*.5,.08),V(-.02,.02,.08)],1);leg([V(-.05,by-.2,-.08),V(.2,by*.62,-.08),V(-.12,by*.78,-.08)],-1);
    const ft=shapeMesh([[0,0],[.16,.06],[.18,0],[.16,-.06]],STD({color:lc}),remap((x,y)=>[x-.02,.012,y+.08]));g.add(ft);
    const hg=pivot(nk[0].clone(),[neck,head,beak,...g.children.filter(o=>o.position.y>by+1.3)],g);
    X.anims.push(t=>{hg.rotation.z=Math.sin(t*.7)*.06;hg.rotation.y=Math.sin(t*.45)*.2;});return 3.4;}
  // ===== ペンギン =====
  B.penguin=function(p){const g=new THREE.Group();X.root.add(g);const bl=C(p.c),wh=C("#f6f5f0"),ye=C("#f2b23a");
    loft([V(0,.04,0),V(.03,.6,0),V(.02,1.25,0),V(.05,1.6,0)],u=>{const r=.55*Math.pow(Math.sin(Math.PI*(.05+.92*u)),.55)*(1-.3*u)+.05;return [r*.92,r];},
      (c,u,a,q,ca,sa)=>{c.copy(bl).lerp(wh,ss(-.05,.35,ca));if(u>.72&&ca>-.3&&ca<.45&&Math.abs(sa)>.5)c.lerp(ye,ss(.72,.85,u)*.9);if(ca>.4&&u>.78)c.lerp(ye,.25);},{n:34,m:22,up2:V(1,0,0),parent:g});
    const head=loft([V(.04,1.58,0),V(.06,1.85,0),V(.05,2.1,0)],u=>{const r=.27*Math.pow(Math.sin(Math.PI*(.12+.82*u)),.55);return [r,r*.92];},(c,u,a,q,ca,sa)=>{c.copy(bl);if(u<.4&&Math.abs(sa)>.55&&ca>-.4)c.lerp(ye,.95*(1-u/.4));},{n:20,m:18,up2:V(1,0,0),parent:g});
    const beak=loft([V(.24,1.86,0),V(.38,1.82,0),V(.52,1.74,0)],u=>[.06*(1-.8*u),.04*(1-.8*u)],(c,u,a,q,ca)=>c.set(ca<-.2?"#f28a2a":"#1a1a1a"),{n:12,m:10,parent:g});
    const eyes=[-1,1].map(s=>eye(V(.2,1.94,s*.15),.035,g,"#0a0a0a"));
    const fl=[-1,1].map(s=>{const m=loft([V(-.02,1.32,s*.47),V(.0,.95,s*.56),V(.08,.62,s*.5)],u=>[.17*(1-.6*u)+.02,.045],(c,u,a,q,ca,sa)=>c.copy(sa*s>0?wh:bl),{n:16,m:10,parent:g});return [pivot(V(-.02,1.32,s*.47),[m],g),s];});
    [-1,1].forEach(s=>sph(.13,STD({color:"#1f1f22",roughness:.8}),V(.16,.03,s*.17),[1.6,.35,.9],g));
    const hg=pivot(V(.04,1.58,0),[head,beak,...eyes],g);
    X.anims.push(t=>{g.rotation.x=Math.sin(t*2.2)*.05;fl.forEach(([f,s])=>f.rotation.x=-s*(.1+Math.max(0,Math.sin(t*2.2))*.35));hg.rotation.y=Math.sin(t*.6)*.4;});return 2.4;};
  // ===== 樹木 =====
  B.tree=function(p){return p.kind==="conifer"?conifer(p):blossom(p);};
  function conifer(p){const h=p.h,bark=C("#8a4a2c");
    loft([V(0,0,0),V(0,h*.3,0),V(0,h*.7,0),V(0,h*.95,0)],u=>{const r=h*.065*(1-.82*u)+h*.07*Math.exp(-u*16);return [r,r];},(c,u,a,q)=>{c.copy(bark).multiplyScalar(.7+.45*vn(a*7,u*26,0));},{n:40,m:20,up2:V(1,0,0),rib:(u,a)=>1+.05*Math.sin(a*15+u*4)*(1-u)});
    const fol=[];const n=64;for(let i=0;i<n;i++){const t=i/n;const y=h*(.38+.6*t);const rl=h*.15*(1-t)*.95+h*.035;const a=i*2.4+rnd()*.6;const d=rl*(.35+.65*Math.sqrt(rnd()));
      const g=new THREE.IcosahedronGeometry(1,1);const ps=g.attributes.position;for(let k=0;k<ps.count;k++){const f=.8+.4*hash(ps.getX(k)*3+i,ps.getY(k)*3,ps.getZ(k)*3);ps.setXYZ(k,ps.getX(k)*f,ps.getY(k)*f,ps.getZ(k)*f);}g.computeVertexNormals();
      const m=new THREE.Mesh(g,STD({color:C("#24451f").multiplyScalar(.7+.45*rnd()),flatShading:true,roughness:.95}));const sz=h*(.06+.045*rnd())*(1-t*.4);m.scale.set(sz*1.3,sz*.8,sz*1.3);m.position.set(Math.cos(a)*d,y,Math.sin(a)*d);X.root.add(m);fol.push(m);
      if(d>rl*.5){const br=loft([V(0,y-h*.02,0),V(Math.cos(a)*d*.6,y-h*.01,Math.sin(a)*d*.6),V(Math.cos(a)*d,y,Math.sin(a)*d)],u=>[h*.008*(1-.6*u)+.02,h*.008*(1-.6*u)+.02],c=>c.copy(bark),{n:6,m:6});}}
    X.anims.push(t=>fol.forEach((m,i)=>{m.rotation.y=Math.sin(t*.6+i)*.04;}));X.ty=h*.5;return h*.8;}
  function blossom(p){const h=p.h,bark=C("#4a3a34");const tips=[];
    const branch=(s,d,len,r,depth)=>{const e=s.clone().addScaledVector(d,len);const mid=s.clone().lerp(e,.5).add(V((rnd()-.5)*len*.15,(rnd()-.2)*len*.1,(rnd()-.5)*len*.15));
      loft([s,mid,e],u=>{const rr=r*(1-.38*u);return [rr,rr];},(c,u,a,q)=>{c.copy(bark).multiplyScalar(.75+.3*vn(a*4,q.y*14,0));if(Math.sin(q.y*70+a)>.92)c.multiplyScalar(1.35);},{n:10,m:10});
      if(depth>=4||r<.03){tips.push(e);return;}const k=depth<1?3:2+(rnd()<.5?1:0);for(let i=0;i<k;i++){const az=rnd()*6.283;const nd=d.clone().multiplyScalar(.6).add(V(Math.cos(az)*(.7+depth*.1),.18+rnd()*.35,Math.sin(az)*(.7+depth*.1))).normalize();branch(e,nd,len*(.68+rnd()*.12),r*.62,depth+1);}};
    branch(V(0,0,0),V(.05,1,.02).normalize(),h*.3,h*.05,0);
    const cv=document.createElement("canvas");cv.width=cv.height=64;const x=cv.getContext("2d");x.translate(32,32);for(let i=0;i<5;i++){x.rotate(Math.PI*2/5);x.beginPath();x.ellipse(0,-14,8,13,0,0,7);x.fillStyle="#ffe3ec";x.fill();}x.beginPath();x.arc(0,0,5,0,7);x.fillStyle="#ff9ab8";x.fill();
    const tex=new THREE.CanvasTexture(cv);const P=[],Cc=[];tips.forEach(tp=>{for(let i=0;i<95;i++){const r=.7*Math.cbrt(rnd());const a=rnd()*6.28,b=Math.acos(2*rnd()-1);P.push(tp.x+r*Math.sin(b)*Math.cos(a),tp.y+r*Math.cos(b)*.7,tp.z+r*Math.sin(b)*Math.sin(a));const w=.85+.15*rnd();Cc.push(w,w*(.82+.1*rnd()),w*(.88+.08*rnd()));}});
    const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.Float32BufferAttribute(P,3));gg.setAttribute("color",new THREE.Float32BufferAttribute(Cc,3));
    X.root.add(new THREE.Points(gg,new THREE.PointsMaterial({size:.24,map:tex,vertexColors:true,transparent:true,alphaTest:.3,depthWrite:true})));
    const pet=[];const pm=STD({color:"#ffd6e2",side:THREE.DoubleSide});for(let i=0;i<70;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.07,.05),pm);m.position.set((rnd()-.5)*h*1.2,rnd()*h,(rnd()-.5)*h*1.2);m.userData={s:rnd()*6,v:.25+rnd()*.3};X.root.add(m);pet.push(m);}
    let last=0;X.anims.push(t=>{const dt=Math.min(.05,t-last);last=t;pet.forEach(m=>{m.position.y-=m.userData.v*dt;m.position.x+=Math.sin(t+m.userData.s)*dt*.25;m.rotation.x+=dt*2;m.rotation.y+=dt*1.3;if(m.position.y<.02)m.position.y=h*1.05;});});
    X.ty=h*.55;return h*.95;}
  // ===== ヒマワリ =====
  B.flower=function(p){const H=2.3,yel=C(p.c),gr=C("#4f8a2f");const g=new THREE.Group();X.root.add(g);
    const top=V(.22,H,0);loft([V(0,0,0),V(.04,H*.5,0),V(.1,H*.88,0),top],u=>[.05*(1-.3*u),.05*(1-.3*u)],(c,u,a,q)=>c.copy(gr).multiplyScalar(.85+.2*vn(q.y*30,a*3,0)),{n:30,m:10,up2:V(1,0,0),parent:g});
    for(let i=0;i<6;i++){const y=H*(.18+i*.12),s=i%2?1:-1,len=.55-i*.05;const lf=shapeMesh([[0,0],[len*.3,len*.32],[len*.75,len*.3],[len,0],[len*.75,-len*.3],[len*.3,-len*.32]],STD({color:C("#3f7a2a").multiplyScalar(.9+.2*rnd()),roughness:.7}),remap((x,y,z)=>[x,-x*x*.5+0,y]));
      lf.position.set(.03,y,0);lf.rotation.y=s*(.5+i*.7);lf.rotation.z=.35;g.add(lf);}
    const hd=new THREE.Group();hd.position.copy(top);hd.rotation.z=-.35;g.add(hd);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(.34,.3,.08,48),STD({color:"#3a2410"}));disc.rotation.z=Math.PI/2;hd.add(disc);
    const n=520,sd=new THREE.InstancedMesh(new THREE.SphereGeometry(.012,6,4),STD({color:"#fff",roughness:.6}),n);const mm=new THREE.Matrix4(),cc=C("#fff");
    for(let i=0;i<n;i++){const r=.32*Math.sqrt(i/n),th=i*2.39996;mm.makeTranslation(.045+.035*(1-r/.32),r*Math.cos(th),r*Math.sin(th));sd.setMatrixAt(i,mm);cc.set(r<.12?"#6a4a12":"#2a1a08").multiplyScalar(.7+.5*hash(i,1,2));sd.setColorAt(i,cc);}
    hd.add(sd);const pg=new THREE.ShapeGeometry(new THREE.Shape([V2(0,0),V2(.05,.08),V2(.045,.2),V2(0,.27),V2(-.045,.2),V2(-.05,.08)]),6);pg.rotateY(Math.PI/2);pg.translate(0,.3,0);
    {const ps=pg.attributes.position;for(let i=0;i<ps.count;i++){const y=ps.getY(i);ps.setX(i,ps.getX(i)+Math.pow(Math.max(0,y-.3)/.27,2)*.06);}pg.computeVertexNormals();}
    for(let k=0;k<2;k++)for(let i=0;i<21;i++){const m=new THREE.Mesh(pg,STD({color:yel.clone().multiplyScalar(.9+.18*rnd()-k*.08),roughness:.55}));m.rotation.x=i/21*Math.PI*2+k*.15;m.position.x=.01-k*.012;hd.add(m);}
    for(let i=0;i<16;i++){const m=new THREE.Mesh(pg,STD({color:"#4f7a2a"}));m.scale.set(1,.55,1.2);m.rotation.x=i/16*Math.PI*2+.1;m.position.x=-.04;hd.add(m);}
    X.anims.push(t=>{g.rotation.z=Math.sin(t*.9)*.025;hd.rotation.x=Math.sin(t*.7)*.05;});X.ty=H*.62;return H*.95;};
  // ===== サボテン（ベンケイチュウ） =====
  B.cactus=function(p){const H=5,base=C(p.c);const rib=(u,a)=>1+.09*Math.cos(12*a);const cf=(c,u,a,q)=>{c.copy(base).multiplyScalar(.72+.38*(.5+.5*Math.cos(12*a)));c.multiplyScalar(.92+.12*vn(q.y*3,a*2,0));};
    const sand=new THREE.Mesh(new THREE.CircleGeometry(7,48),STD({color:"#c9a26a",roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.y=.012;X.root.add(sand);
    loft([V(0,0,0),V(0,H*.5,0),V(0,H,0)],u=>{const r=.42*(u<.9?1:Math.sqrt(Math.max(0,1-Math.pow((u-.9)/.1,2))))+.004;return [r,r];},cf,{n:40,m:48,up2:V(1,0,0),rib});
    const arms=[[1,2.0,1.1,3.7],[-1,2.6,.95,3.9],[.3,3.1,.7,4.0]].map(([s,y0,dx,y1],i)=>{const az=i===2?Math.PI/2:0;const dir=V(Math.cos(az)*s,0,Math.sin(az)*Math.sign(s));
      const pts=[V(0,y0,0),dir.clone().multiplyScalar(dx*.65).add(V(0,y0+.05,0)),dir.clone().multiplyScalar(dx).add(V(0,y0+.5,0)),dir.clone().multiplyScalar(dx).add(V(0,y1,0))];
      return loft(pts,u=>{const r=.26*(u<.88?1:Math.sqrt(Math.max(0,1-Math.pow((u-.88)/.12,2))))+.004;return [r,r];},cf,{n:30,m:36,up2:V(1,0,0),rib});});
    const P=[];for(let k=0;k<12;k++){const a=k/12*Math.PI*2;for(let y=.2;y<H*.95;y+=.16)P.push(Math.cos(a)*.47,y,-Math.sin(a)*.47);}
    const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(P,3));X.root.add(new THREE.Points(pg,new THREE.PointsMaterial({color:"#f2ecd8",size:.045})));
    for(let i=0;i<5;i++){const a=i/5*6.28;const f=sph(.07,STD({color:"#fbf6e8"}),V(Math.cos(a)*.22,H-.02,Math.sin(a)*.22),[1.4,.6,1.4]);sph(.03,STD({color:"#f2c84a"}),V(0,.05,0),[1,1,1],f);}
    X.ty=H*.48;return H*.85;};
  // ===== キノコ（ベニテングタケ） =====
  B.mushroom=function(p){const red=C(p.c);
    const moss=new THREE.Mesh(new THREE.CircleGeometry(3.5,40),STD({color:"#3a4a22",roughness:1}));moss.rotation.x=-Math.PI/2;moss.position.y=.01;X.root.add(moss);
    const one=(x,z,s,open)=>{const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);X.root.add(g);
      const st=new THREE.Mesh(new THREE.LatheGeometry([V2(.001,0),V2(.3,.02),V2(.31,.12),V2(.22,.26),V2(.16,.45),V2(.15,.82),V2(.001,.84)],32),STD({color:"#f2ece0",roughness:.8}));g.add(st);
      const sk=new THREE.Mesh(new THREE.LatheGeometry([V2(.15,.7),V2(.24,.64),V2(.28,.56),V2(.27,.54)],32),STD({color:"#f6f1e6"}));g.add(sk);
      const prof=open?[V2(.001,1.2),V2(.4,1.17),V2(.76,1.06),V2(1.0,.9),V2(1.08,.78),V2(1.02,.74),V2(.6,.79),V2(.12,.82)]:[V2(.001,1.15),V2(.3,1.12),V2(.5,1.0),V2(.58,.82),V2(.55,.72),V2(.3,.75),V2(.1,.78)];
      const capG=new THREE.LatheGeometry(prof,48);const cp=capG.attributes.position;const cols=new Float32Array(cp.count*3);for(let i=0;i<cp.count;i++){_c.copy(red).multiplyScalar(.85+.25*vn(cp.getX(i)*4,cp.getY(i)*4,cp.getZ(i)*4));if(cp.getY(i)<.83)_c.set("#f0e6d0");cols.set([_c.r,_c.g,_c.b],i*3);}
      capG.setAttribute("color",new THREE.BufferAttribute(cols,3));const cap=new THREE.Mesh(capG,VC({roughness:.35}));g.add(cap);
      const wm=STD({color:"#fbf8f0",roughness:.9});for(let i=0;i<(open?70:30);i++){const t=Math.sqrt(rnd())*.82,a=rnd()*6.28;const k=Math.min(prof.length-2,Math.floor(t*(prof.length-3)));const r=prof[k].x+(prof[k+1].x-prof[k].x)*.5,y=prof[k].y+(prof[k+1].y-prof[k].y)*.5;
        const w=sph(.035+.03*rnd(),wm,V(Math.cos(a)*r*1.01,y+.012,Math.sin(a)*r*1.01),[1,1,.45],g);w.lookAt(V(Math.cos(a)*r*3,y*2.2,Math.sin(a)*r*3));}
      const gl=document.createElement("canvas");gl.width=gl.height=256;const cx=gl.getContext("2d");cx.fillStyle="#efe4cc";cx.fillRect(0,0,256,256);cx.strokeStyle="#cbbd9e";cx.lineWidth=1.2;for(let i=0;i<180;i++){const a=i/180*6.283;cx.beginPath();cx.moveTo(128+Math.cos(a)*18,128+Math.sin(a)*18);cx.lineTo(128+Math.cos(a)*128,128+Math.sin(a)*128);cx.stroke();}
      const gills=new THREE.Mesh(new THREE.CircleGeometry(open?1.0:.54,48),STD({map:new THREE.CanvasTexture(gl),roughness:.9}));gills.rotation.x=Math.PI/2;gills.position.y=open?.775:.74;g.add(gills);return g;};
    const m1=one(0,0,1,true),m2=one(1.25,.55,.55,true),m3=one(-.85,.95,.42,false);
    X.anims.push(t=>{m1.rotation.y=t*.05;});return 2.4;};
  // ===== ヘビ（ニシキヘビ） =====
  B.snake=function(p){const base=C(p.c),dk=C(p.spots),bel=C("#e6d9a8");const pts=[];
    for(let i=0;i<=70;i++){const t=i/70;const a=t*Math.PI*4.2;const r=2.1-t*1.55;let y=.16;if(t>.86)y=.16+Math.pow((t-.86)/.14,1.5)*1.0;pts.push(V(Math.cos(a)*r,y,Math.sin(a)*r));}
    const hb=pts[pts.length-1];
    loft(pts,u=>{let r=.17*Math.min(1,.25+u*4)*(u>.94?1-(u-.94)*6:1);return [r,r*1.08];},(c,u,a,q,ca)=>{c.copy(base);const [f1,f2]=wor(u*95,ca*1.6,Math.sin(a)*1.6);if(f1<.38)c.copy(dk).multiplyScalar(.9);else if(f2-f1<.08)c.copy(dk);if(ca<-.55)c.copy(bel);c.multiplyScalar(.88+.2*vn(u*200,ca*4,0));},{n:220,m:16});
    const dir=pts[pts.length-1].clone().sub(pts[pts.length-3]).normalize();const hd0=hb.clone().addScaledVector(dir,-.06);
    const head=loft([hd0,hd0.clone().addScaledVector(dir,.2),hd0.clone().addScaledVector(dir,.38)],u=>{const r=.14*Math.pow(Math.sin(Math.PI*(.15+.8*u)),.5)*(1-.3*u);return [r*.7,r*1.15];},(c,u,a,q,ca)=>{c.copy(base);if(ca<-.4)c.copy(bel);if(ca>.6&&u<.6)c.copy(dk);},{n:14,m:14});
    const side=V(0,1,0).cross(dir).normalize();const eyes=[-1,1].map(s=>eye(hd0.clone().addScaledVector(dir,.24).add(V(0,.05,0)).addScaledVector(side,s*.1),.03,X.root,"#2a1a00"));
    const t0=hd0.clone().addScaledVector(dir,.38);const tongue=new THREE.Line(new THREE.BufferGeometry().setFromPoints([t0,t0.clone().addScaledVector(dir,.14),t0.clone().addScaledVector(dir,.2).addScaledVector(side,.04),t0.clone().addScaledVector(dir,.14),t0.clone().addScaledVector(dir,.2).addScaledVector(side,-.04)]),new THREE.LineBasicMaterial({color:"#d0303a"}));X.root.add(tongue);
    const hg=pivot(hd0.clone(),[head,...eyes,tongue]);X.anims.push(t=>{tongue.visible=Math.sin(t*5)>.3;hg.rotation.y=Math.sin(t*.8)*.18;});return 4.6;};
  // ===== ウミガメ =====
  B.turtle=function(p){const g=new THREE.Group();X.root.add(g);const y0=1.3;g.position.y=y0;const sh=C(p.shell),sk=C(p.c);
    const cg=new THREE.SphereGeometry(1,48,24,0,Math.PI*2,0,Math.PI/2);const cp=cg.attributes.position;const cols=new Float32Array(cp.count*3);
    for(let i=0;i<cp.count;i++){const x=cp.getX(i),y=cp.getY(i),z=cp.getZ(i);const [f1,f2]=wor(x*2.2+.3,z*2.2,y*1.2);_c.copy(sh).multiplyScalar(.75+.4*vn(x*7,y*7,z*7));if(f2-f1<.09)_c.set("#2e2a1a");else _c.lerp(C("#a08a4a"),Math.max(0,.4-f1)*.8);cols.set([_c.r,_c.g,_c.b],i*3);}
    cg.setAttribute("color",new THREE.BufferAttribute(cols,3));const shell=new THREE.Mesh(cg,VC({roughness:.4}));shell.scale.set(1.25,.42,1);g.add(shell);
    const pl=new THREE.Mesh(new THREE.CircleGeometry(1,40),STD({color:"#e6d7a0"}));pl.rotation.x=Math.PI/2;pl.scale.set(1.2,.95,1);pl.position.y=-.01;g.add(pl);
    const skf=(c,u,a,q)=>{c.copy(sk);const [f1,f2]=wor(q.x*9,q.y*9,q.z*9);if(f2-f1<.12)c.multiplyScalar(.55);else c.lerp(C("#c8b878"),.25*(1-f1));};
    const head=loft([V(1.0,.02,0),V(1.3,.08,0),V(1.55,.08,0)],u=>{const r=.24*Math.pow(Math.sin(Math.PI*(.12+.83*u)),.5);return [r*.85,r];},skf,{n:16,m:16,parent:g});
    const eyes=[-1,1].map(s=>eye(V(1.42,.15,s*.16),.045,g,"#1a1206"));
    const fin=(s,front)=>{const L=front?1.35:.55,W=front?.38:.3;const m=shapeMesh([[0,0],[L*.3,W*.5],[L*.8,W*.42],[L,0],[L*.75,-W*.15],[L*.2,-W*.4]],STD({color:sk.clone().multiplyScalar(.9)}),remap((x,y)=>[y*.6,0,s*x]));const pv=new THREE.Group();pv.position.set(front?.7:-.85,-.02,s*(front?.75:.6));pv.rotation.y=front?-s*.55:s*.6+Math.PI*(s>0?0:0);g.add(pv);pv.add(m);return [pv,s,front];};
    const fins=[fin(1,true),fin(-1,true),fin(1,false),fin(-1,false)];const hg=pivot(V(1.0,.02,0),[head,...eyes],g);
    X.anims.push(t=>{fins.forEach(([pv,s,fr])=>{pv.rotation.x=fr?s*Math.sin(t*1.6)*.55:s*Math.sin(t*1.6+1)*.2;});g.position.y=y0+Math.sin(t*1.6)*.06;g.rotation.z=Math.sin(t*1.6)*.03;hg.rotation.y=Math.sin(t*.5)*.15;});return 3.2;};
  // ===== タコ =====
  B.octopus=function(p){const base=C(p.c),lt=C("#f0c8b0");const g=new THREE.Group();X.root.add(g);g.position.y=.35;
    const mot=(c,q)=>{c.copy(base).multiplyScalar(.75+.45*vn(q.x*6,q.y*6,q.z*6));const [f1]=wor(q.x*7,q.y*7,q.z*7);if(f1<.2)c.multiplyScalar(1.25);};
    loft([V(0,.75,0),V(-.12,1.3,0),V(-.4,1.85,0),V(-.62,2.1,0)],u=>{const r=.62*Math.pow(Math.sin(Math.PI*(.12+.85*u)),.55)*(1-.25*u)+.02;return [r,r*.92];},(c,u,a,q)=>mot(c,q),{n:30,m:22,parent:g});
    loft([V(.05,.35,0),V(.05,.6,0),V(0,.9,0)],u=>{const r=.5*(1-.15*u);return [r,r];},(c,u,a,q)=>mot(c,q),{n:10,m:22,up2:V(1,0,0),parent:g});
    [-1,1].forEach(s=>{const e=sph(.12,STD({color:"#f2e2b8",roughness:.3}),V(.32,.85,s*.32),[1,1,1],g);const pu=new THREE.Mesh(new THREE.BoxGeometry(.03,.04,.14),STD({color:"#111"}));pu.position.set(.11,0,0);pu.rotation.y=s*.6;e.add(pu);});
    const arms=[];for(let i=0;i<8;i++){const th=i/8*Math.PI*2+.2;const geo=lgeo(34,10);const sp=t=>{const P=[];for(let k=0;k<=7;k++){const s=k/7;const d=.35+s*1.85;const w=Math.sin(t*1.3+i*.9+s*3.5)*.35*s;const ang=th+w*.5;const curl=s>.7?(s-.7)*2.2:0;
        P.push(V(Math.cos(ang)*d-Math.sin(ang)*curl*.6,.42-s*.38+Math.sin(t*1.1+i+s*4)*.18*s+curl*.5,Math.sin(ang)*d+Math.cos(ang)*curl*.6));}return P;};
      const pf=u=>{const r=.13*(1-.88*u)+.008;return [r,r];};lfill(geo,sp(0),pf,(c,u,a,q,ca)=>{mot(c,q);if(ca<-.45&&Math.sin(u*150)>.2)c.copy(lt);},{});
      const m=new THREE.Mesh(geo,VC());g.add(m);arms.push([geo,sp,pf]);}
    let fr=0;X.anims.push(t=>{if((fr++)%2)return;arms.forEach(([geo,sp,pf])=>lfill(geo,sp(t),pf,null,{keepColor:true}));g.rotation.y=Math.sin(t*.25)*.4;});return 3.2;};
  // ===== クラゲ =====
  B.jelly=function(p){const g=new THREE.Group();X.root.add(g);const y0=2.4;g.position.y=y0;
    const bell=new THREE.Mesh(new THREE.LatheGeometry([V2(.001,1.0),V2(.5,.97),V2(.92,.82),V2(1.18,.6),V2(1.28,.42),V2(1.24,.37),V2(1.0,.47),V2(.5,.57),V2(.001,.6)],48),STD({color:p.c,transparent:true,opacity:.42,emissive:"#5fa8e0",emissiveIntensity:.35,roughness:.15,depthWrite:false}));g.add(bell);
    for(let i=0;i<4;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(.2,.045,10,28,Math.PI*1.7),STD({color:"#d9a0ff",emissive:"#a060d0",emissiveIntensity:.5}));t.position.set(Math.cos(i*Math.PI/2+.78)*.28,.68,Math.sin(i*Math.PI/2+.78)*.28);t.rotation.x=Math.PI/2;t.rotation.z=i*Math.PI/2;g.add(t);}
    const arms=[];for(let i=0;i<4;i++){const a=i/4*Math.PI*2;arms.push(loft([V(Math.cos(a)*.08,.55,Math.sin(a)*.08),V(Math.cos(a)*.25,.0,Math.sin(a)*.25),V(Math.cos(a)*.2,-.7,Math.sin(a)*.2),V(Math.cos(a)*.32,-1.3,Math.sin(a)*.32)],u=>[.1*(1-.6*u)+.02,.03],c=>c.set("#e8f4ff"),{n:30,m:10,up2:V(1,0,0),rib:(u,b)=>1+.45*Math.sin(u*60+b*3),parent:g,mo:{transparent:true,opacity:.6,emissive:"#7fc0f0",emissiveIntensity:.3,depthWrite:false}}));}
    const N=72,K=8,tp=new Float32Array(N*K*2*3);const tg=new THREE.BufferGeometry();tg.setAttribute("position",new THREE.BufferAttribute(tp,3));const tl=new THREE.LineSegments(tg,new THREE.LineBasicMaterial({color:"#cfe8ff",transparent:true,opacity:.55}));g.add(tl);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:"#6fb6ff",transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(5,5,1);glow.position.y=.4;g.add(glow);
    X.anims.push(t=>{const ph=Math.sin(t*2.2);const sxz=1-ph*.07,sy=1+ph*.06;bell.scale.set(sxz,sy,sxz);let k=0;
      for(let i=0;i<N;i++){const a=i/N*Math.PI*2;let px=Math.cos(a)*1.24*sxz,py=.38,pz=Math.sin(a)*1.24*sxz;for(let j=0;j<K;j++){const s=(j+1)/K;const nx=Math.cos(a)*(1.24*sxz+Math.sin(t*1.5+i)*.08*s),ny=.38-s*1.6,nz=Math.sin(a)*(1.24*sxz+Math.sin(t*1.5+i)*.08*s)+Math.sin(t*2+i*.3+s*3)*.06*s;
        tp[k++]=px;tp[k++]=py;tp[k++]=pz;tp[k++]=nx;tp[k++]=ny;tp[k++]=nz;px=nx;py=ny;pz=nz;}}tg.attributes.position.needsUpdate=true;
      g.position.y=y0+Math.sin(t*2.2-1)*.12;arms.forEach((m,i)=>m.rotation.y=Math.sin(t*.8+i)*.1);});return 3.6;};
  // ===== ヒト =====
  B.human=function(p){const fig=(x,z,H,skinC,o)=>{const g=new THREE.Group();g.position.set(x,0,z);X.root.add(g);const sk=C(skinC),sh=C(o.shirt),pa=C(o.pants),hair=C(o.hair),shoe=C("#2a2622");
      const U=y=>y*H;const W=o.f?.92:1;
      loft([V(0,U(o.dress?.38:.48),0),V(0,U(.6),0),V(0,U(.72),0),V(0,U(.83),0)],u=>{const y=(o.dress?.38:.48)+u*(.83-(o.dress?.38:.48));let w=y<.5?(o.dress?.15+(.5-y)*.9:.165):y<.58?.15:y<.66?.135*W:y<.76?.16*W+(o.f?.0:.02):.18*(o.f?.85:1.05)*(1-Math.max(0,(y-.79))*14);w*=H/1.7;let d=y<.5?(o.dress?.13+(.5-y)*.7:.11):y<.7?.1+(o.f&&y>.64?.03:0):.11;d*=H/1.7;if(y>.81)d*=1-(y-.81)*30;return [Math.max(.02,d),Math.max(.03,w)];},
        (c,u,a,q)=>{const y=q.y/H;c.copy(y<.5&&!o.dress?pa:sh).multiplyScalar(.9+.12*vn(q.x*30,q.y*30,q.z*30));if(o.dress&&Math.sin(q.y*40)>.95)c.multiplyScalar(.85);},{n:40,m:24,up2:V(1,0,0),parent:g});
      loft([V(0,U(.82),0),V(0,U(.875),0)],u=>[.05*H/1.7,.052*H/1.7],c=>c.copy(sk),{n:6,m:12,up2:V(1,0,0),parent:g});
      const hy=U(.865),hh=U(.13);const head=loft([V(0,hy,0),V(.005,hy+hh*.55,0),V(0,hy+hh,0)],u=>{const r=Math.pow(Math.sin(Math.PI*(.04+.94*u)),.55);return [r*.105*H/1.7,r*.085*H/1.7];},
        (c,u,a,q,ca,sa)=>{c.copy(sk);if(u>.62||(ca<.3&&u>.35)||(ca<-.2))c.copy(hair).multiplyScalar(.85+.3*vn(q.x*40,q.y*40,q.z*40));},{n:24,m:22,up2:V(1,0,0),parent:g});
      if(o.long)loft([V(-.06*H/1.7,hy+hh*.75,0),V(-.11*H/1.7,hy+hh*.2,0),V(-.1*H/1.7,U(.77),0)],u=>[.05*H/1.7,.085*H/1.7*(1-.2*u)],(c,u,a,q)=>c.copy(hair).multiplyScalar(.85+.3*vn(q.x*40,q.y*40,q.z*40)),{n:14,m:14,parent:g});
      [-1,1].forEach(s=>{const e=sph(.012*H/1.7,STD({color:"#1a1410",roughness:.2}),V(.09*H/1.7,hy+hh*.52,s*.034*H/1.7),[1,1,1],g);sph(.013*H/1.7,STD({color:hair}),V(.095*H/1.7,hy+hh*.62,s*.036*H/1.7),[.6,.3,1.6],g);});
      sph(.016*H/1.7,STD({color:sk}),V(.105*H/1.7,hy+hh*.42,0),[1,1.3,.9],g);sph(.02*H/1.7,STD({color:"#a0505a"}),V(.093*H/1.7,hy+hh*.27,0),[.4,.25,1.3],g);
      const sw=.2*W*H/1.7,sy=U(.8);const armC=(c,u)=>c.copy(u<(o.f?.25:.45)?sh:sk);
      const arm=(s,wave)=>{const sp=V(0,sy,s*sw);const el=wave?V(.05,U(.86),s*(sw+.12)):V(.02,U(.62),s*(sw+.03));const pa1=loft([sp,el],u=>[.045*H/1.7*(1-.2*u),.045*H/1.7*(1-.2*u)],armC,{n:8,m:10,parent:g});
        const wr=wave?V(.04,U(1.0),s*(sw+.16)):V(.07,U(.47),s*(sw+.04));const fa=loft([el,wr],u=>[.037*H/1.7*(1-.2*u),.037*H/1.7*(1-.2*u)],(c,u)=>c.copy(o.f||u>.3?sk:sh),{n:8,m:10,parent:g});
        const hand=sph(.042*H/1.7,STD({color:sk}),wr.clone().add(wave?V(0,.04,0):V(.0,-.05,0)),[.7,1.2,.45],g);if(!wave)return null;return pivot(el.clone(),[fa,hand],g);};
      const wv=arm(1,o.wave);arm(-1,false);
      [-1,1].forEach(s=>{const hz=s*.085*H/1.7;loft([V(0,U(.5),hz),V(.03,U(.27),hz),V(0,U(.045),hz)],u=>{const r=(.075-.035*u)*H/1.7;return [r,r];},(c,u)=>c.copy(o.dress&&u>.2||o.dress?sk:pa).multiplyScalar(o.dress&&u<.25?1:1),{n:16,m:12,parent:g});
        sph(.055*H/1.7,STD({color:shoe,roughness:.5}),V(.05*H/1.7,U(.025),hz),[2,.7,1.1],g);});
      return {g,wv};};
    const a=fig(0,-.55,1.62,p.c,{f:1,shirt:"#c0392b",pants:"#c0392b",hair:"#2a1a10",dress:1,long:1,wave:1}),b=fig(.1,.55,1.76,"#8d5a3b",{shirt:"#2e86de",pants:"#2a2f3a",hair:"#120c08",wave:0});
    a.g.rotation.y=.25;b.g.rotation.y=-.2;X.anims.push(t=>{if(a.wv)a.wv.rotation.x=Math.sin(t*5)*.35;a.g.position.y=Math.max(0,Math.sin(t*2.5))*.01;b.g.rotation.y=-.2+Math.sin(t*.5)*.08;});X.ty=.92;return 1.75;};

  // ===== ワニ・カメレオン =====
  B.croc=function(p){const sm=!!p.small,g=new THREE.Group();X.root.add(g);const base=C(p.c),bel=C(sm?"#c8e070":"#c8c08a");
    if(sm){g.scale.setScalar(.5);g.position.y=1.25;const br=loft([V(-3.4,-.05,0),V(0,.02,0),V(3.4,-.08,0)],u=>[.1,.1],(c,u,a,q)=>c.set("#6b4a2b").multiplyScalar(.75+.4*vn(q.x*8,a*3,0)),{n:20,m:10,parent:g});}
    const spine=sm?[V(-1.4,.3,0),V(-.7,.42,0),V(.2,.5,0),V(1.0,.52,0),V(1.55,.5,0)]:[V(-2.7,.22,0),V(-1.5,.28,0),V(-.3,.4,0),V(.8,.42,0),V(1.6,.36,0),V(2.4,.27,0)];
    const prof=u=>{let ry,rz;if(u<.45){const k=u/.45;ry=.04+.3*Math.pow(k,1.2);rz=.04+.32*Math.pow(k,1.2);}else if(u<.72){ry=.34;rz=.46;}else if(u<.8){ry=.27;rz=.32;}else{const k=(u-.8)/.2;ry=.22-.15*k;rz=.3-.18*k;if(k>.95){ry*=.5;rz*=.5;}}if(sm){ry*=1.25;rz*=.75;}return [ry,rz];};
    loft(spine,prof,(c,u,a,q,ca)=>{c.copy(base).lerp(bel,ss(-.2,-.6,ca));c.multiplyScalar(.75+.4*vn(q.x*9,q.y*9,q.z*9));if(sm&&Math.sin(u*40)>.6)c.lerp(C("#f4e05a"),.35);if(!sm&&ca>.2&&Math.sin(u*90)>.4)c.multiplyScalar(.8);},
      {n:80,m:20,parent:g,rib:(u,a)=>1+(sm?.04:.14)*Math.pow(Math.max(0,Math.cos(a)),10)*(Math.sin(u*130)>0?1:.3)});
    if(sm&&p.curl){const cur=[];for(let i=0;i<=24;i++){const t=i/24,ang=t*Math.PI*2.4;const r=.42*(1-t*.75);cur.push(V(-1.4-r*Math.sin(ang)*.9,-.05+r*Math.cos(ang),0));}loft(cur,u=>[.05*(1-.7*u)+.012,.05*(1-.7*u)+.012],(c,u,a,q)=>c.copy(base).multiplyScalar(.85+.3*vn(q.x*20,q.y*20,0)),{n:40,m:8,parent:g});}
    const hx=spine[spine.length-1].x,hy=spine[spine.length-1].y;[-1,1].forEach(s=>eye(V(hx-(sm?.4:.75),hy+(sm?.18:.2),s*(sm?.2:.18)),sm?.1:.07,g,sm?"#3a2a08":"#c8a020"));
    if(!sm)for(let i=0;i<14;i++)[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.ConeGeometry(.018,.07,5),STD({color:"#f2ecd8"}));t.position.set(hx-.08-i*.06,hy-.06,s*(.08+i*.012));t.rotation.x=Math.PI;g.add(t);});
    const lg=(x,s,f)=>{const top=V(x,(sm?.42:.3),s*(sm?.18:.38)),kn=V(x+(f?.15:-.15),(sm?.2:.12),s*(sm?.38:.7)),ft=V(x+(f?.28:-.05),0,s*(sm?.42:.82));loft([top,kn,ft],u=>[.1*(1-.4*u)*(sm?.7:1),.1*(1-.4*u)*(sm?.7:1)],(c,u,a,q)=>c.copy(base).multiplyScalar(.8+.3*vn(q.x*12,q.y*12,q.z*12)),{n:12,m:10,parent:g});
      for(let k=-1;k<=1;k++){const t=loft([ft,ft.clone().add(V(Math.cos(k*.5)*(sm?.12:.18)*(f?1:-1)*-1+(f?.18:-.0),-.01,s*.06+k*.07))],u=>[.025,.025],c=>c.copy(base),{n:3,m:6,parent:g});}};
    const xs=sm?[.7,-.6]:[.75,-.75];lg(xs[0],1,1);lg(xs[0],-1,1);lg(xs[1],1,0);lg(xs[1],-1,0);
    X.anims.push(t=>{g.rotation.y=Math.sin(t*.4)*.12;});return sm?2.4:5.2;};
  // ===== チョウ =====
  B.insect=function(p){if(p.wtype!=="butterfly")return null;const g=new THREE.Group();X.root.add(g);g.position.y=1.6;const bc=C(p.c);
    loft([V(-.55,0,0),V(-.2,.02,0),V(.15,.03,0),V(.3,.04,0)],u=>{const r=u<.6?.06*Math.sin(Math.PI*(.08+.9*u/.6)*.5+.1):.07;return [r,r];},(c,u,a,q)=>c.copy(bc).multiplyScalar(.8+.4*vn(q.x*30,q.y*30,0)),{n:20,m:10,parent:g});
    sph(.075,STD({color:p.c}),V(.36,.05,0),[1,1,1],g);[-1,1].forEach(s=>{eye(V(.4,.08,s*.05),.025,g,"#101010");const an=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(.4,.1,s*.03),V(.6,.4,s*.12),V(.72,.62,s*.18)]),new THREE.LineBasicMaterial({color:"#222"}));g.add(an);sph(.025,STD({color:"#222"}),V(.72,.62,s*.18),[1,1,1],g);});
    const tex=(fore)=>{const c=document.createElement("canvas");c.width=c.height=256;const x=c.getContext("2d");x.fillStyle=p.wing;x.fillRect(0,0,256,256);x.strokeStyle="#151515";x.lineWidth=7;for(let i=0;i<7;i++){x.beginPath();x.moveTo(8,128);x.quadraticCurveTo(110,128+(i-3)*30,250,128+(i-3)*60);x.stroke();}
      x.lineWidth=30;x.strokeRect(0,0,256,256);x.fillStyle="#151515";x.fillRect(0,fore?0:200,256,56);x.fillStyle=fore?"#fff4c0":"#7ab0ff";for(let i=0;i<8;i++){x.beginPath();x.arc(30+i*30,fore?14:228,7,0,7);x.fill();}if(!fore){x.fillStyle="#e85a2a";x.beginPath();x.arc(40,190,14,0,7);x.fill();}return new THREE.CanvasTexture(c);};
    const mk=(pts,fore,s)=>{const sh=new THREE.Shape(pts.map(([a,b])=>V2(a,b)));const geo=new THREE.ShapeGeometry(sh,16);const ps=geo.attributes.position,uv=geo.attributes.uv;let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;for(let i=0;i<ps.count;i++){mnx=Math.min(mnx,ps.getX(i));mxx=Math.max(mxx,ps.getX(i));mny=Math.min(mny,ps.getY(i));mxy=Math.max(mxy,ps.getY(i));}
      for(let i=0;i<ps.count;i++){const x=ps.getX(i),y=ps.getY(i);uv.setXY(i,(y-mny)/(mxy-mny),(x-mnx)/(mxx-mnx));ps.setXYZ(i,y,Math.sin(x*1.2)*.04,s*x);}ps.needsUpdate=true;uv.needsUpdate=true;geo.computeVertexNormals();return new THREE.Mesh(geo,STD({map:tex(fore),side:THREE.DoubleSide,roughness:.8}));};
    const wings=[-1,1].map(s=>{const wg=new THREE.Group();wg.position.set(.05,.03,0);g.add(wg);wg.add(mk([[0,.25],[.5,.45],[1.05,.55],[1.15,.25],[.9,-.05],[.2,-.05]],true,s));wg.add(mk([[0,-.02],[.55,-.05],[.85,-.35],[.7,-.75],[.55,-1.05],[.4,-.75],[.1,-.45]],false,s));return [wg,s];});
    X.anims.push(t=>{const f=Math.sin(t*7);wings.forEach(([wg,s])=>wg.rotation.x=-s*(.15+f*.7));g.position.y=1.6+Math.sin(t*1.3)*.15-f*.03;g.rotation.y=Math.sin(t*.5)*.5;});X.ty=1.4;return 2.6;};
  // ===== ヒトデ =====
  B.starfish=function(p){const base=C(p.c);const g=new THREE.Group();X.root.add(g);g.position.y=.12;
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const d=V(Math.cos(a),0,Math.sin(a));const tipUp=.12;
      loft([d.clone().multiplyScalar(.05),d.clone().multiplyScalar(.6).add(V(0,.03,0)),d.clone().multiplyScalar(1.3).add(V(0,tipUp,0))],u=>{const r=.34*(1-.85*u)*Math.sqrt(Math.max(0,1-u*.985))+.004;return [r*.45,r];},
        (c,u,a2,q,ca)=>{c.copy(base).multiplyScalar(.8+.3*vn(q.x*10,q.y*10,q.z*10));const [f1]=wor(q.x*14,q.y*14,q.z*14);if(ca>.1&&f1<.22)c.lerp(C("#fff0d0"),.75);if(ca<-.3)c.multiplyScalar(.7);},{n:24,m:16,parent:g,rib:(u,a2)=>1+.06*Math.pow(Math.max(0,Math.cos(a2)),6)});}
    sph(.3,STD({color:base}),V(0,.06,0),[1,.4,1],g);X.anims.push(t=>{g.rotation.y=t*.08;});X.ty=.3;return 2.4;};
  function build(type,p,ctx){if(!B[type])return null;X=ctx;const n0=ctx.root.children.length,a0=ctx.anims.length;try{return B[type](p);}catch(e){console.warn("ORG3D",type,e);ctx.root.children.splice(n0);ctx.anims.length=a0;return null;}}
  return {build,has:t=>!!B[t]};
})();
