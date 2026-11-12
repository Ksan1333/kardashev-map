  // ---- 追加の段階：体と器官／細胞の中／生体分子／物質／プランク長より下（仮説→空想） ----
  const lbl=(t,x,y,z,col="#fff",k=1)=>{const s=txt(t,col);s.position.set(x,y,z);s.scale.multiplyScalar(k);return s;};
  const blob=(n,rx,ry,rz,col,r0=.18,p=root,cx=0,cy=0,cz=0)=>{const g=new THREE.Group();g.position.set(cx,cy,cz);p.add(g);const geo=new THREE.SphereGeometry(r0,10,8),m=M(col,{roughness:.55});
    const im=new THREE.InstancedMesh(geo,m,n);const o=new THREE.Object3D();for(let i=0;i<n;i++){let x,y,z;do{x=R()*2-1;y=R()*2-1;z=R()*2-1;}while(x*x+y*y+z*z>1);o.position.set(x*rx,y*ry,z*rz);o.scale.setScalar(.7+R()*.6);o.updateMatrix();im.setMatrixAt(i,o.matrix);}g.add(im);return g;};
  const bumpy=(r,col,amp,freq,sx=1,sy=1,sz=1,colorFn)=>{const g=new THREE.SphereGeometry(r,96,64);const P=g.attributes.position,cols=[];const v=new THREE.Vector3();
    for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i);const n=v.clone().normalize();const w=n.x*freq+Math.sin(n.y*freq*.45+n.z*2.1)*1.6+Math.sin(n.z*freq*.35)*1.2;const d=(1-Math.abs(Math.sin(w)))*.9-.45+(1-Math.abs(Math.sin(n.y*freq*.8+Math.sin(n.x*4.3)*1.5)))*.4;v.addScaledVector(n,d*amp);v.x*=sx;v.y*=sy;v.z*=sz;P.setXYZ(i,v.x,v.y,v.z);if(colorFn){const c=C(colorFn(n,d));cols.push(c.r,c.g,c.b);}}
    if(colorFn)g.setAttribute("color",new THREE.Float32BufferAttribute(cols,3));g.computeVertexNormals();return new THREE.Mesh(g,M(colorFn?"#ffffff":col,{roughness:.7,vertexColors:!!colorFn}));};
  const lines=(seg,col,op=.9)=>{const l=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op}));root.add(l);return l;};
  const XLV=[
   {id:"body",ln:"main",name:"体と器官",scale:"約1mm〜2m",bg:"#120e16",desc:"人の体は約37兆個の細胞が集まって「組織」になり、組織が集まって「器官」（心臓・脳・肺など）になる。器官を選んでさらにズームインすると、その器官を作る細胞へ。",dist:9,
    items:()=>[["bodyall","人の体（主な器官）","全身の器官の配置"],["heart","心臓","1日約10万回の拍動"],["brain","脳","約860億個の神経細胞"],["lung","肺","約3〜5億個の肺胞"],["eye","目","カメラのような構造"],["skin","皮膚の断面","体で最大の器官"],["bone","骨の中","硬い骨と骨髄"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"inc",ln:"inc",name:"細胞の中（細胞小器官）",scale:"約0.1〜10μm",bg:"#150a1c",desc:"細胞の中には、役割の決まった小さな部屋（細胞小器官）がある。工場にたとえると、核が設計図の保管庫、ミトコンドリアが発電所、小胞体とゴルジ体が製造と出荷。選んでズームインすると、そこで働く分子（タンパク質やDNA）へ。",dist:9,
    items:()=>[["onuc","核","設計図（DNA）の保管庫"],["mito","ミトコンドリア","エネルギー（ATP）の発電所"],["chloro","葉緑体","光で糖を作る（植物）"],["er","小胞体とゴルジ体","タンパク質の製造と出荷"],["lyso","リソソーム","古くなった部品の分解"],["cytosk","細胞骨格","細胞の骨組みと線路"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"biomol",ln:"main",name:"生体分子（命の機械）",scale:"約2〜100nm",bg:"#08101e",desc:"細胞の中で働く巨大な分子。タンパク質は20種類のアミノ酸が数百個つながって折りたたまれたもので、形がそのまま働き（はたらき）を決める。モーターのように回るもの、歩くものまである。",dist:9,
    items:()=>[["chromatin","DNAとヒストン（染色体）","2mのDNAを核に詰める"],["hemo","ヘモグロビン","酸素を運ぶ"],["atpsyn","ATP合成酵素","回転するモーター"],["ribo","リボソーム","タンパク質の製造機"],["membrane","細胞膜","脂質の二重の膜"],["kinesin","キネシン","線路を歩くタンパク質"],["antibody","抗体","Y字の見張り役"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"matter",ln:"main",name:"物質（原子の並び方）",scale:"約0.1〜5nm",bg:"#060a14",desc:"同じ原子でも、並び方で性質がまったく変わる。炭素はダイヤモンドにも鉛筆の芯（黒鉛）にもなり、水は並び方しだいで氷にも液体にもなる。選んでズームインすると、その中心の原子へ。",dist:9,
    items:()=>[["ice","氷","すき間の多い六角形"],["water","液体の水","水素結合がつながっては切れる"],["graphene","黒鉛とグラフェン","炭素の六角形のシート"],["metal","金属（銅）","自由電子の海"],["salt","食塩の結晶","Na⁺とCl⁻の立方体"],["glass","ガラス","並びに規則がない固体"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"planck",ln:"deep",name:"プランク長の世界（仮説）",scale:"約10⁻³⁵m・10⁻⁴⁴秒",bg:"#05030c",fic:1,desc:"ここから先は仮説。重力と量子力学をまとめる理論（量子重力）はまだ完成していない。プランク長（約1.6×10⁻³⁵m）では時空そのものが粒のようになっている、という考えがいくつも提案されている。どれも実験では確かめられていない。",dist:9,
    items:()=>[["pfoam","時空の泡","ホイーラーの考え"],["spinnet","スピンネットワーク","ループ量子重力"],["causal","因果集合","時空は「点と順番」"],["holo","ホログラフィー原理","情報は表面に書ける"],["pstring","超ひも","→ 理論の分岐へ"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"bit",ln:"deep",name:"情報の最小単位（仮説＋空想）",scale:"プランク長より下？",bg:"#04030a",fic:1,desc:"「物質のいちばん底は、粒でもひもでもなく『情報』なのでは」という考え。物理学者ホイーラーの「It from bit（すべては情報から）」などの思想がもとになっているが、科学的に確かめる方法はまだない。ここからは空想の色が濃い。",dist:9,
    items:()=>[["itbit","It from bit","粒子は情報からできている？"],["simul","計算する宇宙","宇宙はセル・オートマトン？"],["pixel","ピクセルの時空","最小の長さと最小の時間"]].map(([id,name,sub])=>({id,name,sub}))},
   {id:"bottom",ln:"deep",name:"描けない底（空想）",scale:"—",bg:"#000000",fic:1,desc:"ミクロの地図のいちばん底。ここより小さな世界は、今の物理学では言葉にも図にもできない。宇宙マップの「いちばん外側」と同じく、ここも一周してつながっている…という空想で閉じた。さらにズームインすると、宇宙のいちばん大きなスケール（宇宙の形）へ。",dist:9,
    items:()=>[["uroboros","宇宙のウロボロス","最小と最大がつながる"],["abyss","底のない底","さらにズームインすると…"]].map(([id,name,sub])=>({id,name,sub}))},
  ];
  const XB={
   body(id){
    if(id==="bodyall"){const sk=G("#cfe6ff",.12);sph(.55,sk,0,3.4,0,.85,1,.9);cyl(.18,.2,.35,sk,0,2.75,0);sph(1,sk,0,1.6,0,.95,1.35,.55);sph(.8,sk,0,.25,0,1,.7,.6);
      [[-1,1],[1,1]].forEach(([s])=>{limb(V(s*.95,2.5,0),V(s*1.25,1,0),.2,sk);limb(V(s*1.25,1,0),V(s*1.35,-.2,.1),.16,sk);limb(V(s*.4,-.2,0),V(s*.45,-2,0),.28,sk);limb(V(s*.45,-2,0),V(s*.45,-3.6,0),.2,sk);});
      const br=bumpy(.42,"#e8a0a8",.025,10,1,.8,1.1);br.position.set(0,3.5,0);root.add(br);
      const lungM=M("#e88a9a",{roughness:.8});sph(.42,lungM,-.42,1.95,0,1,1.5,.8);sph(.42,lungM,.42,1.95,0,1,1.5,.8);
      const ht=sph(.24,M("#c0242c",{roughness:.4}),.12,1.75,.22,1,1.2,.9);anims.push(t=>ht.scale.setScalar(1+Math.max(0,Math.sin(t*7.5))*.08));
      sph(.5,M("#7a2a1a",{roughness:.6}),-.3,1.05,.1,1.3,.55,.7);sph(.28,M("#e0a050",{roughness:.6}),.35,1.0,.15,1.1,.8,.7);
      const gut=[];for(let i=0;i<60;i++){const a=i*.9;gut.push(V(Math.cos(a)*(.45-i*.003),.5-i*.012,Math.sin(a)*.2+.1));}tube(gut,.07,M("#e8b0a0",{roughness:.7}),root,200);
      sph(.12,M("#8a2a3a"),-.3,.7,-.25,1,1.4,.8);sph(.12,M("#8a2a3a"),.3,.7,-.25,1,1.4,.8);
      lbl("脳",.9,3.6,0,"#ffd0d8",.8);lbl("肺",-1.1,2.1,0,"#ffc0c8",.8);lbl("心臓",.9,1.75,.3,"#ff8a8a",.8);lbl("肝臓",-1.2,1.0,0,"#d08a6a",.8);lbl("胃",1.0,1.05,0,"#ffd27a",.8);lbl("腸",1.0,.2,0,"#ffd8c8",.8);
      return [9,"人の体（主な器官）","体は約37兆個の細胞からできている（2013年の推定）。脳は体重の約2%なのに、エネルギーの約20%を使う。腸の長さは小腸だけで約6〜7m。"];}
    if(id==="heart"){const g=new THREE.Group();root.add(g);const mus=M("#b0262e",{roughness:.45}),art=M("#d8484a",{roughness:.4}),ven=M("#4a5ad8",{roughness:.4});
      sph(1.15,mus,.15,-.2,0,1,1.15,.9,g);sph(.85,M("#a02028",{roughness:.45}),-.55,.35,.1,1,1,.9,g);sph(.7,M("#8a1e30"),.6,.55,-.2,1,1,.9,g);
      tube([V(.1,.6,0),V(.15,1.8,0),V(-.4,2.4,0),V(-1.1,2.1,0),V(-1.3,1.2,-.2)],.28,art,g,40);[[-.3,2.35],[-.6,2.4],[-.85,2.3]].forEach(([x,y])=>tube([V(x,y,0),V(x,y+.7,0)],.08,art,g,8));
      tube([V(-.3,.5,.4),V(-.1,1.5,.5),V(.8,1.9,.4),V(1.4,1.6,.3)],.22,M("#5a6ae8"),g,30);tube([V(-1.0,.3,-.2),V(-1.1,1.6,-.3),V(-1.15,2.6,-.3)],.22,ven,g,20);
      const cor=M("#ff7a50",{roughness:.4});tube([V(-.1,.4,.85),V(.2,-.3,1.0),V(.4,-1.0,.8),V(.3,-1.5,.4)],.05,cor,g,30);tube([V(-.2,.4,.8),V(-.7,0,.75),V(-.9,-.6,.5)],.05,cor,g,30);
      anims.push(t=>{const b=Math.max(0,Math.sin(t*7.5));g.scale.set(1-b*.04,1-b*.05,1-b*.04);});
      lbl("大動脈",-1.5,2.5,0,"#ff9a9a",.8);lbl("右心房",-1.6,.4,.5,"#d0d8ff",.8);lbl("左心室",1.4,-.6,.6,"#ffb0b0",.8);lbl("冠動脈",.7,-1.4,1.0,"#ffb070",.8);lbl("肺動脈",1.6,1.9,.3,"#b0b8ff",.8);
      return [6,"心臓","握りこぶしほどの大きさ（約250〜350g）。1分間に約60〜80回、1日に約10万回拍動し、1回に約70mlの血液を送り出す。4つの部屋（右心房・右心室・左心房・左心室）がある。冠動脈は心臓自身に血を送る血管。"];}
    if(id==="brain"){const lobe=(n,d)=>{const y=n.y,z=n.z;const base=z>.35?"#e8a8b0":(y<-.1&&Math.abs(n.x)>.5)?"#a8d0e8":z<-.45?"#c8e8a8":"#e8d0a0";return d>.15?"#f0c8c8":base;};
      [-1,1].forEach(s=>{const h=bumpy(1.2,"#e8b0b8",.06,11,.62,.85,1.15,lobe);h.position.set(s*.66,.3,0);root.add(h);});
      const cb=bumpy(.6,"#d89098",.025,20,1.5,.7,.9);cb.position.set(0,-.65,-.95);root.add(cb);cyl(.22,.16,1.2,M("#d8a0a8"),0,-1.2,-.5);
      lbl("前頭葉（考える・計画）",0,1.6,1.3,"#ffc8d0",.75);lbl("頭頂葉（感覚）",0,1.75,-.3,"#ffe8b8",.75);lbl("側頭葉（聞く・記憶）",1.9,-.2,.4,"#b8e0ff",.75);lbl("後頭葉（見る）",0,.6,-1.9,"#d0f0b8",.75);lbl("小脳（体のバランス）",0,-1.2,-1.8,"#ffb0b8",.75);
      return [6,"脳","重さ約1.3〜1.4kg。大脳の表面のしわ（大脳皮質）を広げると新聞紙1枚ほど。神経細胞は約860億個、それぞれが数千個の神経細胞とつながっている。色分けは役割の目安。"];}
    if(id==="lung"){const lg=G("#ff9aa8",.16);sph(1.1,lg,-1.0,0,0,.85,1.5,.75);sph(1.1,lg,1.0,0,0,.8,1.45,.75);const aw=M("#f0e0d0",{roughness:.6}),seg=[],tips=[];
      tube([V(0,2.4,0),V(0,1.2,0)],.13,aw,root,6);const br=(o,dir,len,r,dp)=>{const e=o.clone().addScaledVector(dir,len);if(dp<3)tube([o,e],r,aw,root,4);else seg.push(o,e);if(dp<7){const ax=V(R()-.5,R()-.5,R()-.5);br(e,dir.clone().applyAxisAngle(ax.normalize(),.45).normalize(),len*.72,r*.7,dp+1);br(e,dir.clone().applyAxisAngle(ax,-.5).normalize(),len*.72,r*.7,dp+1);}else tips.push(e);};
      br(V(0,1.2,0),V(-.6,-.8,0).normalize(),.7,.1,0);br(V(0,1.2,0),V(.6,-.8,0).normalize(),.7,.1,0);lines(seg,"#f0d8c8",.8);
      const am=M("#ff8a9a",{roughness:.5});tips.forEach(p=>{for(let k=0;k<3;k++)sph(.045,am,p.x+(R()-.5)*.08,p.y+(R()-.5)*.08,p.z+(R()-.5)*.08);});
      anims.push(t=>{const b=1+Math.sin(t*1.6)*.025;root.scale.set(b,b,b);});
      lbl("気管",.7,2.3,0,"#fff",.8);lbl("気管支（枝分かれ約23回）",0,-1.9,.9,"#ffe0d0",.8);lbl("肺胞（ふくろ）",1.9,-1.2,.6,"#ff9aa8",.8);
      return [7,"肺","気管は約23回枝分かれして、先端は直径約0.2mmの肺胞というふくろになる。肺胞は約3〜5億個、広げた表面積はテニスコートの1/3ほど（約70m²）。ここで酸素と二酸化炭素を交換する。"];}
    if(id==="eye"){const scl=new THREE.Mesh(new THREE.SphereGeometry(1.2,64,48,0,Math.PI*1.5),M("#f2efe8",{roughness:.5,side:THREE.DoubleSide}));root.add(scl);
      const ret=new THREE.Mesh(new THREE.SphereGeometry(1.14,64,48,0,Math.PI*1.5),M("#c0403a",{roughness:.6,side:THREE.BackSide}));root.add(ret);
      const cor=sph(.55,G("#cfefff",.25),0,0,.98,1,1,.5);const iris=new THREE.Mesh(new THREE.RingGeometry(.18,.5,48),M("#3a7ac0",{roughness:.4,side:THREE.DoubleSide}));iris.position.z=.92;root.add(iris);
      const pupil=new THREE.Mesh(new THREE.CircleGeometry(.18,32),new THREE.MeshBasicMaterial({color:"#000"}));pupil.position.z=.915;root.add(pupil);anims.push(t=>{const k=1+Math.sin(t*.7)*.25;pupil.scale.setScalar(k);});
      sph(.38,G("#fff6d0",.55),0,0,.72,1,1,.45);cyl(.2,.22,1.2,M("#f0d8a0"),0,0,-1.6).rotation.x=Math.PI/2;
      lbl("角膜",0,.8,1.3,"#cfefff",.75);lbl("水晶体（レンズ）",.9,.5,.7,"#fff0b0",.75);lbl("虹彩（ひとみの大きさを変える）",0,-.9,1.2,"#9ac8ff",.7);lbl("網膜（光を感じる）",-1.4,.6,-.4,"#ff9a90",.75);lbl("視神経",0,.5,-2.1,"#ffe0a0",.75);
      return [5,"目","直径約24mm。角膜と水晶体がレンズ、網膜がカメラのセンサーにあたる。網膜には光を感じる細胞が約1億2000万個（明暗用の桿体）と約600万個（色用の錐体）ある。"];}
    if(id==="skin"){const W=4,D=3;const box=(h,y,col)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(W,h,D),M(col,{roughness:.85}));m.position.y=y;root.add(m);};
      box(.25,1.25,"#e8b08a");{const m=new THREE.Mesh(new THREE.BoxGeometry(W,1.4,D),G("#e88a8a",.32));m.position.y=.43;root.add(m);root.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:"#ffb0b0",transparent:true,opacity:.5})).translateY(.43));}for(let i=0;i<130;i++)sph(.17,M("#f6d870",{roughness:.6}),(R()-.5)*3.7,-.95+(R()-.5)*.85,(R()-.5)*2.7);
      for(let i=0;i<5;i++){const x=-1.6+i*.8,z=(R()-.5)*1.6;tube([V(x,-.2,z),V(x+.05,.6,z),V(x+.1,1.4,z),V(x+.35,2.2,z)],.025,M("#3a2a20"),root,10);sph(.09,M("#d07a6a"),x,-.25,z,1,1.6,1);}
      const sw=[];for(let k=0;k<40;k++){const a=k*.8;sw.push(V(1.2+Math.cos(a)*.12,-.5+k*.004,.9+Math.sin(a)*.12));}sw.push(V(1.25,1.0,.9),V(1.25,1.38,.9));tube(sw,.03,M("#9ad0ff"),root,120);
      tube([V(-2,-.2,1),V(-.5,0,.6),V(1,-.1,1.2),V(2,.1,.8)],.06,M("#d8343a"),root,40);tube([V(-2,-.35,.3),V(-.4,-.25,-.4),V(1.2,-.3,.1),V(2,-.2,-.5)],.06,M("#3a52c8"),root,40);
      lbl("表皮（約0.1〜0.2mm）",-2.9,1.3,0,"#ffe0c8",.7);lbl("真皮",-2.9,.45,0,"#ffc0c0",.7);lbl("皮下脂肪",-2.9,-.9,0,"#fff0a0",.7);lbl("毛",-.6,2.3,0,"#fff",.7);lbl("汗腺",1.9,-.6,1,"#b8e0ff",.7);
      return [7,"皮膚の断面","皮膚は体で最大の器官で、大人で面積約1.6m²、重さは体重の約16%（皮下脂肪を除く）。表皮は約4週間で入れ替わる。真皮には血管・神経・汗腺・毛の根元がある。"];}
    if(id==="bone"){const cmp=M("#f2ead8",{roughness:.6});const sh=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2.2,64,1,true),new THREE.MeshStandardMaterial({color:"#f2ead8",roughness:.6,side:THREE.DoubleSide}));root.add(sh);
      const inner=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,2.2,64,1,true),M("#e8dcc0",{side:THREE.DoubleSide}));root.add(inner);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.62,1,64,1),M("#fff6e0",{side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=1.1;root.add(ring);
      for(let i=0;i<60;i++){const a=R()*Math.PI*2,r=.68+R()*.28;const o=new THREE.Mesh(new THREE.TorusGeometry(.04,.012,6,16),M("#c8b890"));o.rotation.x=-Math.PI/2;o.position.set(Math.sin(a)*r,1.105,Math.cos(a)*r);root.add(o);}
      sph(.4,M("#c8343a",{roughness:.7}),0,.5,0,1,1.6,1);const sp=[];for(let i=0;i<260;i++){const a=V((R()-.5)*1.2,(R()-.5)*2.1,(R()-.5)*1.2);if(a.x*a.x+a.z*a.z>.36)continue;sp.push(a,a.clone().add(V((R()-.5)*.4,(R()-.5)*.4,(R()-.5)*.4)));}lines(sp,"#f8f0e0",.8);
      lbl("緻密骨（かたい外側）",1.8,1.6,0,"#fff",.75);lbl("骨単位（オステオン）",0,1.7,.8,"#e0d0a0",.75);lbl("骨髄（血液を作る）",1.6,-.4,0,"#ff9a9a",.75);
      return [5,"骨の中（輪切り）","骨の外側は硬い緻密骨で、年輪のような「骨単位」が並ぶ。内側の骨髄では、赤血球などの血液の細胞が1秒間に約200万〜300万個作られている。骨は約10年で全部入れ替わるといわれる。"];}},
   inc(id){
    if(id==="onuc"){const env=sph(2,G("#9a7ad8",.18),0,0,0);sph(2.08,G("#b89af0",.1),0,0,0);for(let i=0;i<70;i++){const n=V(R()-.5,R()-.5,R()-.5).normalize();const p=new THREE.Mesh(new THREE.TorusGeometry(.07,.025,6,16),M("#e0d0ff"));p.position.copy(n.clone().multiplyScalar(2.04));p.lookAt(0,0,0);root.add(p);}
      sph(.55,M("#5a2a7a",{roughness:.7}),.5,.3,-.2);for(let k=0;k<14;k++){const pts=[];let p=V((R()-.5)*2,(R()-.5)*2,(R()-.5)*2);for(let i=0;i<14;i++){p=p.clone().add(V(R()-.5,R()-.5,R()-.5).multiplyScalar(.6));if(p.length()>1.7)p.multiplyScalar(1.6/p.length());pts.push(p);}tube(pts,.04,M(["#ff9ad0","#9fe8ff","#ffd27a"][k%3],{roughness:.5}),root,80);}
      lbl("核膜（二重の膜）",2.6,1.5,0,"#d0c0ff",.8);lbl("核膜孔（出入り口）",-2.4,1.8,.5,"#e8dcff",.8);lbl("核小体（リボソームを作る）",1.4,.9,0,"#c8a0e0",.8);lbl("染色体（DNA）",-1.2,-1.2,1,"#ffc8e0",.8);
      return [7,"核","細胞の設計図であるDNAを守る部屋。人の細胞1個のDNAは伸ばすと約2m。それが直径約6μmの核に収まっている。核膜孔は約2000〜3000個あり、RNAやタンパク質が出入りする。"];}
    if(id==="mito"){const out=sph(1,G("#ff9a6a",.18),0,0,0,2.4,1,1);const inn=M("#ff7a4a",{roughness:.5,side:THREE.DoubleSide});
      for(let i=0;i<9;i++){const x=-1.9+i*.48;const c=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.07,32,1,false,0,Math.PI*(1.1+R()*.5)),inn);c.rotation.z=Math.PI/2;c.rotation.x=R()*3;c.position.x=x;c.scale.set(1,1,.9);root.add(c);
        for(let k=0;k<8;k++){const a=R()*6.28;sph(.05,M("#ffe08a"),x+.05,Math.cos(a)*.55,Math.sin(a)*.55);}}
      const mt=[];for(let i=0;i<300;i++){mt.push((R()-.5)*4,(R()-.5)*1.4,(R()-.5)*1.4);}const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(mt,3));root.add(new THREE.Points(pg,new THREE.PointsMaterial({color:"#ffd0a0",size:.03})));
      lbl("外膜",0,1.35,0,"#ffc8a8",.8);lbl("クリステ（ひだの膜）",-1.6,-1.25,.4,"#ff9a6a",.8);lbl("ATP合成酵素（黄色の粒）",1.6,-1.2,.5,"#ffe08a",.8);
      return [6,"ミトコンドリア","長さ約1〜10μm。食べ物から取り出したエネルギーでATP（細胞のエネルギー通貨）を作る。人は1日に体重と同じくらいの量のATPを作っては使っている。もとは別の細菌が細胞に住み着いたものと考えられている（自前のDNAを持つ）。"];}
    if(id==="chloro"){sph(1,G("#7ad87a",.16),0,0,0,2.4,1.1,1.1);const tm=M("#2f9a3a",{roughness:.5});
      for(let i=0;i<7;i++){const x=-1.8+i*.6,y=(R()-.5)*.6,z=(R()-.5)*.5;for(let k=0;k<7;k++)cyl(.25,.25,.06,tm,x,y-.25+k*.085,z,root,24);if(i<6)add(new THREE.Mesh(new THREE.BoxGeometry(.6,.025,.3),tm),x+.3,y,z);}
      lbl("チラコイド（光を受ける膜）",0,1.4,0,"#a8f0a8",.8);lbl("グラナ（チラコイドの積み重ね）",-1.6,-1.0,.6,"#7ad87a",.8);lbl("ストロマ（糖を作る場所）",1.8,.9,.4,"#d0ffd0",.8);
      return [6,"葉緑体","植物や藻類の細胞にある。光のエネルギーで水と二酸化炭素から糖を作る（光合成）。地球の酸素のほとんどは、葉緑体（とその祖先のシアノバクテリア）が作った。"];}
    if(id==="er"){const erM=M("#8ab0ff",{roughness:.5,side:THREE.DoubleSide});for(let i=0;i<5;i++){const g=new THREE.Mesh(new THREE.TorusGeometry(1.4+i*.28,.07,8,64,Math.PI*1.2),erM);g.rotation.x=Math.PI/2;g.position.set(-1.5,(i-2)*.12,0);g.scale.set(1,1,.5+i*.05);root.add(g);
        for(let k=0;k<30;k++){const a=R()*Math.PI*1.2,r=1.4+i*.28;sph(.035,M("#3a4aa0"),-1.5+Math.cos(a)*r,(i-2)*.12+.08,Math.sin(a)*r*(.5+i*.05));}}
      const gM=M("#ffb070",{roughness:.5,side:THREE.DoubleSide});for(let i=0;i<6;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(1.2-i*.06,32,8,0,Math.PI*2,0,.5),gM);d.position.set(2.2,.6-i*.16,0);root.add(d);}
      const ves=[];for(let i=0;i<8;i++){const v=sph(.09,M("#c8d8ff"),0,0,0);ves.push([v,R()]);}anims.push(t=>ves.forEach(([v,o])=>{const k=(t*.15+o)%1;v.position.set(-.2+k*2.2,Math.sin(k*3.14)*.5+.2,Math.sin(o*20)*.4);}));
      lbl("粗面小胞体（リボソームつき）",-1.8,1.0,0,"#b8d0ff",.8);lbl("ゴルジ体（仕分けと出荷）",2.4,1.3,0,"#ffc890",.8);lbl("輸送小胞",.9,1.0,.4,"#e0e8ff",.8);
      return [7,"小胞体とゴルジ体","小胞体の表面のリボソームでタンパク質が作られ、小さな袋（小胞）に包まれてゴルジ体へ運ばれる。ゴルジ体は糖をつけて仕上げ、行き先ごとに仕分けて出荷する。"];}
    if(id==="lyso"){for(let i=0;i<6;i++){const p=V((R()-.5)*4,(R()-.5)*2.5,(R()-.5)*2);sph(.35+R()*.25,G("#e8a0ff",.3),p.x,p.y,p.z);for(let k=0;k<12;k++)sph(.04,M("#ffd27a"),p.x+(R()-.5)*.35,p.y+(R()-.5)*.35,p.z+(R()-.5)*.35);}
      sph(1,G("#c890ff",.2),0,0,0,1.3,1,1);sph(.5,G("#ff9a6a",.5),0,0,0,1.8,.8,.8);anims.push(t=>{const k=(Math.sin(t*.5)+1)/2;root.children[root.children.length-1].scale.set(1.8*(1-k*.5),.8*(1-k*.5),.8*(1-k*.5));});
      lbl("リソソーム",1.8,1.4,0,"#e0b8ff",.8);lbl("分解中の古いミトコンドリア",0,-1.3,.6,"#ffb890",.8);lbl("分解酵素（約60種類）",-1.8,1.4,0,"#ffe08a",.8);
      return [6,"リソソーム","中は酸性（pH約4.5〜5）で、約60種類の分解酵素が入っている。古くなった細胞小器官や取り込んだ細菌を分解してリサイクルする（オートファジー：2016年ノーベル賞・大隅良典）。"];}
    if(id==="cytosk"){sph(.18,M("#ffd27a"),0,0,0);const mt=M("#7ee0b0",{roughness:.4}),track=[];for(let i=0;i<22;i++){const d=V(R()-.5,R()-.5,R()-.5).normalize();const e=d.clone().multiplyScalar(3+R());tube([V(0,0,0),d.clone().multiplyScalar(1.5).add(V(R()-.5,R()-.5,R()-.5).multiplyScalar(.3)),e],.035,mt,root,20);if(i===0)track.push(d,e);}
      const ac=[];for(let i=0;i<400;i++){const n=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(3.2+R()*.4);ac.push(n,n.clone().add(V(R()-.5,R()-.5,R()-.5).multiplyScalar(.5)));}lines(ac,"#ff7a7a",.7);
      const v=sph(.2,M("#c8a0ff"),0,0,0);anims.push(t=>{const k=(t*.12)%1;v.position.copy(track[1].clone().multiplyScalar(k));});
      lbl("微小管（線路）",1.6,2.4,0,"#a8f0d0",.8);lbl("アクチン繊維（膜の下の網）",-2.6,2.6,0,"#ff9a9a",.8);lbl("中心体",.5,.5,0,"#ffe08a",.8);lbl("運ばれる小胞",track[1].x*.5,track[1].y*.5+.4,track[1].z*.5,"#d8c0ff",.8);
      return [8,"細胞骨格","細胞の形を保つ骨組みで、物を運ぶ線路でもある。微小管は直径約25nmの管で、キネシンなどのモータータンパク質がその上を歩いて荷物を運ぶ（生体分子の段階で拡大できる）。"];}},
   biomol(id){
    if(id==="chromatin"){const hm=M("#ffb070",{roughness:.45}),dna=M("#7fb2ff",{roughness:.35}),pts=[];const N=12;for(let i=0;i<N;i++){const a=i*.9,c=V(Math.cos(a)*1.6,i*.32-1.8,Math.sin(a)*1.6);const ax=V(-Math.sin(a),.3,Math.cos(a)).normalize();
        const h=add(new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.36,24),hm),c.x,c.y,c.z);h.quaternion.setFromUnitVectors(V(0,1,0),ax);
        const u=V(0,1,0).cross(ax).normalize(),w=ax.clone().cross(u).normalize();for(let k=0;k<=24;k++){const q=k/24*Math.PI*2*1.65;pts.push(c.clone().addScaledVector(u,Math.cos(q)*.52).addScaledVector(w,Math.sin(q)*.52).addScaledVector(ax,(k/24-.5)*.3));}}
      tube(pts,.06,dna,root,600);lbl("ヒストン（糸巻き）",2.4,1.2,0,"#ffc890",.8);lbl("DNA（約1.65周巻きつく）",-2.4,-1.4,0,"#a8c8ff",.8);lbl("ヌクレオソーム（直径約11nm）",0,2.4,0,"#fff",.8);
      return [6,"DNAとヒストン","DNAは「ヒストン」というタンパク質の糸巻きに約1.65周ずつ巻きつき（ヌクレオソーム）、それがさらに折りたたまれて染色体になる。こうして約2mのDNAが直径約6μmの核に収まる。巻き方の強さで、どの遺伝子が使われるかも変わる。"];}
    if(id==="hemo"){blob(260,1,1.2,.9,"#d83a3a",.2,root,-1,.9,0);blob(260,1,1.2,.9,"#d83a3a",.2,root,1,-.9,0);blob(260,1,1.2,.9,"#f0884a",.2,root,1,.9,0);blob(260,1,1.2,.9,"#f0884a",.2,root,-1,-.9,0);
      const hp=[[-1.4,1.2,.9],[1.4,-1.2,.9],[1.4,1.2,-.9],[-1.4,-1.2,-.9]];hp.forEach(([x,y,z])=>{const d=add(new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.05,6),M("#7a2a8a")),x,y,z);d.rotation.x=1.2;sph(.08,M("#c8c8d0",{metalness:.8,roughness:.3}),x,y,z);});
      const o2=[];hp.forEach(([x,y,z],i)=>{const g=new THREE.Group();root.add(g);sph(.12,M("#ff4d4d"),-.11,0,0,1,1,1,g);sph(.12,M("#ff4d4d"),.11,0,0,1,1,1,g);o2.push([g,V(x,y,z),i]);});
      anims.push(t=>o2.forEach(([g,p,i])=>{const k=(Math.sin(t*.6+i*1.6)+1)/2;g.position.copy(p).multiplyScalar(1+k*1.2);}));
      lbl("α鎖（赤）",-2.3,1.6,0,"#ff9a9a",.8);lbl("β鎖（オレンジ）",2.3,1.6,0,"#ffc890",.8);lbl("ヘム（鉄で酸素をつかむ）",0,-2.4,0,"#d8a0ff",.8);lbl("酸素 O₂",2.6,-2,0,"#ff8a8a",.8);
      return [6,"ヘモグロビン","赤血球の中に1個あたり約2億7000万個ある。4本の鎖それぞれに鉄を含む「ヘム」があり、酸素を1個ずつ、合計4個つかむ。1個つかむと形が変わり、残りもつかみやすくなる（協同性）。血が赤いのはヘムの色。"];}
    if(id==="atpsyn"){root.position.y=-1.1;for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++){if(x*x+z*z<5||x*x+z*z>26)continue;sph(.17,M("#d8c8a0"),x*.36,.62,z*.36);sph(.17,M("#d8c8a0"),x*.36,-.62,z*.36);}
      const rot=new THREE.Group();root.add(rot);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;cyl(.13,.13,1.3,M("#7fb2ff"),Math.cos(a)*.6,0,Math.sin(a)*.6,rot);}cyl(.12,.12,2.2,M("#ffd27a"),0,1.4,0,rot);
      const head=new THREE.Group();head.position.y=3;root.add(head);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sph(.48,M(i%2?"#ff8a8a":"#ff6aa0",{roughness:.45}),Math.cos(a)*.62,0,Math.sin(a)*.62,1,1.25,1,head);}
      tube([V(1.4,-.2,0),V(1.5,1.6,0),V(1.1,3.6,0)],.09,M("#c0c0c8"),root,20);
      const H=[];for(let i=0;i<6;i++){H.push([sph(.07,M("#fff07a",{emissive:"#605000"}),0,0,0),R()]);}anims.push(t=>{rot.rotation.y=t*1.2;H.forEach(([h,o])=>{const k=(t*.25+o)%1;h.position.set(.95,-1.8+k*3.6,0);});});
      lbl("F₁（ATPを作る頭、α3β3）",2.6,3.2,0,"#ff9ab8",.8);lbl("回転子（γ軸）",-1.5,1.8,0,"#ffe08a",.8);lbl("cリング（膜の中で回る）",-2.6,0,0,"#a8c8ff",.8);lbl("H⁺（水素イオン）の流れ",1.9,-1.3,0,"#fff07a",.8);lbl("ミトコンドリアの内膜",-2.6,-1.2,0,"#e8dcc0",.7);
      return [8,"ATP合成酵素","水素イオン（H⁺）が膜を通り抜ける流れで、軸が水車のように回る、本物の回転モーター。1回転でATPを3個作り、毎秒100回転以上する。回転していることは1997年に日本の研究チームが顕微鏡で直接見せた。"];}
    if(id==="ribo"){blob(420,1.6,1.1,1.3,"#5a8ad8",.2,root,0,.55,0);blob(240,1.3,.65,1.0,"#9ac8ff",.2,root,0,-.95,0);
      const mr=[];for(let i=0;i<=40;i++){const x=-3+i*.15;mr.push(V(x,-.45+Math.sin(i*.6)*.05,.9));}tube(mr,.05,M("#ffd27a"),root,80);for(let i=0;i<40;i++)sph(.06,M(["#ff6a6a","#6aff8a","#6a8aff","#ffd27a"][i%4]),-3+i*.15,-.35,.9);
      [[-.3,"#ff9a6a"],[.4,"#ffb07a"]].forEach(([x,c])=>{const g=new THREE.Group();g.position.set(x,.2,.7);root.add(g);cyl(.08,.08,.8,M(c),0,0,0,g);cyl(.08,.08,.6,M(c),.25,.4,0,g).rotation.z=Math.PI/2;});
      const chain=[];for(let i=0;i<24;i++)chain.push(sph(.1,M(["#ff8aa0","#8affc0","#c8a0ff","#ffe08a"][i%4]),0,0,0));anims.push(t=>{const n=Math.floor((t*2)%24)+1;chain.forEach((s,i)=>{s.visible=i<n;const k=i*.18;s.position.set(.2+Math.sin(k*2)*.3,1.8+k,Math.cos(k*2)*.3-.2);});});
      lbl("大サブユニット",2.3,1.2,0,"#a8c8ff",.8);lbl("小サブユニット",2.1,-1.4,0,"#cfe6ff",.8);lbl("mRNA（設計図のコピー）",-2.6,-.9,1,"#ffe08a",.8);lbl("tRNA（アミノ酸を運ぶ）",-1.2,.9,1.1,"#ffb090",.8);lbl("できていくタンパク質",1.4,4.6,0,"#ffc8d8",.8);
      return [7,"リボソーム","mRNAの暗号を3文字ずつ読み、tRNAが運んできたアミノ酸を1秒に約5〜20個つなげてタンパク質を作る。人の細胞1個に約1000万個ある。中心で反応を起こしているのはタンパク質ではなくRNA（リボザイム）。"];}
    if(id==="membrane"){const hd=M("#ffb070",{roughness:.4}),tl=M("#f0e8c8",{roughness:.6});for(let x=-7;x<=7;x++)for(let z=-4;z<=4;z++){if(Math.abs(x)<2&&Math.abs(z)<2)continue;const px=x*.4+(z%2)*.2,pz=z*.4;
        [1,-1].forEach(s=>{sph(.17,hd,px,s*1.05,pz);cyl(.035,.035,.75,tl,px-.06,s*.55,pz);cyl(.035,.035,.75,tl,px+.06,s*.55,pz);});}
      const ch=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,2.6,6,1,true),M("#7ad8a0",{side:THREE.DoubleSide,roughness:.4}));root.add(ch);for(let i=0;i<5;i++){const s=sph(.09,M("#9fe8ff"),0,0,0);anims.push(t=>{const k=((t*.3+i*.2)%1);s.position.set(0,2-k*4,0);});}
      sph(.2,M("#ff9ad0"),2.2,1.25,.4);tube([V(2.2,1.3,.4),V(2.5,1.8,.4),V(2.3,2.2,.5)],.05,M("#ff9ad0"),root,10);
      lbl("リン脂質の頭（水が好き）",-2.4,1.6,0,"#ffc890",.75);lbl("しっぽ（水が苦手）",-2.4,0,1.8,"#fff0d0",.75);lbl("チャネル（イオンの通り道）",.9,1.8,0,"#a8f0c8",.75);lbl("糖鎖（細胞の名札）",2.8,2.5,0,"#ffb8e0",.75);
      return [6,"細胞膜","厚さ約5nmの脂質の二重膜。水が好きな頭を外に、水が苦手なしっぽを内側に向けて自然に並ぶ。膜には通り道（チャネル）やポンプのタンパク質が埋まっていて、何を通すかを選んでいる。"];}
    if(id==="kinesin"){const tu=[M("#7ee0b0",{roughness:.4}),M("#4ab88a",{roughness:.4})];for(let i=0;i<34;i++)for(let k=0;k<13;k++){const a=k/13*Math.PI*2;sph(.12,tu[(i+k)%2],-4+i*.25,Math.sin(a)*.38-1,Math.cos(a)*.38);}
      const hA=sph(.22,M("#ffd27a"),0,0,0),hB=sph(.22,M("#ffb04a"),0,0,0);const stalk=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.6,8),M("#e0c890"));root.add(stalk);const ves=sph(.6,G("#c8a0ff",.6),0,0,0);
      anims.push(t=>{const ph=t*1.2,st=Math.floor(ph),f=ph-st;const base=-3+((st*.5)%6);const lift=Math.sin(f*Math.PI)*.35;const a=st%2?hA:hB,b=st%2?hB:hA;a.position.set(base+f*.5,-.48+lift,0);b.position.set(base+.25,-.48,0);const mid=(a.position.x+b.position.x)/2;stalk.position.set(mid,.45,0);ves.position.set(mid,1.6,0);});
      lbl("微小管（13本の柱の管）",-2.4,-1.8,0,"#a8f0d0",.8);lbl("キネシンの足（2本で交互に）",2,.3,0,"#ffe08a",.8);lbl("運ぶ荷物（小胞）",2,2,0,"#d8c0ff",.8);
      return [6,"キネシン","2本の足で微小管の上を1歩8nmずつ歩き、荷物を運ぶモータータンパク質。1歩ごとにATPを1個使い、1秒に約100歩（約0.8μm/秒）。神経細胞の長い軸索（最長約1m）でも、これで荷物を届けている。"];}
    if(id==="antibody"){const hv=M("#5a7ad8",{roughness:.45}),lt=M("#9ac8ff",{roughness:.45});const arm=(s)=>{blob(90,.35,.9,.35,"#5a7ad8",.17,root,s*.55,.95,0).rotation.z=-s*.6;blob(70,.3,.8,.3,"#9ac8ff",.16,root,s*1.05,1.15,0).rotation.z=-s*.6;};arm(1);arm(-1);
      blob(160,.75,.9,.4,"#5a7ad8",.17,root,0,-.8,0);const ag=[];[1,-1].forEach(s=>{const v=sph(.25,M("#ff8a5a",{roughness:.5}),s*1.55,2.1,0);ag.push([v,s]);});anims.push(t=>ag.forEach(([v,s])=>{v.position.y=2.1+Math.sin(t*1.2+s)*.15+.15;}));
      lbl("重鎖（濃い青）",-1.6,-.9,0,"#a8b8ff",.8);lbl("軽鎖（うすい青）",-2.3,1.6,0,"#cfe6ff",.8);lbl("抗原（ウイルスの一部など）",2.4,2.6,0,"#ffb090",.8);lbl("先端の形が抗原ごとに違う",0,2.9,0,"#fff",.75);
      return [5,"抗体","Y字形のタンパク質。2本の腕の先の形が、それぞれ特定の抗原（ウイルスや細菌の目印）にぴったり合う。体は遺伝子の組み合わせを変えて、1億種類以上の違う抗体を作れる。"];}},
   matter(id){
    if(id==="ice"){const a=1.5,c=2.45,O=[],om=M("#ff4d4d",{roughness:.35}),hm=M("#ffffff",{roughness:.35});const B=[[1/3,2/3,0],[2/3,1/3,.5],[1/3,2/3,.375],[2/3,1/3,.875]];
      for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)for(let k=-1;k<=0;k++)B.forEach(([u,v,w])=>{const fu=u+i,fv=v+j;const p=V(a*(fu-fv/2),c*(w+k),a*fv*Math.sqrt(3)/2);if(p.length()<3.3)O.push(p);});
      O.forEach(p=>sph(.2,om,p.x,p.y,p.z));const seg=[];for(let i=0;i<O.length;i++)for(let j=i+1;j<O.length;j++){const d=O[i].distanceTo(O[j]);if(d>.8&&d<1.0){const h=R()<.5;const A=h?O[i]:O[j],Bp=h?O[j]:O[i];const hp=A.clone().lerp(Bp,.36);sph(.11,hm,hp.x,hp.y,hp.z);seg.push(hp,Bp);}}
      root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),new THREE.LineDashedMaterial({color:"#9fe8ff",dashSize:.06,gapSize:.05}))).children;root.children[root.children.length-1].computeLineDistances();
      lbl("水素結合（点線）",0,3.4,0,"#9fe8ff",.8);lbl("六角形のすき間",3,0,0,"#fff",.8);
      return [8,"氷（六方晶の氷 Ih）","水分子が水素結合で4方向とつながり、六角形のすき間の多い形で並ぶ。そのため氷は液体の水より約9%軽く、水に浮く。雪の結晶が六角形なのもこの並び方のため。"];}
    if(id==="water"){const mols=[];for(let i=0;i<70;i++){const p=V((R()-.5)*6,(R()-.5)*6,(R()-.5)*6);if(p.length()>3.2){i--;continue;}const g=new THREE.Group();g.position.copy(p);g.rotation.set(R()*6,R()*6,R()*6);root.add(g);sph(.22,M("#ff4d4d",{roughness:.35}),0,0,0,1,1,1,g);sph(.13,M("#fff"),.24,.17,0,1,1,1,g);sph(.13,M("#fff"),-.24,.17,0,1,1,1,g);mols.push([g,p.clone(),R()*6]);}
      const hb=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:"#9fe8ff",transparent:true,opacity:.55}));root.add(hb);
      anims.push(t=>{mols.forEach(([g,p,o])=>{g.position.set(p.x+Math.sin(t*1.7+o)*.12,p.y+Math.cos(t*1.3+o)*.12,p.z+Math.sin(t*1.1+o*2)*.12);g.rotation.y+=.02;});const s=[];for(let i=0;i<mols.length;i++)for(let j=i+1;j<mols.length;j++){if(mols[i][0].position.distanceTo(mols[j][0].position)<.75)s.push(mols[i][0].position,mols[j][0].position);}hb.geometry.setFromPoints(s);});
      lbl("水素結合（つながっては切れる）",0,3.6,0,"#9fe8ff",.8);
      return [7,"液体の水","水分子はたがいに水素結合でつながるが、1兆分の1秒ほどで切れてはつなぎ直している。この結びつきのおかげで、水は分子の小ささのわりに沸点が高く（100℃）、生き物に欠かせない溶媒になっている。"];}
    if(id==="graphene"){const cm=M("#556070",{roughness:.4}),bm=M("#8a94a4",{roughness:.4}),L2=.9;for(let layer=0;layer<3;layer++){const y=(layer-1)*1.4,off=layer%2?L2:0,P=[];
        for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const x0=i*L2*1.5,z0=j*L2*Math.sqrt(3)+(i%2?L2*Math.sqrt(3)/2:0);[[0,0],[L2,0]].forEach(([dx])=>{const p=V(x0+dx+off-L2*.5,y,z0);if(Math.hypot(p.x,p.z)<4.2)P.push(p);});}
        P.forEach(p=>sph(.13,cm,p.x,p.y,p.z));for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=P[i].distanceTo(P[j]);if(d>.8&&d<.95)limb(P[i],P[j],.04,bm);}}
      lbl("グラフェン（原子1個分の厚さ）",0,2.4,0,"#d0d8e8",.8);lbl("層と層は弱くつながる → 鉛筆で書ける",0,-2.3,0,"#d0d8e8",.75);
      return [9,"黒鉛とグラフェン","炭素原子が六角形の網目に並んだシートが重なったのが黒鉛（鉛筆の芯）。層どうしは弱くしかつながっていないので、はがれて紙に残る。1枚だけはがしたものがグラフェン（2010年ノーベル賞）で、厚さ約0.34nmなのに鋼鉄の約200倍強い。"];}
    if(id==="metal"){const cu=M("#f0a070",{roughness:.35,metalness:.25,emissive:"#3a1a08"}),a=1.1;for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)for(let k=-2;k<=2;k++){[[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]].forEach(([u,v,w])=>{const p=V((i+u)*a,(j+v)*a,(k+w)*a);if(p.length()<2.6)sph(.22,cu,p.x,p.y,p.z);});}
      const N=500,pos=new Float32Array(N*3),vel=[];for(let i=0;i<N;i++){pos.set([(R()-.5)*6,(R()-.5)*6,(R()-.5)*6],i*3);vel.push(V(R()-.5,R()-.5,R()-.5).multiplyScalar(.06));}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));
      root.add(new THREE.Points(g,new THREE.PointsMaterial({color:"#7fd0ff",size:.11,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false})));
      anims.push(()=>{for(let i=0;i<N;i++){for(let k=0;k<3;k++){let v=pos[i*3+k]+vel[i].getComponent(k);if(v>3)v-=6;if(v<-3)v+=6;pos[i*3+k]=v;}}g.attributes.position.needsUpdate=true;});
      lbl("銅イオン（面心立方格子）",0,3.4,0,"#ffb88a",.8);lbl("自由電子の海（青い粒）",0,-3.4,0,"#a8e0ff",.8);
      return [8,"金属（銅）","金属では、原子の外側の電子が特定の原子から離れて、全体を自由に動き回る（自由電子）。これが電気や熱をよく通し、金属特有の光沢や、たたくと伸びる性質の理由になる。"];}
    if(id==="salt"){const na=M("#b48cff",{roughness:.35}),cl=M("#3fd36a",{roughness:.35});const n=2,s=.75;for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++)for(let k=-n;k<=n;k++){const isNa=(i+j+k)%2===0;sph(isNa?.2:.36,isNa?na:cl,i*s,j*s,k*s);}
      lbl("Na⁺（ナトリウムイオン・紫）",0,2.3,0,"#d8c0ff",.8);lbl("Cl⁻（塩化物イオン・緑）",0,-2.3,0,"#a8f0b8",.8);
      return [6,"食塩の結晶","プラスのナトリウムイオンとマイナスの塩化物イオンが交互に並んだ立方体。だから食塩の粒は顕微鏡で見ると小さな立方体の形をしている。水に入れると、水分子がイオンを1個ずつ引きはがして溶ける。"];}
    if(id==="glass"){const si=M("#c8b07a",{roughness:.35}),o=M("#ff5a5a",{roughness:.35}),P=[];for(let t=0;t<4000&&P.length<70;t++){const p=V((R()-.5)*6,(R()-.5)*6,(R()-.5)*6);if(p.length()>3)continue;if(P.every(q=>q.distanceTo(p)>.95))P.push(p);}
      P.forEach(p=>sph(.2,si,p.x,p.y,p.z));for(let i=0;i<P.length;i++){const near=P.map((q,j)=>[q.distanceTo(P[i]),j]).filter(x=>x[1]!==i).sort((a,b)=>a[0]-b[0]).slice(0,3);near.forEach(([d,j])=>{if(j<i||d>1.6)return;const m=P[i].clone().lerp(P[j],.5);sph(.15,o,m.x,m.y,m.z);limb(P[i],P[j],.03,M("#e0d8c8"));});}
      lbl("ケイ素（黄）と酸素（赤）の不規則な網",0,3.4,0,"#ffe0b0",.75);
      return [7,"ガラス","主な成分は二酸化ケイ素（SiO₂）。同じ成分の水晶は原子が規則正しく並ぶが、ガラスは液体のように乱れた並びのまま固まっている（アモルファス）。並びに向きがないので、光がまっすぐ通り抜ける。"];}},
   planck(id){
    if(id==="pfoam"){const r=quantum("foam");return [r[0],r[1],r[2]+"（ホイーラーが1955年に提案した考え。仮説）"];}
    if(id==="spinnet"){const P=[];for(let i=0;i<34;i++)P.push(V((R()-.5)*6,(R()-.5)*6,(R()-.5)*6));const E=[];P.forEach((p,i)=>{P.map((q,j)=>[p.distanceTo(q),j]).filter(x=>x[1]>i).sort((a,b)=>a[0]-b[0]).slice(0,2).forEach(([d,j])=>E.push([i,j]));});
      const nodes=P.map(p=>sph(.16,M("#ffd27a",{emissive:"#4a3000"}),p.x,p.y,p.z));const edges=E.map(([i,j],k)=>{const m=limb(P[i],P[j],.03,new THREE.MeshBasicMaterial({color:"#9fe8ff",transparent:true,opacity:.8}));if(k%3===0){const l=lbl(["1/2","1","3/2","2"][k%4],(P[i].x+P[j].x)/2,(P[i].y+P[j].y)/2+.2,(P[i].z+P[j].z)/2,"#9fe8ff",.55);}return m;});
      anims.push(t=>{edges.forEach((e,k)=>e.material.opacity=.4+.5*Math.abs(Math.sin(t*.8+k)));nodes.forEach((n,k)=>n.scale.setScalar(1+.25*Math.sin(t*1.3+k)));});
      lbl("点＝体積のかけら",0,3.6,0,"#ffe08a",.8);lbl("線の数字＝面積のかけら（スピン）",0,-3.6,0,"#a8f0ff",.8);
      return [7,"スピンネットワーク（ループ量子重力）","ループ量子重力理論の考え方。空間はなめらかではなく、点（体積の最小単位）と線（面積の最小単位）でできた網目だとする。線の数字（スピン）が面積の大きさを決める。網目が時間とともに組み変わることで、時空ができる。仮説で、実験的な証拠はまだない。"];}
    if(id==="causal"){const P=[];for(let i=0;i<120;i++){const u=R(),v=R();P.push(V((u-v)*4,(u+v-1)*4,(R()-.5)*.6));}const seg=[];
      for(let i=0;i<P.length;i++)for(let j=0;j<P.length;j++){const dt=P[j].y-P[i].y,dx=Math.abs(P[j].x-P[i].x);if(dt>0&&dt<1.0&&dx<dt)seg.push(P[i],P[j]);}lines(seg,"#c99cf2",.45);P.forEach(p=>sph(.07,M("#ffffff",{emissive:"#666"}),p.x,p.y,p.z));
      const c=P[60];const cone=[c,c.clone().add(V(-3,3,0)),c,c.clone().add(V(3,3,0)),c,c.clone().add(V(-3,-3,0)),c,c.clone().add(V(3,-3,0))];lines(cone,"#ffd27a",.9);sph(.14,M("#ffd27a",{emissive:"#604000"}),c.x,c.y,c.z);
      lbl("↑ 時間",-4.3,0,0,"#fff",.8);lbl("光円錐（影響が届く範囲）",c.x+1.8,c.y+2.6,0,"#ffe08a",.75);
      return [7,"因果集合","時空は、ばらまかれた「点（出来事）」と「どれがどれより先か（原因→結果の順番）」だけでできている、という仮説（1987年ごろ、ソーキンらが提案）。点の数が体積を、順番の網目が時空の形を決める。紫の線は、原因から結果へのつながり。"];}
    if(id==="holo"){const N=44,cnv=document.createElement("canvas");cnv.width=cnv.height=256;const x=cnv.getContext("2d");x.fillStyle="#04030a";x.fillRect(0,0,256,256);x.font="bold 11px monospace";for(let j=0;j<22;j++)for(let i=0;i<22;i++){x.fillStyle=R()<.5?"#9fe8ff":"#ffd27a";x.fillText(R()<.5?"0":"1",i*11.6+2,j*11.6+11);}
      const T=new THREE.CanvasTexture(cnv);T.wrapS=T.wrapT=THREE.RepeatWrapping;T.repeat.set(4,2);sph(2.6,new THREE.MeshBasicMaterial({map:T,transparent:true,opacity:.85,side:THREE.DoubleSide}),0,0,0);
      const inn=[];for(let i=0;i<1500;i++){const p=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(R()*2);inn.push(p.x,p.y,p.z);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(inn,3));const pp=new THREE.Points(g,new THREE.PointsMaterial({color:"#c99cf2",size:.04}));root.add(pp);anims.push(t=>{pp.rotation.y=t*.2;T.offset.x=t*.02;});
      lbl("表面の情報（0と1）",0,3.3,0,"#9fe8ff",.8);lbl("中の世界は表面の情報の「映像」？",0,-3.3,0,"#d8c0ff",.75);
      return [7,"ホログラフィー原理","ブラックホールに入る情報の量は、体積ではなく表面の面積で決まる（ベッケンシュタイン＝ホーキング）。そこから「3次元の世界の情報は、すべて2次元の表面に書けるのでは」という考えが生まれた。超ひも理論の一部（AdS/CFT対応）では数学的に成り立つが、私たちの宇宙で成り立つかは未確認。"];}
    if(id==="pstring"){const g=vstring(3,true,"#c99cf2",2.6,.25);lbl("超ひも理論の分岐へ（さらにズームイン）",0,1.6,0,"#d8c0ff",.6);return [4,"超ひも（理論の分岐へ）","素粒子を振動するひもと考える仮説。この先は「理論（仮説）」の分岐で、ひもの振動・ブレーン・余剰次元・M理論を見られる。ここでズームインすると移動する。"];}},
   bit(id){
    if(id==="itbit"){const N=260,sp=[];for(let i=0;i<N;i++){const s=txt(R()<.5?"0":"1",R()<.5?"#9fe8ff":"#ffd27a");s.scale.multiplyScalar(.45);const from=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(4+R()*2),to=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(.9*Math.cbrt(R()));sp.push([s,from,to,R()]);}
      const core=sph(.9,G("#ffffff",.0),0,0,0);anims.push(t=>{const k=(Math.sin(t*.5)+1)/2;sp.forEach(([s,f,to,o])=>{s.position.copy(f).lerp(to,Math.min(1,k*1.2+o*.1));});core.material.opacity=Math.max(0,k-.6)*.8;});
      return [7,"It from bit（すべては情報から）","物理学者ジョン・ホイーラーが1989年に唱えた考え。粒子や場（It）の正体は、「はい／いいえ」の答え＝情報（bit）の集まりだという。0と1が集まって粒子の形になり、またほどける様子を空想で描いた。思想としては有名だが、検証できる理論にはなっていない。"];}
    if(id==="simul"){const n=10,cells=[],m1=M("#7ee0b0",{emissive:"#0a3020"}),geo=new THREE.BoxGeometry(.42,.42,.42);const im=new THREE.InstancedMesh(geo,m1,n*n*n);root.add(im);let st=new Uint8Array(n*n*n);for(let i=0;i<st.length;i++)st[i]=R()<.12?1:0;
      const o=new THREE.Object3D(),idx=(x,y,z)=>((x+n)%n)*n*n+((y+n)%n)*n+(z+n)%n;const draw=()=>{for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){o.position.set((x-n/2+.5)*.5,(y-n/2+.5)*.5,(z-n/2+.5)*.5);o.scale.setScalar(st[idx(x,y,z)]?1:.001);o.updateMatrix();im.setMatrixAt(idx(x,y,z),o.matrix);}im.instanceMatrix.needsUpdate=true;};draw();
      let last=0;anims.push(t=>{if(t-last<.4)return;last=t;const nx=new Uint8Array(st.length);let alive=0;for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){let s=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)if(a||b||c)s+=st[idx(x+a,y+b,z+c)];const v=st[idx(x,y,z)];nx[idx(x,y,z)]=(v&&s>=4&&s<=5)||(!v&&s===5)?1:0;alive+=nx[idx(x,y,z)];}st=alive<20?st.map(()=>R()<.12?1:0):nx;draw();root.rotation.y=t*.1;});
      const fr=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5,5,5)),new THREE.LineBasicMaterial({color:"#7ee0b0",transparent:true,opacity:.4}));root.add(fr);
      return [7,"計算する宇宙","「宇宙そのものが、単純な規則で一歩ずつ更新される巨大な計算機（セル・オートマトン）では」という考え。コンラート・ツーゼ（1969年）やスティーブン・ウルフラムらが提案した。ここでは3次元のマス目が「周りの数」だけで生まれたり消えたりする規則で動いている（空想の図）。"];}
    if(id==="pixel"){const n=8,s=.6,seg=[];for(let i=0;i<=n;i++)for(let j=0;j<=n;j++){const a=(i-n/2)*s,b=(j-n/2)*s,h=n/2*s;seg.push(V(a,b,-h),V(a,b,h),V(a,-h,b),V(a,h,b),V(-h,a,b),V(h,a,b));}lines(seg,"#5a6ab8",.14);
      const p=sph(.2,M("#ffd27a",{emissive:"#604000"}),0,0,0);const trail=[];for(let i=0;i<14;i++)trail.push(sph(.12,G("#ffd27a",.5-i*.03),0,0,0));let pos=V(0,0,0),hist=[];let last=0;
      anims.push(t=>{if(t-last<.35)return;last=t;const d=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]][Math.floor(R()*6)];pos=pos.clone().add(V(...d).multiplyScalar(s));if(pos.length()>2.3)pos=V(0,0,0);hist.unshift(pos.clone());hist=hist.slice(0,14);p.position.copy(pos);trail.forEach((tr,i)=>{if(hist[i+1])tr.position.copy(hist[i+1]);});});
      lbl("1マス＝プランク長（1.6×10⁻³⁵m）",0,3.6,0,"#a8b8ff",.75);lbl("1コマ＝プランク時間（5.4×10⁻⁴⁴秒）",0,-3.6,0,"#ffe08a",.75);
      return [7,"ピクセルの時空","「長さにも時間にも最小の単位があり、世界はマス目の上をコマ送りで動いている」という空想の図。プランク長とプランク時間は、物理定数から計算できる「量子重力が効くスケール」の目安で、本当にそれが最小単位かどうかはわかっていない。"];}},
   bottom(id){
    if(id==="uroboros"){const R0=3,pts=[];for(let i=0;i<=200;i++){const a=Math.PI/2+.25+i/200*(Math.PI*2-.5);pts.push(V(Math.cos(a)*R0,Math.sin(a)*R0,0));}
      const c=new THREE.CatmullRomCurve3(pts);const tg=new THREE.TubeGeometry(c,240,.32,12,false);const P=tg.attributes.position;const v=new THREE.Vector3();for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i);const ring=Math.floor(i/13)/240;const ctr=c.getPoint(ring);const k=.35+.65*(1-ring);v.sub(ctr).multiplyScalar(k).add(ctr);P.setXYZ(i,v.x,v.y,v.z);}tg.computeVertexNormals();
      root.add(new THREE.Mesh(tg,M("#4aa87a",{roughness:.45,metalness:.2})));const hd=sph(.45,M("#4aa87a",{roughness:.45}),Math.cos(Math.PI/2+.25)*R0,Math.sin(Math.PI/2+.25)*R0,0,1.4,.9,1);sph(.07,M("#ffd27a",{emissive:"#806000"}),hd.position.x+.15,hd.position.y+.25,.35);
      const S=[["10⁻³⁵m プランク長",.12],["10⁻¹⁸m 素粒子",.2],["10⁻¹⁵m 原子核",.28],["10⁻¹⁰m 原子",.36],["10⁻⁵m 細胞",.46],["1m ヒト",.56],["10⁷m 地球",.64],["10¹³m 太陽系",.72],["10²¹m 銀河",.8],["10²⁶m 観測できる宇宙",.9]];
      S.forEach(([t,f])=>{const a=Math.PI/2+.25+f*(Math.PI*2-.5);lbl(t,Math.cos(a)*(R0+1.3),Math.sin(a)*(R0+.9),0,f<.5?"#9fe8ff":"#ffd27a",.7);});lbl("いちばん小さい ⇄ いちばん大きい",0,R0+1.2,0,"#fff",.8);
      anims.push(t=>root.rotation.y=Math.sin(t*.2)*.4);
      return [9,"宇宙のウロボロス","物理学者シェルドン・グラショーが描いた図。自分の尾をくわえた蛇（ウロボロス）の体に、いちばん小さなスケールから、いちばん大きなスケールまでを並べたもの。頭と尾が出会うところでは、宇宙の始まり（インフレーション）を理解するのに素粒子の理論が必要になるように、最小と最大がつながっている。"];}
    const N=3000,pos=[];for(let i=0;i<N;i++){const k=i/N,a=k*60,r=4*Math.pow(1-k,2);pos.push(Math.cos(a)*r,(k-.5)*-6*(1-k),Math.sin(a)*r);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));const pp=new THREE.Points(g,new THREE.PointsMaterial({color:"#c99cf2",size:.05,transparent:true,opacity:.8}));root.add(pp);anims.push(t=>pp.rotation.y=t*.4);
    lbl("さらにズームインすると、宇宙のいちばん大きなスケールへ",0,3.4,0,"#fff",.7);
    return [7,"底のない底","どこまでも小さくなっていく渦。物理学では、プランク長より小さな長さに意味があるのかどうかもわかっていない。この地図ではここを底とし、さらに進むと、宇宙のいちばん大きなスケールにつながる（空想）。"];}
  };
  // ズームインの行き先（選んでいるものに合わせて「中」へ）
  const SYMZ=s=>{const e=ELEMENTS.find(x=>x.sym===s);return e?e.Z:1;};
  function INTO(lv,id){const P=["sakura","sunflower","cactus","sequoia"];switch(lv){
    case "life":return P.includes(id)?["cell","plantcell"]:id==="mushroom"?["microbe","yeast"]:["body",id==="human"?"bodyall":"bodyall"];
    case "body":return ["cell",{brain:"neuron",eye:"neuron",heart:"rbc",bone:"rbc"}[id]||"animalcell"];
    case "cell":return id==="animalcell"?["inc","onuc"]:id==="plantcell"?["inc","chloro"]:id==="rbc"?["biomol","hemo"]:id==="neuron"?["biomol","kinesin"]:null;
    case "inc":return ["biomol",{onuc:"chromatin",mito:"atpsyn",chloro:"atpsyn",er:"ribo",lyso:"membrane",cytosk:"kinesin"}[id]];
    case "virus":return ["biomol","antibody"];
    case "biomol":return ["mol",{chromatin:"dna",hemo:"o2",atpsyn:"h2o",ribo:"gly",membrane:"etoh",kinesin:"glu",antibody:"gly"}[id]||"h2o"];
    case "mol":{if(id==="h2o")return ["matter","ice"];if(id==="diam")return ["matter","graphene"];if(id==="nacl")return ["matter","salt"];const m=MOLS.find(x=>x[0]===id);if(!m)return null;const zs=m[4].map(a=>SYMZ(a[0]));return ["atom",String(Math.max(...zs))];}
    case "matter":return ["atom",String({ice:8,water:8,graphene:6,metal:29,salt:11,glass:14}[id]||8)];
    case "atom":return ["nucleus",String(id)];
    case "nucleus":return ["quark","p"];
    case "quark":return ["particle",id==="n"?"d":"u"];
    case "particle":return ["quantum",id==="e"?"o1s":id==="γ"?"slit":"vac"];
    case "quantum":return ["planck",id==="foam"?"pfoam":"pfoam"];
    case "planck":return id==="pstring"?["string","modes"]:["bit","itbit"];
    case "bit":return ["bottom","uroboros"];
    case "string":return ["dims","d10"];
  }return null;}
