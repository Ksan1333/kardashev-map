/* ---------- ⑦ ミクロの世界（生き物→細胞→微生物→ウイルス→分子→原子→原子核→クオーク） ---------- */
const MICRO=(function(){
  const host=document.getElementById("mcscene");if(!host||typeof THREE==="undefined")return null;
  const info=document.getElementById("mcinfo"),lvBox=document.getElementById("mclevels"),list=document.getElementById("mclist"),fade=document.getElementById("mcfade");
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c);
  const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,metalness:.05,...o});
  const G=(c,o=.35)=>new THREE.MeshStandardMaterial({color:c,roughness:.2,metalness:.1,transparent:true,opacity:o,depthWrite:false,side:THREE.DoubleSide});
  let seed=3;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
__MICROX__
  const LEVELS=[
   {id:"life",name:"生き物",scale:"約1cm〜30m",desc:"地球の生き物は、名前がついているだけで約200万種。まだ知られていない種を含めると数百万〜1億種ともいわれる。",dist:9,items:()=>ORGS.map(o=>({id:o[0],name:o[1],sub:o[2]}))},
   {id:"cell",name:"細胞",scale:"約1〜100μm",desc:"生き物の体を作る単位。大きさは髪の毛の太さ（約80μm）の数分の1ほど。",dist:9,items:()=>MICROS.filter(m=>m[2]==="細胞").map(m=>({id:m[0],name:m[1],sub:m[3]}))},
   {id:"microbe",name:"微生物",scale:"約1μm〜1mm",desc:"顕微鏡でないと見えない生き物。地球の生物の重さの多くを細菌が占めるともいわれる。",dist:9,items:()=>MICROS.filter(m=>["細菌","菌類","原生生物","原生生物（藻類）","動物（緩歩動物）"].includes(m[2])).map(m=>({id:m[0],name:m[1],sub:m[3]}))},
   {id:"virus",name:"ウイルス",scale:"約20〜300nm",desc:"細胞を持たず、ほかの生き物の細胞の中でしか増えられない。生物か非生物か、意見が分かれる。",dist:9,items:()=>MICROS.filter(m=>m[2]==="ウイルス").map(m=>({id:m[0],name:m[1],sub:m[3]}))},
   {id:"mol",name:"分子",scale:"約0.1〜10nm",desc:"原子が結びついたもの。色：白＝水素、灰＝炭素、青＝窒素、赤＝酸素。",dist:12,items:()=>MOLS.map(m=>({id:m[0],name:m[1],sub:m[2]}))},
   {id:"atom",name:"原子",scale:"約0.1nm（1000万分の1mm）",desc:"中心の原子核のまわりを電子が取り巻く。原子核は原子全体の約10万分の1の大きさしかない（ここでは見やすく拡大）。実際の電子は決まった軌道ではなく「確率の雲」として存在する。",dist:14,items:()=>ELEMENTS.slice(0,54).map(e=>({id:String(e.Z),name:e.Z+" "+e.ja,sub:e.sym}))},
   {id:"nucleus",name:"原子核",scale:"約1〜15fm（1兆分の1mm）",desc:"陽子（赤）と中性子（灰）が強い力で固まったもの。陽子どうしは電気で反発するが、強い力がそれに勝つ。",dist:14,items:()=>ELEMENTS.filter(e=>[1,2,6,8,26,79,92,118].includes(e.Z)).map(e=>({id:String(e.Z),name:e.ja,sub:e.sym}))},
   {id:"quark",name:"陽子とクオーク",scale:"約0.8fm",desc:"陽子と中性子はそれぞれ3つのクオークでできている。クオークどうしはグルーオンでつながれ、単独では取り出せない（閉じ込め）。色は「色荷」という性質の表現で、実際の色ではない。",dist:7,items:()=>[{id:"p",name:"陽子（uud）",sub:"+1"},{id:"n",name:"中性子（udd）",sub:"0"}]},
   {id:"particle",name:"素粒子",scale:"大きさが見つかっていない「点」（10⁻¹⁸m未満）",desc:"これ以上分けられないと考えられている粒子。場の理論では、素粒子は宇宙全体に広がる「場」のさざ波（励起）として表される。ここでは場を点の格子で、粒子をその波として描いています。",dist:8,items:()=>PARTICLES.map(p=>({id:p[0],name:p[1],sub:PCAT[p[2]][0]}))},
   {id:"quantum",name:"量子の世界",scale:"原子の中〜プランク長（1.6×10⁻³⁵m）",desc:"ミクロの世界では、粒子は波のようにふるまい、位置は確率でしか決まらない。いちばん小さなスケール（プランク長）では、時空そのものが揺らいでいると考えられている（仮説）。",dist:8,items:()=>[{id:"o1s",name:"電子の雲（1s軌道）",sub:"水素原子"},{id:"o2p",name:"電子の雲（2p軌道）",sub:"ダンベル形"},{id:"o3d",name:"電子の雲（3d軌道）",sub:"四つ葉形"},{id:"slit",name:"二重スリット実験",sub:"粒子なのに干渉する"},{id:"ent",name:"量子もつれ",sub:"離れても相関する"},{id:"vac",name:"真空のゆらぎ",sub:"粒子が生まれては消える"},{id:"foam",name:"時空の泡（プランク長）",sub:"仮説"}]},
   {id:"string",name:"超ひも理論（仮説）",scale:"プランク長（約10⁻³⁵m）",desc:"すべての素粒子は「点」ではなく、とても小さな振動する「ひも」だという仮説。ひもの振動のしかた（音の高さのようなもの）の違いが、電子・クオーク・光子・重力子などの違いになる。理論が成り立つには空間が9次元（時間を合わせて10次元、M理論では11次元）必要で、余分な次元は小さく丸まっていると考える。実験的な証拠はまだない。",dist:8,items:()=>[{id:"modes",name:"ひもの振動と粒子",sub:"振動の違い＝粒子の違い"},{id:"openclosed",name:"開いたひも・閉じたひも",sub:"端があるか輪か"},{id:"brane",name:"ブレーン（膜）と重力",sub:"なぜ重力だけ弱い？"},{id:"cy",name:"余剰次元（カラビ–ヤウ空間）",sub:"丸まった6次元"},{id:"compact",name:"次元が丸まるとは",sub:"ホースのたとえ"},{id:"m",name:"M理論と11次元",sub:"5つの理論をつなぐ"}]},
   {id:"dims",name:"次元（1〜11次元）",scale:"線（1次元）〜M理論（11次元）",desc:"次元とは「独立に動ける方向の数」。1〜3次元は空間、4次元目は時間。5次元目より先は、超ひも理論・M理論が考える「小さく丸まった余剰次元」で、まだ実験で確かめられていない仮説。",dist:9,items:()=>[["d1","1次元：線","前と後ろだけ"],["d2","2次元：面","平面の世界"],["d3","3次元：空間","たて・よこ・奥行き"],["d4","4次元：時間","時空・世界線・光円錐"],["d5","5次元","丸まった次元（カルツァ＝クライン）"],["d6","6次元","小さなドーナツ面"],["d7","7次元","出ると反対側から戻る箱"],["d8","8次元","超立方体の影"],["d9","9次元","5次元立方体の影"],["d10","10次元","超ひも理論・カラビ–ヤウ空間"],["d11","11次元","M理論・膜の宇宙"]].map(([id,name,sub])=>({id,name,sub}))},
  ];
  {const at=(id,after)=>{const i=LEVELS.findIndex(L=>L.id===after);LEVELS.splice(i+1,0,XLV.find(x=>x.id===id));};
   at("body","life");at("inc","cell");at("biomol","virus");at("matter","mol");at("planck","quantum");at("bit","planck");at("bottom","bit");
   const LN={life:"main",cell:"main",microbe:"org",virus:"org",mol:"main",atom:"main",nucleus:"main",quark:"main",particle:"main",quantum:"main",string:"th",dims:"th"};LEVELS.forEach(L=>{if(!L.ln)L.ln=LN[L.id];});}
  const MAINS=LEVELS.filter(L=>L.ln==="main").map(L=>L.id),DEEP=LEVELS.filter(L=>L.ln==="deep").map(L=>L.id);
  const LANEN={org:"微生物・ウイルス",inc:"細胞の中",th:"理論（仮説）",deep:"プランク長より下（仮説→空想）"};
  const lvNo=L=>{const m=MAINS.indexOf(L.id);if(m>=0)return `本線 ${m+1} / ${MAINS.length}`;const d=DEEP.indexOf(L.id);if(d>=0)return `本線の先 ${MAINS.length+d+1}（${LANEN.deep}）`;return `分岐：${LANEN[L.ln]||""}`;};
  const DEFIN={life:"body",body:"cell",cell:"biomol",inc:"biomol",microbe:"virus",virus:"biomol",biomol:"mol",mol:"matter",matter:"atom",atom:"nucleus",nucleus:"quark",quark:"particle",particle:"quantum",quantum:"planck",planck:"bit",bit:"bottom",string:"dims",dims:"planck"};
  const DEFOUT={body:"life",cell:"body",inc:"cell",microbe:"cell",virus:"microbe",biomol:"cell",mol:"biomol",matter:"mol",atom:"matter",nucleus:"atom",quark:"nucleus",particle:"quark",quantum:"particle",planck:"quantum",bit:"planck",bottom:"bit",string:"quantum",dims:"string"};
  const back={};const lvI=id=>LEVELS.findIndex(L=>L.id===id);
  function zin(){const L=LEVELS[LV];if(L.id==="bottom"){window.dispatchEvent(new CustomEvent("micro-loop"));return;}const t=INTO(L.id,cur)||[DEFIN[L.id],null];const i=lvI(t[0]);if(i<0)return;back[t[0]]={lv:LV,item:cur};go(i,t[1],"in");}
  function zout(){const L=LEVELS[LV];const b=back[L.id];if(b){delete back[L.id];go(b.lv,b.item,"out");return;}const o=DEFOUT[L.id];if(o){go(lvI(o),null,"out");return;}if(window.toMapFromMicro)window.toMapFromMicro();}
  let renderer,scene,camera,root,anims=[],running=false,t0=performance.now(),last=0,LV=0,cur=null,inited=false;
  const cam={th:.6,ph:1.15,r:9,goal:9,drag:null,auto:true};
  let keyL=null;function init(){if(inited)return;inited=true;renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.prepend(renderer.domElement);
    camera=new THREE.PerspectiveCamera(42,1,.01,500);resize();new ResizeObserver(resize).observe(host);
    host.addEventListener("pointerdown",e=>{cam.drag={x:e.clientX,y:e.clientY};cam.auto=false;host.setPointerCapture(e.pointerId);});
    host.addEventListener("pointermove",e=>{if(!cam.drag)return;cam.th-=(e.clientX-cam.drag.x)*.006;cam.ph=Math.max(.2,Math.min(2.9,cam.ph-(e.clientY-cam.drag.y)*.006));cam.drag={x:e.clientX,y:e.clientY};});
    host.addEventListener("pointerup",()=>{cam.drag=null;});
    let acc=0;host.addEventListener("wheel",e=>{e.preventDefault();const f=Math.exp(e.deltaY*.0012);const L=LEVELS[LV],mn=L.dist*.35,mx=L.dist*2.4;
      const g=cam.goal*f;if(g<mn&&f<1){acc+=1-f;if(acc>.5){acc=0;zin();}cam.goal=mn;return;}
      if(g>mx&&f>1){acc+=f-1;if(acc>.5){acc=0;zout();}cam.goal=mx;return;}acc=0;cam.goal=g;},{passive:false});
    drawNav();
    list.addEventListener("click",e=>{const b=e.target.closest("button[data-it]");if(b)build(b.dataset.it);});
    document.getElementById("mc-in").onclick=zin;
    document.getElementById("mc-out").onclick=zout;}
  function resize(){if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;if(!w)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const MSHORT={life:"生き物",cell:"細胞",microbe:"微生物",virus:"ウイルス",mol:"分子",atom:"原子",nucleus:"原子核",quark:"クオーク",particle:"素粒子",quantum:"量子",string:"超ひも",dims:"次元"};
  function drawNav(){if(!window.GITNAV)return;const SH={...MSHORT,body:"体と器官",inc:"細胞の中",biomol:"生体分子",matter:"物質",planck:"プランク長",bit:"情報",bottom:"描けない底"};
    const nodes=[];MAINS.forEach((id,i)=>nodes.push({id,lane:"main",label:SH[id],num:i+1,col:i}));DEEP.forEach((id,i)=>nodes.push({id,lane:"deep",label:SH[id],num:MAINS.length+i+1,col:MAINS.length+i,fic:1}));
    const col=id=>MAINS.indexOf(id);nodes.push({id:"inc",lane:"inc",label:SH.inc,col:col("cell")+.8});nodes.push({id:"microbe",lane:"org",label:SH.microbe,col:col("cell")+.8},{id:"virus",lane:"org",label:SH.virus,col:col("cell")+1.7});
    nodes.push({id:"string",lane:"th",label:SH.string,col:col("quantum")+.8,fic:1},{id:"dims",lane:"th",label:SH.dims,col:col("quantum")+1.7,fic:1});
    GITNAV.render(lvBox,{cw:74,lanes:[{id:"main",name:"本線",color:"#7ee0b0"},{id:"deep",name:"プランク長より下（仮説→空想）",color:"#c99cf2",from:"quantum",dash:1,inline:1},{id:"inc",name:"細胞の中",color:"#ff9ad0",from:"cell",merge:"biomol"},{id:"org",name:"微生物・ウイルス",color:"#ffb36a",from:"cell",merge:"biomol"},{id:"th",name:"理論（仮説）",color:"#c99cf2",from:"quantum",dash:1}],nodes},
      LEVELS[LV]&&LEVELS[LV].id,id=>{const i=LEVELS.findIndex(L=>L.id===id);if(i>=0)go(i);});}
  let goTok=0;function go(i,item,dir){LV=i;const L=LEVELS[i];fade.classList.add("on");const tok=++goTok;
    setTimeout(()=>{if(tok!==goTok)return;drawNav();
      const its=L.items();list.innerHTML=its.map(x=>`<button data-it="${x.id}"><b>${x.name}</b><small>${x.sub||""}</small></button>`).join("");
      build(item||its[0].id,dir);fade.classList.remove("on");},inited?200:0);}
  function setup(bg){if(scene)scene.traverse(o=>{o.geometry&&o.geometry.dispose();});scene=new THREE.Scene();scene.background=C(bg);root=new THREE.Group();scene.add(root);anims=[];
    scene.add(new THREE.HemisphereLight("#ffffff","#334",.7));const d=keyL=new THREE.DirectionalLight("#fff",.9);d.position.set(5,8,6);scene.add(d);const d2=new THREE.DirectionalLight("#9fc8ff",.35);d2.position.set(-6,-2,-4);scene.add(d2);}
  const add=(m,x=0,y=0,z=0,p=root)=>{m.position.set(x,y,z);p.add(m);return m;};
  const sph=(r,mat,x,y,z,sx=1,sy=1,sz=1,p)=>{const m=add(new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat),x,y,z,p);m.scale.set(sx,sy,sz);return m;};
  const cyl=(r1,r2,h,mat,x,y,z,p,seg=12)=>add(new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),mat),x,y,z,p);
  const tube=(pts,r,mat,p=root,seg=24)=>{const c=new THREE.CatmullRomCurve3(pts);const m=new THREE.Mesh(new THREE.TubeGeometry(c,seg,r,8,false),mat);p.add(m);return m;};
  const limb=(a,b,r,mat,p=root)=>{const d=b.clone().sub(a),l=d.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.85,l,10),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());p.add(m);return m;};
  function ground(c="#2a3a2a",r=6){const g=new THREE.Mesh(new THREE.CircleGeometry(r,48),M(c,{roughness:1}));g.rotation.x=-Math.PI/2;root.add(g);}
  // ---- 生き物 ----
  const B={
    quad(p){const L=p.h*1.25,bh=p.leg+p.h*.35,col=M(p.c),dark=M(p.patch||p.mane||"#2a2018");
      const body=sph(p.h*.42,col,0,bh,0,L/p.h*1.05,p.round?1:.8,.75);
      if(p.spots){for(let i=0;i<40;i++){const a=R()*6.28,b=(R()-.5)*1.4;const s=sph(.09*p.h,M(p.spots),Math.cos(a)*.3*L,bh+Math.sin(b)*.3*p.h,Math.sin(a)*.3*p.h,1,1,.3);s.lookAt(0,bh,0);}}
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([x,z])=>limb(V(x*L*.32,bh-.1,z*p.h*.2),V(x*L*.32,0,z*p.h*.2),p.h*.09,p.patch?dark:col));
      const nk=V(L*.45,bh+p.h*.15,0),hd=nk.clone().add(V(p.h*.15+p.neck*.35,p.neck,0));if(p.neck>.3)limb(nk,hd,p.h*.13*(p.neck>2?.6:1),col);
      const head=sph(p.h*.2*(p.neck>2?.8:1),p.patch?col:col,hd.x+p.h*.12,hd.y,0,1.3,1,1);
      if(p.mane)sph(p.h*.3,M(p.mane),nk.x+p.h*.05,nk.y+p.neck*.4,0,.8,1.1,1.1);
      if(p.patch){[-1,1].forEach(s=>{sph(p.h*.07,dark,hd.x+p.h*.05,hd.y+p.h*.18,s*p.h*.12);sph(p.h*.05,dark,hd.x+p.h*.27,hd.y+.03,s*p.h*.08,1,1.3,.6);});}
      if(p.ears)[-1,1].forEach(s=>{const e=sph(p.h*.25*p.ears,col,hd.x,hd.y+.05,s*p.h*.2,.25,1,1);});
      if(p.trunk)tube([V(hd.x+p.h*.3,hd.y,0),V(hd.x+p.h*.45,hd.y-p.h*.4,0),V(hd.x+p.h*.4,hd.y-p.h*.9,0),V(hd.x+p.h*.55,hd.y-p.h*1.05,0)],p.h*.06,col);
      if(p.tusk)[-1,1].forEach(s=>tube([V(hd.x+p.h*.25,hd.y-p.h*.15,s*.18),V(hd.x+p.h*.5,hd.y-p.h*.35,s*.22),V(hd.x+p.h*.7,hd.y-p.h*.2,s*.2)],p.h*.03,M("#f4efe2")));
      if(p.horn)[-1,1].forEach(s=>cyl(.04,.05,.25,col,hd.x,hd.y+p.h*.25,s*.08));
      if(p.tail)tube([V(-L*.48,bh+.1,0),V(-L*.6,bh-.2,0),V(-L*.62,bh-p.h*.5,0)],p.h*.03,col);
      [-1,1].forEach(s=>sph(p.h*.025,M("#111"),hd.x+p.h*.25,hd.y+p.h*.07,s*p.h*.09));
      anims.push(t=>{body.position.y=bh+Math.sin(t*2)*.01;head.rotation.z=Math.sin(t*.8)*.08;});return Math.max(L,p.h+p.leg+p.neck);},
    whale(p){const l=p.l,col=M(p.c);const g=new THREE.Group();root.add(g);g.position.y=1;
      const b=sph(l*.12,col,0,0,0,4,1,1.1,g);sph(l*.11,M("#d8dde6"),l*.05,-l*.03,0,3.3,.6,1,g);
      const fl=new THREE.Mesh(new THREE.BoxGeometry(l*.06,l*.01,l*.35),col);fl.position.x=-l*.5;g.add(fl);
      [-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.BoxGeometry(l*.12,l*.01,l*.05),col);f.position.set(l*.15,-l*.06,s*l*.12);f.rotation.y=s*.5;g.add(f);});
      if(p.fin){const f=new THREE.Mesh(new THREE.ConeGeometry(l*.05,l*.1,4),col);f.position.set(-l*.05,l*.12,0);f.rotation.z=-.5;g.add(f);}
      if(p.beak)sph(l*.04,col,l*.5,-l*.02,0,2,.7,.8,g);
      anims.push(t=>{g.rotation.z=Math.sin(t)*.06;fl.rotation.z=Math.sin(t*2)*.3;g.position.y=1+Math.sin(t)*.1;});return l;},
    bat(p){const col=M(p.c),w=new THREE.MeshStandardMaterial({color:"#4a3030",side:THREE.DoubleSide,roughness:.8});sph(.25,col,0,1.5,0,1.4,1,1);sph(.15,col,.35,1.6,0);
      [-1,1].forEach(s=>{sph(.06,col,.35,1.78,s*.07,1,1.6,1);});const wings=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(0,1.55,0);root.add(g);
        const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(.5,1.3*s);sh.lineTo(-.1,1.5*s);sh.lineTo(-.5,1.1*s);sh.lineTo(-.4,.2*s);sh.lineTo(0,0);const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),w);m.rotation.x=Math.PI/2;g.add(m);return [g,s];});
      anims.push(t=>wings.forEach(([g,s])=>g.rotation.x=Math.sin(t*8)*.6*s));return 3;},
    bird(p){const col=M(p.c),wc=M(p.c);const lh=p.legs||.5,by=lh+.4;const body=sph(.4,col,0,by,0,1.6,.9,.9);
      const nk=p.neck?tube([V(.5,by+.1,0),V(.7,by+.9,0),V(.45,by+1.3,0),V(.7,by+1.5,0)],.08,col):null;const hy=p.neck?by+1.5:by+.35,hx=p.neck?.75:.7;
      sph(.2,M(p.head),hx,hy,0);const bk=new THREE.Mesh(new THREE.ConeGeometry(.07,.3,8),M(p.beak));bk.rotation.z=-Math.PI/2+(p.neck?.6:0);add(bk,hx+.25,hy-.03,0);
      [-1,1].forEach(s=>sph(.03,M("#111"),hx+.1,hy+.06,s*.13));
      [-1,1].forEach(s=>limb(V(0,by-.25,s*.12),V(0,0,s*.12),.035,M(p.legs?"#ff7a8a":"#f4b942")));
      const ws=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(0,by+.15,s*.25);root.add(g);sph(.2,wc,-.1,0,s*(.05+p.wing*.2),1.6,.15,p.wing,g);return [g,s];});
      sph(.15,col,-.75,by+.05,0,1.6,.3,1);anims.push(t=>ws.forEach(([g,s])=>g.rotation.x=Math.sin(t*3)*.35*s));return by+2;},
    penguin(p){sph(.55,M(p.c),0,.9,0,1,1.5,1);sph(.45,M("#f4f4f0"),.18,.85,0,.8,1.35,.9);sph(.32,M(p.c),0,1.85,0);sph(.12,M("#f4b942"),.2,1.75,.22,1.4,.6,.6);
      const bk=new THREE.Mesh(new THREE.ConeGeometry(.06,.25,8),M("#f48a2a"));bk.rotation.z=-Math.PI/2;add(bk,.42,1.82,0);
      const fl=[-1,1].map(s=>{const f=sph(.3,M(p.c),-.05,1.1,s*.52,.4,1.2,.15);return [f,s];});[-1,1].forEach(s=>sph(.13,M("#f48a2a"),.15,.05,s*.18,1.6,.4,1));
      anims.push(t=>fl.forEach(([f,s])=>f.rotation.x=Math.sin(t*2)*.2*s));return 2.2;},
    croc(p){const sc=p.small?.3:1,col=M(p.c);const g=new THREE.Group();root.add(g);g.scale.setScalar(sc);g.position.y=p.small?1.2:0;
      sph(.5,col,0,.45,0,2.2,.5,.8,g);sph(.25,col,1.4,.45,0,2.5,.5,.9,g);[-1,1].forEach(s=>sph(.08,M("#e8d84a"),1.25,.65,s*.18,1,1,1,g));
      if(p.curl){const tl=new THREE.Mesh(new THREE.TorusGeometry(.4,.1,8,24,Math.PI*1.6),col);tl.position.set(-1.4,.1,0);g.add(tl);}else{const tl=new THREE.Mesh(new THREE.ConeGeometry(.3,2.4,8),col);tl.rotation.z=Math.PI/2;tl.position.set(-2.2,.4,0);g.add(tl);}
      [[.6,1],[.6,-1],[-.6,1],[-.6,-1]].forEach(([x,s])=>limb(V(x,.4,s*.3),V(x+.1,0,s*.6),.08,col,g));
      if(p.small){const br=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,8,8),M("#6b4a2b"));br.rotation.z=Math.PI/2;br.position.y=-.05;g.add(br);}
      return p.small?2:5;},
    turtle(p){const col=M(p.c);sph(1,M(p.shell),0,.5,0,1.2,.45,1);sph(.25,col,1.3,.5,0,1.3,.9,1);
      const fl=[[.6,1],[.6,-1],[-.7,1],[-.7,-1]].map(([x,s])=>{const f=sph(.35,col,x,.35,s*.95,1.4,.2,.6);return [f,s,x];});anims.push(t=>fl.forEach(([f,s,x])=>f.rotation.y=Math.sin(t*1.5+(x>0?0:1))*.4*s));return 3;},
    snake(p){const pts=[];for(let i=0;i<40;i++){const a=i*.35;pts.push(V(Math.cos(a)*(1.6-i*.03),.2+(i>32?(i-32)*.12:0),Math.sin(a)*(1.6-i*.03)));}
      tube(pts,.14,M(p.c),root,200);for(let i=0;i<30;i++){const k=Math.floor(R()*38);sph(.08,M(p.spots),pts[k].x,pts[k].y+.12,pts[k].z,1,.4,1);}
      const h=pts[pts.length-1];sph(.2,M(p.c),h.x+.1,h.y,h.z,1.4,.7,1);return 4;},
    frog(p){const col=M(p.c);sph(.6,col,0,.45,0,1.2,.75,1);[-1,1].forEach(s=>{sph(.17,col,.45,.95,s*.3);sph(.09,M("#111"),.55,1.0,s*.33);sph(.25,col,-.4,.25,s*.6,1.6,.5,.7);sph(.12,col,.5,.1,s*.45,1.3,.4,.9);});
      const b=root;anims.push(t=>{root.position.y=Math.max(0,Math.sin(t*2))*.3;});return 2;},
    fish(p){const l=p.l,col=M(p.c);const g=new THREE.Group();root.add(g);g.position.y=1;
      sph(l*.18,col,0,0,0,2.8,p.shark?1:1.1,p.shark?1:.6,g);if(p.belly||p.shark)sph(l*.16,M(p.belly||"#e8ecf2"),l*.03,-l*.06,0,2.6,.6,p.shark?.9:.55,g);
      const tl=new THREE.Mesh(new THREE.ConeGeometry(l*.18,l*.3,3),col);tl.rotation.z=Math.PI/2;tl.scale.z=.15;tl.position.x=-l*.6;g.add(tl);
      const df=new THREE.Mesh(new THREE.ConeGeometry(l*.08,l*.22,3),col);df.scale.z=.15;df.position.set(0,l*.22,0);df.rotation.z=.4;g.add(df);
      if(p.stripe)[.2,-.05,-.3].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(l*.15,l*.025,8,24),M(p.stripe));r.rotation.y=Math.PI/2;r.scale.set(1,1.1,.6);r.position.x=x*l;g.add(r);});
      [-1,1].forEach(s=>sph(l*.03,M("#111"),l*.38,l*.05,s*l*.09,1,1,1,g));
      anims.push(t=>{tl.rotation.y=Math.sin(t*4)*.4;g.rotation.y=Math.sin(t*.5)*.3;});return l*1.6;},
    octopus(p){const col=M(p.c);sph(.7,col,0,1.6,0,1,1.3,1);[-1,1].forEach(s=>sph(.12,M("#f2e2a0"),.55,1.4,s*.3));
      const T=[...Array(8)].map((_,i)=>{const a=i/8*6.283;return {a,m:null};});anims.push(t=>{T.forEach(o=>{if(o.m){root.remove(o.m);o.m.geometry.dispose();}const pts=[];for(let k=0;k<7;k++){const r=.4+k*.32,w=Math.sin(t*1.5+k*.7+o.a*2)*.25;pts.push(V(Math.cos(o.a+w*.4)*r,1.1-k*.12+Math.sin(t+k+o.a)*.1,Math.sin(o.a+w*.4)*r));}o.m=tube(pts,.09,col,root,20);});});return 4;},
    jelly(p){const bell=new THREE.Mesh(new THREE.SphereGeometry(1,32,16,0,6.283,0,Math.PI/2),G(p.c,.45));bell.position.y=2;root.add(bell);
      [0,1,2,3].forEach(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.25,.05,8,24),M("#e6a0e6",{transparent:true,opacity:.8}));r.rotation.x=Math.PI/2;r.position.set(Math.cos(i*1.57)*.4,2.2,Math.sin(i*1.57)*.4);root.add(r);});
      const ts=[];for(let i=0;i<24;i++){const a=i/24*6.283;const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints([...Array(12)].map((_,k)=>V(Math.cos(a)*.95,2-k*.25,Math.sin(a)*.95))),new THREE.LineBasicMaterial({color:"#dff4ff",transparent:true,opacity:.6}));root.add(ln);ts.push(ln);}
      anims.push(t=>{const s=1+Math.sin(t*2)*.12;bell.scale.set(s,1/s,s);root.position.y=Math.sin(t*2-1)*.2;});return 4;},
    insect(p){const col=M(p.c),s=.8;const g=new THREE.Group();root.add(g);g.position.y=.6;g.scale.setScalar(s);
      sph(.2,col,.55,0,0,1,1,1,g);sph(.25,col,.15,0,0,1.2,1,1,g);const ab=sph(.3,M(p.c),-.45,-.02,0,1.7,1,1,g);
      if(p.stripe)[-.3,-.5,-.7].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.27,.05,8,20),M(p.stripe));r.rotation.y=Math.PI/2;r.position.x=x;g.add(r);});
      [-1,1].forEach(z=>[-.15,.12,.35].forEach(x=>{limb(V(x,-.05,z*.12),V(x+.05,-.35,z*.45),.025,col,g);limb(V(x+.05,-.35,z*.45),V(x+.15,-.6,z*.6),.02,col,g);}));
      [-1,1].forEach(z=>tube([V(.7,.1,z*.08),V(.95,.45,z*.25),V(1.05,.55,z*.35)],.015,col,g));
      const ws=[];if(p.wtype!=="none"){const wm=p.wtype==="bee"?G("#ffffff",.35):new THREE.MeshStandardMaterial({color:p.wing,side:THREE.DoubleSide,roughness:.6});
        [-1,1].forEach(z=>{const wg=new THREE.Group();wg.position.set(.15,.2,z*.1);g.add(wg);const big=p.wtype==="butterfly"?1.3:.5;
          const w1=new THREE.Mesh(new THREE.CircleGeometry(big*.6,24),wm);w1.rotation.x=Math.PI/2;w1.position.set(.15,0,z*big*.6);w1.scale.set(1,.7,1);wg.add(w1);
          if(p.wtype==="butterfly"){const w2=new THREE.Mesh(new THREE.CircleGeometry(big*.45,24),wm);w2.rotation.x=Math.PI/2;w2.position.set(-.35,0,z*big*.45);wg.add(w2);
            const dot=new THREE.Mesh(new THREE.CircleGeometry(.12,16),M("#1a3aff",{side:THREE.DoubleSide}));dot.rotation.x=Math.PI/2;dot.position.set(-.4,.01,z*big*.55);wg.add(dot);}
          ws.push([wg,z]);});}
      anims.push(t=>ws.forEach(([w,z])=>w.rotation.x=Math.sin(t*(p.wtype==="bee"?30:5))*.6*z));return 2.4;},
    spider(p){const col=M(p.c);sph(.3,col,.35,.6,0);sph(.5,col,-.4,.7,0,1,.9,1);sph(.08,M("#c0302a"),-.4,1.12,0,2,.3,1);
      [-1,1].forEach(z=>[0,1,2,3].forEach(i=>{const x=.5-i*.17,a=V(x,.6,z*.15),k=V(x+(1.5-i)*.25,1.05,z*.7),f=V(x+(1.5-i)*.5,0,z*1.2);limb(a,k,.04,col);limb(k,f,.035,col);}));return 3;},
    crab(p){const col=M(p.c);sph(.8,col,0,.6,0,1.1,.4,1);[-1,1].forEach(z=>{[0,1,2,3].forEach(i=>{const x=-.5+i*.3,a=V(x,.5,z*.7),k=V(x,.8,z*1.3),f=V(x,0,z*1.7);limb(a,k,.06,col);limb(k,f,.05,col);});
      limb(V(.7,.55,z*.4),V(1.2,.75,z*.8),.09,col);sph(.22,col,1.45,.8,z*.9,1.6,.7,.9);sph(.06,M("#111"),.75,.95,z*.2);});return 3.5;},
    starfish(p){const col=M(p.c);sph(.4,col,0,.15,0,1,.4,1);for(let i=0;i<5;i++){const a=i/5*6.283;const c=new THREE.Mesh(new THREE.ConeGeometry(.35,1.6,8),col);c.scale.z=.4;c.rotation.z=-Math.PI/2;const g=new THREE.Group();g.rotation.y=a;c.position.set(.9,.15,0);g.add(c);root.add(g);}
      for(let i=0;i<40;i++){const a=R()*6.28,r=R()*1.4;sph(.04,M("#ffd0a0"),Math.cos(a)*r,.25,Math.sin(a)*r);}return 3;},
    tree(p){const h=p.h;if(p.kind==="conifer"){cyl(.5,.8,h*.7,M("#8a3a2a"),0,h*.35,0);for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.8-i*.25,2.2,10),M("#2f5d3a"));c.position.y=h*.45+i*1.1;root.add(c);}return h*1.2;}
      cyl(.25,.4,h*.45,M("#5a3a2a"),0,h*.22,0);for(let i=0;i<5;i++){const a=i*1.3;limb(V(0,h*.4,0),V(Math.cos(a)*1.4,h*.6,Math.sin(a)*1.4),.1,M("#5a3a2a"));}
      for(let i=0;i<14;i++){const a=R()*6.28,r=R()*1.8;sph(.9+R()*.5,M(R()<.5?"#ffc8d8":"#ffb0c8"),Math.cos(a)*r,h*.65+R()*1.4,Math.sin(a)*r);}
      const pts=[];for(let i=0;i<120;i++)pts.push(V((R()-.5)*6,R()*h,(R()-.5)*6));const pg=new THREE.BufferGeometry().setFromPoints(pts);const pm=new THREE.Points(pg,new THREE.PointsMaterial({color:"#ffd0e0",size:.08}));root.add(pm);
      anims.push(t=>{const a=pg.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)-.01;if(y<0)y=h;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(t+i)*.004);}a.needsUpdate=true;});return h*1.3;},
    cactus(p){const col=M(p.c);cyl(.45,.5,6,col,0,3,0,root,16);sph(.45,col,0,6,0);[[1,2.5,1.5],[-1,3.4,1.1]].forEach(([s,y,h])=>{limb(V(0,y,0),V(s*1.1,y,0),.3,col);cyl(.3,.3,h,col,s*1.1,y+h/2,0);sph(.3,col,s*1.1,y+h,0);});
      for(let i=0;i<60;i++){const a=R()*6.28,y=R()*6;sph(.03,M("#f2f2e2"),Math.cos(a)*.47,y,Math.sin(a)*.47);}return 7.5;},
    flower(p){limb(V(0,0,0),V(0,2.2,0),.06,M("#3f8a3a"));[-1,1].forEach(s=>sph(.3,M("#3f8a3a"),s*.3,1,0,1.6,.15,.7));const hd=new THREE.Group();hd.position.y=2.3;hd.rotation.z=.5;root.add(hd);
      sph(.4,M("#5a3a1a"),0,0,0,.4,1,1,hd);for(let i=0;i<20;i++){const a=i/20*6.283;const pt=sph(.22,M(p.c),0,Math.cos(a)*.55,Math.sin(a)*.55,.12,1,.45,hd);pt.rotation.x=-a;}return 3;},
    mushroom(p){cyl(.18,.25,1.4,M("#f2eee2"),0,.7,0);const cap=new THREE.Mesh(new THREE.SphereGeometry(.9,32,16,0,6.283,0,Math.PI/2),M(p.c));cap.position.y=1.3;cap.scale.y=.6;root.add(cap);
      for(let i=0;i<22;i++){const a=R()*6.28,b=R()*1.2;const v=V(Math.cos(a)*Math.sin(b)*.9,Math.cos(b)*.9*.6+1.3,Math.sin(a)*Math.sin(b)*.9);sph(.06,M("#ffffff"),v.x,v.y,v.z);}
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.25,.05,8,20),M("#f2eee2"));ring.rotation.x=Math.PI/2;ring.position.y=1.05;root.add(ring);return 2;},
    human(p){const sk=M(p.c),cl=M("#3a6ab0"),pa=M("#2a2a3a");sph(.13,sk,0,1.62,0,1,1.15,1);sph(.14,M("#2a1a10"),-.02,1.7,0,1,.8,1);cyl(.18,.16,.6,cl,0,1.2,0);
      [-1,1].forEach(s=>{limb(V(0,.9,s*.09),V(0,.05,s*.1),.07,pa);limb(V(0,1.45,s*.21),V(.05,.85,s*.25),.05,sk);});return 2.2;},
  };
  // ---- 細胞・微生物・ウイルス ----
  const BM={
    cell(p){const mem=sph(3,G(p.plant?"#9fe8a0":"#ffd6e0",.18),0,0,0,p.plant?1.2:1,p.plant?.9:.8,1);if(p.plant){const w=new THREE.Mesh(new THREE.BoxGeometry(7.4,5.6,6.2),new THREE.MeshStandardMaterial({color:"#5fbf5f",transparent:true,opacity:.12,wireframe:false,depthWrite:false}));root.add(w);
        sph(1.8,G("#9fd8ff",.25),-.6,0,0,1.2,.9,1);for(let i=0;i<14;i++){const a=R()*6.28,b=(R()-.5)*2;sph(.3,M("#3fae4a"),Math.cos(a)*2.5,Math.sin(b),Math.sin(a)*2.2,1.6,.7,.9);}}
      const nu=sph(1,M("#8a6ad0",{transparent:true,opacity:.85}),.8,.2,0);sph(.35,M("#4a2a8a"),.9,.3,.2);
      for(let i=0;i<10;i++){const a=R()*6.28,r=1.5+R()*.9;const m=new THREE.Group();m.position.set(Math.cos(a)*r,(R()-.5)*1.4,Math.sin(a)*r*.9);m.rotation.set(R()*3,R()*3,R()*3);root.add(m);
        cyl(.18,.18,.5,M("#ff9a4a"),0,0,0,m);sph(.18,M("#ff9a4a"),0,.25,0,1,1,1,m);sph(.18,M("#ff9a4a"),0,-.25,0,1,1,1,m);}
      for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(1.4+i*.18,.06,6,40,Math.PI*.9),M("#f4b0c8"));t.rotation.set(Math.PI/2,0,R());t.position.set(.8,.2+i*.05-.1,0);root.add(t);}
      for(let i=0;i<4;i++){const d=new THREE.Mesh(new THREE.TorusGeometry(.5,.08,6,20,Math.PI),M("#f4d06a"));d.position.set(-1.6,.6-i*.2,1.2);d.rotation.z=1.2;root.add(d);}
      const rb=[];for(let i=0;i<300;i++){const a=R()*6.28,u=R()*2-1,r=1.2+R()*1.5;rb.push(V(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r*.7,Math.sin(a)*Math.sqrt(1-u*u)*r));}root.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(rb),new THREE.PointsMaterial({color:"#6a4aa0",size:.06})));
      anims.push(t=>{mem.scale.x=(p.plant?1.2:1)+Math.sin(t)*.02;});return 8;},
    rbc(){const prof=[];for(let i=0;i<=20;i++){const x=i/20*1.5;const y=.3*(1-(x/1.5)**2)*(.4+(x/1.5)**2*1.6);prof.push(new THREE.Vector2(x,y));}for(let i=20;i>=0;i--)prof.push(new THREE.Vector2(i/20*1.5,-prof[i].y));
      const geo=new THREE.LatheGeometry(prof,40);for(let i=0;i<14;i++){const m=new THREE.Mesh(geo,M("#d0302a",{roughness:.4}));m.position.set((R()-.5)*7,(R()-.5)*4,(R()-.5)*5);m.rotation.set(R()*3,R()*3,R()*3);root.add(m);const sp=.2+R()*.3;anims.push(t=>{m.rotation.x+=.003;m.position.x+=sp*.01;if(m.position.x>4)m.position.x=-4;});}return 8;},
    neuron(){const c=M("#f4b0d0");sph(.8,c,0,0,0);for(let i=0;i<8;i++){const a=R()*6.28,b=(R()-.5)*2;let p0=V(0,0,0),pts=[p0];for(let k=1;k<5;k++)pts.push(V(Math.cos(a)*k*.7+(R()-.5)*.5,Math.sin(b)*k*.5+(R()-.5)*.5,Math.sin(a)*k*.7));tube(pts,.08-.0,c);}
      tube([V(.6,0,0),V(2,-.3,0),V(4,.2,0),V(6,-.2,0)],.1,c);for(let i=0;i<5;i++){const s=cyl(.2,.2,.6,M("#f2f2e2"),2.4+i*.8,-.1+Math.sin(i)*.15,0);s.rotation.z=Math.PI/2;}
      const sig=sph(.15,new THREE.MeshBasicMaterial({color:"#7ee0ff"}),0,0,0);anims.push(t=>{const k=(t*.4)%1;sig.position.set(.6+k*5.4,Math.sin(k*6)*.2,0);});return 9;},
    bacillus(p){for(let i=0;i<5;i++){const g=new THREE.Group();g.position.set((R()-.5)*5,(R()-.5)*3,(R()-.5)*4);g.rotation.set(R()*3,R()*3,R()*3);root.add(g);
      cyl(.45,.45,1.6,M(p.c),0,0,0,g,16);sph(.45,M(p.c),0,.8,0,1,1,1,g);sph(.45,M(p.c),0,-.8,0,1,1,1,g);
      const fl=[];for(let k=0;k<4;k++){fl.push({k,m:null});}anims.push(t=>fl.forEach(f=>{if(f.m){g.remove(f.m);f.m.geometry.dispose();}const pts=[];for(let j=0;j<8;j++)pts.push(V(Math.sin(t*6+j*.8+f.k)*.25+(f.k-1.5)*.15,-1.1-j*.35,Math.cos(t*6+j*.8)*.2));f.m=tube(pts,.03,M("#e8f4c0"),g,16);}));
      anims.push(t=>{g.position.x+=.004;if(g.position.x>4)g.position.x=-4;});}return 9;},
    coccus(p){for(let c=0;c<3;c++){const a=R()*6;for(let i=0;i<6;i++)sph(.45,M(p.c),Math.cos(a)*i*.85-2,(c-1)*1.6+Math.sin(i)*.2,Math.sin(a)*i*.3);}return 8;},
    cyano(p){for(let c=0;c<3;c++){const pts=[];for(let i=0;i<12;i++)pts.push(V(i*.7-4,(c-1)*1.5+Math.sin(i*.5+c)*.6,Math.cos(i*.4)*.5));pts.forEach(q=>sph(.32,M(p.c),q.x,q.y,q.z,1.1,1,1));}return 9;},
    yeast(p){for(let i=0;i<7;i++){const x=(R()-.5)*5,y=(R()-.5)*3,z=(R()-.5)*3;sph(.7,M(p.c),x,y,z,1.2,1,1);if(i%2)sph(.35,M(p.c),x+.9,y+.3,z,1.1,1,1);}return 8;},
    parame(p){const b=sph(1.2,G(p.c,.6),0,0,0,2.4,.9,1);sph(.4,M("#8a6ad0"),.2,0,0);const pts=[];for(let i=0;i<900;i++){const a=R()*6.28,u=R()*2-1;pts.push(V(Math.cos(a)*Math.sqrt(1-u*u)*1.25*2.4,u*1.25*.9,Math.sin(a)*Math.sqrt(1-u*u)*1.25));}
      root.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts),new THREE.PointsMaterial({color:"#f2ffe0",size:.04})));for(let i=0;i<10;i++)sph(.15,M("#9fe8a0"),(R()-.5)*3.5,(R()-.5)*.8,(R()-.5)*1.2);
      anims.push(t=>{root.rotation.y=t*.2;root.position.x=Math.sin(t*.3)*.5;});return 8;},
    amoeba(p){const g=new THREE.SphereGeometry(1.6,48,32),base=g.attributes.position.array.slice();const m=new THREE.Mesh(g,G(p.c,.6));root.add(m);sph(.4,M("#6a4aa0"),.3,.1,0);for(let i=0;i<8;i++)sph(.15,M("#4fa0c0"),(R()-.5)*2,(R()-.5)*1,(R()-.5)*1.5);
      anims.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=base[i*3],y=base[i*3+1],z=base[i*3+2];const f=1+.25*Math.sin(x*1.5+t)+.2*Math.sin(z*2-t*1.3)+.15*Math.sin(y*3+t*.7);a.setXYZ(i,x*f,y*f*.6,z*f);}a.needsUpdate=true;g.computeVertexNormals();});return 8;},
    diatom(p){for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set((i-1)*3,(R()-.5),0);g.rotation.set(R(),R(),0);root.add(g);
      const c=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.5,48),G(p.c,.55));g.add(c);for(let r=1;r<5;r++){const pts=[];for(let k=0;k<r*10;k++){const a=k/(r*10)*6.283;pts.push(V(Math.cos(a)*r*.27,.27,Math.sin(a)*r*.27));}g.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts),new THREE.PointsMaterial({color:"#5a4a2a",size:.07})));}
      sph(.4,M("#8a7a3a"),0,0,0,1,.4,1,g);anims.push(t=>g.rotation.y=t*.3+i);}return 8;},
    tardi(p){const col=M(p.c);for(let i=0;i<4;i++)sph(.8-Math.abs(i-1.5)*.08,col,i*.7-1.05,1,0,1.1,.85,.95);sph(.55,col,1.75,.95,0,1.1,.9,.9);sph(.08,M("#111"),2.1,1.15,.25);sph(.08,M("#111"),2.1,1.15,-.25);
      for(let i=0;i<4;i++)[-1,1].forEach(s=>{const x=i*.7-1.05;const l=limb(V(x,.55,s*.5),V(x+.05,.05,s*.75),.14,col);for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(.03,.2,6),M("#3a2a1a"));c.position.set(x+.1,0,s*.7+(k-1)*.07);c.rotation.z=-1.2;root.add(c);}});
      anims.push(t=>root.position.x=Math.sin(t*.4)*.4);return 7;},
    corona(p){const core=sph(1.6,M(p.c),0,0,0);for(let i=0;i<60;i++){const u=1-2*(i+.5)/60,a=i*2.399;const v=V(Math.cos(a)*Math.sqrt(1-u*u),u,Math.sin(a)*Math.sqrt(1-u*u));const s=limb(v.clone().multiplyScalar(1.5),v.clone().multiplyScalar(2.2),.05,M("#f4b0a0"));sph(.13,M("#e86a5a"),v.x*2.25,v.y*2.25,v.z*2.25);}
      for(let i=0;i<30;i++){const a=R()*6.28,u=R()*2-1;sph(.08,M("#f4d06a"),Math.cos(a)*Math.sqrt(1-u*u)*1.62,u*1.62,Math.sin(a)*Math.sqrt(1-u*u)*1.62);}anims.push(t=>root.rotation.y=t*.15);return 8;},
    phage(p){const col=M(p.c,{metalness:.4});const h=new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),col);h.position.y=2.6;h.scale.y=1.2;root.add(h);cyl(.12,.12,.2,col,0,1.5,0);cyl(.22,.22,1.6,M("#c9d6e8"),0,.6,0);
      for(let i=0;i<14;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.22,.03,6,16),M("#8a9ab0"));r.rotation.x=Math.PI/2;r.position.y=-.1+i*.11;root.add(r);}cyl(.6,.6,.1,col,0,-.2,0,root,6);
      for(let i=0;i<6;i++){const a=i/6*6.283;const k=V(Math.cos(a)*1.2,-.3,Math.sin(a)*1.2),f=V(Math.cos(a)*1.6,-1.6,Math.sin(a)*1.6);limb(V(Math.cos(a)*.5,-.2,Math.sin(a)*.5),k,.04,col);limb(k,f,.04,col);}anims.push(t=>root.rotation.y=t*.2);return 8;},
    tmv(p){const col=M(p.c);for(let i=0;i<260;i++){const a=i*.4,y=i*.03-3.9;const b=new THREE.Mesh(new THREE.BoxGeometry(.35,.12,.2),col);b.position.set(Math.cos(a)*.55,y,Math.sin(a)*.55);b.rotation.y=-a;root.add(b);}
      tube([...Array(30)].map((_,k)=>V(Math.cos(k*1.2)*.3,k*.27-3.9,Math.sin(k*1.2)*.3)),.04,M("#ff6a6a"),root,200);root.rotation.z=.3;anims.push(t=>root.rotation.y=t*.2);return 9;},
  };
  // ---- 分子 ----
  function molecule(id){const m=MOLS.find(x=>x[0]===id);const A=m[4];const cen=A.reduce((s,a)=>s.add(V(a[1],a[2],a[3])),V(0,0,0)).multiplyScalar(1/A.length);
    const ext=Math.max(...A.map(a=>V(a[1],a[2],a[3]).distanceTo(cen)))||1;const sc=Math.min(1.4,4/ext);const g=new THREE.Group();root.add(g);g.scale.setScalar(sc);
    A.forEach(([e,x,y,z])=>{const r=(ATOMR[e]||.8)*.5+.15;sph(r,M(ATOMCOL[e]||"#ccc",{roughness:.35}),x-cen.x,y-cen.y,z-cen.z,1,1,1,g);});
    const bm=M("#c9ced6",{roughness:.4});for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=V(A[i][1],A[i][2],A[i][3]).sub(cen),b=V(A[j][1],A[j][2],A[j][3]).sub(cen),d=a.distanceTo(b);
      const lim=id==="nacl"?2.9:id==="dna"?(A[i][0]==="P"&&A[j][0]==="P"?4.7:2.5):((ATOMR[A[i][0]]||.8)+(ATOMR[A[j][0]]||.8))*1.25;if(d<lim&&d>.3)limb(a,b,.07,bm,g);}
    anims.push(t=>g.rotation.y=t*.25);return 10;}
  // ---- 原子 ----
  function shells(Z){const ord=[[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]];const sh=[0,0,0,0,0,0,0];let e=Z;for(const[n,c]of ord){const k=Math.min(c,e);sh[n-1]+=k;e-=k;if(!e)break;}return sh.filter(x=>x);}
  function nucleusMesh(Z,N,r0,p=root){const A=Z+N,Rr=r0*Math.cbrt(A);const pm=M("#ff5a4a",{roughness:.4}),nm=M("#b8c0cc",{roughness:.4});const g=new THREE.Group();p.add(g);
    for(let i=0;i<A;i++){const u=1-2*(i+.5)/A,a=i*2.399,rr=Rr*Math.cbrt((i+.5)/A);const v=V(Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr,Math.sin(a)*Math.sqrt(1-u*u)*rr);sph(r0*.95,(i*Z/A)%1<Z/A?pm:nm,v.x,v.y,v.z,1,1,1,g);}
    anims.push(t=>{g.rotation.y=t*.3;g.rotation.x=Math.sin(t*.5)*.2;});return g;}
  function atom(Z){const el=ELEMENTS[Z-1];const N=Math.round(parseFloat(String(el.m).replace(/[\[\]]/g,"")))-Z;nucleusMesh(Z,Math.max(0,N),.12);
    const sh=shells(Z);sh.forEach((n,k)=>{const r=1+k*.75;const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,6,96),new THREE.MeshBasicMaterial({color:"#7fb2ff",transparent:true,opacity:.35}));const tilt=new THREE.Group();tilt.rotation.set(R()*1.2,R()*3,0);root.add(tilt);tilt.add(ring);ring.rotation.x=Math.PI/2;
      const cloud=new THREE.Mesh(new THREE.SphereGeometry(r,32,16),new THREE.MeshBasicMaterial({color:"#5a8aff",transparent:true,opacity:.04,depthWrite:false}));root.add(cloud);
      for(let i=0;i<n;i++){const e=sph(.07,new THREE.MeshBasicMaterial({color:"#9fe8ff"}),0,0,0,1,1,1,tilt);const ph=i/n*6.283,sp=1.2/(k+1);anims.push(t=>{const a=ph+t*sp;e.position.set(Math.cos(a)*r,0,Math.sin(a)*r);});}});
    return 3+sh.length*1.5;}
  function nucleus(Z){const el=ELEMENTS[Z-1];const N=Math.round(parseFloat(String(el.m).replace(/[\[\]]/g,"")))-Z;nucleusMesh(Z,Math.max(0,N),.35);return 6+Math.cbrt(Z+N)*.8;}
  function quarks(kind){const shell=sph(2.2,G("#f4b942",.08),0,0,0);const fl=kind==="p"?["u","u","d"]:["u","d","d"],cols=["#ff4a4a","#4aff6a","#4a7aff"];
    const q=fl.map((f,i)=>{const m=sph(.42,M(cols[i],{emissive:cols[i],emissiveIntensity:.35}),0,0,0);const lab=document.createElement("canvas");lab.width=lab.height=64;const g=lab.getContext("2d");g.fillStyle="#fff";g.font="bold 44px sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText(f,32,34);
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(lab),depthTest:false}));s.scale.set(.6,.6,1);m.add(s);return {m,ph:i*2.1};});
    const glu=[0,1,2].map(()=>({line:null}));
    anims.push(t=>{q.forEach((o,i)=>{o.m.position.set(Math.cos(t*.7+o.ph)*1.1+Math.sin(t*1.3+i)*.2,Math.sin(t*.9+o.ph*1.3)*.8,Math.sin(t*.7+o.ph)*1.1);});
      glu.forEach((gl,i)=>{const a=q[i].m.position,b=q[(i+1)%3].m.position;if(gl.line){root.remove(gl.line);gl.line.geometry.dispose();}const pts=[];for(let k=0;k<=40;k++){const f=k/40;const p=a.clone().lerp(b,f);const d=b.clone().sub(a).normalize();const n=V(-d.z,0,d.x).multiplyScalar(Math.sin(f*Math.PI*8+t*10)*.12);p.add(n);p.y+=Math.cos(f*Math.PI*8+t*10)*.12;pts.push(p);}
        gl.line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:"#f4d06a"}));root.add(gl.line);});});
    return 7;}
  // ---- 素粒子：場のさざ波 ----
  function particleField(id){const P=PARTICLES.find(x=>x[0]===id);const col=PCAT[P[2]][1];const N=26,pts=new Float32Array(N*N*3),cols=new Float32Array(N*N*3);
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pts,3));g.setAttribute("color",new THREE.BufferAttribute(cols,3));root.add(new THREE.Points(g,new THREE.PointsMaterial({size:.12,vertexColors:true})));
    const c0=C(col),c1=C("#2a3350");const core=sph(.35,new THREE.MeshBasicMaterial({color:col}),0,0,0);
    const lc=document.createElement("canvas");lc.width=lc.height=128;const lg=lc.getContext("2d");lg.fillStyle="#fff";lg.font="bold 70px serif";lg.textAlign="center";lg.textBaseline="middle";lg.fillText(id,64,70);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(lc),depthTest:false}));sp.scale.set(1.2,1.2,1);sp.position.y=1.2;root.add(sp);
    const fast=/ν/.test(id),massless=P[4]==="0";
    anims.push(t=>{const cx=fast?((t*3)%12)-6:Math.sin(t*.5)*1.5;core.position.set(cx,0,0);sp.position.x=cx;let k=0;
      for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=(i-N/2)*.36,z=(j-N/2)*.36,d=Math.hypot(x-cx,z);const amp=massless?Math.sin(d*3-t*6)*Math.exp(-d*.15)*.5:Math.exp(-d*d*.35)*1.2*Math.cos(t*4);
        pts.set([x,amp-1,z],k*3);const f=Math.min(1,Math.abs(amp));cols.set([c1.r+(c0.r-c1.r)*f,c1.g+(c0.g-c1.g)*f,c1.b+(c0.b-c1.b)*f],k*3);k++;}
      g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true;});
    if(P[2]==="quark")["#ff4a4a","#4aff6a","#4a7aff"].forEach((c,i)=>{const o=sph(.1,new THREE.MeshBasicMaterial({color:c}),0,0,0);anims.push(t=>{const a=t*2+i*2.1;o.position.set(core.position.x+Math.cos(a)*.6,Math.sin(a)*.6,0);});});
    return 6;}
  // ---- 量子 ----
  function cloud(fn,n=9000,col="#7ee0ff",R=5){const p=[];let tries=0;while(p.length<n*3&&tries<n*400){tries++;const x=(Math.random()*2-1)*R,y=(Math.random()*2-1)*R,z=(Math.random()*2-1)*R;if(Math.random()<fn(x,y,z))p.push(x,y,z);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const pt=new THREE.Points(g,new THREE.PointsMaterial({color:col,size:.05,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));root.add(pt);anims.push(t=>pt.rotation.y=t*.2);sph(.12,new THREE.MeshBasicMaterial({color:"#ff5a4a"}),0,0,0);}
  function quantum(id){
    if(id==="o1s"){cloud((x,y,z)=>{const r=Math.hypot(x,y,z)*1.6;return Math.exp(-2*r)*1.0;},9000,"#7ee0ff",3);return [6,"水素原子の電子（1s軌道）","電子は決まった軌道を回っているのではなく、このような「確率の雲」として存在する。点が濃いところほど、測ったときに電子が見つかりやすい。"];}
    if(id==="o2p"){cloud((x,y,z)=>{const X=x*2,Y=y*2,Z=z*2,r=Math.hypot(X,Y,Z);return Y*Y*Math.exp(-r)/.55;},9000,"#9fe8ff",6);return [8,"2p軌道","ダンベルのような形。真ん中（原子核の位置）には電子がほとんど見つからない。化学結合の向きを決める。"];}
    if(id==="o3d"){cloud((x,y,z)=>{const X=x*2.5,Y=y*2.5,Z=z*2.5,r=Math.hypot(X,Y,Z);return X*X*Y*Y*Math.exp(-2*r/3)/90;},9000,"#c99cf2",7);return [10,"3d軌道","四つ葉のような形。鉄や銅などの遷移金属の性質に関わる。"];}
    if(id==="slit"){const wall=new THREE.Mesh(new THREE.BoxGeometry(.2,4,4),M("#5a6070"));wall.position.x=0;root.add(wall);[-.5,.5].forEach(z=>{const h=new THREE.Mesh(new THREE.BoxGeometry(.25,4.05,.25),new THREE.MeshBasicMaterial({color:"#05070f"}));h.position.set(0,0,z);root.add(h);});
      const scr=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshBasicMaterial({color:"#101830",side:THREE.DoubleSide,transparent:true,opacity:.55,depthWrite:false}));scr.position.x=4;scr.rotation.y=Math.PI/2;root.add(scr);
      const hits=[],hg=new THREE.BufferGeometry();const hp=new THREE.Points(hg,new THREE.PointsMaterial({color:"#7ee0ff",size:.09}));root.add(hp);const bullet=sph(.07,new THREE.MeshBasicMaterial({color:"#ffd27a"}),-4,0,0);let last=0;
      anims.push(t=>{const k=(t*2)%1;bullet.position.set(-4+k*8,0,0);if(Math.floor(t*2)!==last){last=Math.floor(t*2);for(let n=0;n<6;n++){let z;do{z=(Math.random()*2-1)*1.9;}while(Math.random()>Math.pow(Math.cos(z*5.5),2)*Math.pow(Math.sin(z*2+1e-6)/(z*2+1e-6),2));hits.push(4,(Math.random()-.5)*3.6,z);}if(hits.length>9000)hits.splice(0,18);hg.setAttribute("position",new THREE.Float32BufferAttribute(hits,3));}});
      return [10,"二重スリット実験","電子を1個ずつ飛ばしても、スクリーンには縞模様（干渉じま）ができる。1個の電子が「波として両方のスリットを同時に通った」ように見える。どちらを通ったか観測すると、縞は消える。"];}
    if(id==="ent"){const a=sph(.5,M("#7fb2ff"),-3,0,0),b=sph(.5,M("#ff8a6a"),3,0,0);const ar=[a,b].map(o=>{const h=new THREE.ArrowHelper(V(0,1,0),V(0,0,0),1.1,"#fff");o.add(h);return h;});
      const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-3,0,0),V(3,0,0)]),new THREE.LineDashedMaterial({color:"#c99cf2",dashSize:.2,gapSize:.15}));l.computeLineDistances();root.add(l);
      anims.push(t=>{const k=Math.floor(t/2.5)%2,spin=(t%2.5)<1.2;if(spin){ar[0].setDirection(V(Math.sin(t*9),Math.cos(t*9),0).normalize());ar[1].setDirection(V(Math.sin(t*7),Math.cos(t*7),0).normalize());}else{ar[0].setDirection(V(0,k?1:-1,0));ar[1].setDirection(V(0,k?-1:1,0));}});
      return [9,"量子もつれ","2つの粒子の状態がペアとして決まっていて、片方を測って「上向き」なら、どれだけ離れていてももう片方は必ず「下向き」になる。ただし、これを使って光より速く情報を送ることはできない。量子コンピュータや量子通信の基礎。"];}
    if(id==="vac"){const pairs=[];for(let i=0;i<24;i++){const a=sph(.12,new THREE.MeshBasicMaterial({color:"#7fb2ff"}),0,0,0),b=sph(.12,new THREE.MeshBasicMaterial({color:"#ff8a6a"}),0,0,0);const c=V((Math.random()-.5)*7,(Math.random()-.5)*4,(Math.random()-.5)*4),d=V(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),o=Math.random()*3;pairs.push([a,b,c,d,o]);}
      anims.push(t=>pairs.forEach(([a,b,c,d,o])=>{const k=((t+o)%3)/3,s=Math.sin(k*Math.PI);a.position.copy(c).addScaledVector(d,s*.8);b.position.copy(c).addScaledVector(d,-s*.8);a.scale.setScalar(s+.01);b.scale.setScalar(s+.01);}));
      return [9,"真空のゆらぎ","何もない真空でも、粒子と反粒子のペアがほんの一瞬生まれては消えている（量子ゆらぎ）。2枚の金属板が引き合う「カシミール効果」で、その影響が実際に測られている。"];}
    const g=new THREE.IcosahedronGeometry(3,4),base=g.attributes.position.array.slice();const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:"#6a8aff",wireframe:true,transparent:true,opacity:.6}));root.add(m);
    anims.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=base[i*3],y=base[i*3+1],z=base[i*3+2];const f=1+.18*Math.sin(x*4+t*3)*Math.cos(y*5-t*2)*Math.sin(z*3+t*4);a.setXYZ(i,x*f,y*f,z*f);}a.needsUpdate=true;});
    return [8,"時空の泡（プランク長）","約1.6×10⁻³⁵m。これより小さな長さは意味を持たないかもしれない、とされる最小のスケール。ここでは重力と量子論が同時に効き、時空そのものが泡立つように揺らいでいるという仮説（ホイーラーの「量子の泡」）。確かめる方法はまだない。"];}
  // ---- 超ひも理論 ----
  function vstring(mode,closed,col,len=2.4,amp=.25){const N=120;const g=new THREE.BufferGeometry();const p=new Float32Array((N+1)*3);g.setAttribute("position",new THREE.BufferAttribute(p,3));
    const m=new THREE.Line(g,new THREE.LineBasicMaterial({color:col,linewidth:2}));const glow=new THREE.Points(g,new THREE.PointsMaterial({color:col,size:.07,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));const grp=new THREE.Group();grp.add(m,glow);root.add(grp);
    anims.push(t=>{for(let i=0;i<=N;i++){const f=i/N;let x,y,z;if(closed){const a=f*Math.PI*2,r=len/2/Math.PI*2+Math.sin(a*mode+t*3)*amp;x=Math.cos(a)*r;z=Math.sin(a)*r;y=Math.cos(a*mode-t*3)*amp*.8;}else{x=(f-.5)*len;y=Math.sin(f*Math.PI*mode)*Math.sin(t*3)*amp;z=Math.sin(f*Math.PI*mode)*Math.cos(t*2)*amp*.5;}p.set([x,y,z],i*3);}g.attributes.position.needsUpdate=true;});return grp;}
  function txt(t,col="#fff"){const c=document.createElement("canvas"),F="bold 30px sans-serif";let g=c.getContext("2d");g.font=F;const w=Math.max(256,Math.ceil(g.measureText(t).width)+28);c.width=w;c.height=64;g=c.getContext("2d");g.font=F;g.textAlign="center";g.lineWidth=6;g.strokeStyle="rgba(0,0,0,.65)";g.strokeText(t,w/2,42);g.fillStyle=col;g.fillText(t,w/2,42);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(1.6*w/256,.4,1);root.add(s);return s;}
  function strings(id){
    if(id==="modes"){[["電子",1,"#7fb2ff"],["クオーク",2,"#ff8f8f"],["光子",3,"#f4d06a"],["重力子",4,"#c99cf2"]].forEach(([n,k,c],i)=>{const g=vstring(k+1,true,c,2.6,.18);g.position.set((i-1.5)*2.6,0,0);const l=txt(n,c);l.position.set((i-1.5)*2.6,1.4,0);});
      return [9,"ひもの振動と粒子","同じ「ひも」でも、振動のしかた（節の数・速さ）が違うと、別の粒子に見える。ギターの弦が押さえる位置で違う音を出すのと似ている。重力子（重力を伝える粒子）が自然に出てくることが、この理論が注目される大きな理由。"];}
    if(id==="openclosed"){const a=vstring(2,false,"#7ee0ff",3,.35);a.position.x=-2.2;const b=vstring(3,true,"#c99cf2",2.6,.2);b.position.x=2.2;sph(.1,new THREE.MeshBasicMaterial({color:"#fff"}),-3.7,0,0);sph(.1,new THREE.MeshBasicMaterial({color:"#fff"}),-.7,0,0);
      txt("開いたひも","#7ee0ff").position.set(-2.2,1.3,0);txt("閉じたひも","#c99cf2").position.set(2.2,1.3,0);
      return [8,"開いたひも・閉じたひも","両端がある「開いたひも」と、輪になった「閉じたひも」がある。開いたひもは光子やクオークなど、閉じたひもは重力子に対応する。ひもの長さはプランク長（約10⁻³⁵m）ほどで、陽子の10²⁰分の1よりさらに小さい。"];}
    if(id==="brane"){const g=new THREE.PlaneGeometry(9,6,18,12),b=g.attributes.position.array.slice();const br=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:"#4a6aa8",transparent:true,opacity:.45,side:THREE.DoubleSide}));br.rotation.x=-Math.PI/2;root.add(br);
      anims.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setZ(i,Math.sin(b[i*3]*.8+t)*.08);a.needsUpdate=true;});
      for(let i=0;i<5;i++){const s=vstring(1+i%2,false,"#ff8f8f",1.2,.25);s.position.set(-3+i*1.5,.6,(i%2-.5)*1.5);s.rotation.z=Math.PI/2;}
      const c=vstring(3,true,"#c99cf2",1.6,.15);anims.push(t=>{const k=(t*.25)%1;c.position.set(2,k*5,0);c.visible=true;});txt("重力子（閉じたひも）は膜から離れられる","#c99cf2").position.set(2,3.2,0);
      return [9,"ブレーン（膜）と重力","私たちの宇宙は、高次元空間に浮かぶ「膜（ブレーン）」かもしれないという考え。物質や光（開いたひも）は端が膜にくっついて離れられないが、重力子（閉じたひも）だけは膜の外へ出られる。そのため重力だけが他の力よりずっと弱く見える、という説明がある。"];}
    if(id==="cy"){const n=5,ga=[],pos=[];const cpow=(re,im,p)=>{const r=Math.hypot(re,im),a=Math.atan2(im,re);const R2=Math.pow(r,p);return [R2*Math.cos(a*p),R2*Math.sin(a*p)];};
      const cosh=(x,y)=>[Math.cosh(x)*Math.cos(y),Math.sinh(x)*Math.sin(y)],sinh=(x,y)=>[Math.sinh(x)*Math.cos(y),Math.cosh(x)*Math.sin(y)];const A=.6;
      for(let k1=0;k1<n;k1++)for(let k2=0;k2<n;k2++){const geo=new THREE.BufferGeometry(),vs=[],idx=[];const S=14;
        for(let i=0;i<=S;i++)for(let j=0;j<=S;j++){const x=-1+2*i/S,y=(Math.PI/2)*j/S;const c=cosh(x,y),s0=sinh(x,y);const z1a=cpow(c[0],c[1],2/n);const ms=[s0[1],-s0[0]];const z2a=cpow(ms[0],ms[1],2/n);
          const p1=2*Math.PI*k1/n,p2=2*Math.PI*k2/n;const z1=[z1a[0]*Math.cos(p1)-z1a[1]*Math.sin(p1),z1a[0]*Math.sin(p1)+z1a[1]*Math.cos(p1)],z2=[z2a[0]*Math.cos(p2)-z2a[1]*Math.sin(p2),z2a[0]*Math.sin(p2)+z2a[1]*Math.cos(p2)];
          vs.push(z1[0]*2,z2[0]*2,(Math.cos(A)*z1[1]+Math.sin(A)*z2[1])*2);}
        for(let i=0;i<S;i++)for(let j=0;j<S;j++){const a=i*(S+1)+j,b=a+1,c=a+S+1,d=c+1;idx.push(a,c,b,b,c,d);}
        geo.setAttribute("position",new THREE.Float32BufferAttribute(vs,3));geo.setIndex(idx);geo.computeVertexNormals();const col=new THREE.Color().setHSL((k1*n+k2)/(n*n),.6,.55);
        root.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:col,side:THREE.DoubleSide,roughness:.4,metalness:.2})));}
      anims.push(t=>{root.rotation.y=t*.25;root.rotation.x=Math.sin(t*.2)*.4;});
      return [7,"余剰次元（カラビ–ヤウ空間）","超ひも理論では空間は9次元あり、私たちに見える3次元以外の6次元は、このような複雑な形に小さく丸まっていると考える。その形によって、どんな素粒子や力が現れるかが決まる。図は6次元の形の一部を3次元に映した有名な描き方（5次の多様体の断面）。"];}
    if(id==="compact"){const tube=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,10,40,1,true),new THREE.MeshStandardMaterial({color:"#6a8aff",wireframe:true,transparent:true,opacity:.5}));tube.rotation.z=Math.PI/2;root.add(tube);
      const ant=sph(.12,new THREE.MeshBasicMaterial({color:"#f4b942"}),0,0,0);anims.push(t=>{const a=t*1.5;ant.position.set(((t*.6)%10)-5,Math.cos(a)*.62,Math.sin(a)*.62);});
      txt("遠くからは「線」に見える","#9fb3d6").position.set(0,2,0);
      return [9,"次元が丸まるとは","遠くから見たホースは1本の線（1次元）に見えるが、近づくと表面をぐるりと回る方向（もう1つの次元）がある。アリ（金色の点）はその小さな方向にも動ける。余剰次元もこのように、小さすぎて私たちには見えないだけだと考える。"];}
    // M理論
    const names=["タイプI","タイプIIA","タイプIIB","ヘテロSO(32)","ヘテロE8×E8","11次元超重力"];names.forEach((n,i)=>{const a=i/6*6.283;const s=vstring(i%3+2,i%2===0,["#ff8f8f","#7fb2ff","#6fd2a0","#f4d06a","#c99cf2","#ff9ad0"][i],1.6,.15);s.position.set(Math.cos(a)*4.6,Math.sin(a)*3,0);txt(n,"#fff").position.set(Math.cos(a)*4.6,Math.sin(a)*3+1.1,0);});
    const core=sph(.8,new THREE.MeshStandardMaterial({color:"#f4b942",emissive:"#f4b942",emissiveIntensity:.4}),0,0,0);txt("M理論（11次元）","#f4b942").position.set(0,-1.3,0);anims.push(t=>core.scale.setScalar(1+Math.sin(t*2)*.08));
    return [13,"M理論と11次元","1990年代、5種類あった超ひも理論と11次元超重力理論は、じつは1つの理論（M理論）の別の見え方だと分かってきた（ウィッテン、1995年）。M理論では空間10次元＋時間1次元の11次元。M理論そのものの完全な形はまだ分かっていない。"];}
  // ---- 次元（1〜11次元） ----
  const DCOL=["#ff6b6b","#4cd97b","#5aa8ff","#ffd84a","#c58bff","#ff8fd0","#5fe0e0","#ffa94d","#a0e86a","#9fa8ff","#ffffff"];
  const glowM=c=>new THREE.MeshBasicMaterial({color:c});
  function arrow(dir,len,col,p=root){const g=new THREE.Group();const d=dir.clone().normalize();const sh=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,len,10),glowM(col));sh.position.y=len/2;const hd=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,14),glowM(col));hd.position.y=len+.15;g.add(sh,hd);g.quaternion.setFromUnitVectors(V(0,1,0),d);p.add(g);return g;}
  function bead(col,r=.22,p=root){const g=new THREE.Group();p.add(g);const b=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),M(col,{roughness:.35}));g.add(b);[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(r*.2,10,8),glowM("#1a1420"));e.position.set(r*.82,r*.2,s*r*.32);e.scale.x=.5;g.add(e);});return g;}
  // n次元立方体の影（各方向を色分け）
  function ncube(n,scale,planes){const N=1<<n,ed=[];for(let a=0;a<N;a++)for(let k=0;k<n;k++){const b=a^(1<<k);if(a<b)ed.push([a,b,k]);}
    const em=new THREE.InstancedMesh(new THREE.CylinderGeometry(.028,.028,1,8,1,true),new THREE.MeshBasicMaterial({color:"#fff"}),ed.length);ed.forEach(([a,b,k],i)=>em.setColorAt(i,C(DCOL[k])));root.add(em);
    const q=new THREE.Quaternion(),va=V(0,0,0),vb=V(0,0,0),vd=V(0,0,0),up=V(0,1,0),sc=V(1,1,1);
    const vm=new THREE.InstancedMesh(new THREE.SphereGeometry(.07,12,8),glowM("#ffffff"),N);root.add(vm);const P=[],mt=new THREE.Matrix4();
    anims.push(t=>{for(let a=0;a<N;a++){const p=[];for(let k=0;k<n;k++)p.push(a>>k&1?1:-1);planes.forEach(([i,j,w])=>{const th=t*w,c=Math.cos(th),s=Math.sin(th),x=p[i],y=p[j];p[i]=x*c-y*s;p[j]=x*s+y*c;});
        for(let k=n-1;k>=3;k--){const f=2.6/(3.4-p[k]*.9);for(let m=0;m<k;m++)p[m]*=f;}P[a]=[p[0]*scale,p[1]*scale,p[2]*scale];mt.makeTranslation(P[a][0],P[a][1],P[a][2]);vm.setMatrixAt(a,mt);}
      vm.instanceMatrix.needsUpdate=true;ed.forEach(([a,b],i)=>{va.fromArray(P[a]);vb.fromArray(P[b]);vd.subVectors(vb,va);const l=vd.length();q.setFromUnitVectors(up,vd.normalize());sc.set(1,l,1);mt.compose(va.add(vb).multiplyScalar(.5),q,sc);em.setMatrixAt(i,mt);});em.instanceMatrix.needsUpdate=true;});}
  function dimGrid(n,step,fn){for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=(i-(n-1)/2)*step,z=(j-(n-1)/2)*step;fn(x,z,i,j);}}
  function dims(id){const k=+id.slice(1);
    if(k===1){const ln=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,10,8),glowM(DCOL[0]));ln.rotation.z=Math.PI/2;root.add(ln);
      const bs=[["#ffb3c1",-3],["#9fd8ff",0],["#ffe08a",2.8]].map(([c,x])=>{const b=bead(c);b.position.x=x;return b;});
      anims.push(t=>{const xs=[-2.8+Math.sin(t*.9)*1.1,Math.sin(t*1.3)*1.05,2.75+Math.sin(t*.7+1)*1.05];bs.forEach((b,i)=>{b.position.x=xs[i];b.rotation.y=Math.cos([.9,1.3,.7][i]*t)>0?0:Math.PI;});});
      txt("← 前","#ff9b9b").position.set(-4.4,.7,0);txt("後ろ →","#ff9b9b").position.set(4.4,.7,0);txt("追い越せない！","#fff").position.set(0,1.3,0);
      return [7,"1次元：線の世界","動ける方向は「前・後ろ」の1つだけ。線の上に住む生き物は、となりの相手を追い越すことも、よけることもできない。位置は数1つ（x）で決まる。"];}
    if(k===2){const pl=new THREE.Mesh(new THREE.PlaneGeometry(9,9),G("#4a7ad8",.22));pl.rotation.x=-Math.PI/2;root.add(pl);const gr=new THREE.GridHelper(9,18,"#7fa8ff","#36508a");root.add(gr);
      arrow(V(1,0,0),2.4,DCOL[0]).position.set(-4.3,.02,4.3);arrow(V(0,0,-1),2.4,DCOL[1]).position.set(-4.3,.02,4.3);
      const shp=[new THREE.CircleGeometry(.45,32),new THREE.CircleGeometry(.5,3),new THREE.PlaneGeometry(.75,.75)].map((g0,i)=>{const m=new THREE.Mesh(g0,new THREE.MeshBasicMaterial({color:["#ffb3c1","#ffe08a","#9fd8ff"][i],side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.02;root.add(m);return m;});
      const ball=sph(1.1,G("#ffd84a",.55),2,0,-1);const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1,48),new THREE.MeshBasicMaterial({color:"#ffd84a",side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(2,.03,-1);root.add(ring);
      anims.push(t=>{shp.forEach((m,i)=>{const a=t*(.4+i*.15)+i*2;m.position.x=-1.6+Math.cos(a)*1.6;m.position.z=1+Math.sin(a*1.3)*1.4;m.rotation.z=t*(i-1)*.8;});
        const y=Math.sin(t*.7)*1.9;ball.position.y=y;const r=Math.sqrt(Math.max(0,1.21-y*y));ring.visible=r>.02;ring.scale.setScalar(Math.max(.01,r));});
      txt("3次元の球が通ると…","#ffd84a").position.set(2,2.6,-1);txt("平面の住人には「円」が現れて消える","#fff").position.set(0,-1.2,3.5);
      return [8,"2次元：面の世界","動ける方向は「たて・よこ」の2つ。上下という方向は存在しない。小説『フラットランド』（1884年）の住人のように、3次元の球が平面を通り抜けると、彼らには点→大きな円→点→消える、という不思議な現象に見える。"];}
    if(k===3){[[V(1,0,0),0],[V(0,1,0),1],[V(0,0,1),2]].forEach(([d,i])=>arrow(d,3,DCOL[i]));txt("よこ (x)",DCOL[0]).position.set(3.6,0,0);txt("たて (y)",DCOL[1]).position.set(0,3.7,0);txt("奥行き (z)",DCOL[2]).position.set(0,0,3.8);
      const cb=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.8,1.8),G("#9fd8ff",.3));cb.position.set(1.4,1.4,1.4);root.add(cb);const ed=new THREE.LineSegments(new THREE.EdgesGeometry(cb.geometry),new THREE.LineBasicMaterial({color:"#fff"}));cb.add(ed);
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6),G("#4a7ad8",.18));pl.rotation.x=-Math.PI/2;pl.position.set(1.4,1.4,1.4);root.add(pl);
      anims.push(t=>{cb.rotation.y=t*.4;cb.rotation.x=Math.sin(t*.3)*.4;pl.position.y=1.4+Math.sin(t*.8)*.9;});
      root.position.y=-1.3;return [9,"3次元：私たちの空間","動ける方向は「たて・よこ・奥行き」の3つ。どんな場所も3つの数（x, y, z）で表せる。2次元の住人にとっての球と同じように、私たちも「もっと高い次元の物体」は断面しか見られないのかもしれない。"];}
    if(k===4){const sp=new THREE.Mesh(new THREE.PlaneGeometry(7,7),G("#4a7ad8",.12));sp.rotation.x=-Math.PI/2;root.add(sp);
      const cone=(up)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(2.6,2.6,48,1,true),G("#ffd84a",.16));m.position.y=up?1.3:-1.3;if(up)m.rotation.x=Math.PI;root.add(m);const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ConeGeometry(2.6,2.6,24,1,true)),new THREE.LineBasicMaterial({color:"#ffd84a",transparent:true,opacity:.35}));m.add(e);};cone(true);cone(false);
      arrow(V(0,1,0),3.6,DCOL[3]).position.y=-3.2;txt("時間 ↑（4次元目）",DCOL[3]).position.set(0,3.4,0);txt("空間（2次元に省略）","#9fb3d6").position.set(3.4,-.3,3);txt("光円錐","#ffd84a").position.set(2.6,1.9,0);
      const pts=[];for(let i=0;i<=120;i++){const y=-3+i/120*6,a=y*2.2;pts.push(V(Math.cos(a)*1.2+1.8,y,Math.sin(a)*1.2-1));}tube(pts,.05,glowM("#7fd3ff"),root,240);sph(.45,M("#ffcf5a",{emissive:"#ffb000",emissiveIntensity:.6}),1.8,0,-1,1,.12,1);
      const pts2=[V(-1.8,-3,1.4),V(-1.8,3,1.4)];tube(pts2,.04,glowM("#ff9bb0"),root,4);
      const now=new THREE.Mesh(new THREE.PlaneGeometry(7,7),G("#ffffff",.08));now.rotation.x=-Math.PI/2;root.add(now);const e1=sph(.16,glowM("#7fd3ff"),0,0,0),e2=sph(.16,glowM("#ff9bb0"),-1.8,0,1.4);
      anims.push(t=>{const y=((t*.5)%6)-3;now.position.y=y;const a=y*2.2;e1.position.set(Math.cos(a)*1.2+1.8,y,Math.sin(a)*1.2-1);e2.position.y=y;});
      txt("地球の世界線（らせん）","#7fd3ff").position.set(1.8,-3.5,-1);
      return [9,"4次元：時間（時空）","相対性理論では、時間は空間と組み合わさって4次元の「時空」になる。図は空間を2次元に省いて、上向きを時間にしたもの。止まっている物はまっすぐな線、太陽のまわりを回る地球はらせんの「世界線」を描く。黄色い円すい（光円錐）の外へは、光より速くないと行けないので、原因と結果はこの中だけでつながる。"];}
    if(k>=5&&k<=7){const nC=k-4;const sm=[];
      dimGrid(5,1.5,(x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);root.add(g);sph(.05,glowM("#ffffff"),0,0,0,1,1,1,g);
        if(nC===1){const r=new THREE.Mesh(new THREE.TorusGeometry(.32,.025,8,32),glowM(DCOL[4]));g.add(r);}
        else if(nC===2){const r=new THREE.Mesh(new THREE.TorusGeometry(.3,.12,14,32),M(DCOL[5],{roughness:.4}));g.add(r);}
        else{[[0,0,0],[Math.PI/2,0,0],[0,Math.PI/2,0]].forEach((rt,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.33,.02,6,32),glowM(DCOL[4+i]));r.rotation.set(...rt);g.add(r);});}
        sm.push(g);});
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(7.5,7.5),G("#4a7ad8",.1));pl.rotation.x=-Math.PI/2;pl.position.y=-.5;root.add(pl);
      // 拡大図
      const big=new THREE.Group();big.position.set(0,3.4,0);root.add(big);const dot=sph(.14,glowM("#ffd84a"),0,0,0,1,1,1,big);
      if(nC===1){big.add(new THREE.Mesh(new THREE.TorusGeometry(1.3,.06,12,64),glowM(DCOL[4])));anims.push(t=>{const a=t*1.4;dot.position.set(Math.cos(a)*1.3,Math.sin(a)*1.3,0);});}
      else if(nC===2){const tor=new THREE.Mesh(new THREE.TorusGeometry(1.2,.5,32,64),G(DCOL[5],.45));big.add(tor);anims.push(t=>{const u=t*.9,v=t*2.3;dot.position.set((1.2+.5*Math.cos(v))*Math.cos(u),(1.2+.5*Math.cos(v))*Math.sin(u),.5*Math.sin(v));});}
      else{const bx=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.2,2.2),G("#5fe0e0",.12));big.add(bx);bx.add(new THREE.LineSegments(new THREE.EdgesGeometry(bx.geometry),new THREE.LineBasicMaterial({color:"#5fe0e0"})));
        const w=x=>((x+1.1)%2.2+2.2)%2.2-1.1;anims.push(t=>{dot.position.set(w(t*.9),w(t*.55+.3),w(t*.37+.7));});}
      anims.push(t=>{sm.forEach((g,i)=>{g.rotation.y=t*.8+i;g.rotation.x=t*.5;});big.rotation.y=t*.3;});
      const T={1:["5次元：丸まった次元（カルツァ＝クライン）","1921〜26年、カルツァとクラインは「空間にもう1つ、小さな円の形に丸まった次元がある」と考えると、重力と電磁気力を同じ式で書けることを見つけた。図の下は私たちの空間（2次元に省略）で、どの点にも小さな円（紫）がついている。上は1つを拡大したもので、点はこの円の方向にも動ける。ただし円は小さすぎて（プランク長ほど）私たちには見えない。"],
        2:["6次元：2つ目の丸まった次元","丸まった次元が2つあると、各点についている小さな空間は「ドーナツ面（トーラス）」になる。ドーナツの表面は、ぐるっと回る方向が2つある2次元の世界。上の拡大図の点は、2つの円の方向を同時に動いている。"],
        3:["7次元：3つの丸まった次元","丸まった次元が3つになると、各点の小さな空間は「3次元トーラス」。描くのは難しいが、「右の面から出ると左の面から戻ってくる箱」と同じもの（上の拡大図）。テレビゲームで画面の端から出ると反対側から出てくるのと同じしくみを3方向にしたもの。"]}[nC];
      txt(`丸まった次元 ×${nC}`,DCOL[4]).position.set(0,5.3,0);txt("私たちの空間のどの点にも…","#9fb3d6").position.set(0,-1.2,4.2);
      root.position.y=-1.4;return [11.5,T[0],T[1]];}
    if(k===8||k===9){const n=k-4;ncube(n,1.4,n===4?[[0,3,.5],[1,2,.25]]:[[0,3,.45],[1,4,.32],[2,3,.2]]);
      txt(n===4?"4次元立方体（超立方体）の影":"5次元立方体の影","#fff").position.set(0,3.6,0);
      return [7,k===8?"8次元：4つの丸まった次元":"9次元：5つの丸まった次元",k===8?"丸まった次元が4つになると、各点の小さな空間は「4次元トーラス」。これは4次元立方体（超立方体・テッセラクト）の向かい合う面どうしを貼り合わせたもの。図は超立方体を3次元に映した「影」で、回転すると内側の立方体と外側の立方体が入れかわる。線の色は4つの方向（赤・緑・青・黄）を表す。":"丸まった次元が5つ。5次元立方体は頂点32個・辺80本で、各頂点から5方向（5色）に辺がのびる。私たちの目には影しか見えないが、数学では何次元でも同じように扱える。"];}
    if(k===10){const r=strings("cy");txt("6つの丸まった次元","#ff9ad0").position.set(0,2.9,0);
      return [7,"10次元：超ひも理論の時空","超ひも理論が矛盾なく成り立つには、空間9次元＋時間1次元＝10次元が必要。私たちに見える3次元以外の6次元は、図のような「カラビ–ヤウ空間」に小さく丸まっていると考える。丸まり方の違いで、どんな素粒子や力が現れるかが変わる（候補は10⁵⁰⁰通り以上とも）。"];}
    // 11次元：M理論（ホジャヴァ＝ウィッテン型：2枚の膜のあいだ）
    const mkBr=(x,col)=>{const g=new THREE.PlaneGeometry(7,5,28,20),b=g.attributes.position.array.slice();const m=new THREE.Mesh(g,G(col,.38));m.rotation.y=Math.PI/2;m.position.x=x;root.add(m);
      const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(7,5)),new THREE.LineBasicMaterial({color:col}));m.add(e);anims.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setZ(i,Math.sin(b[i*3]*.9+t*1.2+x)*.07+Math.cos(b[i*3+1]*1.1+t)*.05);a.needsUpdate=true;});return m;};
    mkBr(-2.6,"#5aa8ff");mkBr(2.6,"#ff8fd0");txt("私たちの宇宙（膜）","#9fd0ff").position.set(-2.6,3.1,0);txt("もう1枚の膜","#ffb3dd").position.set(2.6,3.1,0);
    const ax=arrow(V(1,0,0),4.4,DCOL[10]);ax.position.set(-2.2,-2.9,0);txt("11次元目","#fff").position.set(0,-3.4,0);
    for(let i=0;i<5;i++){const s=vstring(1+i%2,false,"#ffcf5a",.9,.18);s.position.set(-2.15,-1.6+i*.8,(i%2-.5)*2);s.rotation.y=Math.PI/2;s.rotation.x=Math.PI/2;}
    const gs=[0,1,2].map(i=>vstring(2+i%2,true,"#c99cf2",.9,.08));anims.push(t=>gs.forEach((g,i)=>{const u=((t*.18+i/3)%1);g.position.set(-2.4+u*4.8,Math.sin(t+i*2)*1.2,Math.cos(t*.7+i)*1.5);}));
    txt("物質・光（ひもの端が膜にくっつく）","#ffcf5a").position.set(-2.6,-2.3,-3.2);txt("重力子（膜のあいだも飛べる）","#c99cf2").position.set(1,1.9,0);
    return [9,"11次元：M理論","1995年にウィッテンが提案したM理論では、空間10次元＋時間1次元の11次元。ホジャヴァとウィッテンのモデルでは、11次元目は2枚の「膜（ブレーン）」にはさまれた短い区間で、私たちの宇宙はその片方の膜だと考える。物質や光は膜から離れられないが、重力子は膜のあいだを行き来できる。M理論の完全な形はまだ分かっていない。"];}
  // ---- 表示 ----
  function shadows(s){if(!keyL)return;keyL.castShadow=true;keyL.position.set(s*.9,s*1.8,s*1.1);keyL.target.position.set(0,s*.25,0);scene.add(keyL.target);const c=keyL.shadow.camera;c.left=-s*1.3;c.right=s*1.3;c.top=s*1.3;c.bottom=-s*1.3;c.near=.05;c.far=s*7;c.updateProjectionMatrix();
    keyL.shadow.mapSize.set(2048,2048);keyL.shadow.bias=-.0004;keyL.shadow.normalBias=.02;root.traverse(o=>{if(o.isMesh){const tn=o.material&&o.material.isMeshToonMaterial,bs=o.material&&o.material.isMeshBasicMaterial;o.castShadow=!(o.material&&o.material.transparent)&&!bs;o.receiveShadow=!tn;}});}
  function build(id,dir){const L=LEVELS[LV];cur=id;seed=7+[...String(id)].reduce((a,c)=>a+c.charCodeAt(0),0);
    const bg={life:"#0e1a24",cell:"#1a0e1e",microbe:"#0e1e1a",virus:"#1e0e14",mol:"#0a0f1f",atom:"#05070f",nucleus:"#05050a",quark:"#050308",particle:"#04030a",quantum:"#020208",string:"#050212",dims:"#04030c"}[L.id]||L.bg||"#05070f";setup(bg);root.position.set(0,0,0);root.rotation.set(0,0,0);
    let size=6,title="",desc="",meta="",orgTy=null;
    if(XB[L.id]){const r=XB[L.id](id);size=r[0];title=r[1];desc=r[2];meta=L.fic?`<p class="clim">※仮説・空想を含む段階です。</p>`:"";}
    else if(L.id==="life"){const o=ORGS.find(x=>x[0]===id);ground(o[6]==="whale"||o[6]==="fish"||o[6]==="octopus"||o[6]==="jelly"||o[6]==="starfish"||o[6]==="crab"||o[6]==="turtle"?"#1a3a5a":"#2a3a2a",8);const oc={root,anims,R,id:o[0]};const cs=window.CUTE&&CUTE.has(o[6])?CUTE.build(o[6],o[7],oc):null;if(cs){scene.traverse(l=>{if(l.isHemisphereLight){l.intensity=.62;l.color.set("#fff4ea");l.groundColor.set("#5a6078");}else if(l.isDirectionalLight)l.intensity=l===keyL?.62:.22;});}size=cs||(window.ORG3D&&ORG3D.has(o[6])?ORG3D.build(o[6],o[7],oc):null)||B[o[6]](o[7])||4;orgTy=oc.ty;shadows(size);title=o[1];meta=`<dl class="kdl"><dt>分類</dt><dd>${o[2]}</dd><dt>大きさ</dt><dd>${o[3]}</dd><dt>すみか</dt><dd>${o[4]}</dd></dl>`;desc=o[5];}
    else if(L.id==="cell"||L.id==="microbe"||L.id==="virus"){const o=MICROS.find(x=>x[0]===id);const hc={root,anims,R};const hq=window.MICROHQ&&MICROHQ.has(o[5])?MICROHQ.build(o[5],o[6],hc):null;size=hq||BM[o[5]](o[6])||8;if(hc.cam){cam.th=hc.cam.th;cam.ph=hc.cam.ph;}title=o[1];meta=`<dl class="kdl"><dt>なかま</dt><dd>${o[2]}</dd><dt>大きさ</dt><dd>${o[3]}</dd></dl>`;desc=o[4];}
    else if(L.id==="mol"){const o=MOLS.find(x=>x[0]===id);size=molecule(id);title=o[1];meta=`<div class="num" style="font-size:18px;color:var(--accent)">${o[2]}</div>`;desc=o[3]+`<br><span class="clim">原子：${[...new Set(o[4].map(a=>a[0]))].map(e=>`<i class="adot" style="background:${ATOMCOL[e]}"></i>${e}`).join(" ")}</span>`;}
    else if(L.id==="atom"){const Z=+id;size=atom(Z);const el=ELEMENTS[Z-1];title=`${el.ja}（${el.sym}）`;meta=`<dl class="kdl"><dt>陽子</dt><dd>${Z}</dd><dt>電子</dt><dd>${Z}（殻ごとに ${shells(Z).join("・")}）</dd></dl>`;desc=(ENOTE[Z]||"")+" 電子の並び方（殻）が、その元素の化学的な性質を決める。";}
    else if(L.id==="nucleus"){const Z=+id;size=nucleus(Z);const el=ELEMENTS[Z-1];const N=Math.round(parseFloat(String(el.m).replace(/[\[\]]/g,"")))-Z;title=`${el.ja}の原子核`;meta=`<dl class="kdl"><dt>陽子（赤）</dt><dd>${Z}</dd><dt>中性子（灰）</dt><dd>${N}</dd></dl>`;desc=Z>82?"陽子が多すぎると反発が強くなり、原子核は不安定になって壊れる（放射性）。":Z===26?"鉄の原子核は最も安定。恒星の核融合は鉄で止まる。":"";}
    else if(L.id==="particle"){size=particleField(id);const P=PARTICLES.find(x=>x[0]===id);title=`${P[1]}（${P[0]}）`;meta=`<dl class="kdl"><dt>種類</dt><dd>${PCAT[P[2]][0]}</dd><dt>質量</dt><dd>${P[4]}</dd><dt>電荷</dt><dd>${P[3]}</dd><dt>発見</dt><dd>${P[5]?P[5]+"年":"未発見"}</dd></dl>`;desc=P[6];}
    else if(L.id==="quantum"){const r=quantum(id);size=r[0];title=r[1];desc=r[2];meta="";}
    else if(L.id==="dims"){const r=dims(id);size=r[0];const sk=Math.max(1,size/7.5);root.traverse(o=>{if(o.isSprite)o.scale.multiplyScalar(sk);});title=r[1];desc=r[2];meta=+id.slice(1)>=5?`<p class="clim">※5次元目より先（余剰次元）は、超ひも理論・M理論の仮説です。実験ではまだ見つかっていません。</p>`:"";}
    else if(L.id==="string"){const r=strings(id);size=r[0];title=r[1];desc=r[2];meta=`<p class="clim">※超ひも理論は数学的には有力だが、実験で確かめられていない仮説です。</p>`;}
    else{size=quarks(id);title=id==="p"?"陽子":"中性子";meta=`<dl class="kdl"><dt>クオーク</dt><dd>${id==="p"?"アップ2個＋ダウン1個":"アップ1個＋ダウン2個"}</dd><dt>電荷</dt><dd>${id==="p"?"+2/3+2/3−1/3 ＝ +1":"+2/3−1/3−1/3 ＝ 0"}</dd></dl>`;desc="陽子の質量のうち、クオーク自体の質量はわずか約1%。残りはクオークとグルーオンの運動と結合のエネルギー（E=mc²）から生まれている。";}
    L.dist=Math.max(4,size*(L.id==="life"?1.9:1.5));L.ty=L.id==="life"?(orgTy!=null?orgTy:Math.min(size*.38,8)):0;cam.goal=L.dist;cam.r=dir==="in"?L.dist*2.2:dir==="out"?L.dist*.4:L.dist;cam.auto=true;
    list.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.it===String(id)));
    info.innerHTML=`<div class="splv">${lvNo(L)}　${L.scale}</div><h3>${L.name}</h3><p>${L.desc}</p>${window.lvMore?window.lvMore(L.id):""}<div class="spobj"><h4>${title}</h4>${meta}<p>${desc}</p></div><p class="sphint">ドラッグで回転、ホイールで拡大縮小。さらに拡大すると、選んでいるものの「中」（次の小さな世界）へ、縮小すると来た場所へ戻ります。</p>`;}
  function frame(now){if(!running)return;requestAnimationFrame(frame);const t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000||0);last=now;if(!scene)return;
    anims.forEach(f=>f(t));if(cam.auto&&!cam.drag)cam.th+=dt*.15;cam.r+=(cam.goal-cam.r)*.08;
    const ty=LEVELS[LV].ty||0;camera.position.set(Math.sin(cam.th)*Math.sin(cam.ph)*cam.r,ty+Math.cos(cam.ph)*cam.r,Math.cos(cam.th)*Math.sin(cam.ph)*cam.r);camera.lookAt(0,ty,0);renderer.render(scene,camera);}
  let started=false;
  function start(){init();if(!started){started=true;go(LV);}if(running)return;running=true;last=performance.now();requestAnimationFrame(frame);}
  function stop(){running=false;}
  function open(kind,v){const i=LEVELS.findIndex(L=>L.id===kind);if(i<0)return;start();go(i,v);}
  window.addEventListener("hashchange",()=>{location.hash==="#micro"?start():stop();});if(location.hash==="#micro")start();
  return {open,go,start,stop,LEVELS,zin,zout,get item(){return cur;},get level(){return LV;}};
})();
window.MICRO=MICRO;
// 世界地図 ⇄ ミクロ
window.toMicro=()=>{const v=document.getElementById("veil");v.textContent="ミクロの世界へ…";v.classList.add("on");setTimeout(()=>{location.hash="micro";MICRO&&MICRO.open("life");setTimeout(()=>v.classList.remove("on"),350);},450);};
window.addEventListener("micro-loop",()=>{const v=document.getElementById("veil");v.textContent="一周して、宇宙のいちばん外側「無」へ…";v.classList.add("on");setTimeout(()=>{location.hash="space-map";setTimeout(()=>{if(typeof SPZ!=="undefined"&&SPZ)SPZ.goBr("void");setTimeout(()=>v.classList.remove("on"),700);},300);},1100);});
window.toMapFromMicro=()=>{const v=document.getElementById("veil");v.textContent="世界地図へ…";v.classList.add("on");setTimeout(()=>{location.hash="world-map";setTimeout(()=>v.classList.remove("on"),350);},450);};
