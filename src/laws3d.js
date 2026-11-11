/* ---------- 宇宙の法則：カードごとの小さな3D（1つのWebGLで順番に描いて各カードへ写す） ---------- */
window.L3D=(function(){
  if(typeof THREE==="undefined")return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c);
  const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:.1,...o});
  const B=(c,o=1)=>new THREE.MeshBasicMaterial({color:c,transparent:o<1,opacity:o});
  const RW=360,RH=220;let renderer=null;const items=[];let run=false;
  function R0(){if(renderer)return;renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(RW,RH);}
  function base(bg="#0a0f1f"){const s=new THREE.Scene();s.background=C(bg);s.add(new THREE.HemisphereLight("#fff","#334",.8));const d=new THREE.DirectionalLight("#fff",.8);d.position.set(3,5,4);s.add(d);return s;}
  const sph=(s,r,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),m);o.position.set(x,y,z);s.add(o);return o;};
  function label(txt,col="#fff",size=1){const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d");g.fillStyle=col;g.font="bold 64px 'Times New Roman',serif";g.textAlign="center";g.textBaseline="middle";g.fillText(txt,64,68);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));sp.scale.set(size,size,1);return sp;}
  function glowS(col,s){const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,col);r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,64,64);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));sp.scale.set(s,s,1);return sp;}
  function wave(s,col,len=6,amp=.4,k=3,axis="y"){const pts=[...Array(120)].map((_,i)=>V(-len/2+i/119*len,0,0));const g=new THREE.BufferGeometry().setFromPoints(pts);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:col}));s.add(l);
    return t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i);const v=Math.sin(x*k-t*4)*amp;axis==="y"?a.setY(i,v):a.setZ(i,v);}a.needsUpdate=true;};}
  function spring(s,col){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(1,0,0)]),new THREE.LineBasicMaterial({color:col}));s.add(l);
    return (a,b,t)=>{const pts=[];for(let k=0;k<=30;k++){const f=k/30;const p=a.clone().lerp(b,f);p.y+=Math.sin(f*Math.PI*6+t*8)*.12;p.z+=Math.cos(f*Math.PI*6+t*8)*.12;pts.push(p);}l.geometry.setFromPoints(pts);};}
  function grid(s,well){const g=new THREE.PlaneGeometry(8,8,32,32);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:"#4a7ad0",wireframe:true,transparent:true,opacity:.55}));m.rotation.x=-Math.PI/2;s.add(m);
    const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,-well/(1+(x*x+y*y)*.9));}a.needsUpdate=true;return m;}
  // ---- 場面 ----
  const SC={
    // 4つの力
    "force:0"(s,an){const cols=["#ff4a4a","#4aff6a","#4a7aff"],fl=["u","u","d"];const q=cols.map((c,i)=>{const m=sph(s,.32,M(c,{emissive:c,emissiveIntensity:.3}));m.add(label(fl[i],"#fff",.5));return m;});const sp=[0,1,2].map(()=>spring(s,"#f4d06a"));
      s.add(Object.assign(sph(s,1.5,new THREE.MeshBasicMaterial({color:"#f4b942",transparent:true,opacity:.07})),{}));an.push(t=>{q.forEach((m,i)=>m.position.set(Math.cos(t*.8+i*2.1)*.8,Math.sin(t*1.1+i*2.1)*.5,Math.sin(t*.8+i*2.1)*.8));sp.forEach((f,i)=>f(q[i].position,q[(i+1)%3].position,t));});return 4.2;},
    "force:1"(s,an){const p=sph(s,.4,M("#ff5a4a")),n=sph(s,.4,M("#4a7aff"));p.position.x=-1.6;n.position.x=1.6;p.add(label("+","#fff",.6));n.add(label("−","#fff",.6));
      for(let i=0;i<8;i++){const a=i/8*6.283;const c=new THREE.QuadraticBezierCurve3(V(-1.6,0,0),V(0,Math.cos(a)*1.6,Math.sin(a)*1.6),V(1.6,0,0));s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(30)),new THREE.LineBasicMaterial({color:"#f4d06a",transparent:true,opacity:.5})));}
      const w=wave(s,"#ffe07a",3,.25,6);an.push(t=>{w(t);});return 4.5;},
    "force:2"(s,an){const n=sph(s,.45,M("#b8c0cc"));const p=sph(s,.45,M("#ff5a4a"));const e=sph(s,.15,B("#7fb2ff"));const nu=sph(s,.1,B("#c9ffcf",.8));const w=sph(s,.25,M("#9fd86a",{emissive:"#9fd86a",emissiveIntensity:.5}));
      n.add(label("n","#222",.5));p.add(label("p","#fff",.5));an.push(t=>{const k=(t*.35)%1;n.visible=k<.35;p.visible=k>=.35;w.visible=k>.3&&k<.5;w.position.set((k-.3)*6,(k-.3)*3,0);
        e.visible=nu.visible=k>=.45;e.position.set((k-.45)*6,(k-.45)*4,0);nu.position.set((k-.45)*6,-(k-.45)*4,0);});return 4;},
    "force:3"(s,an){grid(s,1.6);const sun=sph(s,.6,B("#ffd27a"));sun.position.y=-1.2;const pl=sph(s,.2,M("#5a8ad0"));an.push(t=>{const r=2.4;pl.position.set(Math.cos(t*.8)*r,-.5,Math.sin(t*.8)*r);});s.children.forEach(o=>{});return 6;},
    // 公式
    "formula:0"(s,an){const a=sph(s,.6,M("#7fb2ff")),b=sph(s,.35,M("#d8c48a"));an.push(t=>{const d=2.2+Math.sin(t)*.8;a.position.x=-d/2;b.position.x=d/2;});return 5;},
    "formula:1"(s,an){const bx=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),M("#e8a46a"));s.add(bx);const ar=new THREE.ArrowHelper(V(1,0,0),V(-2,0,0),1.2,"#f4d06a");s.add(ar);an.push(t=>{const k=(t*.5)%2;bx.position.x=-.6+k*k*.8;ar.position.x=bx.position.x-1.7;});return 5;},
    "formula:2"(s,an){return SC["force:1"](s,an);},
    "formula:3"(s,an){const e=wave(s,"#ff6a6a",6,.6,2.5,"y"),b=wave(s,"#6a9aff",6,.6,2.5,"z");an.push(t=>{e(t);b(t);});const ax=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-3,0,0),V(3,0,0)]),new THREE.LineBasicMaterial({color:"#666"}));s.add(ax);return 5;},
    "formula:4"(s,an){const m=sph(s,.35,M("#c9ced6"));const g=glowS("#fff2c0",3);s.add(g);an.push(t=>{const k=(t*.4)%1;m.visible=k<.4;m.scale.setScalar(1-k*1.5);g.material.opacity=k<.4?0:1-(k-.4)/.6;g.scale.setScalar(.5+(k-.4)*8);});return 5;},
    "formula:5"(s,an){const w=wave(s,"#b48cff",5,.35,5);const env=t=>{};an.push(t=>w(t));const ph=glowS("#e6c8ff",1);s.add(ph);an.push(t=>ph.position.x=((t*1.2)%5)-2.5);return 4.5;},
    "formula:6"(s,an){const n=1500,p=new Float32Array(n*3);const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(p,3));s.add(new THREE.Points(g,new THREE.PointsMaterial({color:"#7ee0ff",size:.05})));
      an.push(t=>{const sx=.4+Math.sin(t)*.3,sp=.7-Math.sin(t)*.3;for(let i=0;i<n;i++){const u=Math.random(),v=Math.random();const r=Math.sqrt(-2*Math.log(u+1e-9));p[i*3]=r*Math.cos(6.283*v)*sx;p[i*3+1]=r*Math.sin(6.283*v)*.3;p[i*3+2]=(Math.random()-.5)*sp;}g.attributes.position.needsUpdate=true;});return 4;},
    "formula:7"(s,an){const g=new THREE.PlaneGeometry(6,4,40,24);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:"#6a9aff",side:THREE.DoubleSide,flatShading:true}));m.rotation.x=-Math.PI/2.4;s.add(m);
      an.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,Math.exp(-(x*x+y*y)*.25)*Math.cos(x*3-t*3)*.8);}a.needsUpdate=true;g.computeVertexNormals();});return 5;},
    "formula:8"(s,an){return SC["force:3"](s,an);},
    "formula:9"(s,an){const gs=[];for(let i=0;i<40;i++){const v=V(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(.3+Math.random()*.7);const g=glowS(i%3?"#cfe0ff":"#ffd8a0",.35);g.userData.v=v;s.add(g);gs.push(g);}
      an.push(t=>{const k=1+((t*.25)%1)*2.5;gs.forEach(g=>g.position.copy(g.userData.v).multiplyScalar(k*1.4));});return 5;},
    "formula:10"(s,an){const bx=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4,2.4,2.4)),new THREE.LineBasicMaterial({color:"#888"}));s.add(bx);const ps=[...Array(60)].map(()=>{const m=sph(s,.06,B("#f4b942"));m.userData={x:-1.8+Math.random()*.6,y:(Math.random()-.5)*2,z:(Math.random()-.5)*2,vx:Math.random()*2,vy:Math.random()-.5,vz:Math.random()-.5};return m;});
      an.push(t=>{const k=(t*.15)%1;ps.forEach(m=>{const u=m.userData;m.position.set(Math.max(-1.95,Math.min(1.95,u.x+u.vx*k*2.5)),u.y*(.4+k*.6),u.z*(.4+k*.6));});});return 5;},
    "formula:11"(s,an){const e=sph(s,.3,M("#7fb2ff")),p=sph(s,.3,M("#ff8a6a"));e.add(label("e⁻","#fff",.5));p.add(label("e⁺","#fff",.5));const g=glowS("#fff",2);s.add(g);
      an.push(t=>{const k=(t*.4)%1;e.position.x=-2+k*2;p.position.x=2-k*2;e.visible=p.visible=k<.95;g.material.opacity=k>.9?1:0;g.scale.setScalar(1+((t*.4)%1)*3);});return 5;},
    // 素粒子
    particle(s,an,id){const P=PARTICLES.find(x=>x[0]===id);const col=PCAT[P[2]][1];const m=sph(s,P[2]==="boson"||P[2]==="hypo"?.35:.55,M(col,{emissive:col,emissiveIntensity:.35,transparent:P[2]==="hypo",opacity:P[2]==="hypo"?.4:1}));m.add(label(id,"#fff",.9));
      const g=glowS(col,2.6);s.add(g);if(P[2]==="quark"){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.02,6,60),B(col,.5));ring.rotation.x=1.2;s.add(ring);const sat=["#ff4a4a","#4aff6a","#4a7aff"].map((c,i)=>{const o=sph(s,.08,B(c));o.userData.i=i;return o;});an.push(t=>sat.forEach(o=>{const a=t+o.userData.i*2.1;o.position.set(Math.cos(a),Math.sin(a)*.36,Math.sin(a)*.93);}));}
      if(P[2]==="boson"){const w=wave(s,col,4,.25,5);an.push(t=>w(t));}if(P[2]==="higgs"){const f=grid(s,0);f.position.y=-1;f.material.color=C("#c99cf2");an.push(t=>{f.position.y=-1+Math.sin(t*2)*.1;});}
      an.push(t=>{m.rotation.y=t;g.scale.setScalar(2.4+Math.sin(t*2)*.2);});return 3.6;},
    // 分子
    mol(s,an,id){const m=MOLS.find(x=>x[0]===id);const A=m[4];const cen=A.reduce((a,b)=>a.add(V(b[1],b[2],b[3])),V(0,0,0)).multiplyScalar(1/A.length);const ext=Math.max(...A.map(a=>V(a[1],a[2],a[3]).distanceTo(cen)))||1;
      const grp=new THREE.Group();s.add(grp);grp.scale.setScalar(Math.min(1.2,2.2/ext));A.forEach(([e,x,y,z])=>{const o=sph(grp,(ATOMR[e]||.8)*.5+.15,M(ATOMCOL[e]||"#ccc"));o.position.set(x-cen.x,y-cen.y,z-cen.z);});
      for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=V(A[i][1],A[i][2],A[i][3]).sub(cen),b=V(A[j][1],A[j][2],A[j][3]).sub(cen),d=a.distanceTo(b);const lim=id==="nacl"?2.9:id==="dna"?(A[i][0]==="P"&&A[j][0]==="P"?4.7:2.5):((ATOMR[A[i][0]]||.8)+(ATOMR[A[j][0]]||.8))*1.25;
        if(d<lim&&d>.3){const c=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,d,6),M("#c9ced6"));c.position.copy(a).add(b).multiplyScalar(.5);c.quaternion.setFromUnitVectors(V(0,1,0),b.clone().sub(a).normalize());grp.add(c);}}
      an.push(t=>{grp.rotation.y=t*.6;grp.rotation.x=Math.sin(t*.3)*.3;});return 4.2;},
    un(s,an,k){if(SC[k])return SC[k](s,an);
      const pts=(n,f,col,size=.05)=>{const p=[];for(let i=0;i<n;i++)p.push(...f(i));const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({color:col,size,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));s.add(o);return o;};
      if(k==="halo"){const d=pts(2500,i=>{const r=Math.pow(Math.random(),.7)*1.8,a=r*2.5+(i%2)*Math.PI+(Math.random()-.5)*.4;return [Math.cos(a)*r,(Math.random()-.5)*.1,Math.sin(a)*r];},"#ffe2b0",.04);const h=sph(s,2.6,new THREE.MeshBasicMaterial({color:"#7a5aff",transparent:true,opacity:.12,depthWrite:false}));an.push(t=>{d.rotation.y=t*.4;h.scale.setScalar(1+Math.sin(t)*.03);});return 6.5;}
      if(k==="expand2"){const a=SC["formula:9"](s,an);const r1=new THREE.Mesh(new THREE.TorusGeometry(1.8,.03,6,60),B("#ff6a6a"));const r2=new THREE.Mesh(new THREE.TorusGeometry(2.2,.03,6,60),B("#6ab0ff"));s.add(r1,r2);return a;}
      if(k==="expand")return SC["formula:9"](s,an);if(k==="pair")return SC["formula:11"](s,an);if(k==="cloud")return SC["formula:6"](s,an);if(k==="entropy")return SC["formula:10"](s,an);
      if(k==="foam"){const g=new THREE.IcosahedronGeometry(1.6,3),b=g.attributes.position.array.slice();s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:"#6a8aff",wireframe:true,transparent:true,opacity:.6})));
        an.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=b[i*3],y=b[i*3+1],z=b[i*3+2],f=1+.2*Math.sin(x*5+t*3)*Math.cos(y*4-t*2)*Math.sin(z*3+t*4);a.setXYZ(i,x*f,y*f,z*f);}a.needsUpdate=true;});return 5;}
      if(k==="bh"){sph(s,.7,B("#000000"));const r=new THREE.Mesh(new THREE.TorusGeometry(1.4,.25,8,64),B("#ffb070",.85));r.rotation.x=1.25;s.add(r);const g=glowS("#ffb070",3.5);s.add(g);const f=pts(300,()=>[0,0,0],"#ffd8a0",.06);const P=[...Array(300)].map(()=>[Math.random()*6.28,2.5+Math.random()*1.5]);
        an.push(t=>{r.rotation.z=t;const a=f.geometry.attributes.position;P.forEach(([o,r0],i)=>{const k2=((t*.2+i/300)%1),rr=r0*(1-k2)+.7*k2,ang=o+k2*8;a.setXYZ(i,Math.cos(ang)*rr,(Math.random()-.5)*.05,Math.sin(ang)*rr);});a.needsUpdate=true;});return 5.5;}
      if(k==="neutrino"){const e=sph(s,1.1,M("#3d7fd0"));const n=pts(40,()=>[0,0,0],"#c9ffcf",.12);const D=[...Array(40)].map(()=>[Math.random()*2-1,Math.random()*2-1,Math.random()*6]);an.push(t=>{const a=n.geometry.attributes.position;D.forEach(([y,z,o],i)=>a.setXYZ(i,((t*2+o)%6)-3,y*.9,z*.9));a.needsUpdate=true;});return 5;}
      if(k==="fine"){const dials=[...Array(5)].map((_,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.35,.04,6,40),B("#8e98b5"));r.position.x=(i-2)*.9;s.add(r);const nd=new THREE.Mesh(new THREE.BoxGeometry(.04,.32,.04),B("#f4b942"));nd.position.copy(r.position);s.add(nd);return nd;});an.push(t=>dials.forEach((d,i)=>{d.rotation.z=Math.sin(t*(.6+i*.2))*.15+i;}));return 4.5;}
      if(k==="proton")return SC["force:0"](s,an);
      if(k==="earthcut"){// 地球の断面（3/4の球＋切り口の層）
        const R=1.6,g=new THREE.Group();s.add(g);const tl=(txt,col)=>{const c=document.createElement("canvas");c.width=256;c.height=64;const x=c.getContext("2d");x.font="bold 30px sans-serif";x.textAlign="center";x.textBaseline="middle";x.lineWidth=6;x.strokeStyle="#000a";x.strokeText(txt,128,34);x.fillStyle=col;x.fillText(txt,128,34);
          const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));sp.scale.set(1.3,.325,1);return sp;};
        const cv=document.createElement("canvas");cv.width=1024;cv.height=512;const x=cv.getContext("2d");const gr=x.createLinearGradient(0,0,0,512);gr.addColorStop(0,"#1d3f73");gr.addColorStop(.5,"#2463a8");gr.addColorStop(1,"#1d3f73");x.fillStyle=gr;x.fillRect(0,0,1024,512);
        if(typeof EARTHPATH!=="undefined"){x.fillStyle="#5d8a45";x.fill(new Path2D(EARTHPATH));}x.fillStyle="#eef4fa";x.fillRect(0,0,1024,20);x.fillRect(0,474,1024,38);
        const sg=new THREE.SphereGeometry(R,64,32,0,Math.PI*1.5);const uv=sg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*.75);
        g.add(new THREE.Mesh(sg,new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.8})));
        const LY=[[1,.955,"#8b6b4a","地殻"],[.955,.896,"#d9703f","上部マントル"],[.896,.546,"#b44a2c","下部マントル"],[.546,.19,"#f5a03a","外核（液体）"],[.19,0,"#fff1a8","内核（固体）"]];
        [0,-Math.PI/2].forEach((ry,j)=>LY.forEach(([a,b,c])=>{const m=new THREE.Mesh(new THREE.RingGeometry(R*b,R*a,64,1,Math.PI/2,Math.PI),new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide,roughness:.7,emissive:c,emissiveIntensity:c==="#fff1a8"||c==="#f5a03a"?.45:.12}));m.rotation.y=ry;g.add(m);}));
        const AL=[64,40,14,-62];LY.forEach(([a,b,c,n],i)=>{const sp=tl(n,"#fff");if(i<4){const r=R*(a+b)/2,al=AL[i]*Math.PI/180;sp.position.set(-r*Math.cos(al),r*Math.sin(al),.05);}else sp.position.set(.02,.12,-.28);g.add(sp);});
        const gl=glowS("rgba(127,178,255,.55)",4.4);s.add(gl);g.rotation.y=Math.PI*.75;an.push(t=>{g.rotation.y=Math.PI*.75+Math.sin(t*.35)*.45;});return 5.4;}
      if(k==="cell"){sph(s,1.6,new THREE.MeshStandardMaterial({color:"#9fe8a0",transparent:true,opacity:.25,depthWrite:false}));const m=pts(200,()=>{const a=Math.random()*6.28,u=Math.random()*2-1,r=Math.random()*1.3;return [Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r];},"#ffd27a",.08);an.push(t=>m.rotation.y=t*.5);return 5;}
      if(k==="planet"){const p=sph(s,.9,M("#c96a3a"));const r=new THREE.Mesh(new THREE.RingGeometry(1.2,1.8,48),new THREE.MeshBasicMaterial({color:"#d8c48a",side:THREE.DoubleSide,transparent:true,opacity:.6}));r.rotation.x=1.2;s.add(r);pts(400,()=>[(Math.random()-.5)*12,(Math.random()-.5)*8,-4-Math.random()*4],"#ffffff",.05);an.push(t=>p.rotation.y=t*.4);return 5;}
      if(k==="neurons"){const N=[...Array(26)].map(()=>{const o=sph(s,.08,B("#f4b0d0"));o.position.set((Math.random()-.5)*4,(Math.random()-.5)*2.4,(Math.random()-.5)*2);return o;});const E=[];N.forEach((a,i)=>N.forEach((b,j)=>{if(j>i&&a.position.distanceTo(b.position)<1.3){s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.position,b.position]),new THREE.LineBasicMaterial({color:"#7a5a8a"})));E.push([a,b]);}}));
        const sp=E.slice(0,8).map(()=>sph(s,.06,B("#7ee0ff")));an.push(t=>sp.forEach((o,i)=>{const [a,b]=E[(i*3+Math.floor(t))%E.length];o.position.copy(a.position).lerp(b.position,t%1);}));return 5;}
      if(k==="graph"){const N=[...Array(12)].map((_,i)=>{const o=sph(s,.12,M("#7fb2ff"));const a=i/12*6.283;o.position.set(Math.cos(a)*1.8,Math.sin(a*2)*.4,Math.sin(a)*1.8);return o;});N.forEach((a,i)=>N.forEach((b,j)=>{if(j>i&&(j-i)%4===1||(j-i)===5)s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.position,b.position]),new THREE.LineBasicMaterial({color:"#4a5a8a"})));}));
        an.push(t=>N.forEach((o,i)=>o.material.color.set(i===Math.floor(t*2)%12?"#f4b942":"#7fb2ff")));return 5.5;}
      if(k==="spiral"){const c=[];for(let i=0;i<400;i++){const tt=i*.06;c.push(V(Math.cos(tt*3)*tt*.12,tt*.06-1.2,Math.sin(tt*3)*tt*.12));}s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c),new THREE.LineBasicMaterial({color:"#b48cff"})));
        const z=[14.1,21.0,25.0,30.4,32.9,37.6,40.9,43.3,48.0,49.8];z.forEach(v=>sph(s,.07,B("#f4b942"),0,v*.06-1.6,0));s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,-1.8,0),V(0,1.8,0)]),new THREE.LineBasicMaterial({color:"#f4b942"})));an.push(t=>{});return 5;}
      if(k==="flow"){const P=pts(1500,()=>{const r=.3+Math.random()*2,a=Math.random()*6.28;return [Math.cos(a)*r,(Math.random()-.5)*.6,Math.sin(a)*r];},"#7ee0ff",.04);an.push(t=>{P.rotation.y=-t*.6;P.rotation.x=Math.sin(t*.4)*.3;});return 5;}
      if(k==="torus"){const m=new THREE.Mesh(new THREE.TorusKnotGeometry(1,.3,120,16),M("#c99cf2",{flatShading:true}));s.add(m);an.push(t=>{m.rotation.y=t*.5;m.rotation.x=t*.3;});return 5;}
      if(k==="collatz"){let n=27;const seq=[n];while(n!==1){n=n%2?3*n+1:n/2;seq.push(n);}const mx=Math.max(...seq);const c=seq.map((v,i)=>V(i/seq.length*5-2.5,Math.log(v)/Math.log(mx)*2.4-1.2,0));s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c),new THREE.LineBasicMaterial({color:"#f4b942"})));
        const b=sph(s,.08,B("#fff"));an.push(t=>{const i=Math.floor((t*20)%seq.length);b.position.copy(c[i]);});return 5.5;}
      return SC["formula:6"](s,an);},
    // 原子（詳細パネル用）
    atom(s,an,Z){Z=+Z;const el=ELEMENTS[Z-1];const N=Math.max(0,Math.round(parseFloat(String(el.m).replace(/[\[\]]/g,"")))-Z);const A=Math.min(Z+N,120);const Rr=.08*Math.cbrt(A);
      for(let i=0;i<A;i++){const u=1-2*(i+.5)/A,a=i*2.399,rr=Rr*Math.cbrt((i+.5)/A);sph(s,.075,M(i%2?"#b8c0cc":"#ff5a4a"),Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr,Math.sin(a)*Math.sqrt(1-u*u)*rr);}
      const ord=[[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]];const sh=[0,0,0,0,0,0,0];let e=Z;for(const[n,c]of ord){const k=Math.min(c,e);sh[n-1]+=k;e-=k;if(!e)break;}
      sh.filter(x=>x).forEach((n,k)=>{const r=.7+k*.45;const tilt=new THREE.Group();tilt.rotation.set(k*.7,k*1.3,0);s.add(tilt);const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.008,4,80),B("#7fb2ff",.4));ring.rotation.x=Math.PI/2;tilt.add(ring);
        for(let i=0;i<n;i++){const o=sph(tilt,.045,B("#9fe8ff"));const ph=i/n*6.283,sp=1.4/(k+1);an.push(t=>{const a=ph+t*sp;o.position.set(Math.cos(a)*r,0,Math.sin(a)*r);});}});return 2.5+sh.filter(x=>x).length*.9;},
  };
  // ---- 登録と描画 ----
  const io=new IntersectionObserver(es=>es.forEach(e=>{const it=items.find(x=>x.cv===e.target);if(it)it.vis=e.isIntersecting;}),{rootMargin:"100px"});
  function add(cv){if(cv._l3d)return;cv._l3d=1;const [k,id]=cv.dataset.k.split("|");const hi=+cv.dataset.hi||1;const it={cv,k,id,vis:false,sc:null,an:[],dist:5,last:0,th:Math.random()*6,W:RW*hi,H:RH*hi};items.push(it);io.observe(cv);if(!run){run=true;requestAnimationFrame(loop);}}
  function scan(root){(root||document).querySelectorAll("canvas[data-k]").forEach(add);}
  function build(it){R0();it.sc=base();it.an=[];const f=SC[it.k]||SC[it.k.split(":")[0]];try{it.dist=f(it.sc,it.an,it.id)||5;}catch(e){console.error(e);}}
  let t0=performance.now();
  let rr=0,curW=RW;
  function loop(now){requestAnimationFrame(loop);const t=(now-t0)/1000;let n=0;const L=items.length;
    for(let q=0;q<L&&n<5;q++){const it=items[(rr+q)%L];if(!it.vis||!it.cv.isConnected||it.cv.offsetParent===null)continue;if(now-it.last<70)continue;n++;it.last=now;rr=(items.indexOf(it)+1)%L;if(!it.sc)build(it);
      it.an.forEach(f=>f(t));const cam=it.cam||(it.cam=new THREE.PerspectiveCamera(40,RW/RH,.1,100));const a=it.th+t*.2;cam.position.set(Math.sin(a)*it.dist*.25,it.dist*.35,it.dist);cam.lookAt(0,0,0);
      if(curW!==it.W){renderer.setSize(it.W,it.H);curW=it.W;}renderer.render(it.sc,cam);const g=it.cv.getContext("2d");if(it.cv.width!==it.W){it.cv.width=it.W;it.cv.height=it.H;}g.drawImage(renderer.domElement,0,0);}}
  return {scan};
})();
