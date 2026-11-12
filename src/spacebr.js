  // ===== 分岐（GitHubの枝分かれのように、本線1〜12から横に伸びる） =====
  const ALL=LEVELS.slice();const BRMAP={};const LANES=[];
  function lane(id,name,from,color){LANES.push({id,name,from,color});}
  function addBr(L){L.br=1;ALL.push(L);if(L.pobj)BRMAP[L.parent+":"+L.pobj]=L.id;return L;}
  const SUNP=V(-420,260,-60);
  function lightsFor(){const d=new THREE.DirectionalLight("#fff6ea",1.9);d.position.copy(SUNP);scene.add(d);scene.add(new THREE.AmbientLight("#40506a",.55));}
  const label=(id,name,node,view,desc,dist)=>obj(id,name,node,view,desc,dist);
  const llpos=(r,la,lo)=>{la*=Math.PI/180;lo*=Math.PI/180;return V(Math.cos(la)*Math.cos(lo)*r,Math.sin(la)*r,-Math.cos(la)*Math.sin(lo)*r);};
  // ---- 惑星・恒星の中 ----
  const BODY={
   sun:{name:"太陽",R:"69万6000km",shell:"star",layers:[[.25,"中心核（核融合で輝く・約1500万℃）","#fff6c0","#ffd070"],[.7,"放射層（光が数万年かけて外へ）","#ffb347","#a04a10"],[1,"対流層（ガスが煮立つように動く）","#ff7a2a","#7a2a08"]],
     desc:"太陽の中心では、毎秒約6億トンの水素がヘリウムに変わり、そのとき減った質量がエネルギーになる。中心で生まれた光は放射層で吸収と放出を繰り返し、外に出るまで数万〜十数万年かかる。表面のつぶつぶ（粒状斑）は対流のてっぺん。",feat:[]},
   mercury:{name:"水星",kind:"mercury",R:"2440km",layers:[[.42,"内核（固体の鉄）","#d8c8a8","#6a3a10"],[.83,"外核（液体の鉄）","#c89a5a","#4a2a08"],[.98,"マントル（岩石）","#8a6a52"],[1,"地殻","#6a6560"]],
     desc:"体積の大部分を鉄の核が占める、とても「重い」惑星（核の半径は全体の約8割）。昼は430℃、夜は−180℃。",feat:[["caloris","カロリス盆地",30.5,170,"直径約1550kmの巨大な衝突盆地。"]]},
   venus:{name:"金星",kind:"venus",R:"6052km",layers:[[.53,"核（鉄・ニッケル）","#d8a060","#5a2a08"],[.985,"マントル（岩石）","#b0603a"],[1,"地殻（火山の溶岩）","#7a6a5a"]],
     desc:"地球とほぼ同じ大きさ・内部構造だが、表面は厚さ約70km・90気圧の二酸化炭素の大気と硫酸の雲に包まれ、460℃に達する。自転は逆向きで、1日（自転）が1年より長い。",feat:[["maxwell","マクスウェル山（雲の下）",65,3,"金星で最も高い山（約1万1000m）。"]]},
   earth:{name:"地球",shell:"earth",R:"6371km",layers:[[.19,"内核（固体の鉄・ニッケル、約5400℃）","#ffe9a0","#ff9a20"],[.546,"外核（液体の鉄：地磁気を生む）","#ffb050","#a03a08"],[.895,"下部マントル","#c0502a"],[.99,"上部マントル","#d8703a"],[1,"地殻（大陸・海底）","#6a5a4a"]],
     desc:"中心から、固体の内核・液体の外核・マントル・地殻。外核の液体の鉄が流れることで地磁気が生まれ、宇宙からの放射線を防いでいる。いちばん深い穴（コラ半島超深度掘削）でも12kmで、地殻すら貫けていない。",feat:[]},
   moon:{name:"月",kind:"moon",R:"1737km",layers:[[.14,"内核（固体の鉄）","#e8d8b0","#6a3a10"],[.19,"外核（液体）","#d8a060","#4a2008"],[.28,"部分的に溶けた層","#b0705a"],[.977,"マントル","#8a7a6a"],[1,"地殻","#9a9a96"]],
     desc:"アポロ計画で置いた地震計の記録から、小さな鉄の核を持つことが分かった。表側の黒い「海」は、約30〜40億年前に溶岩が流れ出て固まった平原。",feat:[["tranq","静かの海（アポロ11号）",.67,23.5,"1969年、人類が初めて月面に降り立った場所。"],["tycho","ティコ・クレーター",-43.3,-11.2,"明るい光条が四方に伸びる若いクレーター（約1億年前）。"],["imbrium","雨の海",32.8,-15.6,"直径約1100kmの巨大な溶岩の平原。"],["procellarum","嵐の大洋",18.4,-57.4,"月で最も広い「海」。"]]},
   mars:{name:"火星",kind:"mars",R:"3390km",layers:[[.54,"核（液体の鉄・硫黄）","#d89a5a","#6a2a08"],[.985,"マントル","#b0583a"],[1,"地殻","#8a4a2a"]],
     desc:"探査機インサイトの地震観測（2018〜2022年）で、核が意外に大きく液体であることが分かった。かつては川や湖があり、今も極に水の氷がある。",feat:[["olympus","オリンポス山",18.65,-133.8,"太陽系最大の火山。高さ約2万1900m。"],["valles","マリネリス峡谷",-12,-70,"長さ約4000km、深さ最大7kmの大峡谷。"],["hellas","ヘラス盆地",-42.4,70.5,"直径約2300kmの衝突盆地。"],["jezero","ジェゼロ・クレーター（パーサヴィアランス）",18.4,77.6,"昔の湖の跡で、生命の痕跡を探している。"],["npole","北極冠",86,0,"水の氷とドライアイスの層。"]]},
   jupiter:{name:"木星",kind:"jupiter",R:"6万9911km",layers:[[.22,"中心核（岩石と氷・境界はぼやけている）","#d8b070","#7a4a10"],[.78,"金属水素の層（電気を通す：強い磁場の源）","#8a96a8","#1a2a40"],[.985,"液体の分子状水素","#c8a882"],[1,"大気（アンモニアなどの雲の層）","#e8d2b0"]],
     desc:"ほとんどが水素とヘリウム。深いところでは圧力で水素が金属のようになり、電気を流して太陽系最強の磁場をつくる。探査機ジュノーの観測で、中心核は岩石と水素が混ざった「ぼやけた核」だと分かってきた。",feat:[["grs","大赤斑",-22,-60,"地球より大きい巨大な嵐。少なくとも190年以上続いている。"]]},
   saturn:{name:"土星",kind:"saturn",rings:0,R:"5万8232km",layers:[[.22,"中心核（岩石と氷）","#d8b070","#6a4010"],[.5,"金属水素の層","#8a96a8","#1a2a40"],[.985,"液体の分子状水素","#d8c08a"],[1,"大気（雲の層）","#efe0b8"]],
     desc:"平均密度は水より小さい（0.69g/cm³）。環の幅は約28万kmあるのに、厚さは多くの場所で10〜100mほど。主な環は内側からC環・B環・カッシーニの間隙・A環。",feat:[["hex","北極の六角形",80,0,"一辺が地球の直径より長い、六角形のジェット気流。"],["cassini","カッシーニの間隙",0,0,"B環とA環の間の幅約4800kmのすき間。"]]},
   uranus:{name:"天王星",kind:"uranus",rings:1,tilt:97.8,R:"2万5362km",layers:[[.2,"岩石の核","#a8907a","#3a2008"],[.75,"氷のマントル（水・アンモニア・メタン）","#4fb0c0"],[1,"水素・ヘリウムの大気","#9fdce0"]],
     desc:"自転軸が約98°傾き、横倒しで太陽のまわりを回る。「氷」のマントルは高温高圧の液体。メタンが赤い光を吸うので青緑に見える。",feat:[]},
   neptune:{name:"海王星",kind:"neptune",R:"2万4622km",layers:[[.25,"岩石の核","#a8907a","#3a2008"],[.8,"氷のマントル","#3f7fd0"],[1,"水素・ヘリウム・メタンの大気","#4f78e0"]],
     desc:"太陽系で最も強い風（秒速約600m）が吹く。1989年にボイジャー2号が「大暗斑」を撮影した。",feat:[["gds","暗斑",-20,-40,"地球ほどの大きさの高気圧の渦。"]]},
   pluto:{name:"冥王星",kind:"pluto",off:180,R:"1188km",layers:[[.72,"岩石の核","#8a6a52"],[.81,"内部の海（あると考えられている）","#3f7ac8"],[1,"氷の地殻（窒素や水の氷）","#d8c8b0"]],
     desc:"2015年に探査機ニューホライズンズが接近。ハート形の白い平原（スプートニク平原）は窒素の氷の海で、ゆっくり対流している。",feat:[["tombaugh","トンボー領域（ハート形）",20,175,"左半分が窒素の氷の平原スプートニク平原。"],["cthulhu","クトゥルフ領域",-5,100,"赤黒い有機物（ソリン）に覆われた地域。"]]}};
  function buildBody(key){const B=BODY[key];lightsFor();const r=10;const g=new THREE.Group();scene.add(g);let shell;
    if(B.shell==="earth"){const e=earthMesh(r,SUNP);shell=e.material;}else if(B.shell==="star"){shell=starMesh(r,"#fff0d0",48,.5).material;}else shell=planetMat(B.kind,SUNP,(B.off||0)*Math.PI/180);
    const cut=cutaway(r,shell,B.layers,g);if(B.shell==="earth"){const uv=cut.children[0].geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*.75);}
    if(B.shell==="star"){const gl=glowBB("#ffb050",r*7,1);g.add(gl);}
    if(B.rings!==undefined){const rg=ringsFX(r,B.rings,SUNP);g.add(rg);}
    if(B.tilt){g.rotation.z=B.tilt*Math.PI/180;}
    anims.push(t=>{g.rotation.y=Math.sin(t*.12)*.35;});
    let prev=0;B.layers.forEach(([f,nm],i)=>{const rm=r*(prev+f)/2;prev=f;const n=new THREE.Object3D();const a=(200+i*9)*Math.PI/180;n.position.set(Math.cos(a)*rm,Math.sin(a)*rm,.05);g.add(n);label(key+"_l"+i,nm,n,r*1.6,"断面の層（半径の"+Math.round(f*100)+"%まで）","");});
    (B.feat||[]).forEach(([id,nm,la,lo,d])=>{const n=new THREE.Object3D();n.position.copy(llpos(r*1.01,la,lo+(B.off||0)));g.add(n);label(id,nm,n,r*1.2,d,B.name);});
    const h=new THREE.Object3D();h.position.set(0,r*1.35,0);g.add(h);label(key+"_all",B.name+"の全体",h,r*3.2,B.desc,"半径 "+B.R);}
  lane("pa","地球と月の中","moon","#6fb6ff");lane("pb","太陽・内惑星の中","inner","#ffb347");lane("pc","外惑星の中","outer","#c8a882");
  [["earth","pa","moon"],["moon","pa","moon"],["sun","pb","inner"],["mercury","pb","inner"],["venus","pb","inner"],["mars","pb","inner"],["jupiter","pc","outer"],["saturn","pc","outer"],["uranus","pc","outer"],["neptune","pc","outer"],["pluto","pc","outer"]].forEach(([k,ln,par])=>{
    const B=BODY[k];addBr({id:"in_"+k,lane:ln,parent:par,pobj:k,name:B.name+"の中",short:B.name,unit:"断面図（層の厚さは実際の比率）",desc:B.desc,dist:34,min:12,max:80,th:-2.35,ph:1.05,build(){buildBody(k);}});});
  BRMAP["inner:earth"]="in_earth";
  // ---- 銀河の中 ----
  const GX={
   lmc:{name:"大マゼラン雲",lane:"ga",parent:"galaxy",type:"irregular",size:120,c1:"#ffe8c8",c2:"#c8d8ff",c3:"#ff6a9a",bulge:.15,arms:2,tilt:.6,dist:"約16万光年",
     desc:"天の川銀河を回る伴銀河。直径約1万4000光年に約300億個の恒星。棒状の構造と、局部銀河群で最大の星形成領域タランチュラ星雲がある。",
     feat:[["tarantula","タランチュラ星雲（かじき座30）",-.38,.18,"局部銀河群で最も活発な星の誕生の場。太陽の300倍近い質量の星R136a1がある。","neb"],["sn1987a","超新星SN 1987A",-.3,.05,"1987年に肉眼で見えた超新星。約400年ぶりの肉眼超新星。","pt"],["lmcbar","中央の棒",0,0,"恒星が棒状に集まった構造。","pt"],["n11","N11（星形成領域）",.45,.35,"2番目に大きい星の誕生の場。","neb"]]},
   andromeda:{name:"アンドロメダ銀河（M31）",lane:"gb",parent:"local",type:"spiral",size:140,arms:2,pitch:.15,bulge:.15,ring:.6,dust:1,c1:"#ffe2b8",c2:"#c8d4ff",c3:"#ff7aa0",tilt:1.35,dist:"約250万光年",
     desc:"直径約22万光年、約1兆個の恒星。天の川銀河より大きい渦巻銀河。星形成は中心から約3万光年の「リング」に集中している。約45億年後に天の川銀河と衝突・合体する。",
     feat:[["m31core","中心核（二重に見える核）",0,0,"中心の星の集まりが2つあるように見える。太陽の約1億倍のブラックホールがある。","bh"],["ngc206","NGC 206（巨大な星の雲）",-.45,-.32,"若い青い星が数百個集まる、M31で最も明るい星の雲。","neb"],["ring10","星形成リング",.62,0,"中心から約3万光年の輪で、新しい星が生まれている。","pt"],["m32","M32（伴銀河）",.18,.22,"M31に近づきすぎて外側の星をはぎ取られた、小さな楕円銀河。","sat"],["m110","M110（伴銀河）",-.3,.6,"M31を回る矮小楕円銀河。","sat"],["g1","G1（巨大な球状星団）",.9,.55,"局部銀河群で最も明るい球状星団。中心にブラックホールがあるかもしれない。","pt"]]},
   triangulum:{name:"さんかく座銀河（M33）",lane:"gb",parent:"local",type:"flocculent",size:110,arms:2,pitch:.35,bulge:.06,dust:.4,c1:"#ffe8d0",c2:"#bcd0ff",c3:"#ff6a9a",tilt:.95,dist:"約273万光年",
     desc:"局部銀河群で3番目に大きい渦巻銀河。はっきりした腕ではなく、綿のような腕がたくさんある（綿状渦巻銀河）。中心に大きなブラックホールが見つかっていない。",
     feat:[["ngc604","NGC 604（巨大なHII領域）",.42,.25,"直径約1500光年。オリオン大星雲の約6000倍明るい星の誕生の場。","neb"]]},
   m51:{name:"子持ち銀河（M51）",lane:"gc",parent:"lania",type:"spiral",size:120,arms:2,pitch:.28,bulge:.1,dust:1,c1:"#ffe2b8",c2:"#c0d0ff",c3:"#ff5a8a",tilt:.25,dist:"約2300万光年",
     desc:"くっきりした2本の腕を持つ「グランドデザイン渦巻銀河」の代表。腕の先の小さな銀河NGC 5195との引力で、腕がはっきり作られていると考えられている。",
     feat:[["ngc5195","NGC 5195（伴銀河）",.0,.95,"M51の腕の先にくっついて見える小さな銀河。","sat"],["m51hii","HII領域（ピンクの点）",-.5,.1,"腕に沿って並ぶ、星が生まれている場所。","neb"]]},
   sombrero:{name:"ソンブレロ銀河（M104）",lane:"gc",parent:"lania",type:"sombrero",size:120,bulge:.3,dust:1,c1:"#ffe0b0",c2:"#ffe8d0",tilt:.05,ph:1.5,dist:"約3100万光年",
     desc:"巨大なバルジ（中心のふくらみ）と、ふちを横切るちりの帯が帽子のように見える。約2000個の球状星団を持ち、中心には太陽の約10億倍のブラックホールがある。",
     feat:[["somdust","ちりの帯",.6,0,"円盤のふちを真横から見ている。","pt"],["somcore","中心のブラックホール",0,0,"太陽の約10億倍。","bh"]]},
   m87:{name:"M87（巨大楕円銀河）",lane:"gc",parent:"lania",type:"elliptical",size:140,c1:"#ffe2b8",dist:"約5500万光年",
     desc:"おとめ座銀河団の中心にある巨大楕円銀河。約1万2000個の球状星団を持つ。中心のブラックホールM87*（太陽の約65億倍）からは、長さ約5000光年のジェットが光速近くで吹き出している。2019年、人類が初めて撮影したブラックホール。",
     feat:[["m87bh","ブラックホールM87*",0,0,"2019年にイベント・ホライズン・テレスコープが撮影。","bh"],["m87jet","ジェット",.35,.35,"電子が光速に近い速さで飛び出している。","pt"]]},
   cena:{name:"ケンタウルス座A（NGC 5128）",lane:"gc",parent:"lania",type:"elliptical",size:130,c1:"#ffe2c0",dist:"約1200万光年",
     desc:"楕円銀河が渦巻銀河を飲み込んだ跡と考えられ、中央を太いちりの帯が横切る。中心のブラックホール（太陽の約5500万倍）から、銀河より大きな電波の泡（ローブ）が吹き出している。",
     feat:[["cenadust","ちりの帯",0,0,"飲み込まれた渦巻銀河のなごり。","pt"],["cenalobe","電波ローブとジェット",.0,.8,"目に見えない電波で輝く巨大な泡。","pt"]]}};
  function buildGalaxy(key){const G=GX[key];scene.add(new THREE.AmbientLight("#fff",1));const g=new THREE.Group();scene.add(g);g.rotation.x=G.tilt||0;
    const S=G.size;const disk=galFX({...G,size:S,gain:1});g.add(disk);
    if(G.type==="elliptical"){disk.visible=false;const bb=galFX({...G,size:S*.9,bb:1,gain:key==="cena"?1.8:1.2});g.add(bb);}
    if(G.type==="sombrero"){g.add(glowBB("#ffe0b0",S*.55,0));}
    g.add(galStars({...G,size:S,n:G.type==="elliptical"?26000:36000,ps:S*.004}));
    if(G.type!=="elliptical"){const pts=[];for(let i=0;i<300;i++){const a=R()*6.283,u=R()*2-1,rr=S*.45*Math.cbrt(R());pts.push(Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr*.6,Math.sin(a)*Math.sqrt(1-u*u)*rr);}g.add(points(pts,"#ffe8c8",S*.006,.9));}
    else{const pts=[];for(let i=0;i<1600;i++){const a=R()*6.283,u=R()*2-1,rr=S*.55*Math.pow(R(),.7);pts.push(Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr,Math.sin(a)*Math.sqrt(1-u*u)*rr);}g.add(points(pts,"#ffe0b0",S*.007,.95));}
    if(key==="m87"){const jm=glowBB("#9fc8ff",S*.08,0);g.add(jm);const jet=new THREE.Mesh(new THREE.CylinderGeometry(S*.0015,S*.006,S*.4,12,1,true),new THREE.MeshBasicMaterial({color:"#7fb0ff",transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));jet.position.set(S*.12,S*.12,0);jet.rotation.z=-Math.PI/4;g.add(jet);
      for(let i=0;i<6;i++){const k=glowBB("#bfe0ff",S*.014,0);k.position.set(S*(.05+i*.04),S*(.05+i*.04),0);g.add(k);}}
    if(key==="cena"){const dl=new THREE.Mesh(new THREE.PlaneGeometry(S*.7,S*.18,40,6),new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.y+=sin(p.x*.06)*2.;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",
        fragmentShader:`varying vec2 vUv;${GLN}void main(){float n=fbm(vUv*vec2(14.,4.));float b=smoothstep(.0,.3,vUv.y)*smoothstep(1.,.7,vUv.y)*smoothstep(0.,.15,vUv.x)*smoothstep(1.,.85,vUv.x);gl_FragColor=vec4(vec3(.08,.045,.03)*(.6+n*.6)+vec3(1.,.45,.55)*smoothstep(.78,.92,n)*.5,clamp(b*(.75+n*.5),0.,1.));}`,transparent:true,depthWrite:false,side:THREE.DoubleSide}));dl.rotation.z=-.3;g.add(dl);
      [[1,1],[-1,-1]].forEach(([sx,sy])=>{const lobe=glowBB("#8a6aff",S*.7,0);lobe.position.set(sx*S*.15,sy*S*.55,0);lobe.material.uniforms.uCol.value=C("#5a4acf").convertSRGBToLinear();g.add(lobe);});}
    (G.feat||[]).forEach(([id,nm,x,y,d,kd])=>{let n;const pos=V(x*S/2,0,-y*S/2);
      if(kd==="bh"){n=blackHoleFX(S*.006);}else if(kd==="neb"){n=new THREE.Group();n.add(nebFX(id==="tarantula"||id==="ngc604"?"carina":"orion",S*.09,"#ff5a8a","#ffb0c0","#9fd0ff"));}else if(kd==="sat"){n=galFX({type:"elliptical",size:S*.14,bb:1,c1:"#ffe8d0",gain:.9});}else n=new THREE.Object3D();
      if(key==="m87"&&id==="m87jet")pos.set(S*.18,S*.18,0);if(key==="cena"&&id==="cenalobe")pos.set(S*.15,S*.55,0);
      n.position.copy(pos);g.add(n);label(id,nm,n,kd==="bh"?S*.06:S*.25,d,G.name);});
    const h=new THREE.Object3D();h.position.set(0,S*.32,0);scene.add(h);label(key+"_all",G.name+"の全体",h,S*1.25,G.desc,G.dist);}
  lane("ga","天の川の伴銀河","galaxy","#cfe0ff");lane("gb","局部銀河群の銀河の中","local","#ffe2b8");lane("gc","遠くの銀河の中","lania","#ffb48a");
  Object.entries(GX).forEach(([k,G])=>addBr({id:"gx_"+k,lane:G.lane,parent:G.parent,pobj:k,name:G.name+"の中",short:G.name.replace(/（.*）/,""),unit:"銀河の内部（星の位置は模式的）",desc:G.desc,ph:G.ph,dist:G.size*1.3,min:G.size*.05,max:G.size*3,build(){buildGalaxy(k);}}));
  // ---- マルチバース（空想） ----
  const UNI=[
   ["home","私たちの宇宙","#f4b942","ここに戻ると「宇宙の形」へ。"],
   ["mirror","鏡の宇宙","#7fe0ff","物質と反物質が入れ替わった宇宙。銀河の腕は逆巻きで、恒星は反陽子と陽電子でできている。見た目はほとんど同じだが、私たちの物質が触れると一瞬で光に変わる。"],
   ["heavy","重力の強い宇宙","#ff7a5a","重力が今の10倍強い宇宙。星はすぐ燃え尽き、銀河は小さく密集し、ブラックホールだらけになる。生命が育つ時間がほとんどない。"],
   ["thin","重力の弱い宇宙","#9a9ab0","重力が弱すぎて、ガスが集まらず星も銀河もできなかった宇宙。うすい水素の霧だけが、永遠に冷えながら広がり続ける。"],
   ["slow","光の遅い宇宙","#c99cf2","光の速さが秒速30kmしかない宇宙。星の光の届く範囲（光の球）が見えるほど遅く、遠くの景色はいつも何万年も前の姿。"],
   ["crystal","結晶の宇宙","#6fd2a0","誕生のときのゆらぎが完全に規則正しかった宇宙。銀河が結晶の原子のように等間隔に並ぶ。"],
   ["crunch","つぶれゆく宇宙","#ff4a6a","膨張が止まって収縮に転じた宇宙。銀河どうしが次々に衝突し、宇宙背景放射は熱く青白くなっていく。最後は一点に戻る「ビッグクランチ」。"],
   ["univita","ユニヴィータ宇宙（SFノート）","#ffd27a","SFノートの宇宙。生命と情報、物質の区別がなくなった知性（UOI）が、星々を光の網でつないでいる。超因果圏・高次存在領域へ続く入口がある。"]];
  lane("mv","マルチバース（空想）","shape","#c99cf2");lane("uv","別の宇宙（空想）","mv","#ff9ad0");
  addBr({id:"mv",lane:"mv",parent:"shape",pobj:"uni_shape",name:"マルチバース（空想）",short:"マルチバース",unit:"宇宙の外側（空想図）",desc:"ここから先は空想です。永久インフレーション説では、私たちの宇宙は無数の「泡宇宙」の一つかもしれない。泡ごとに物理定数が違えば、まったく違う宇宙になる。泡を選んで近づき、さらにズームインすると、その宇宙の中に入れます。",dist:900,min:60,max:2400,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const MVFS=`uniform vec3 uCol;uniform float uTime;varying vec3 vN;varying vec3 vW;varying vec2 vUv;${GLN}void main(){vec3 v=normalize(cameraPosition-vW);float f=pow(1.-abs(dot(normalize(vN),v)),2.5);float n=fbm(vUv*8.+uTime*.03);vec3 ir=.5+.5*cos(6.283*(f*1.5+n+vec3(0.,.33,.67)));gl_FragColor=vec4(mix(uCol,ir,.45)*(f*1.4+.05)+uCol*n*.08,f*.9+.06);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`;
      UNI.forEach(([id,nm,col,d],i)=>{const a=i/UNI.length*6.283,rr=i?420+R()*120:0;const r0=i?70+R()*40:110;const m=new THREE.ShaderMaterial({uniforms:{uCol:{value:C(col).convertSRGBToLinear()},uTime:{value:0}},vertexShader:VS,fragmentShader:MVFS,transparent:true,depthWrite:false});
        const b=sphere(r0,m,48);b.position.set(Math.cos(a)*rr,(R()-.5)*260,Math.sin(a)*rr);scene.add(b);const inner=glowBB(col,r0*1.1,0);b.add(inner);const ps=[];for(let k=0;k<300;k++){const q=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r0*.8*Math.cbrt(R()));ps.push(q.x,q.y,q.z);}b.add(points(ps,col,r0*.03,.9));
        const s0=1+R()*.05;anims.push(t=>{m.uniforms.uTime.value=t;b.scale.setScalar(s0+Math.sin(t*.4+i)*.03);});label("u_"+id,nm,b,r0*3.2,d,id==="home"?"直径約930億光年（観測できる範囲）":"空想");});
      const fil=[];for(let i=0;i<4000;i++){const q=V(R()-.5,R()-.5,R()-.5).multiplyScalar(2600);fil.push(q.x,q.y,q.z);}scene.add(points(fil,"#5a4a8a",3,.5));}});
  BRMAP["mv:u_home"]="shape";
  const uniBuild={
    mirror(){const g1=galFX({type:"spiral",size:200,arms:2,pitch:-.3,c1:"#c8f4ff",c2:"#ffd8b0",c3:"#7fffd0",gain:1});scene.add(g1);scene.add(galStars({type:"spiral",size:200,arms:2,pitch:-.3,c1:"#c8f4ff",c2:"#ffd8b0",c3:"#7fffd0",n:20000}));
      for(let i=0;i<14;i++){const gg=galFX({type:R()<.5?"spiral":"elliptical",size:30+R()*30,arms:2,pitch:-.3,c1:"#c8f4ff",c2:"#ffd8b0",gain:.8,bb:R()<.3});gg.position.set((R()-.5)*1400,(R()-.5)*500,(R()-.5)*1400);gg.rotation.x+=R();scene.add(gg);}
      const fl=glowBB("#ffffff",40,1);fl.position.set(130,40,60);scene.add(fl);anims.push(t=>{const k=(t*.5)%1;fl.scale.setScalar(k<.1?1+k*20:Math.max(0,3-k*3));});return "反物質の銀河（腕が逆巻き）";},
    heavy(){for(let i=0;i<60;i++){const b=blackHoleFX(2+R()*4);b.position.set((R()-.5)*700,(R()-.5)*300,(R()-.5)*700);scene.add(b);}
      for(let i=0;i<30;i++){const g=galFX({type:"elliptical",size:20+R()*20,bb:1,c1:"#bfd0ff",gain:1.4});g.position.set((R()-.5)*700,(R()-.5)*300,(R()-.5)*700);scene.add(g);}
      const sn=[];for(let i=0;i<20;i++){const s=glowBB("#9fc8ff",30,1);s.position.set((R()-.5)*700,(R()-.5)*300,(R()-.5)*700);scene.add(s);sn.push([s,R()*10]);}anims.push(t=>sn.forEach(([s,o])=>{const k=((t+o)*.3)%1;s.scale.setScalar(k<.15?k*8:Math.max(.01,1.2-k));}));return "ブラックホールと青い巨星だらけ";},
    thin(){const fog=nebFX("fog",1600,"#2a2a44","#7a7a9a");fog.material.uniforms.uGain.value=.5;scene.add(fog);const s=[];for(let i=0;i<120;i++)s.push((R()-.5)*1600,(R()-.5)*800,(R()-.5)*1600);scene.add(points(s,"#ffb070",4,.7));return "星のない水素の霧";},
    slow(){for(let i=0;i<18;i++){const p=V((R()-.5)*900,(R()-.5)*300,(R()-.5)*900);const st=star(4,["O","B","G","K","M"][i%5],10);st.position.copy(p);scene.add(st);
        const sh=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),new THREE.MeshBasicMaterial({color:["#9fc8ff","#cfe0ff","#fff2c0","#ffd0a0","#ffb070"][i%5],transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending}));sh.position.copy(p);scene.add(sh);const o=R()*10;anims.push(t=>{const k=((t+o)*.08)%1;sh.scale.setScalar(5+k*160);sh.material.opacity=.14*(1-k);});}
      return "光がゆっくり広がる球";},
    crystal(){const g=[];for(let x=-3;x<=3;x++)for(let y=-1;y<=1;y++)for(let z=-3;z<=3;z++){const gg=galFX({type:"spiral",size:34,arms:2,pitch:.3,c1:"#ffe2b8",c2:"#b8ffd8",gain:.9,seed:3});gg.position.set(x*150,y*150,z*150);scene.add(gg);}
      const lines=[];for(let x=-3;x<=3;x++)for(let y=-1;y<=1;y++){lines.push(V(x*150,y*150,-450),V(x*150,y*150,450));}for(let z=-3;z<=3;z++)for(let y=-1;y<=1;y++){lines.push(V(-450,y*150,z*150),V(450,y*150,z*150));}
      scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines),new THREE.LineBasicMaterial({color:"#3f8f6a",transparent:true,opacity:.35})));return "等間隔に並ぶ銀河";},
    crunch(){const bg=sphere(2000,new THREE.MeshBasicMaterial({color:"#2a3a8a",side:THREE.BackSide,transparent:true,opacity:.6}),32);scene.add(bg);anims.push(t=>bg.material.color.setHSL(.62-.05*Math.sin(t*.2),.6,.2+.05*Math.sin(t*.3)));
      const gs=[];for(let i=0;i<40;i++){const gg=galFX({type:R()<.5?"spiral":"elliptical",size:30+R()*20,bb:R()<.4,c1:"#ffd0b0",c2:"#c8d0ff",gain:1});const p=V((R()-.5)*900,(R()-.5)*400,(R()-.5)*900);gg.position.copy(p);scene.add(gg);gs.push([gg,p]);}
      anims.push(t=>{const k=1-((t*.02)%1)*.7;gs.forEach(([g,p])=>g.position.copy(p).multiplyScalar(k));});return "縮んでいく銀河たち";},
    univita(){const N=70,P=[];for(let i=0;i<N;i++){const p=V((R()-.5)*900,(R()-.5)*400,(R()-.5)*900);P.push(p);const s=star(3+R()*3,["G","A","F","K"][i%4],8);s.position.copy(p);scene.add(s);}
      const seg=[];P.forEach((a,i)=>{P.map((b,j)=>[a.distanceTo(b),j]).filter(x=>x[1]>i).sort((x,y)=>x[0]-y[0]).slice(0,3).forEach(([d,j])=>seg.push(a,P[j]));});
      const lm=new THREE.LineBasicMaterial({color:"#ffd27a",transparent:true,opacity:.55,blending:THREE.AdditiveBlending});scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),lm));
      const pk=[];for(let i=0;i<40;i++){const s=glowBB("#fff2c0",10,0);scene.add(s);pk.push([s,Math.floor(R()*seg.length/2),R()]);}anims.push(t=>{lm.opacity=.4+.2*Math.sin(t*1.5);pk.forEach(([s,k,o])=>{const a=seg[k*2],b=seg[k*2+1];s.position.copy(a).lerp(b,(t*.15+o)%1);});});
      const tc=new THREE.Object3D();tc.position.set(0,260,0);scene.add(tc);label("transcausal","超因果圏への入口（SFノート）",tc,300,"従来の因果律や時空の制約を超えて、知性どうしが交流できる段階（SFノートの第4段階）。","空想");
      const hy=new THREE.Mesh(new THREE.TorusKnotGeometry(60,8,200,16,3,5),new THREE.MeshBasicMaterial({color:"#ffd27a",wireframe:true,transparent:true,opacity:.35}));hy.position.set(0,-200,0);scene.add(hy);anims.push(t=>{hy.rotation.x=t*.2;hy.rotation.y=t*.13;});
      label("hypermension","高次存在領域（SFノート）",hy,400,"空間・時間・言語といった概念そのものを超えた存在領域。UOIが現れる（SFノートの第5段階）。図は高次元の形を3次元に映した「影」のイメージ。","空想");return "光の網でつながる知性（UOI）";}};
  UNI.slice(1).forEach(([id,nm,col,d])=>addBr({id:"uv_"+id,lane:"uv",parent:"mv",pobj:"u_"+id,name:nm,short:nm.replace(/（.*）/,""),unit:"別の宇宙（空想）",desc:d,dist:900,min:40,max:2200,fic:1,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const what=uniBuild[id]();const h=new THREE.Object3D();h.position.set(0,120,0);scene.add(h);label("uv_"+id+"_all",nm,h,900,d+"（すべて空想）",what);}}));
