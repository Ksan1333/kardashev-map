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
     desc:"体積の大部分を鉄の核が占める、とても「重い」惑星（核の半径は全体の約8割）。昼は430℃、夜は−180℃。",feat:[["caloris","カロリス盆地",30.5,170,"直径約1550kmの巨大な衝突盆地。"],["rachmaninoff","ラフマニノフ盆地",27.6,57.6,"二重の輪を持つ比較的新しい盆地。"],["borealis","ボレアリス平原",73,-79.5,"北極付近の広い溶岩平原。"],["chao","カイパー・クレーター",-11.4,-31.5,"明るい光条を持つ若いクレーター。"]]},
   venus:{name:"金星",kind:"venus",R:"6052km",layers:[[.53,"核（鉄・ニッケル）","#d8a060","#5a2a08"],[.985,"マントル（岩石）","#b0603a"],[1,"地殻（火山の溶岩）","#7a6a5a"]],
     desc:"地球とほぼ同じ大きさ・内部構造だが、表面は厚さ約70km・90気圧の二酸化炭素の大気と硫酸の雲に包まれ、460℃に達する。自転は逆向きで、1日（自転）が1年より長い。",feat:[["maxwell","マクスウェル山（雲の下）",65,3,"金星で最も高い山（約1万1000m）。"],["ishtar","イシュタル大陸",70,27.5,"オーストラリアほどの大きさの高地。"],["aphrodite","アフロディーテ大陸",-5.8,104.8,"赤道に沿う、金星最大の高地。"],["beta","ベータ地域",25.3,-77,"大きな火山がある高地。"]]},
   earth:{name:"地球",shell:"earth",R:"6371km",layers:[[.19,"内核（固体の鉄・ニッケル、約5400℃）","#ffe9a0","#ff9a20"],[.546,"外核（液体の鉄：地磁気を生む）","#ffb050","#a03a08"],[.895,"下部マントル","#c0502a"],[.99,"上部マントル","#d8703a"],[1,"地殻（大陸・海底）","#6a5a4a"]],
     desc:"中心から、固体の内核・液体の外核・マントル・地殻。外核の液体の鉄が流れることで地磁気が生まれ、宇宙からの放射線を防いでいる。いちばん深い穴（コラ半島超深度掘削）でも12kmで、地殻すら貫けていない。",feat:[["everest","エベレスト（最高峰）",27.99,86.93,"標高8849m。"],["mariana","マリアナ海溝（最深部）",11.35,142.2,"深さ約1万920m。"],["amazon","アマゾン熱帯雨林",-3,-60,"世界最大の熱帯雨林。"],["sahara","サハラ砂漠",23,13,"世界最大の暑い砂漠。"],["antarc","南極大陸",-80,0,"地球の淡水の約7割が氷として眠る。"],["tokyo","東京",35.68,139.69,"世界最大の都市圏。"]]},
   moon:{name:"月",kind:"moon",R:"1737km",layers:[[.14,"内核（固体の鉄）","#e8d8b0","#6a3a10"],[.19,"外核（液体）","#d8a060","#4a2008"],[.28,"部分的に溶けた層","#b0705a"],[.977,"マントル","#8a7a6a"],[1,"地殻","#9a9a96"]],
     desc:"アポロ計画で置いた地震計の記録から、小さな鉄の核を持つことが分かった。表側の黒い「海」は、約30〜40億年前に溶岩が流れ出て固まった平原。",feat:[["tranq","静かの海（アポロ11号）",.67,23.5,"1969年、人類が初めて月面に降り立った場所。"],["tycho","ティコ・クレーター",-43.3,-11.2,"明るい光条が四方に伸びる若いクレーター（約1億年前）。"],["imbrium","雨の海",32.8,-15.6,"直径約1100kmの巨大な溶岩の平原。"],["procellarum","嵐の大洋",18.4,-57.4,"月で最も広い「海」。"],["copernicus","コペルニクス・クレーター",9.6,-20.1,"直径約93kmの美しいクレーター。"],["crisium","危難の海",17,59.1,"円形のはっきりした海。"],["serenitatis","晴れの海",28,17.5,"アポロ17号が着陸した近く。"],["spa","南極エイトケン盆地（裏側）",-53,-169,"太陽系最大級の衝突盆地。直径約2500km。"],["chang4","嫦娥4号（裏側に初着陸）",-45.5,177.6,"2019年、月の裏側に初めて着陸した。"]]},
   mars:{name:"火星",kind:"mars",R:"3390km",layers:[[.54,"核（液体の鉄・硫黄）","#d89a5a","#6a2a08"],[.985,"マントル","#b0583a"],[1,"地殻","#8a4a2a"]],
     desc:"探査機インサイトの地震観測（2018〜2022年）で、核が意外に大きく液体であることが分かった。かつては川や湖があり、今も極に水の氷がある。",feat:[["olympus","オリンポス山",18.65,-133.8,"太陽系最大の火山。高さ約2万1900m。"],["valles","マリネリス峡谷",-12,-70,"長さ約4000km、深さ最大7kmの大峡谷。"],["hellas","ヘラス盆地",-42.4,70.5,"直径約2300kmの衝突盆地。"],["jezero","ジェゼロ・クレーター（パーサヴィアランス）",18.4,77.6,"昔の湖の跡で、生命の痕跡を探している。"],["npole","北極冠",86,0,"水の氷とドライアイスの層。"],["tharsis","タルシス台地（3つの火山）",0,-112,"アルシア山・パヴォニス山・アスクレウス山が並ぶ。"],["utopia","ユートピア平原",46.7,117.5,"バイキング2号（1976年）と祝融号（2021年）が着陸した。"],["argyre","アルギル盆地",-49.7,-43.4,"大きな衝突盆地。"],["gale","ゲール・クレーター（キュリオシティ）",-5.4,137.8,"2012年から探査車が登っているシャープ山がある。"],["spole","南極冠",-87,0,"ドライアイスが多い極冠。"]]},
   jupiter:{name:"木星",kind:"jupiter",R:"6万9911km",layers:[[.22,"中心核（岩石と氷・境界はぼやけている）","#d8b070","#7a4a10"],[.78,"金属水素の層（電気を通す：強い磁場の源）","#8a96a8","#1a2a40"],[.985,"液体の分子状水素","#c8a882"],[1,"大気（アンモニアなどの雲の層）","#e8d2b0"]],
     desc:"ほとんどが水素とヘリウム。深いところでは圧力で水素が金属のようになり、電気を流して太陽系最強の磁場をつくる。探査機ジュノーの観測で、中心核は岩石と水素が混ざった「ぼやけた核」だと分かってきた。",feat:[["grs","大赤斑",-22,-60,"地球より大きい巨大な嵐。少なくとも190年以上続いている。"],["neb","北赤道縞",12,0,"茶色い縞（ベルト）。"],["seb","南赤道縞",-15,90,"大赤斑のすぐ北側の縞。"],["ovalba","オーバルBA（小赤斑）",-33,40,"2000年に小さな渦が合体してできた嵐。"]]},
   saturn:{name:"土星",kind:"saturn",rings:0,R:"5万8232km",layers:[[.22,"中心核（岩石と氷）","#d8b070","#6a4010"],[.5,"金属水素の層","#8a96a8","#1a2a40"],[.985,"液体の分子状水素","#d8c08a"],[1,"大気（雲の層）","#efe0b8"]],
     desc:"平均密度は水より小さい（0.69g/cm³）。環の幅は約28万kmあるのに、厚さは多くの場所で10〜100mほど。主な環は内側からC環・B環・カッシーニの間隙・A環。",feat:[["hex","北極の六角形",80,0,"一辺が地球の直径より長い、六角形のジェット気流。"],["cassini","カッシーニの間隙",0,0,"B環とA環の間の幅約4800kmのすき間。"],["storm","大白斑（2010〜11年）",35,60,"約30年ごとに現れる巨大な嵐。"]]},
   uranus:{name:"天王星",kind:"uranus",rings:1,tilt:97.8,R:"2万5362km",layers:[[.2,"岩石の核","#a8907a","#3a2008"],[.75,"氷のマントル（水・アンモニア・メタン）","#4fb0c0"],[1,"水素・ヘリウムの大気","#9fdce0"]],
     desc:"自転軸が約98°傾き、横倒しで太陽のまわりを回る。「氷」のマントルは高温高圧の液体。メタンが赤い光を吸うので青緑に見える。",feat:[["spole2","南極（1986年にボイジャー2号が見た面）",-80,0,"当時は南極がほぼ太陽を向いていた。"]]},
   neptune:{name:"海王星",kind:"neptune",R:"2万4622km",layers:[[.25,"岩石の核","#a8907a","#3a2008"],[.8,"氷のマントル","#3f7fd0"],[1,"水素・ヘリウム・メタンの大気","#4f78e0"]],
     desc:"太陽系で最も強い風（秒速約600m）が吹く。1989年にボイジャー2号が「大暗斑」を撮影した。",feat:[["gds","暗斑",-20,-40,"地球ほどの大きさの高気圧の渦。"],["scooter","スクーター（白い雲）",-42,30,"暗斑より速く回る白い雲。"]]},
   pluto:{name:"冥王星",kind:"pluto",off:180,R:"1188km",layers:[[.72,"岩石の核","#8a6a52"],[.81,"内部の海（あると考えられている）","#3f7ac8"],[1,"氷の地殻（窒素や水の氷）","#d8c8b0"]],
     desc:"2015年に探査機ニューホライズンズが接近。ハート形の白い平原（スプートニク平原）は窒素の氷の海で、ゆっくり対流している。",feat:[["tombaugh","トンボー領域（ハート形）",20,175,"左半分が窒素の氷の平原スプートニク平原。"],["cthulhu","クトゥルフ領域",-5,100,"赤黒い有機物（ソリン）に覆われた地域。"],["sputnik","スプートニク平原",20,180,"窒素の氷でできた、ハートの左半分。"],["wright","ライト山",-22,173,"氷の火山かもしれない山。"]]}};
  function buildMap(key){const B=BODY[key];scene.add(new THREE.AmbientLight("#fff",1));const W=40,H=20;let mat;
    if(B.shell==="earth")mat=new THREE.MeshBasicMaterial({map:T.earth()});else if(B.shell==="star")mat=starMesh(1,"#fff0d0",48,.5).material;else mat=mapMat(B.kind,(B.off||0)*Math.PI/180);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(W,H,1,1),mat);scene.add(pl);const seg=[];
    for(let lo=-180;lo<=180;lo+=30)seg.push(V(lo/180*W/2,-H/2,.02),V(lo/180*W/2,H/2,.02));for(let la=-60;la<=60;la+=30)seg.push(V(-W/2,la/90*H/2,.02),V(W/2,la/90*H/2,.02));
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),new THREE.LineBasicMaterial({color:"#ffffff",transparent:true,opacity:.22})));
    const eq=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-W/2,0,.03),V(W/2,0,.03)]),new THREE.LineBasicMaterial({color:"#ffd27a",transparent:true,opacity:.5}));scene.add(eq);
    (B.feat||[]).forEach(([id,nm,la,lo,d])=>{const n=new THREE.Object3D();n.position.set(lo/180*W/2,la/90*H/2,.1);scene.add(n);const dot=sphere(.12,new THREE.MeshBasicMaterial({color:"#ffd27a"}),8);n.add(dot);label(id,nm,n,9,d+`（北緯/南緯 ${Math.abs(la)}°${la<0?"S":"N"}・経度 ${Math.abs(lo)}°${lo<0?"W":"E"}）`,B.name);});
    const h=new THREE.Object3D();h.position.set(0,H/2+1.4,0);scene.add(h);label(key+"_map",B.name+"の地図（全面）",h,30,B.desc+" 地図は正距円筒図法（横軸が経度−180°〜180°、縦軸が緯度−90°〜90°）。",(B.mapNote||"主な地名の位置は実際の緯度・経度。細かい模様は再現した想像図"));}
  function buildBody(key){if(window.SPZ_MAP){buildMap(key);return;}const B=BODY[key];lightsFor();const r=10;const g=new THREE.Group();scene.add(g);let shell;
    if(B.shell==="earth"){const e=earthMesh(r,SUNP);shell=e.material;}else if(B.shell==="star"){shell=starMesh(r,"#fff0d0",48,.5).material;}else shell=planetMat(B.kind,SUNP,(B.off||0)*Math.PI/180);
    const cut=cutaway(r,shell,B.layers,g);if(B.shell==="earth"){const uv=cut.children[0].geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*.75);}
    if(B.shell==="star"){const gl=glowBB("#ffb050",r*7,1);g.add(gl);}
    if(B.rings!==undefined){const rg=ringsFX(r,B.rings,SUNP);g.add(rg);}
    if(B.tilt){g.rotation.z=B.tilt*Math.PI/180;}
    anims.push(t=>{g.rotation.y=Math.sin(t*.12)*.35;});
    let prev=0;B.layers.forEach(([f,nm],i)=>{const rm=r*(prev+f)/2;prev=f;const n=new THREE.Object3D();const a=(200+i*9)*Math.PI/180;n.position.set(Math.cos(a)*rm,Math.sin(a)*rm,.05);g.add(n);label(key+"_l"+i,nm,n,r*1.6,"断面の層（半径の"+Math.round(f*100)+"%まで）","");});
    (B.feat||[]).forEach(([id,nm,la,lo,d])=>{const L2=((lo+(B.off||0))%360+360)%360;if(L2>92&&L2<178)return;const n=new THREE.Object3D();n.position.copy(llpos(r*1.01,la,lo+(B.off||0)));g.add(n);label(id,nm,n,r*1.2,d,B.name);});
    const h=new THREE.Object3D();h.position.set(0,r*1.35,0);g.add(h);label(key+"_all",B.name+"の全体",h,r*3.2,B.desc,"半径 "+B.R);}
  lane("pa","地球と月の中","moon","#6fb6ff");lane("pb","太陽・内惑星の中","inner","#ffb347");lane("pc","外惑星の中","outer","#c8a882");
  [["earth","pa","moon"],["moon","pa","moon"],["sun","pb","inner"],["mercury","pb","inner"],["venus","pb","inner"],["mars","pb","inner"],["jupiter","pc","outer"],["saturn","pc","outer"],["uranus","pc","outer"],["neptune","pc","outer"],["pluto","pc","outer"]].forEach(([k,ln,par])=>{
    const B=BODY[k];addBr({id:"in_"+k,lane:ln,parent:par,pobj:k,name:B.name+"の中",short:B.name,unit:"断面図（層の厚さは実際の比率）",desc:B.desc,dist:34,min:12,max:80,th:-2.35,ph:1.05,build(){buildBody(k);this.th=window.SPZ_MAP?0:-2.35;this.ph=window.SPZ_MAP?1.5708:1.05;this.dist=window.SPZ_MAP?32:34;}});});
  BRMAP["inner:earth"]="in_earth";BRMAP["outer:sun"]="in_sun";
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
  // ---- マルチバース（空想）：泡宇宙と、その上の2つの層 ----
  // [id, 名前, 色, 説明, 私たちの宇宙との違い, 見どころ[[id,名前,説明,[x,y,z],印の色]]]
  const UNI=[
   ["home","私たちの宇宙","#f4b942","ここに戻ると「宇宙の形」へ。","—",[]],
   ["mirror","鏡の宇宙","#7fe0ff","物質と反物質が入れ替わった宇宙。銀河の腕は逆巻きで、恒星は反陽子と陽電子でできている。見た目はほとんど同じだが、私たちの物質が触れると一瞬で光に変わる。","物質↔反物質、左右も反転",
     [["mi_gal","逆巻きの渦巻銀河","腕の巻き方が私たちの銀河と逆向き。",[0,10,0]],["mi_star","反物質の恒星","反陽子と陽電子でできた星。光は私たちの星と同じなので、見ただけでは区別できない。",[60,20,-40],"#c8f4ff"],["mi_flash","対消滅の閃光","物質の宇宙のかけらが紛れ込むと、ガンマ線の閃光になる。",[130,40,60],"#ffffff"],["mi_cloud","反水素の雲","反陽子1個と陽電子1個の反水素原子のガス。",[-260,-60,120],"#7fffd0"],["mi_earth","鏡の地球（空想）","左右が反転した大陸を持つかもしれない、もう一つの青い惑星。",[-120,30,-200],"#4f8fff"]]],
   ["heavy","重力の強い宇宙","#ff7a5a","重力が今の10倍強い宇宙。星はすぐ燃え尽き、銀河は小さく密集し、ブラックホールだらけになる。生命が育つ時間がほとんどない。","重力定数Gが約10倍",
     [["he_bh","ブラックホールの群れ","大きな星はすぐにつぶれてブラックホールになる。",[100,0,-80]],["he_blue","青い短命の巨星","寿命は数百万年ほど。",[-160,40,80],"#9fc8ff"],["he_sn","超新星の連鎖","次々に星が爆発し、空が明滅する。",[200,-60,120]],["he_dense","小さく密な銀河","直径は私たちの銀河の数十分の一。",[-60,-80,-200]],["he_life","生命の時計","星の寿命が短すぎて、生命が進化する時間がない。",[0,120,0]]]],
   ["thin","重力の弱い宇宙","#9a9ab0","重力が弱すぎて、ガスが集まらず星も銀河もできなかった宇宙。うすい水素の霧だけが、永遠に冷えながら広がり続ける。","重力定数Gが約100分の1",
     [["th_fog","永遠の水素の霧","ガスは集まらず、ただ広がり続ける。",[0,0,0]],["th_lone","まれに生まれた孤独な星","偶然濃くなった場所にだけ、小さな星がぽつんとある。",[300,40,-200],"#ffb070"],["th_cmb","冷えていく背景放射","温度は下がり続け、やがて何も見えなくなる。",[-400,100,200]],["th_none","構造のない空","銀河も星座もない、のっぺりとした空。",[0,250,0]]]],
   ["slow","光の遅い宇宙","#c99cf2","光の速さが秒速30kmしかない宇宙。星の光の届く範囲（光の球）が見えるほど遅く、遠くの景色はいつも何万年も前の姿。","光速cが約1万分の1",
     [["sl_sphere","光の球（因果の地平）","星の光が届いた範囲。球の外ではまだその星は「生まれていない」。",[0,0,0]],["sl_past","過去しか見えない空","となりの星の光でも、届くまで何年もかかる。",[200,80,-100]],["sl_time","時間の遅れが日常","秒速数kmで走るだけで時計が遅れる（相対性理論の効果）。",[-200,-40,150]],["sl_color","色の変わる星","近づく星は青く、遠ざかる星は赤く見える。",[100,-120,200],"#9fc8ff"]]],
   ["crystal","結晶の宇宙","#6fd2a0","誕生のときのゆらぎが完全に規則正しかった宇宙。銀河が結晶の原子のように等間隔に並ぶ。","初期ゆらぎが完全に周期的",
     [["cr_lat","格子に並ぶ銀河","銀河どうしの間隔がすべて同じ。",[0,0,0]],["cr_disl","格子のずれ（転位）","1か所だけ並びがずれた帯。",[300,150,0],"#ffd27a"],["cr_sound","宇宙の音（格子の振動）","銀河の並びが波のように揺れている。",[-300,-150,300]],["cr_sky","規則正しい星座","どの方向を見ても同じ模様の空。",[0,300,-300]]]],
   ["crunch","つぶれゆく宇宙","#ff4a6a","膨張が止まって収縮に転じた宇宙。銀河どうしが次々に衝突し、宇宙背景放射は熱く青白くなっていく。最後は一点に戻る「ビッグクランチ」。","膨張→収縮（物質が多すぎた）",
     [["cu_merge","衝突する銀河","距離が縮み、銀河どうしがぶつかり合う。",[80,20,40]],["cu_hot","熱くなる背景放射","空そのものが星より熱く光り始める。",[-300,100,-300]],["cu_point","最後の一点","すべてが一点に集まるビッグクランチ。",[0,0,0],"#ffffff"],["cu_bounce","次の宇宙の種（バウンス説）","つぶれた後に、また膨張が始まるかもしれない。",[0,-200,0],"#ff9ad0"]]],
   ["flat","2次元の宇宙","#ffd27a","空間が平面しかない宇宙。重力は距離に反比例して弱まり、星や銀河は平面の上で回る。","空間が2次元",
     [["fl_star","平面の恒星","光も熱も平面の中だけに広がる。",[0,0,0],"#fff2c0"],["fl_orbit","ゆらぐ軌道","重力の弱まり方が違うので、惑星の軌道は花びらのように回る。",[160,0,0]],["fl_life","2次元の生き物","口から肛門までの管があると体が2つに分かれてしまう（2次元生物の難問）。",[-200,0,120],"#7fe0b0"],["fl_wire","交差できない電線","平面では、線と線が交われない。",[100,0,-220]]]],
   ["fourd","4次元空間の宇宙","#9fe8ff","空間が4次元ある宇宙。重力や電気の力が距離の3乗で弱まるため、惑星は安定して回れず、原子も形を保てない。","空間が4次元（力は距離の3乗に反比例）",
     [["fo_star","惑星のない恒星","安定な軌道がないので、惑星は落ちるか飛び去る。",[0,0,0],"#fff2c0"],["fo_slice","超球の星","私たちには4次元の球の「断面」だけが見え、大きくなったり小さくなったりする。",[200,40,-80],"#9fe8ff"],["fo_atom","形を保てない原子","電子は原子核に落ちてしまう。化学も生命も成り立たない。",[-180,-40,120],"#c99cf2"],["fo_cube","超立方体の結晶","4次元の結晶は、3次元に影を落とすと形が変わり続ける。",[0,140,200]]]],
   ["weakless","弱い力のない宇宙","#ffb36a","4つの力のうち「弱い力」がない宇宙。実際に2006年に物理学者が「それでも星も生命もできるかもしれない」と論文で示した、検討された仮説の宇宙。","弱い力がない（ほかの定数を調整）",
     [["we_star","重水素を燃やす小さな星","水素ではなく重水素の核融合で輝く、少し暗い星。",[0,0,0],"#ffb070"],["we_sn","少ない超新星","弱い力がないので、超新星爆発の多くが起きない。",[220,60,-100]],["we_planet","鉄の少ない惑星","重い元素のばらまかれ方が違い、惑星の材料も変わる。",[-200,-30,150],"#c8a070"],["we_life","それでも生命は？","炭素や酸素はでき、生命が生まれる可能性は残る。",[0,150,0],"#7fe0b0"]]],
   ["nocarbon","炭素が生まれない宇宙","#7fd0d0","炭素ができる原子核の反応（ホイル状態）がわずかにずれた宇宙。星の中で炭素がほとんど作られず、酸素とネオンの宇宙になる。","強い力の強さが数%違う",
     [["nc_neb","酸素の星雲","青緑に光る、炭素のない星雲。",[0,0,0],"#7fffd0"],["nc_planet","炭素のない惑星","有機物がなく、岩と酸素の氷でできた星。",[200,40,-120],"#a0b0c0"],["nc_si","ケイ素の生き物（空想）","炭素の代わりにケイ素の結晶で体をつくる生命がいるかもしれない。",[-200,-20,160],"#cfe6ff"],["nc_why","なぜ私たちの宇宙には炭素がある？","物理定数がちょうどよい値になっている「微調整問題」の例として有名。",[0,160,0]]]],
   ["rip","引き裂かれる宇宙（ビッグリップ）","#ff6a3a","膨張をうながす「ファントム・エネルギー」が強い宇宙。膨張がどんどん加速し、銀河団、銀河、恒星系、そして原子までもが最後には引き裂かれる。","ダークエネルギーの性質がw<−1",
     [["ri_cl","ほどける銀河団","最初に銀河どうしのつながりが切れる。",[0,0,0]],["ri_sys","ほどける恒星系","最後の数か月で惑星が恒星から離れていく。",[200,40,-100],"#ffd27a"],["ri_atom","原子まで分解","最後の一瞬、原子さえも引き裂かれる。",[-180,-60,140],"#ffffff"],["ri_hor","迫る地平線","見える範囲がどんどん小さくなる。",[0,200,0],"#ff6a3a"]]],
   ["cycle","時間が輪になった宇宙","#c8a0ff","時間が円のようにつながった宇宙。終わりがそのまま始まりに戻り、同じ出来事が永遠にくり返す。","時間が閉じている（閉じた時間的曲線）",
     [["cy_ring","時間の輪","終わりとはじまりがつながっている。",[0,0,0]],["cy_twice","何度も見える銀河","同じ銀河が、時間の輪を回るたびに現れる。",[300,0,0],"#c8a0ff"],["cy_para","自分の過去と出会う","過去を変えると矛盾が起きる（タイムパラドックス）。",[-300,60,0],"#ff9ad0"],["cy_eternal","永劫回帰","ニーチェが考えた「同じ人生が永遠にくり返す」世界。",[0,200,0]]]],
   ["quantum","量子が大きい宇宙","#7fb2ff","量子の効果（プランク定数）がとても大きい宇宙。ふだんの大きさのものまで「重ね合わせ」になり、惑星や銀河の位置がぼやけ、見たときに初めて決まる。","プランク定数hが巨大",
     [["qu_pl","2つの場所にある惑星","見るまでは、どちらにあるとも決まっていない。",[0,0,0],"#7fb2ff"],["qu_int","干渉縞の銀河","銀河の光が波のように重なり、縞模様をつくる。",[200,40,-150]],["qu_obs","観測で決まる世界","誰かが見るたびに、世界の形が1つに定まる。",[-200,-30,150],"#ffffff"],["qu_tun","トンネル効果の星","星が壁をすり抜けるように、突然別の場所に現れる。",[0,180,0],"#ffd27a"]]],
   ["alive","生命に満ちた宇宙","#7fe0b0","どの惑星にも生命があり、多くの銀河がType III文明に包まれた宇宙。銀河の星々はダイソン球に覆われて赤外線で光り、文明どうしの通信が空を満たしている。","生命の誕生がとても起きやすい",
     [["al_dyson","ダイソン球に包まれた銀河","恒星の光を文明が使い尽くし、銀河は赤外線でしか光らない。",[0,0,0],"#ff7a5a"],["al_net","銀河間の通信網","文明どうしの光の通信が空を横切る。",[200,60,-100],"#7fe0b0"],["al_forest","森の惑星","どの惑星にも、それぞれ違う生命の森がある。",[-160,-40,120],"#4faa5a"],["al_fermi","フェルミのパラドックスがない世界","「みんなどこにいる？」という問いがそもそも生まれない。",[0,170,0]]]],
   ["univita","ユニヴィータ宇宙（SFノート）","#ffd27a","SFノートの宇宙。生命と情報、物質の区別がなくなった知性（UOI）が、星々を光の網でつないでいる。超因果圏・高次存在領域へ続く入口がある。","生命・情報・物質の区別がない",[]]];
  lane("mv","マルチバース（空想）","shape","#c99cf2");lane("uv","別の宇宙（空想）","mv","#ff9ad0");lane("up","上位の層（空想）","mv","#9fe8ff");
  const MVFS=`uniform vec3 uCol;uniform float uTime;varying vec3 vN;varying vec3 vW;varying vec2 vUv;${GLN}void main(){vec3 v=normalize(cameraPosition-vW);float f=pow(1.-abs(dot(normalize(vN),v)),2.5);float n=fbm(vUv*8.+uTime*.03);vec3 ir=.5+.5*cos(6.283*(f*1.5+n+vec3(0.,.33,.67)));gl_FragColor=vec4(mix(uCol,ir,.45)*(f*1.4+.05)+uCol*n*.08,f*.9+.06);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`;
  function bubble(r0,col){const m=new THREE.ShaderMaterial({uniforms:{uCol:{value:C(col).convertSRGBToLinear()},uTime:{value:0}},vertexShader:VS,fragmentShader:MVFS,transparent:true,depthWrite:false});const b=sphere(r0,m,40);anims.push(t=>m.uniforms.uTime.value=t);return b;}
  addBr({id:"mv",lane:"mv",parent:"shape",pobj:"uni_shape",up:"meta",downObj:"u_home",name:"マルチバース（空想）",short:"マルチバース",unit:"宇宙の外側（空想図）",desc:"ここから先は空想です。永久インフレーション説では、私たちの宇宙は無数の「泡宇宙」の一つかもしれない。泡ごとに物理定数が違えば、まったく違う宇宙になる。泡を選んで近づき、さらにズームインするとその宇宙の中へ。ズームアウトを続けると、さらに上の層（空想）へ。",dist:1100,min:60,max:2600,
    build(){scene.add(new THREE.AmbientLight("#fff",1));
      UNI.forEach(([id,nm,col,d,diff],i)=>{const a=i/UNI.length*6.283*2.0,rr=i?380+(i%3)*160:0;const r0=i?60+R()*35:110;const b=bubble(r0,col);b.position.set(Math.cos(a)*rr,i?((i%4)-1.5)*150:0,Math.sin(a)*rr);scene.add(b);b.add(glowBB(col,r0*1.1,0));
        const ps=[];for(let k=0;k<260;k++){const q=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r0*.8*Math.cbrt(R()));ps.push(q.x,q.y,q.z);}b.add(points(ps,col,r0*.03,.9));
        const s0=1+R()*.05;anims.push(t=>b.scale.setScalar(s0+Math.sin(t*.4+i)*.03));label("u_"+id,nm,b,r0*3.2,d+(diff!=="—"?"（違い："+diff+"）":""),id==="home"?"直径約930億光年（観測できる範囲）":"空想");});
      const fil=[];for(let i=0;i<4000;i++){const q=V(R()-.5,R()-.5,R()-.5).multiplyScalar(3000);fil.push(q.x,q.y,q.z);}scene.add(points(fil,"#5a4a8a",3,.5));}});
  BRMAP["mv:u_home"]="shape";
  // 上位の層1：法則の海（メタバース）
  addBr({id:"meta",lane:"up",parent:"mv",up:"omni",downObj:"m_ours",down:"mv",fic:1,name:"法則の海（メタバース・空想）",short:"法則の海",unit:"マルチバースのさらに外（空想）",desc:"空想の層。ここでは「物理法則の決まり方」そのものが場所ごとに違い、マルチバース（泡宇宙の群れ）が島のように浮かぶ。法則を記したような光の粒が海流のように流れている。金色の島が私たちのマルチバース。",dist:1400,min:80,max:3200,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const isl=[["m_ours","私たちのマルチバース","#f4b942",V(0,0,0),"泡宇宙の群れ。ここにズームインすると戻れる。"],["m_everett","量子の多世界の森（エヴェレット解釈）","#7fb2ff",V(620,120,-260),"量子の出来事のたびに世界が枝分かれするという解釈。枝が林のように広がる。"],["m_melt","法則が溶ける海峡","#ff9ad0",V(-560,-140,300),"ここでは物理定数がゆっくり変化し続け、泡宇宙が生まれては溶ける。"],["m_timeless","時間のないマルチバース","#9fe8ff",V(-200,260,-640),"時間という次元を持たない泡ばかりの群れ。変化も歴史もない。"],["m_made","文明が作ったマルチバース（SF）","#ffd27a",V(380,-280,560),"高度な文明（Type V）が、自分たちで宇宙を生み出して育てているという空想。SFノートのUOIの先かもしれない。"]];
      isl.forEach(([id,nm,col,p,d],k)=>{const g=new THREE.Group();g.position.copy(p);scene.add(g);for(let i=0;i<26;i++){const b=bubble(12+R()*22,col);b.position.set((R()-.5)*220,(R()-.5)*140,(R()-.5)*220);g.add(b);}g.add(glowBB(col,360,0));
        if(id==="m_everett"){const seg=[];const br=(o,dir,len,dp)=>{const e=o.clone().addScaledVector(dir,len);seg.push(o,e);if(dp<6){br(e,dir.clone().add(V(R()-.5,R()*.6,R()-.5)).normalize(),len*.75,dp+1);br(e,dir.clone().add(V(R()-.5,R()*.6,R()-.5)).normalize(),len*.75,dp+1);}};br(V(0,-120,0),V(0,1,0),70,0);g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),new THREE.LineBasicMaterial({color:"#9fc8ff",transparent:true,opacity:.7})));}
        anims.push(t=>{g.rotation.y=t*.02*(k%2?1:-1);});label(id,nm,g,700,d,"空想");});
      const N=6000,pos=new Float32Array(N*3),ph=[];for(let i=0;i<N;i++){ph.push([R()*6.283,(R()-.5)*1400,900+R()*900,.02+R()*.04]);}const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(gg,new THREE.PointsMaterial({color:"#9fe8ff",size:5,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(pts);
      anims.push(t=>{for(let i=0;i<N;i++){const [a,y,r,w]=ph[i];const q=a+t*w;pos[i*3]=Math.cos(q)*r;pos[i*3+1]=y+Math.sin(q*3+i)*40;pos[i*3+2]=Math.sin(q)*r*.7;}gg.attributes.position.needsUpdate=true;});
      const h=new THREE.Object3D();h.position.set(0,700,0);scene.add(h);label("meta_all","法則の海（全体）",h,2400,"マルチバースのさらに外側を想像した層。どんな法則の宇宙が生まれうるか、その「法則の法則」が場所によって違う。","空想");}});
  // 上位の層2：オムニバース（すべての可能性）
  addBr({id:"omni",lane:"up",parent:"meta",top:1,downObj:"o_meta",down:"meta",fic:1,name:"オムニバース（すべての可能性・空想）",short:"オムニバース",unit:"考えうるすべての世界（空想）",desc:"想像できる最も外側の層。「数学的に矛盾なく書けるものは、すべてどこかに実在する」という考え（テグマークの数学的宇宙仮説＝レベルIV）を絵にした空想。立体・結び目・フラクタル・セル・オートマトンが、それぞれ別の世界の「設計図」として漂う。ここより外は描けない。",dist:1300,min:60,max:2000,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const wire=(geo,col,p,sp)=>{const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:.6}));m.position.copy(p);scene.add(m);anims.push(t=>{m.rotation.x=t*sp;m.rotation.y=t*sp*.7;});return m;};
      const cvTex=(f)=>{const c=document.createElement("canvas");c.width=c.height=256;const x=c.getContext("2d");f(x);return new THREE.CanvasTexture(c);};
      const mand=cvTex(x=>{const im=x.createImageData(256,256);for(let j=0;j<256;j++)for(let i=0;i<256;i++){let cr=-2.2+i/256*3,ci=-1.5+j/256*3,zr=0,zi=0,k=0;while(k<60&&zr*zr+zi*zi<4){const t=zr*zr-zi*zi+cr;zi=2*zr*zi+ci;zr=t;k++;}const v=k===60?0:k/60;const o=(j*256+i)*4;im.data[o]=255*Math.sqrt(v);im.data[o+1]=120*v;im.data[o+2]=255*(1-v)*(k===60?0:1);im.data[o+3]=255;}x.putImageData(im,0,0);});
      const ca=cvTex(x=>{x.fillStyle="#000";x.fillRect(0,0,256,256);let row=new Array(256).fill(0);row[255]=1;x.fillStyle="#7fe0b0";for(let y=0;y<256;y++){for(let i=0;i<256;i++)if(row[i])x.fillRect(i,y,1,1);const nr=row.map((_,i)=>{const l=row[(i+255)%256],c=row[i],r=row[(i+1)%256];return (110>>(l*4+c*2+r))&1;});row=nr;}});
      const plane=(tex,p,nm,id,d)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,transparent:true,opacity:.9}));m.position.copy(p);scene.add(m);anims.push(t=>m.lookAt(camera.position));label(id,nm,m,520,d,"空想");};
      const meta=new THREE.Group();scene.add(meta);for(let i=0;i<12;i++){const b=bubble(14+R()*16,"#9fe8ff");b.position.set((R()-.5)*120,(R()-.5)*80,(R()-.5)*120);meta.add(b);}meta.add(glowBB("#9fe8ff",260,0));label("o_meta","法則の海（ここから来た）",meta,600,"一つ下の層。ここにズームインすると戻れる。","空想");
      label("o_math","数学的構造の宇宙（立体）",wire(new THREE.IcosahedronGeometry(110,0),"#ffd27a",V(520,120,-200),.1),560,"正多面体のような「形の決まり」だけで成り立つ世界。数学的宇宙仮説では、これも一つの宇宙。","空想");
      label("o_knot","結び目の宇宙",wire(new THREE.TorusKnotGeometry(80,18,200,12,3,7),"#ff9ad0",V(-500,-80,260),.08),560,"ほどけない結び目の形そのものが、世界の法則になっている世界。","空想");
      plane(mand,V(-160,260,-560),"フラクタルの宇宙（マンデルブロ集合）","o_frac","単純な式のくり返しから、無限に細かい形が生まれる世界。どこを拡大しても新しい模様が現れる。");
      plane(ca,V(300,-260,520),"論理だけの世界（セル・オートマトン）","o_logic","「ルール110」のような単純な規則だけで、計算も複雑な模様も生まれる。規則そのものが物理法則の世界。");
      const st=new THREE.Group();st.position.set(-560,200,-120);scene.add(st);for(let i=0;i<60;i++){const s=sphere(4+R()*6,new THREE.MeshBasicMaterial({color:["#ffd27a","#ff9ad0","#9fe8ff"][i%3]}),8);s.position.set((R()-.5)*160,(R()-.5)*160,(R()-.5)*160);st.add(s);}anims.push(t=>st.rotation.y=t*.05);
      label("o_story","物語の宇宙（空想）","—"&&st,520,"「書かれた物語の世界も、どこかに実在するのでは？」という空想の島。数学的に矛盾がなければ、物語の宇宙もありうる。","空想");
      const hy=wire(new THREE.TorusKnotGeometry(60,8,240,16,5,8),"#fff2c0",V(80,380,300),.15);label("o_hyper","高次存在領域（SFノート）",hy,460,"SFノートの最終段階。空間・時間・言語を超えた存在の領域を、この層に置いてみた。","空想");
      const edge=sphere(1700,new THREE.MeshBasicMaterial({color:"#ffffff",side:THREE.BackSide,transparent:true,opacity:.04,depthWrite:false}),32);scene.add(edge);const en=new THREE.Object3D();en.position.set(0,0,1650);scene.add(en);label("o_edge","描けない果て","—"&&en,1600,"ここより外は、言葉でも図でも描けない。この地図の最も外側。","空想");
      const pts=[];for(let i=0;i<5000;i++){const q=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(300+R()*1300);pts.push(q.x,q.y,q.z);}scene.add(points(pts,"#ffffff",3,.5));}});
  BRMAP["meta:m_ours"]="mv";BRMAP["omni:o_meta"]="meta";
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
      label("hypermension","高次存在領域（SFノート）",hy,400,"空間・時間・言語といった概念そのものを超えた存在領域。UOIが現れる（SFノートの第5段階）。図は高次元の形を3次元に映した「影」のイメージ。","空想");return "光の網でつながる知性（UOI）";},
    flat(){const gr=new THREE.GridHelper(1400,56,"#5a4a20","#2a2410");scene.add(gr);const pl=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400),new THREE.MeshBasicMaterial({color:"#2a2008",transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));pl.rotation.x=-Math.PI/2;scene.add(pl);
      for(let i=0;i<10;i++){const g=galFX({type:"spiral",size:80+R()*60,arms:2,pitch:.3,c1:"#ffe2a0",c2:"#ffd27a",gain:1});g.position.set((R()-.5)*1100,.5,(R()-.5)*1100);scene.add(g);}
      const s=new THREE.Mesh(new THREE.CircleGeometry(14,48),new THREE.MeshBasicMaterial({color:"#fff2c0"}));s.rotation.x=-Math.PI/2;s.position.y=1;scene.add(s);const ob=[];for(let k=0;k<3;k++){const p=new THREE.Mesh(new THREE.CircleGeometry(4,24),new THREE.MeshBasicMaterial({color:["#7fe0b0","#c8a070","#7fb2ff"][k]}));p.rotation.x=-Math.PI/2;p.position.y=1.2;scene.add(p);ob.push(p);}
      const ros=[];for(let i=0;i<=600;i++){const a=i/600*6.283*5;const r=60+k2(a);ros.push(V(Math.cos(a)*r,1,Math.sin(a)*r));}function k2(a){return 70+40*Math.cos(a*1.6);}scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ros),new THREE.LineBasicMaterial({color:"#ffd27a",transparent:true,opacity:.5})));
      anims.push(t=>ob.forEach((p,k)=>{const a=t*(.6-k*.15)+k*2;const r=60+k*50+40*Math.cos(a*1.6);p.position.set(Math.cos(a)*r,1.2,Math.sin(a)*r);}));return "平面だけの銀河と、花びらのような軌道";},
    fourd(){for(let i=0;i<16;i++){const p=V((R()-.5)*700,(R()-.5)*300,(R()-.5)*700);const st=star(4,["G","K","A","F"][i%4],8);st.position.copy(p);scene.add(st);const sl=sphere(1,new THREE.MeshBasicMaterial({color:"#9fe8ff",transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending}),24);sl.position.copy(p);scene.add(sl);const o=R()*6;anims.push(t=>sl.scale.setScalar(6+Math.abs(Math.sin(t*.5+o))*22));}
      const tg=new THREE.Group();tg.position.set(0,140,200);scene.add(tg);const v4=[];for(let a=0;a<16;a++)v4.push([a&1?1:-1,a&2?1:-1,a&4?1:-1,a&8?1:-1]);const ed=[];for(let a=0;a<16;a++)for(let k=0;k<4;k++){const b2=a^(1<<k);if(a<b2)ed.push([a,b2]);}
      const pos=new Float32Array(ed.length*6);const lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.BufferAttribute(pos,3));tg.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:"#9fe8ff"})));
      anims.push(t=>{const P=v4.map(v=>{let [x,y,z,w]=v;const c=Math.cos(t*.5),s2=Math.sin(t*.5);[x,w]=[x*c-w*s2,x*s2+w*c];const f=40/(3-w);return [x*f,y*f,z*f];});ed.forEach(([a,b2],i)=>{pos.set(P[a],i*6);pos.set(P[b2],i*6+3);});lg.attributes.position.needsUpdate=true;});
      const fall=[];for(let i=0;i<8;i++){const p=sphere(2.5,new THREE.MeshBasicMaterial({color:"#c99cf2"}),10);scene.add(p);fall.push([p,R()*6]);}anims.push(t=>fall.forEach(([p,o])=>{const k=((t*.2+o)%1);const a=o*3+k*12;const r=90*(1-k);p.position.set(Math.cos(a)*r,0,Math.sin(a)*r);}));
      return "惑星を持てない恒星と、超立方体の影";},
    weakless(){for(let i=0;i<10;i++){const g=galFX({type:R()<.6?"spiral":"elliptical",size:60+R()*80,arms:2,pitch:.3,c1:"#ffc890",c2:"#ffb070",gain:.9,bb:R()<.3});g.position.set((R()-.5)*1200,(R()-.5)*400,(R()-.5)*1200);g.rotation.x+=R();scene.add(g);}
      const s=star(10,"K",9);scene.add(s);for(let k=0;k<3;k++){const p=planetGPU(2.5,["mars","moon","venus"][k],V(0,0,0),24);scene.add(p);const r=40+k*22,o=k*2;anims.push(t=>p.position.set(Math.cos(t*.3/(k+1)+o)*r,0,Math.sin(t*.3/(k+1)+o)*r));}return "少し暗い星と、静かな銀河";},
    nocarbon(){const n=nebFX("ring",300,"#3fd0c0","#bfffe8");scene.add(n);const n2=nebFX("orion",420,"#2fb0a0","#cffff0","#ffffff");n2.position.set(-300,80,-200);scene.add(n2);
      const pl=planetGPU(16,"europa",V(0,200,300),48);pl.position.set(200,40,-120);scene.add(pl);const cr=new THREE.Group();cr.position.set(-200,-20,160);scene.add(cr);for(let i=0;i<14;i++){const c=new THREE.Mesh(new THREE.OctahedronGeometry(6+R()*8,0),new THREE.MeshStandardMaterial({color:"#cfe6ff",metalness:.6,roughness:.1,transparent:true,opacity:.85}));c.position.set((R()-.5)*60,(R()-.5)*40,(R()-.5)*60);c.rotation.set(R()*3,R()*3,R()*3);cr.add(c);}
      scene.add(new THREE.PointLight("#cfffff",1.5,0,0));anims.push(t=>cr.rotation.y=t*.2);return "青緑の酸素の星雲と、ケイ素の結晶";},
    rip(){const gs=[];for(let i=0;i<36;i++){const g=galFX({type:R()<.5?"spiral":"elliptical",size:30+R()*30,arms:2,c1:"#ffd0b0",c2:"#ffb080",gain:1,bb:R()<.4});const p=V((R()-.5)*600,(R()-.5)*300,(R()-.5)*600);g.position.copy(p);scene.add(g);gs.push([g,p,R()]);}
      const sys=new THREE.Group();sys.position.set(200,40,-100);scene.add(sys);const st=star(6,"G",8);sys.add(st);const pls=[];for(let k=0;k<4;k++){const p=planetGPU(1.6,["mars","venus","neptune","moon"][k],V(0,0,0),20);sys.add(p);pls.push(p);}
      const hor=sphere(1,new THREE.MeshBasicMaterial({color:"#ff6a3a",wireframe:true,transparent:true,opacity:.25}),24);scene.add(hor);
      anims.push(t=>{const k=(t*.03)%1;const e=Math.exp(k*2.5);gs.forEach(([g,p,o])=>{g.position.copy(p).multiplyScalar(e);g.scale.setScalar(1+k*o*1.5);});pls.forEach((p,i)=>{const r=(12+i*7)*(1+k*k*6),a=t*.6/(i+1);p.position.set(Math.cos(a)*r,0,Math.sin(a)*r);});hor.scale.setScalar(900*(1-k*.85));});return "広がり続け、すべてが引き裂かれていく";},
    cycle(){const N=40;const R0=320;for(let i=0;i<N;i++){const a=i/N*6.283;const g=galFX({type:"spiral",size:36,arms:2,c1:"#e0c8ff",c2:"#c8a0ff",gain:1,seed:i%5});g.position.set(Math.cos(a)*R0,Math.sin(a*3)*40,Math.sin(a)*R0);scene.add(g);}
      const ring=new THREE.Mesh(new THREE.TorusGeometry(R0,4,8,200),new THREE.MeshBasicMaterial({color:"#c8a0ff",transparent:true,opacity:.4}));ring.rotation.x=Math.PI/2;scene.add(ring);const tk=glowBB("#ffffff",40,1);scene.add(tk);anims.push(t=>{const a=t*.15;tk.position.set(Math.cos(a)*R0,Math.sin(a*3)*40,Math.sin(a)*R0);});return "輪になって巡る時間";},
    quantum(){const ghosts=[];for(let i=0;i<6;i++){const p=planetGPU(14,["jupiter","neptune","mars"][i%3],V(0,300,300),40);p.material.transparent=true;scene.add(p);ghosts.push([p,V((R()-.5)*120,(R()-.5)*60,(R()-.5)*120),R()*6]);}
      anims.push(t=>ghosts.forEach(([p,o,ph],i)=>{const k=Math.sin(t*1.3+ph);p.position.copy(o).multiplyScalar(k);p.visible=Math.sin(t*7+ph*3)>-.3;}));
      const ifm=new THREE.Mesh(new THREE.PlaneGeometry(500,300),new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform float uTime;varying vec2 vUv;void main(){vec2 p=vUv*2.-1.;float d1=length(p-vec2(-.3,0.)),d2=length(p-vec2(.3,0.));float I=((cos((d1-d2)*40.+uTime))*(cos((d1-d2)*40.+uTime)))*exp(-dot(p,p)*1.5);gl_FragColor=vec4(vec3(.5,.7,1.)*I,I*.8);}",transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
      ifm.position.set(200,40,-150);scene.add(ifm);anims.push(t=>{ifm.material.uniforms.uTime.value=t;ifm.lookAt(camera.position);});
      const tn=star(5,"F",8);scene.add(tn);anims.push(t=>{const k=Math.floor(t/2.5);tn.position.set(Math.sin(k*7.1)*200,180+Math.cos(k*3.3)*40,Math.cos(k*5.3)*200);});return "ぼやけて重なり合う天体";},
    alive(){for(let i=0;i<14;i++){const g=new THREE.Group();g.position.set((R()-.5)*1000,(R()-.5)*360,(R()-.5)*1000);scene.add(g);g.add(galFX({type:"spiral",size:70+R()*50,arms:2,c1:"#ff7a5a",c2:"#a0302a",gain:.8}));g.add(galStars({type:"spiral",size:80,arms:2,c1:"#ff5a3a",c2:"#ff8a5a",n:2500,ps:.7}));}
      const seg=[];for(let i=0;i<40;i++){seg.push(V((R()-.5)*1000,(R()-.5)*360,(R()-.5)*1000),V((R()-.5)*1000,(R()-.5)*360,(R()-.5)*1000));}const lm=new THREE.LineBasicMaterial({color:"#7fe0b0",transparent:true,opacity:.35,blending:THREE.AdditiveBlending});scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),lm));anims.push(t=>lm.opacity=.25+.15*Math.sin(t*2));
      const ds=new THREE.Group();scene.add(ds);const sh=sphere(14,new THREE.MeshBasicMaterial({color:"#ff6a4a",wireframe:true,transparent:true,opacity:.5}),16);ds.add(sh);ds.add(glowBB("#ff5a3a",80,0));
      const fp=planetGPU(10,"europa",V(0,0,0),40);fp.material.uniforms.uKind.value=PLK.mars;fp.position.set(-160,-40,120);scene.add(fp);const forest=sphere(10.3,new THREE.MeshStandardMaterial({color:"#2f8a3a",transparent:true,opacity:.75}),32);forest.position.copy(fp.position);scene.add(forest);scene.add(new THREE.PointLight("#ffffff",1.2,0,0));
      return "赤外線で光る銀河と、文明の通信網";},
  };
  UNI.slice(1).forEach(([id,nm,col,d,diff,feats])=>{BRMAP["mv:u_"+id]="uv_"+id;addBr({id:"uv_"+id,lane:"uv",parent:"mv",pobj:"u_"+id,name:nm,short:nm.replace(/（.*）/,""),unit:"別の宇宙（空想）",ph:id==="flat"?.5:.95,desc:d+(diff!=="—"?"　私たちの宇宙との違い："+diff+"。":""),dist:900,min:40,max:2200,fic:1,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const what=uniBuild[id]();
      (feats||[]).forEach(([fid,fn,fd,p,mk])=>{let n;if(mk){n=glowBB(mk,26,0);}else n=new THREE.Object3D();n.position.set(...p);scene.add(n);label(fid,fn,n,260,fd,"空想");});
      const h=new THREE.Object3D();h.position.set(0,320,0);scene.add(h);label("uv_"+id+"_all",nm+"（全体）",h,1200,d+(diff!=="—"?"　私たちの宇宙との違い："+diff+"。":"")+"（すべて空想）",what);}});});
