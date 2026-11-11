/* ---------- 出来事を「人の目線」で描く小さな3Dジオラマ ---------- */
window.EV3D=(function(){
  if(typeof THREE==="undefined")return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),C=c=>new THREE.Color(c);
  const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.8,flatShading:true,...o});
  const E=(c,i=1)=>new THREE.MeshBasicMaterial({color:c,transparent:i<1,opacity:i});
  let seed=1;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  // ---- 分類 ----
  const has=(s,re)=>re.test(s);
  function classify(sp){const t=(sp.title||"")+" "+(sp.desc||"");const tags=(sp.tags||[]).join(" ");const y=sp.y;
    if(sp.kind&&sp.kind!=="hist"){const k=sp.kind;
      if(/bigbang|cmb|stars|galaxies|milky|sun|disk/.test(k))return {s:"space",k};
      if(k==="molten"||k==="moonimpact")return {s:"molten",k};if(k==="ocean"||k==="life"||k==="oxygen")return {s:"ocean",k};if(k==="snow")return {s:"snow"};
      if(k==="land")return {s:y<-3.6e8?"land":"forest"};if(k==="extinct")return {s:"extinct"};if(k==="dino")return {s:y< -6.6e7?"dino":"mammal"};
      if(k==="impact")return {s:"impact"};if(k==="human")return {s:"savanna"};}
    // 宇宙年表・地球史年表の言葉から
    if(sp.src==="cosmos"){if(has(t,/ビッグバン|インフレーション|プランク|無から|無境界|膜|バウンス|イーオン|共形/))return {s:"space",k:"bigbang"};if(has(t,/晴れ上がり|原子$|原子\b|原子核|陽子|クオーク|力|ヒッグス|電弱|統一/))return {s:"space",k:"particles"};
      if(has(t,/最初の星|星と重い|宇宙の正午/))return {s:"space",k:"stars"};if(has(t,/銀河|加速|多元宇宙|泡宇宙/))return {s:"space",k:"galaxies"};if(has(t,/太陽系|地球/))return {s:"space",k:"disk"};
      if(has(t,/生命/))return {s:"ocean",k:"life"};if(has(t,/リップ/))return {s:"space",k:"rip"};if(has(t,/クランチ/))return {s:"space",k:"crunch"};if(has(t,/真空崩壊/))return {s:"space",k:"vacuum"};
      if(has(t,/赤色巨星/))return {s:"scorched"};if(has(t,/アンドロメダ/))return {s:"space",k:"galaxies"};if(has(t,/熱的死|ブラックホール|陽子崩壊|星の誕生が終わる|フリーズ/))return {s:"space",k:"dark"};if(has(t,/現在/))return {s:"space",k:"galaxies"};return {s:"space",k:"stars"};}
    if(sp.src==="earth"){if(has(t,/地球の誕生/))return {s:"molten"};if(has(t,/月の誕生/))return {s:"molten",k:"moonimpact"};if(has(t,/全球凍結/))return {s:"snow"};
      if(has(t,/恐竜|鳥|三畳|ジュラ|白亜/))return {s:"dino"};if(has(t,/大量絶滅|絶滅/))return {s:"extinct"};if(has(t,/哺乳|霊長/))return {s:"mammal"};
      if(has(t,/人類|ルーシー|石器|サピエンス|ネアンデルタール/))return {s:"savanna"};if(has(t,/太陽に飲み込|外側へ|海が蒸発/))return {s:"scorched"};
      if(has(t,/森林|植物|花|陸上|両生|爬虫|昆虫|菌類/))return {s:"forest"};if(has(t,/大陸|パンゲア|ロディニア|ヌーナ|ゴンドワナ|ケノーランド|プロキシマ|アメイジア|オーリカ|原始大陸/))return {s:"rift"};
      if(has(t,/魚|節足|三葉虫|アンモナイト|軟体|動物|カンブリア|エディアカラ/))return {s:"sea"};return {s:"ocean",k:"life"};}
    // 世界史
    if(y>2100)return {s:"future",era:6,t};
    const era=y<-3000?0:y<500?1:y<1450?2:y<1760?3:y<1945?4:y<=2026.5?5:6;
    if(has(t,/月面|アポロ|月に/))return {s:"moon",era};if(has(t,/原爆|核実験|水爆/))return {s:"nuke",era};
    if(has(t,/ピラミッド/))return {s:"pyramid",era};if(has(t,/長城/))return {s:"wall",era};
    if(has(t,/ペスト|疫病|パンデミック|コロナ|感染症|天然痘/))return {s:"plague",era};if(has(t,/地震|噴火|津波|ヴェスヴィオ/))return {s:"volcano",era};
    if(has(t,/鉄道|蒸気機関車|新幹線/))return {s:"train",era};if(has(t,/飛行機|航空|ライト兄弟/))return {s:"plane",era};
    if(has(t,/インターネット|Web|コンピュータ|AI|スマートフォン|携帯|半導体/))return {s:"lab",era};if(has(t,/オリンピック|スタジアム/))return {s:"stadium",era};
    if(has(tags,/宇宙/)||has(t,/ロケット|人工衛星|スプートニク|宇宙/))return {s:"launch",era};
    if(has(tags,/戦争/)||has(t,/戦い|戦争|侵攻|征服|攻略|包囲/))return {s:"battle",era};
    if(has(tags,/宗教/))return {s:"temple",era};if(has(t,/航海|到達|発見|探検|船|艦隊|移民/)||(has(tags,/交通/)&&era<4))return {s:"voyage",era};
    if(has(tags,/技術|エネルギー|学問|医療/))return {s:"workshop",era};if(has(tags,/経済|農業|食料/))return {s:"market",era};
    if(has(t,/革命|独立|宣言|憲法|共和|議会|民主/))return {s:"assembly",era,flags:1};return {s:"town",era};}
  // ---- 組み立て ----
  let S,anims,root;
  const add=(m,x=0,y=0,z=0)=>{m.position.set(x,y,z);m.castShadow=true;root.add(m);return m;};
  const box=(w,h,d,c,x,y,z)=>add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==="string"?M(c):c),x,y+h/2,z);
  const cyl=(a,b,h,c,x,y,z,s=10)=>add(new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s),typeof c==="string"?M(c):c),x,y+h/2,z);
  const cone=(r,h,c,x,y,z,s=10)=>add(new THREE.Mesh(new THREE.ConeGeometry(r,h,s),typeof c==="string"?M(c):c),x,y+h/2,z);
  const sph=(r,c,x,y,z)=>add(new THREE.Mesh(new THREE.SphereGeometry(r,16,10),typeof c==="string"?M(c):c),x,y,z);
  let TOD="day",WX="clear";const TODC={dawn:["#e89a7a",.45],day:[null,0],dusk:["#d0603a",.5],night:["#050a1a",.82]};
  function sky(top,bot,stars){if(TODC[TOD][0]){top=C(top).lerp(C(TOD==="night"?"#02040c":TODC[TOD][0]),TODC[TOD][1]).getStyle();bot=C(bot).lerp(C(TODC[TOD][0]),TODC[TOD][1]).getStyle();if(TOD==="night")stars=1;}
    if(WX!=="clear"){top=C(top).lerp(C(WX==="snow"?"#c9d3dd":"#5d6670"),.55).getStyle();bot=C(bot).lerp(C(WX==="snow"?"#e6ebf0":"#7a838c"),.55).getStyle();}const m=new THREE.Mesh(new THREE.SphereGeometry(200,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{a:{value:C(top)},b:{value:C(bot)}},vertexShader:"varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform vec3 a;uniform vec3 b;varying vec3 p;void main(){gl_FragColor=vec4(mix(b,a,clamp(p.y*1.5+.1,0.,1.)),1.);}"}));S.add(m);
    if(stars){const p=[];for(let i=0;i<1500;i++){const a=R()*6.28,u=R()*1.2-.2;p.push(Math.cos(a)*Math.sqrt(1-u*u)*190,u*190,Math.sin(a)*Math.sqrt(1-u*u)*190);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));S.add(new THREE.Points(g,new THREE.PointsMaterial({color:"#fff",size:1.3,sizeAttenuation:false})));}}
  function ground(c,r=60){const g=new THREE.Mesh(new THREE.CircleGeometry(r,48),M(c,{roughness:1}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;root.add(g);return g;}
  function water(c="#2f7fc0",r=60,y=.05){const g=new THREE.PlaneGeometry(r*2,r*2,40,40);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.2,metalness:.3,flatShading:true,transparent:true,opacity:.92}));m.rotation.x=-Math.PI/2;m.position.y=y;root.add(m);
    const b=g.attributes.position.array.slice();anims.push(t=>{const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setZ(i,Math.sin(b[i*3]*.4+t)*.12+Math.cos(b[i*3+1]*.35+t*.8)*.1);a.needsUpdate=true;g.computeVertexNormals();});}
  function light(c="#fff",i=1,pos=[20,30,10],amb=.5){if(TOD==="night"){i*=.25;amb*=.45;c="#9fb4ff";}else if(TOD!=="day"){c=TOD==="dusk"?"#ffb07a":"#ffd0b0";pos=[pos[0],6,pos[2]];}if(WX!=="clear")i*=.6;S.add(new THREE.HemisphereLight("#ffffff","#444455",amb));const d=new THREE.DirectionalLight(c,i);d.position.set(...pos);S.add(d);}
  function sunDisc(c,pos,r=8){const s=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),E(c));s.position.set(...pos);S.add(s);return s;}
  function person(c,x,z,ry=0,s=1){if(Math.hypot(x,z-4)<3.2){z=Math.min(z,.6);if(Math.abs(x)<1.2)x+=x<0?-1.5:1.5;}const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.17*s,.22*s,.9*s,8),M(c));b.position.y=.75*s;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.16*s,10,8),M("#d9a77a"));h.position.y=1.38*s;g.add(h);
    [-1,1].forEach(k=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.06*s,.06*s,.5*s,6),M("#3a3030"));l.position.set(0,.25*s,k*.09*s);g.add(l);});g.position.set(x,0,z);g.rotation.y=ry;root.add(g);return g;}
  function crowd(n,cx,cz,r,cols,walk=.3,face){for(let i=0;i<n;i++){const a=R()*6.28,d=Math.sqrt(R())*r;const p=person(cols[i%cols.length],cx+Math.cos(a)*d,cz+Math.sin(a)*d,face!=null?face:R()*6.28);const o=R()*6;if(walk)anims.push(t=>{p.position.y=Math.abs(Math.sin(t*4+o))*.05;p.rotation.y+=Math.sin(t+o)*.002;});}}
  function tree(x,z,kind="broad",s=1){if(kind==="palm"||kind==="fern"){cyl(.12*s,.18*s,(kind==="fern"?1.2:3)*s,"#6b4a2b",x,0,z,6);for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(2*s,.06,.4*s),M(kind==="fern"?"#3f7a2a":"#3f8a3a"));l.position.set(x+Math.cos(i)*s*.8,(kind==="fern"?1.2:3)*s,z+Math.sin(i)*s*.8);l.rotation.y=-i;l.rotation.z=-.4;root.add(l);}return;}
    if(kind==="conifer"){cyl(.15*s,.2*s,1.2*s,"#5a3a2a",x,0,z,6);cone(1.2*s,3.5*s,"#2f5d3a",x,1*s,z,7);return;}
    if(kind==="acacia"){cyl(.12*s,.18*s,2.4*s,"#6b4a2b",x,0,z,6);const c=new THREE.Mesh(new THREE.SphereGeometry(1.6*s,10,6),M("#6a8a3a"));c.scale.y=.3;c.position.set(x,2.6*s,z);root.add(c);return;}
    if(kind==="dead"){cyl(.12*s,.2*s,2.5*s,"#3a3030",x,0,z,5);for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.04,.07,1.2*s,4),M("#3a3030"));b.position.set(x+Math.cos(i*2)*.4,2*s,z+Math.sin(i*2)*.4);b.rotation.z=.8*Math.cos(i*2);b.rotation.x=.8*Math.sin(i*2);root.add(b);}return;}
    cyl(.15*s,.22*s,1.4*s,"#6b4a2b",x,0,z,6);sph(1.1*s,kind==="giant"?"#2f6a2a":"#4f8a3c",x,2.2*s,z);}
  function ring(n,r,f){for(let i=0;i<n;i++){const a=i/n*6.283+R()*.2,rr=r+(R()-.5)*r*.3;f(Math.cos(a)*rr,Math.sin(a)*rr,a);}}
  const PAL={0:{w:"#a08060",r:"#6b5a3a"},1:{w:"#d8c49a",r:"#a8442f"},2:{w:"#b9b3a6",r:"#5a4a3a"},3:{w:"#e6dccb",r:"#7a3a2a"},4:{w:"#a8543a",r:"#3a3a3a"},5:{w:"#c9d3df",r:"#6a7a8a"},6:{w:"#eef3f8",r:"#7ee0ff"}};
  function house(x,z,era,h,ry){const p=PAL[era];if(era===0){const c=cone(1.4,2.2,"#8a6a3a",x,0,z,8);return;}
    if(era>=5){const b=box(2.2,h*1.8,2.2,M(era===6?"#dfe8f2":p.w,{metalness:.3,roughness:.4,emissive:"#223",emissiveIntensity:.2}),x,0,z);b.rotation.y=ry;if(era===6){const r=cyl(.2,.2,1,E("#7ee0ff"),x,h*1.8,z);}return;}
    const b=box(2,h,2,p.w,x,0,z);b.rotation.y=ry;const r=cone(1.7,1,p.r,x,h,z,4);r.rotation.y=Math.PI/4+ry;if(era===4&&R()<.4){cyl(.25,.3,h+2.5,"#5a3a2a",x+.6,0,z+.6,8);smoke(x+.6,h+2.5,z+.6);}}
  function smoke(x,y,z,c="#888",n=6){for(let i=0;i<n;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:.5,depthWrite:false}));root.add(s);const o=i/n;anims.push(t=>{const k=(t*.15+o)%1;s.position.set(x+k*2,y+k*6,z);s.scale.setScalar(.6+k*2);s.material.opacity=.55*(1-k);});}}
  function fire(x,z,s=1){const f=new THREE.Mesh(new THREE.ConeGeometry(.35*s,1*s,8),E("#ffb040",.9));f.position.set(x,.5*s,z);root.add(f);const pl=new THREE.PointLight("#ff9a40",1.5,8*s);pl.position.set(x,1,z);S.add(pl);anims.push(t=>{f.scale.y=1+Math.sin(t*20)*.2;pl.intensity=1.3+Math.sin(t*13)*.4;});}
  function town(era,n=14){ring(n,14,(x,z,a)=>house(x,z,era,2+R()*(era>=5?6:2),-a));}
  function flag(x,z,c="#d8302a",h=4){cyl(.05,.05,h,"#ccc",x,0,z,5);const f=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9,6,3),new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide}));f.position.set(x+.7,h-.5,z);root.add(f);const g=f.geometry,b=g.attributes.position.array.slice();anims.push(t=>{for(let i=0;i<g.attributes.position.count;i++)g.attributes.position.setZ(i,Math.sin(b[i*3]*3+t*5)*.12*(b[i*3]+.7));g.attributes.position.needsUpdate=true;});}
  function ship(x,z,era,s=1){const g=new THREE.Group();g.position.set(x,0,z);root.add(g);const hull=new THREE.Mesh(new THREE.BoxGeometry(5*s,1*s,1.6*s),M(era>=5?"#3a4a5a":"#6b4a2b"));hull.position.y=.4;g.add(hull);
    if(era<4){[-1,0,1].forEach(k=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,4*s,5),M("#4a3020"));m.position.set(k*1.4*s,2.4*s,0);g.add(m);const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.3*s,2.2*s),new THREE.MeshStandardMaterial({color:"#f2ead8",side:THREE.DoubleSide}));sl.position.set(k*1.4*s,2.6*s,.1);sl.rotation.y=Math.PI/2;g.add(sl);});}
    else{const c=new THREE.Mesh(new THREE.BoxGeometry(1.6*s,1.2*s,1.2*s),M("#e6e6e6"));c.position.set(-1.2*s,1.4*s,0);g.add(c);const st=new THREE.Mesh(new THREE.CylinderGeometry(.3,.35,1.6*s,8),M(era===4?"#2a2a2a":"#c0392b"));st.position.set(-.2*s,2*s,0);g.add(st);if(era>=5)for(let i=0;i<5;i++){const cn=new THREE.Mesh(new THREE.BoxGeometry(.6*s,.5*s,1.2*s),M(["#c0392b","#2e86de","#27ae60","#f1c40f"][i%4]));cn.position.set((i*.7+.5)*s,1.15*s,0);g.add(cn);}}
    const o=R()*6;anims.push(t=>{g.position.y=Math.sin(t+o)*.12;g.rotation.z=Math.sin(t*.8+o)*.04;g.position.x=x+Math.sin(t*.05+o)*3;});return g;}
  function dino(x,z,type,s=1){const g=new THREE.Group();g.position.set(x,0,z);root.add(g);const col=M(type==="long"?"#6a7a4a":"#7a5a3a");
    if(type==="long"){const b=new THREE.Mesh(new THREE.SphereGeometry(1.6*s,12,8),col);b.scale.set(1.8,1,1);b.position.y=3*s;g.add(b);[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,c])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.35*s,.35*s,2.2*s,8),col);l.position.set(a*1.6*s,1.1*s,c*.8*s);g.add(l);});
      const nk=new THREE.Mesh(new THREE.CylinderGeometry(.3*s,.5*s,6*s,8),col);nk.position.set(3.5*s,6*s,0);nk.rotation.z=-.6;g.add(nk);const h=new THREE.Mesh(new THREE.SphereGeometry(.45*s,10,8),col);h.position.set(5.2*s,8.5*s,0);g.add(h);
      const tl=new THREE.Mesh(new THREE.ConeGeometry(.6*s,6*s,8),col);tl.rotation.z=Math.PI/2+.2;tl.position.set(-5.5*s,2.5*s,0);g.add(tl);anims.push(t=>{nk.rotation.z=-.6+Math.sin(t*.4)*.05;h.position.y=8.5*s+Math.sin(t*.4)*.3;});}
    else{const b=new THREE.Mesh(new THREE.SphereGeometry(.9*s,12,8),col);b.scale.set(1.8,1,1);b.position.y=2.4*s;b.rotation.z=.15;g.add(b);[-1,1].forEach(c=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.25*s,.18*s,2*s,8),col);l.position.set(0,1*s,c*.4*s);g.add(l);});
      const h=new THREE.Mesh(new THREE.BoxGeometry(1.4*s,.8*s,.7*s),col);h.position.set(2*s,3.3*s,0);g.add(h);const tl=new THREE.Mesh(new THREE.ConeGeometry(.5*s,3.5*s,8),col);tl.rotation.z=Math.PI/2-.2;tl.position.set(-2.8*s,2.6*s,0);g.add(tl);}
    const o=R()*6;anims.push(t=>{g.position.x=x+Math.sin(t*.12+o)*3;g.rotation.y=Math.cos(t*.12+o)>0?0:Math.PI;});return g;}
  function bigBody(c,pos,r){const s=new THREE.Mesh(new THREE.SphereGeometry(r,32,16),new THREE.MeshStandardMaterial({color:c,roughness:1}));s.position.set(...pos);S.add(s);return s;}
  function particles(n,cols,spread,size=.15,motion){const p=[],c=[];for(let i=0;i<n;i++){p.push((R()-.5)*spread,(R()-.2)*spread*.6,-(R())*spread);const cc=C(cols[i%cols.length]);c.push(cc.r,cc.g,cc.b);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setAttribute("color",new THREE.Float32BufferAttribute(c,3));
    const pt=new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));S.add(pt);if(motion)anims.push(t=>motion(pt,t));return pt;}
  function glow(c,s,pos){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,c);r.addColorStop(.3,c);r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,128,128);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(s,s,1);sp.position.set(...pos);S.add(sp);return sp;}
  function glowSun(){const s=new THREE.Mesh(new THREE.SphereGeometry(10,24,16),E("#fff2c0"));s.position.set(0,40,-140);S.add(s);}
  // ---- 場面 ----
  // 出来事ごとのちがい：看板・天気・小道具
  function sign(title,yr){const c=document.createElement("canvas");c.width=512;c.height=128;const g=c.getContext("2d");g.fillStyle="#0a0f1fdd";g.fillRect(0,0,512,128);g.strokeStyle="#f4b942";g.lineWidth=6;g.strokeRect(3,3,506,122);
    g.fillStyle="#f4b942";g.font="bold 26px sans-serif";g.fillText(yr,18,40);g.fillStyle="#fff";g.font="bold 38px sans-serif";let t=title;while(g.measureText(t).width>480&&t.length>2)t=t.slice(0,-1);g.fillText(t===title?t:t+"…",18,96);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(4,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide,transparent:true}));m.position.set(-3.2,3.2,-4);m.rotation.y=.35;root.add(m);
    [-1,1].forEach(k=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.8,6),M("#5a4a3a"));p.position.set(-3.2+k*1.6*Math.cos(.35),1.4,-4+k*-1.6*Math.sin(.35));root.add(p);});}
  function weather(){if(WX==="rain"){const p=[];for(let i=0;i<1500;i++)p.push((R()-.5)*40,R()*20,-R()*30+5);const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({color:"#aac8ee",size:.06}));S.add(o);anims.push(t=>{o.position.y=-((t*14)%20);});}
    if(WX==="snow"){const p=[];for(let i=0;i<1200;i++)p.push((R()-.5)*40,R()*20,-R()*30+5);const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({color:"#fff",size:.12}));S.add(o);anims.push(t=>{o.position.y=-((t*1.5)%20);o.position.x=Math.sin(t*.3);});}
    if(WX==="fog")S.fog=new THREE.Fog("#c8ccd4",6,40);
    if(TOD==="night"){for(let i=0;i<6;i++){const l=new THREE.PointLight("#ffcf7a",.9,12);l.position.set((R()-.5)*20,3,-R()*16);S.add(l);const b=new THREE.Mesh(new THREE.SphereGeometry(.15,8,6),E("#ffe0a0"));b.position.copy(l.position);S.add(b);}}}
  const PROPS=[
   [/印刷|活版|本|書物|新聞|聖書/,()=>{box(1.6,1.2,1,"#5a3a2a",2.5,0,-4);box(1.4,.15,.9,"#f2ead8",2.5,1.2,-4);for(let i=0;i<5;i++)box(.5,.1,.7,"#f2ead8",3.6+i*.1,0,-3.2+i*.05);}],
   [/蒸気|機関|工場|産業革命/,()=>{cyl(.8,.8,2.4,"#3a3a3a",3,0,-5,14);const w=new THREE.Mesh(new THREE.TorusGeometry(1,.12,6,16),M("#5a4a3a"));w.position.set(4.4,1.2,-5);root.add(w);anims.push(t=>w.rotation.z=t*2);smoke(3,2.4,-5,"#999",6);}],
   [/電気|電信|電話|電球|送電/,()=>{for(let i=0;i<5;i++){cyl(.06,.08,5,"#6b4a2b",-8+i*4,0,-7,5);box(1,.08,.08,"#6b4a2b",-8+i*4,4.6,-7);}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-8,4.7,-7),V(8,4.7,-7)]),new THREE.LineBasicMaterial({color:"#222"}));root.add(l);}],
   [/自動車|車|フォード/,()=>{for(let i=0;i<4;i++){const c=box(1.8,.7,.9,["#c0392b","#2a2a2a","#2e86de","#f1c40f"][i],-6+i*3.5,.2,-2);const o=R()*6;anims.push(t=>c.position.x=((t*2+o*5)%20)-10);}}],
   [/城|要塞|砦/,()=>{box(6,4,4,"#9a948a",0,0,-16);[-3,3].forEach(x=>{cyl(1,1,6,"#8a847a",x,0,-14,10);cone(1.2,1.6,"#5a3a3a",x,6,-14,10);});}],
   [/大聖堂|教会|聖堂|教皇|ローマ教皇/,()=>{box(4,6,8,"#c8c0b0",0,0,-18);cone(1,6,"#6a6458",0,6,-14,4);const r=new THREE.Mesh(new THREE.CircleGeometry(.8,16),E("#c94a8a",.8));r.position.set(0,4,-13.95);root.add(r);}],
   [/モスク|メッカ|カーバ/,()=>{sph(2.2,"#e8dcc4",0,4,-16);box(5,3,5,"#e8dcc4",0,0,-16);cyl(.25,.3,8,"#e8dcc4",4,0,-16);cone(.3,.8,"#3fae6a",4,8,-16,8);}],
   [/仏教|仏|寺|ストゥーパ|悟り/,()=>{box(4,1,4,"#d8c8a0",0,0,-14);sph(1.8,"#f2e8c8",0,1.6,-14);cyl(.15,.15,1.6,"#c9a24a",0,3.2,-14);}],
   [/王|皇帝|即位|戴冠|女王|帝国/,()=>{box(1.6,.5,1,"#c9a24a",0,0,-6);box(1.6,2,.3,"#8a2a2a",0,.5,-6.4);const cr=new THREE.Mesh(new THREE.TorusGeometry(.35,.08,6,12),M("#f4c430",{metalness:.8,roughness:.3}));cr.position.set(0,2.4,-6);cr.rotation.x=Math.PI/2;root.add(cr);anims.push(t=>cr.rotation.z=t);}],
   [/条約|会議|講和|同盟|サミット|国際連合|国連/,()=>{box(5,.15,2,"#6b4a2b",0,1,-5);for(let i=0;i<8;i++)person(["#2a2a3a","#3a4a6a","#5a3a3a"][i%3],-2+(i%4)*1.3,-5+(i<4?-1.3:1.3),i<4?0:Math.PI);flag(-4,-7,"#2e86de");flag(4,-7,"#c0392b");}],
   [/革命|暴動|反乱|蜂起|デモ|抗議/,()=>{for(let i=0;i<6;i++)box(1,.6,.6,"#6b5a4a",-3+i*1.2,0,-5);crowd(14,0,-8,3,["#c0392b","#2a2a2a","#ecf0f1"],.5);fire(2,-6,.8);}],
   [/運河/,()=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(4,40),new THREE.MeshStandardMaterial({color:"#2f7fc0",roughness:.2}));w.rotation.x=-Math.PI/2;w.position.set(6,.03,-10);root.add(w);ship(6,-10,4,.6);}],
   [/橋/,()=>{box(16,.4,2,"#8a8a8a",0,3,-12);for(let i=-2;i<=2;i++)box(.6,3,.6,"#7a7a7a",i*3.5,0,-12);}],
   [/塔|タワー/,()=>{for(let i=0;i<6;i++)box(2.2-i*.3,2.2,2.2-i*.3,"#a89a7a",0,i*2.2,-18);}],
   [/ベルリンの壁|壁/,()=>{for(let i=-6;i<=6;i++)box(1.9,3,.4,"#b8b8b0",i*2,0,-7);crowd(16,0,-4,4,["#2e86de","#ecf0f1","#f1c40f"],.4);}],
   [/空襲|爆撃|原爆|空爆/,()=>{for(let i=0;i<3;i++){const pl=new THREE.Group();pl.add(new THREE.Mesh(new THREE.BoxGeometry(3,.4,.4),M("#3a3a3a")),new THREE.Mesh(new THREE.BoxGeometry(.5,.08,4),M("#3a3a3a")));S.add(pl);anims.push(t=>pl.position.set(((t*4+i*8)%60)-30,14+i,-20-i*3));}fire(-4,-10,1.5);smoke(-4,1,-10,"#333",8);}],
   [/海戦|艦隊|艦/,()=>{for(let i=0;i<3;i++)ship(-8+i*8,-20,4,1.2);smoke(0,2,-20,"#666",6);}],
   [/モンゴル|騎馬|遊牧|チンギス/,()=>{for(let i=0;i<6;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,.7,.5),M("#6b4a2b"));b.position.y=1.1;g.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.7,.35),M("#6b4a2b"));h.position.set(.8,1.5,0);g.add(h);
      for(const[x,z]of[[.5,.2],[.5,-.2],[-.5,.2],[-.5,-.2]]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.8,4),M("#4a3020"));l.position.set(x,.4,z);g.add(l);}root.add(g);const o=R()*10;anims.push(t=>g.position.set(((t*3+o)%30)-15,Math.abs(Math.sin(t*8+o))*.15,-6-o*.4));}}],
   [/十字軍|騎士/,()=>{for(let i=0;i<6;i++){const p=person("#d8d8d8",-4+i*1.6,-6,0);const c=new THREE.Mesh(new THREE.BoxGeometry(.05,.4,.3),E("#c0392b"));c.position.set(.2,.8,0);p.add(c);}flag(-6,-7,"#ffffff");}],
   [/幕府|侍|武士|将軍|戦国|関ヶ原|江戸/,()=>{for(let k=0;k<3;k++){box(5-k*1.2,1.6,4-k*1.2,"#f2f2ea",0,k*2,-18);box(6-k*1.2,.3,5-k*1.2,"#3a3a3a",0,k*2+1.6,-18);}}],
   [/稲|水田|田んぼ|米作|コメ/,()=>{for(let i=0;i<8;i++){const w=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshStandardMaterial({color:"#6fa0b0",roughness:.2}));w.rotation.x=-Math.PI/2;w.position.set(-6+(i%4)*3.2,.04,-6-Math.floor(i/4)*3.2);root.add(w);for(let k=0;k<9;k++)cone(.08,.5,"#6fae4a",-7+(i%4)*3.2+(k%3),.0,-7-Math.floor(i/4)*3.2+Math.floor(k/3),4);}},1],
   [/小麦|農業|農耕|麦/,()=>{for(let i=0;i<120;i++)cone(.06,.8,"#d8b44a",(R()-.5)*16,0,-4-R()*10,4);},1],
   [/石油|油田/,()=>{for(let i=0;i<3;i++){cone(1,6,M("#555",{wireframe:true}),-6+i*6,0,-14,4);const b=box(2.4,.2,.2,"#2a2a2a",-6+i*6,6,-14);anims.push(t=>b.rotation.z=Math.sin(t*2+i)*.3);}}],
   [/原子力|原発|チェルノブイリ|福島/,()=>{for(let i=0;i<2;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(2.2,3,7,24,1,true),M("#c8c8c8",{side:THREE.DoubleSide}));c.position.set(-4+i*6,3.5,-18);root.add(c);smoke(-4+i*6,7,-18,"#eee",5);}}],
   [/大学|学校|アカデミー|図書館|学問|哲学/,()=>{box(8,4,3,"#d8cfc0",0,0,-14);for(let i=0;i<6;i++)cyl(.25,.3,4,"#efe8d8",-3+i*1.2,0,-12.3);for(let i=0;i<4;i++)box(.8,1.4,.3,["#8a3a2a","#2a4a8a","#3a6a2a","#6a4a2a"][i],-1.5+i*.9,0,-6);}],
   [/望遠鏡|天文|地動説|ガリレオ|コペルニクス|ケプラー/,()=>{const tb=cyl(.2,.3,2.4,"#c9a24a",2,1,-5);tb.rotation.z=.8;sph(.4,"#3d7fd0",-3,4,-10);sph(.25,"#d8c48a",-1,5,-10);}],
   [/医|ワクチン|病院|ペニシリン|抗生物質|手術/,()=>{box(6,3,3,"#f2f2f2",0,0,-12);const cr=box(1.4,.4,.1,E("#e74c3c"),0,2.2,-10.45);box(.4,1.4,.1,E("#e74c3c"),0,1.7,-10.44);}],
   [/金貨|銀貨|金融|金本位|金鉱|銀山|ゴールドラッシュ|貨幣|通貨|銀行|株|恐慌|経済/,()=>{for(let i=0;i<30;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.05,12),M("#f4c430",{metalness:.8,roughness:.3}));c.position.set(2+(R()-.5)*1.5,.05+i*.05,-4+(R()-.5)*.6);root.add(c);}},1],
   [/オリンピック|スポーツ|ワールドカップ/,()=>{[-1,0,1,-.5,.5].forEach((x,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.6,.08,8,24),M(["#2e86de","#2a2a2a","#c0392b","#f1c40f","#27ae60"][i]));r.position.set(x*1.4,i<3?5:4.4,-8);root.add(r);});}],
   [/インターネット|Web|SNS|スマートフォン|携帯|AI|人工知能/,()=>{const N=[...Array(20)].map(()=>{const o=sph(.15,E("#7ee0ff"),(R()-.5)*14,2+R()*6,-8-R()*8);return o;});N.forEach((a,i)=>{const b=N[(i+3)%N.length];root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.position,b.position]),new THREE.LineBasicMaterial({color:"#3a7aa0"})));});}],
   [/独立|建国/,()=>{flag(0,-6,["#c0392b","#27ae60","#2e86de","#f1c40f"][Math.floor(R()*4)],7);crowd(20,0,-3,4,["#ecf0f1","#c0392b","#27ae60"],.4,Math.PI);},1],
   [/地震|津波/,()=>{for(let i=0;i<8;i++){const b=box(1.5,1+R()*2,1.5,"#8a8478",(R()-.5)*14,0,-6-R()*8);b.rotation.z=(R()-.5)*.6;}anims.push(t=>root.position.x=Math.sin(t*30)*.03*(Math.sin(t*.5)>0?1:0));}],
   [/ダム|発電/,()=>{box(16,6,2,"#b8b8b0",0,0,-20);const w=new THREE.Mesh(new THREE.PlaneGeometry(16,1.2),E("#bfe6ff",.7));w.position.set(0,3,-18.9);root.add(w);}],
   [/探検|南極|北極|極点/,()=>{flag(0,-6,"#c0392b",3);person("#e8691e",-1,-5,0);person("#2e86de",1,-5,0);}],
  ];
  const SCN={
    space(k){sky("#02030a","#05070f",1);light("#fff",.6,[10,10,10],.3);
      if(k==="bigbang"){const g=glow("#fff6d8",60,[0,8,-60]);particles(3000,["#ffd090","#ff9a50","#fff2c0"],120,.4,(p,t)=>{p.scale.setScalar(1+((t*.2)%1)*1.5);p.material.opacity=1-((t*.2)%1)*.6;});anims.push(t=>g.scale.setScalar(50+((t*.2)%1)*60));return "人の目線（もしその場にいたら）：あらゆる方向がまぶしい光と熱に満ちている。";}
      if(k==="cmb"){sky("#ff7a3a","#c0401a",0);particles(2000,["#ffb070","#ff8040"],100,.3);return "空全体がオレンジ色に光り、それがだんだん暗くなっていく。";}
      if(k==="particles"){particles(2500,["#ff4a4a","#4aff6a","#4a7aff","#f4d06a"],60,.35,(p,t)=>{p.rotation.y=t*.1;});return "素粒子が飛び交う、超高温のスープ。";}
      if(k==="stars"||k==="galaxies"||k==="milky"){for(let i=0;i<5;i++)glow(i%2?"#9fc8ff":"#ffe2b0",8+R()*12,[(R()-.5)*120,R()*40,-40-R()*80]);const p=[];for(let i=0;i<4000;i++){const r=Math.pow(R(),.7)*60,a=r*.18+(i%2)*Math.PI+(R()-.5)*.4;p.push(Math.cos(a)*r,(R()-.5)*3,Math.sin(a)*r);}
        const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const gx=new THREE.Points(g,new THREE.PointsMaterial({color:"#cfe0ff",size:.5,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));gx.position.set(0,30,-120);gx.rotation.x=1.1;S.add(gx);anims.push(t=>gx.rotation.z=t*.03);return "暗い空に、生まれたばかりの青い星と銀河がかすかに光る。";}
      if(k==="sun"||k==="disk"){glow("#ffcf6a",40,[0,6,-70]);const p=[];for(let i=0;i<4000;i++){const r=10+R()*70,a=R()*6.28;p.push(Math.cos(a)*r,(R()-.5)*1.5,Math.sin(a)*r-70);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const d=new THREE.Points(g,new THREE.PointsMaterial({color:"#d8a070",size:.4}));d.position.y=4;S.add(d);return "若い太陽のまわりを、ちりとガスの円盤が回っている。";}
      if(k==="dark"){glow("#ff6a4a",4,[-30,10,-80]);const bh=new THREE.Mesh(new THREE.SphereGeometry(8,24,16),E("#000"));bh.position.set(10,12,-70);S.add(bh);const rg=new THREE.Mesh(new THREE.TorusGeometry(13,1.5,8,64),E("#ffb070",.8));rg.position.copy(bh.position);rg.rotation.x=1.3;S.add(rg);anims.push(t=>rg.rotation.z=t*.3);return "星は燃え尽き、残るのは冷えた天体とブラックホールだけ。";}
      if(k==="rip"){particles(2500,["#ff8a6a","#ffd0a0"],120,.35,(p,t)=>p.scale.set(1+t*.05,1,1+t*.05));return "銀河も星も、空間の膨張に引き裂かれていく。";}
      if(k==="crunch"){glow("#fff2c0",30,[0,8,-60]);particles(2500,["#ffd090","#ff6a3a"],120,.35,(p,t)=>{const k2=1-((t*.1)%1)*.8;p.scale.setScalar(k2);});return "空のすべての銀河が近づいてきて、空が明るく熱くなっていく。";}
      if(k==="vacuum"){const b=new THREE.Mesh(new THREE.SphereGeometry(10,32,16),new THREE.MeshBasicMaterial({color:"#c99cf2",transparent:true,opacity:.35,side:THREE.DoubleSide}));b.position.set(0,5,-60);S.add(b);anims.push(t=>b.scale.setScalar(1+((t*.3)%1)*4));return "光の速さで広がる「新しい真空」の泡。見えた瞬間にはもう届いている。";}
      return "";},
    molten(k){sky("#3a0a04","#c0401a");light("#ff9a5a",1,[10,20,-10],.5);const g=ground("#3a1a10");for(let i=0;i<30;i++){const c=new THREE.Mesh(new THREE.CircleGeometry(1+R()*3,10),E("#ff6a1a",.9));c.rotation.x=-Math.PI/2;c.position.set((R()-.5)*60,.02,-R()*50);root.add(c);}
      for(let i=0;i<5;i++){cone(6,8+R()*6,"#2a1008",(R()-.5)*80,0,-30-R()*30,8);glow("#ff7a2a",8,[(R()-.5)*60,12,-40]);}
      if(k==="moonimpact"){bigBody("#8a7a6a",[20,40,-120],30);glow("#ffd0a0",60,[0,30,-100]);return "空いっぱいに迫る火星ほどの天体。衝突の破片から月が生まれる。";}return "足もとはマグマの海。空気は熱く、隕石が降り続ける。";},
    ocean(k){sky(k==="oxygen"?"#5a9ad8":"#c08a5a","#e8c08a");light("#ffe0b0",.9,[30,20,-20]);water(k==="oxygen"?"#2f7fc0":"#3f7a7a");ground("#5a4a3a",8);
      for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.6+R()*.8,10,6,0,6.28,0,Math.PI/2),M("#6a5a3a"));s.position.set((R()-.5)*14,0,-3-R()*12);root.add(s);}
      sunDisc("#ffe2b0",[40,20,-120],6);return k==="life"||!k?"浅い海に、細菌が積み重なって作ったストロマトライトが並ぶ。空気に酸素はまだほとんどない。":"光合成で生まれた酸素で、空が青くなっていく。";},
    sea(){sky("#2f6aa8","#0a2a4a");light("#9fd8ff",.8,[0,30,0],.6);const g=ground("#c8b48a");for(let i=0;i<20;i++){const t=new THREE.Mesh(new THREE.SphereGeometry(.4,8,6),M("#8a6a4a"));t.scale.set(1.6,.4,1);t.position.set((R()-.5)*16,.2,-2-R()*14);root.add(t);const o=R()*6;anims.push(tt=>t.position.x+=Math.sin(tt+o)*.005);}
      for(let i=0;i<10;i++)cone(.4,2+R()*2,"#c06a8a",(R()-.5)*20,0,-5-R()*15,6);const fog=new THREE.FogExp2("#0a3a5a",.05);S.fog=fog;return "海の中。三葉虫など、殻や目を持つ動物たちが海底を歩き回る。";},
    snow(){sky("#bcd4ec","#f4f8fb");light("#ffffff",1,[30,10,-20],.7);ground("#f2f6fa");for(let i=0;i<20;i++){const c=cone(3+R()*4,2+R()*3,"#e2ecf4",(R()-.5)*90,0,-20-R()*50,6);}sunDisc("#fff8e8",[50,12,-120],5);return "見渡すかぎり氷。赤道まで凍りついた「スノーボールアース」。";},
    land(){sky("#7ab0e0","#d8e8f0");light();ground("#8a7a5a");water("#3f7aa8",60,-.05);for(let i=0;i<60;i++){const a=R()*6.28,r=3+R()*20;cone(.15,.4,"#4f8a3a",Math.cos(a)*r,0,-Math.abs(Math.sin(a)*r),5);}return "岩だらけの陸に、コケのような小さな植物が広がり始める。";},
    forest(){sky("#7ab0e0","#d8f0d8");light("#fff",.9,[20,30,10],.6);ground("#3a5a2a");for(let i=0;i<40;i++){const a=R()*6.28,r=4+R()*30;tree(Math.cos(a)*r,Math.sin(a)*r,R()<.5?"fern":"giant",1.2+R()*1.5);}
      const fog=new THREE.Fog("#cfe8cf",20,80);S.fog=fog;for(let i=0;i<8;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.3,.02,.15),M("#88aacc"));root.add(d);const o=R()*6;anims.push(t=>d.position.set(Math.sin(t*.7+o)*5,2+Math.sin(t*3+o),-4+Math.cos(t*.7+o)*3));}return "巨大なシダや木が茂る湿った森。大きなトンボが飛び回る。";},
    dino(){sky("#6aa8e0","#f0e0c0");light("#fff4d8",1,[30,40,10],.6);ground("#5a6a3a");for(let i=0;i<30;i++){const a=R()*6.28,r=6+R()*35;tree(Math.cos(a)*r,Math.sin(a)*r,R()<.6?"fern":"conifer",1+R()*1.2);}
      dino(-4,-18,"long",1.3);dino(6,-10,"rex",.9);dino(-12,-30,"long",1);cone(14,18,"#4a3a30",30,0,-80,8);smoke(30,18,-80,"#777",8);return "シダと針葉樹の森を、首の長い竜脚類が歩いていく。";},
    impact(){const r=SCN.dino();sky("#ff9a5a","#ffe0b0");const fb=glow("#fff2c0",20,[-30,40,-80]);const tr=new THREE.Mesh(new THREE.CylinderGeometry(.5,3,40,8),E("#ffd0a0",.6));tr.position.set(-10,60,-60);tr.rotation.z=-.6;S.add(tr);anims.push(t=>{fb.scale.setScalar(20+Math.sin(t*3)*4);});return "空を横切る巨大な火の玉。数分後、すべてが変わる。";},
    extinct(){sky("#3a2020","#8a5a40");light("#ff9a6a",.6,[10,20,0],.4);ground("#4a4440");for(let i=0;i<20;i++){const a=R()*6.28,r=5+R()*30;tree(Math.cos(a)*r,Math.sin(a)*r,"dead",1+R());}
      for(let i=0;i<3;i++){cone(10,14,"#2a2020",(i-1)*40,0,-70,8);smoke((i-1)*40,14,-70,"#444",8);glow("#ff5a1a",10,[(i-1)*40,14,-70]);}return "火山灰で空が暗く、森は枯れ、多くの生き物が姿を消した。";},
    mammal(){sky("#7ab8e8","#e8f0d8");light();ground("#6a8a3a");for(let i=0;i<25;i++){const a=R()*6.28,r=6+R()*30;tree(Math.cos(a)*r,Math.sin(a)*r,"broad",1+R());}
      for(let i=0;i<6;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(.4,10,8),M("#8a6a4a"));b.scale.set(1.6,1,1);b.position.y=.6;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),M("#8a6a4a"));h.position.set(.7,.8,0);g.add(h);root.add(g);const o=R()*6,x=(R()-.5)*12,z=-3-R()*10;anims.push(t=>{g.position.set(x+Math.sin(t*.3+o)*2,Math.abs(Math.sin(t*4+o))*.2,z);});}return "恐竜のいなくなった森で、哺乳類がさまざまな姿に広がっていく。";},
    savanna(){sky("#6aa8e8","#f4e0b0");light("#fff0d0",1,[30,20,10],.6);ground("#c8a85a");for(let i=0;i<12;i++){const a=R()*6.28,r=8+R()*30;tree(Math.cos(a)*r,Math.sin(a)*r,"acacia",1.2);}
      fire(0,-5);crowd(7,0,-5,2.5,["#6a4a3a","#5a3a2a","#7a5a3a"],.2);for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.DodecahedronGeometry(.15),M("#8a8a80"));s.position.set((R()-.5)*3,.1,-3+R());root.add(s);}return "アフリカのサバンナ。たき火を囲み、石を割って道具を作る人々。";},
    rift(){sky("#7ab0e0","#d8e8f0");light();ground("#8a6a4a");const w=new THREE.Mesh(new THREE.BoxGeometry(6,6,80),M("#2a1a10"));w.position.set(0,-2.9,-30);root.add(w);for(let i=0;i<14;i++)glow("#ff6a1a",3,[(R()-.5)*3,-.5,-R()*60]);
      for(let i=0;i<10;i++){cone(5+R()*4,6+R()*8,"#6a5a4a",(R()<.5?-1:1)*(10+R()*20),0,-20-R()*50,6);}return "大地が裂け、大陸が少しずつ離れていく（年に数cmの速さ）。";},
    scorched(){sky("#5a1a0a","#ff6a2a");light("#ff6a3a",1.2,[0,20,-50],.5);ground("#5a2a1a");glow("#ff4a1a",160,[0,40,-150]);for(let i=0;i<20;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(.1,.02,4+R()*6),E("#ff8a3a",.8));c.position.set((R()-.5)*40,.02,-R()*30);c.rotation.y=R()*3;root.add(c);}return "空の大半を占める赤い太陽。海は消え、地表は焼けている。";},
    // ---- 世界史 ----
    town(e){sky("#7ab8e8","#e8f0f8");light();ground(e.era>=5?"#6a6e74":"#9a8a6a");town(e.era,16);crowd(18,0,-2,6,["#c0392b","#2e86de","#f1c40f","#27ae60","#8e44ad"]);if(e.flags){flag(-3,-6);flag(3,-6,"#2e86de");}return "";},
    assembly(e){const r=SCN.town({era:e.era,flags:1});const p=PAL[e.era];box(10,4,4,p.w,0,0,-12);for(let i=0;i<6;i++)cyl(.3,.3,4,p.w,-4+i*1.6,0,-9.8,8);cone(6,2,p.r,0,4,-12,4);crowd(30,0,-4,5,["#2e86de","#ecf0f1","#c0392b"],.4,Math.PI);flag(-6,-8,"#c0392b",6);flag(6,-8,"#2e86de",6);return "";},
    market(e){SCN.town(e);for(let i=0;i<8;i++){const x=(i%4-1.5)*3,z=-3-Math.floor(i/4)*3;box(2,.9,1,"#8a6a4a",x,0,z);const a=box(2.2,.1,1.4,["#e74c3c","#f1c40f","#27ae60","#3498db"][i%4],x,1.8,z);cyl(.04,.04,1.8,"#5a4a3a",x-1,0,z,4);for(let k=0;k<4;k++)sph(.15,["#ff6a3a","#f4d06a","#8fd16a"][k%3],x-.6+k*.4,1,z);}return "";},
    temple(e){sky("#7ab8e8","#f0e8d8");light();ground("#a89a7a");const reg=e.region||"";
      if(/東アジア/.test(reg)){for(let k=0;k<5;k++){box(4-k*.5,1.6,4-k*.5,"#6b3b2a",0,k*2,-12);const r=box(5.6-k*.5,.3,5.6-k*.5,"#3a3a3a",0,k*2+1.6,-12);}}
      else if(/中東|南・東南/.test(reg)){box(8,5,8,"#e8dcc4",0,0,-14);const d=sph(3.5,"#e8dcc4",0,6,-14);cyl(.4,.5,10,"#e8dcc4",-6,0,-14);cyl(.4,.5,10,"#e8dcc4",6,0,-14);}
      else if(/アメリカ/.test(reg)&&e.era<4){for(let k=0;k<6;k++)box(12-k*2,1.4,12-k*2,"#9a9080",0,k*1.4,-16);box(2,2,2,"#9a9080",0,8.4,-16);}
      else if(e.era<=1){box(12,1,7,"#e8e0cf",0,0,-14);for(let i=0;i<7;i++){cyl(.35,.4,4,"#f0ead8",-5+i*1.66,1,-11);cyl(.35,.4,4,"#f0ead8",-5+i*1.66,1,-17);}box(12,.8,7,"#e8e0cf",0,5,-14);}
      else{box(6,8,12,"#b9b3a6",0,0,-16);cone(1.5,12,"#8a8478",-2,8,-11,4);cone(1.5,12,"#8a8478",2,8,-11,4);}
      crowd(26,0,-4,5,["#f2f2f2","#c9a24a","#8a3a2a","#3a4a8a"],.1,Math.PI);fire(-3,-8,.6);fire(3,-8,.6);return "";},
    battle(e){sky(e.era>=4?"#8a8a8a":"#8ab0d8","#d8d0c0");light("#fff",.8);ground(e.era>=4?"#5a5040":"#7a7a4a");const A=["#c0392b"],B=["#2e86de"];
      for(let i=0;i<12;i++){const p=person(A[0],-6+i%6*1.2,-6-Math.floor(i/6)*1.2,Math.PI/2);const q=person(B[0],-6+i%6*1.2,-14+Math.floor(i/6)*1.2,-Math.PI/2);
        if(e.era<3){[p,q].forEach(o=>{const sp=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.4,4),M("#8a8a8a"));sp.position.set(.3,1.6,0);sp.rotation.x=.3;o.add(sp);});}}
      if(e.era>=3&&e.era<5){for(let i=0;i<3;i++){const c=cyl(.25,.3,1.6,"#2a2a2a",-4+i*4,.4,-9);c.rotation.x=Math.PI/2;smoke(-4+i*4,1,-10,"#ddd",4);}}
      if(e.era>=4){for(let i=0;i<3;i++){const t=box(2.6,1,1.6,"#4a5a3a",-6+i*6,0,-18);cyl(.12,.12,2,"#3a4a2a",-6+i*6+1,1,-18);}const pl=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(3,.4,.4),M("#4a4a4a"));const w=new THREE.Mesh(new THREE.BoxGeometry(.6,.1,3.5),M("#4a4a4a"));pl.add(b,w);S.add(pl);anims.push(t=>pl.position.set(Math.sin(t*.3)*30,14,-25+Math.cos(t*.3)*10));}
      flag(-8,-4,"#c0392b");flag(-8,-16,"#2e86de");fire(2,-10,1.2);smoke(2,1,-10,"#555",6);return "";},
    voyage(e){sky("#7ab8e8","#e8f4f8");light();water();const n=e.era>=5?2:3;for(let i=0;i<n;i++)ship((i-1)*10,-14-i*5,e.era,1.1);sunDisc("#fff8e0",[40,25,-150],5);if(e.era<=2){const l=new THREE.Mesh(new THREE.ConeGeometry(15,4,10),M("#5a7a3a"));l.position.set(-40,0,-90);root.add(l);}return "";},
    workshop(e){sky("#9ab8d8","#e8ecf0");light();ground(e.era>=4?"#6a6e74":"#8a7a5a");town(e.era,10);
      if(e.era>=5){for(let i=0;i<6;i++){box(1,2,.8,"#2a3040",-5+i*2,0,-6);box(.8,.5,.05,E("#7ee0ff"),-5+i*2,1.4,-5.58);}crowd(8,0,-3,3,["#ecf0f1","#3a6ab0"]);}
      else{const g=new THREE.Mesh(new THREE.TorusGeometry(1.4,.25,6,12),M("#8a6a3a"));g.position.set(0,2.2,-7);root.add(g);anims.push(t=>g.rotation.z=t);box(3,1,1.5,"#6a4a2a",0,0,-7);fire(-3,-7,.7);if(e.era>=4){cyl(.4,.5,8,"#5a3a2a",4,0,-9,8);smoke(4,8,-9,"#666",8);}crowd(6,0,-4,2.5,["#8a6a4a","#4a4a5a"]);}return "";},
    launch(e){sky(e.era>=6?"#0a1030":"#7ab8e8","#e0ecf8");light();ground("#8a8a7a");box(1,14,1,"#c0392b",3,0,-16);const r=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,10,12),M("#f2f2f2"));b.position.y=5;r.add(b);const n=new THREE.Mesh(new THREE.ConeGeometry(.8,2,12),M("#d0d4dc"));n.position.y=11;r.add(n);
      const f=new THREE.Mesh(new THREE.ConeGeometry(1,4,10),E("#ffb347",.9));f.rotation.x=Math.PI;f.position.y=-1.5;r.add(f);r.position.set(0,0,-16);root.add(r);anims.push(t=>{const c=t%16;r.position.y=c<6?0:(c-6)*(c-6)*.8;f.visible=c>4;f.scale.y=1+Math.sin(t*30)*.2;});smoke(0,0,-16,"#ddd",8);crowd(20,0,4,5,["#3a6ab0","#ecf0f1","#c0392b","#f1c40f"],.1,Math.PI);return "";},
    moon(){sky("#000000","#020204",1);light("#ffffff",1.4,[30,20,10],.15);ground("#8a8a86");for(let i=0;i<20;i++){const c=new THREE.Mesh(new THREE.TorusGeometry(1+R()*2,.25,6,20),M("#7a7a76"));c.rotation.x=Math.PI/2;c.position.set((R()-.5)*40,0,-R()*30);root.add(c);}
      bigBody("#3d7fd0",[20,30,-120],8);const lm=box(2,1.6,2,"#d8b04a",-3,0,-8);for(let k=0;k<4;k++){const l=cyl(.06,.06,1.4,"#ccc",-3+(k%2?1:-1)*1.2,0,-8+(k<2?1:-1)*1.2,4);l.rotation.z=(k%2?1:-1)*.4;}
      const a=person("#f2f2f2",0,-6,0,1);flag(1.5,-7,"#ffffff",2.5);return "月面。重力は地球の6分の1。黒い空に地球が浮かぶ。";},
    nuke(e){sky("#c08a6a","#ffd0a0");light("#ffd0a0",1.2);ground("#6a6050");town(4,10);const st=cyl(2,3,20,M("#c8b8a0",{emissive:"#5a3a20"}),0,0,-60);const cap=sph(12,M("#d8c8b0",{emissive:"#8a4a20"}),0,26,-60);cap.scale.y=.6;glow("#ffd090",40,[0,10,-60]);anims.push(t=>{cap.scale.x=cap.scale.z=1+Math.sin(t*.5)*.05;});return "遠くに立ちのぼるきのこ雲。";},
    pyramid(e){sky("#7ab8e8","#f4e8c8");light("#fff4d8",1.1);ground("#d9b77a");cone(14,18,"#cfae74",0,0,-40,4);cone(10,13,"#c9a76d",-22,0,-50,4);for(let i=0;i<8;i++){box(1.6,1,1.6,"#c4a168",-4+i*1.2,0,-12);}crowd(20,0,-10,5,["#f2ead8","#c9a24a","#8a6a4a"],.3);return "";},
    wall(e){sky("#8ab8e0","#e8f0e8");light();ground("#6f8a52");for(let i=-30;i<=30;i+=2){const z=-20+Math.sin(i*.1)*8,y=Math.cos(i*.08)*2+1;box(2.2,2,1.6,"#a39b8c",i,y,z);if(i%10===0)box(3,4.5,3,"#a39b8c",i,y,z);}crowd(10,0,-8,4,["#8a6a4a","#4a4a5a"],.3);return "";},
    plague(e){sky("#9aa0a8","#c8ccd0");light("#ddd",.6);ground("#7a7468");town(e.era,14);S.fog=new THREE.Fog("#b8bcc0",8,45);crowd(4,0,-6,6,["#3a3a3a","#5a5a5a"],.1);return "人通りの消えた街。";},
    volcano(e){SCN.town(e);cone(16,20,"#4a3a30",0,0,-60,8);smoke(0,20,-60,"#555",10);glow("#ff5a1a",14,[0,20,-60]);return "";},
    train(e){sky("#9ab8d8","#e8ecf0");light();ground("#7a8a5a");for(let i=-30;i<30;i+=1.5)box(.3,.1,3,"#5a4a3a",i,0,-8);box(60,.12,.12,"#888",0,.1,-9);box(60,.12,.12,"#888",0,.1,-7);
      const tr=new THREE.Group();const c=new THREE.Mesh(new THREE.BoxGeometry(5,2.2,2.4),M(e.era>=5?"#f2f2f2":"#2a2a2a"));c.position.y=1.4;tr.add(c);if(e.era<5){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,1.4,8),M("#2a2a2a"));ch.position.set(1.8,3,0);tr.add(ch);}for(let k=1;k<4;k++){const w=new THREE.Mesh(new THREE.BoxGeometry(5,2,2.3),M(e.era>=5?"#2e86de":"#7a3a2a"));w.position.set(-k*5.4,1.3,0);tr.add(w);}
      tr.position.z=-8;root.add(tr);anims.push(t=>tr.position.x=((t*4)%70)-30);if(e.era<5)smoke(0,3,-8,"#999",6);town(e.era,8);return "";},
    plane(e){SCN.town(e);const pl=new THREE.Group();pl.add(new THREE.Mesh(new THREE.BoxGeometry(5,.6,.6),M("#e8e8e8")),new THREE.Mesh(new THREE.BoxGeometry(1,.1,7),M("#e8e8e8")));S.add(pl);anims.push(t=>pl.position.set(Math.sin(t*.2)*30,10+Math.sin(t)*.5,-20));return "";},
    lab(e){sky("#0a1020","#1a2440");light("#9fd8ff",.6,[0,20,10],.5);ground("#2a3040");for(let i=0;i<10;i++){box(1.2,2.4,1,"#1a2030",-6+i*1.3,0,-8);for(let k=0;k<6;k++){const l=box(.08,.08,.02,E(R()<.5?"#7ee0ff":"#8fd16a"),-6.3+i*1.3+R()*.6,.4+k*.35,-7.49);anims.push(t=>l.visible=Math.sin(t*5+k+i)>-.3);}}crowd(5,0,-3,2,["#ecf0f1","#3a6ab0"],.1,Math.PI);return "";},
    future(e){const t=e.t||"";const sp=/ダイソン|スウォーム|恒星リフティング|マトリョーシカ|Type II/.test(t),bh=/ブラックホール|ペンローズ/.test(t),col=/植民|恒星系|多様化|銀河の反対|恒星間|過半数|Type III|文明圏/.test(t),an=/アンドロメダ/.test(t),hab=/居住地|木星系|円筒|人口1兆|ケレス|採掘/.test(t);
      if(hab){sky("#1a1030","#3a5a8a");light("#fff",.8);const c=new THREE.Mesh(new THREE.CylinderGeometry(30,30,120,48,1,true),new THREE.MeshStandardMaterial({color:"#5f8a46",side:THREE.BackSide,flatShading:true}));c.rotation.z=Math.PI/2;c.position.y=29;root.add(c);
        for(let i=0;i<40;i++){const a=R()*6.28,x=(R()-.5)*100;const b=new THREE.Mesh(new THREE.BoxGeometry(2,3+R()*4,2),M("#e6ecf2",{emissive:"#334",emissiveIntensity:.3}));b.position.set(x,29-Math.cos(a)*27.5,Math.sin(a)*27.5);b.lookAt(x,29,0);root.add(b);}
        const sun=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,120,8),E("#fff2c0"));sun.rotation.z=Math.PI/2;sun.position.y=29;root.add(sun);crowd(8,0,-4,3,["#ecf0f1","#7ee0ff","#f4b942"],.3);return "回転する円筒形の居住地の中。足もとの地面は、見上げると頭上までぐるりと続いている。";}
      sky("#02030a","#0a1030",1);light("#cfe0ff",.6,[20,30,10],.4);
      if(col){ground("#6a4a7a");for(let i=0;i<20;i++)cone(.4+R(),2+R()*3,"#4a8aa8",(R()-.5)*40,0,-6-R()*30,6);sunDisc("#ffb070",[40,30,-150],10);sunDisc("#cfe0ff",[-50,45,-160],5);
        for(let i=0;i<6;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(2+R()*2,16,10,0,6.28,0,Math.PI/2),new THREE.MeshStandardMaterial({color:"#bfe6ff",transparent:true,opacity:.4}));d.position.set((R()-.5)*30,0,-10-R()*20);root.add(d);}crowd(6,0,-4,3,["#7ee0ff","#c99cf2","#9fd86a"],.3);return "太陽系から遠く離れた恒星系の惑星。空に2つの太陽。";}
      if(bh){ground("#2a2a3a");const b=new THREE.Mesh(new THREE.SphereGeometry(12,32,16),E("#000"));b.position.set(0,30,-100);S.add(b);const r=new THREE.Mesh(new THREE.TorusGeometry(22,4,8,64),E("#ffb070",.9));r.position.copy(b.position);r.rotation.x=1.3;S.add(r);anims.push(tt=>r.rotation.z=tt*.3);
        for(let i=0;i<8;i++){const st=box(1.2,6+R()*10,1.2,M("#8a9ab0",{metalness:.6}),(R()-.5)*30,0,-15-R()*15);}return "銀河の中心。巨大なブラックホールのまわりを光る円盤が回る。";}
      if(an){ground("#3a3a4a");const p=[];for(let i=0;i<6000;i++){const r=Math.pow(R(),.6)*60,a=r*.15+(i%2)*Math.PI+(R()-.5)*.5;p.push(Math.cos(a)*r,(R()-.5)*2,Math.sin(a)*r);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));const gx=new THREE.Points(g,new THREE.PointsMaterial({color:"#ffe2c0",size:.6}));gx.position.set(0,50,-150);gx.rotation.x=1.2;S.add(gx);
        const rk=cyl(.8,.8,8,"#e6ecf2",0,0,-12);return "夜空いっぱいに広がるアンドロメダ銀河。そこへ向かう探査機の発射台。";}
      if(sp){ground("#4a4a5a");glowSun();const arc=[];for(let i=0;i<1500;i++){const a=R()*6.28,b=(R()-.5)*1.4;arc.push(Math.cos(a)*Math.cos(b)*40,Math.sin(b)*40+40,Math.sin(a)*Math.cos(b)*40-140);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(arc,3));S.add(new THREE.Points(g,new THREE.PointsMaterial({color:"#f4b942",size:.5})));
        return "空に太陽を取り囲む無数の発電衛星（ダイソン・スウォーム）が光の帯になって見える。";}
      ground("#3a4050");for(let i=0;i<14;i++){const h=8+R()*30;box(2+R()*2,h,2+R()*2,M("#dfe8f2",{metalness:.4,emissive:"#223355",emissiveIntensity:.4}),(R()-.5)*50,0,-15-R()*30);}const rg=new THREE.Mesh(new THREE.TorusGeometry(80,.6,8,120),E("#7ee0ff",.7));rg.position.set(0,40,-60);rg.rotation.x=1.3;S.add(rg);crowd(8,0,-4,4,["#ecf0f1","#7ee0ff"],.3);return "未来の都市。空には軌道リングが光る。";},
    stadium(e){sky("#7ab8e8","#e8f0f8");light();ground("#5f8a46");const st=new THREE.Mesh(new THREE.CylinderGeometry(22,20,8,40,1,true,0,Math.PI*1.4),M("#b9b3a6",{side:THREE.DoubleSide}));st.position.set(0,4,-10);root.add(st);crowd(40,0,-10,14,["#c0392b","#2e86de","#f1c40f","#27ae60","#ecf0f1"],.3);flag(0,-24,"#ffffff",8);return "";},
  };
  // ---- 表示器（1つのWebGLを使い回す） ----
  let renderer=null,cam,cur=null,run=false,t0=0,host=null,ang=0;
  function build(scene,spec){S=scene;root=new THREE.Group();S.add(root);anims=[];seed=7+[...(spec.title||"x")].reduce((a,c)=>a+c.charCodeAt(0),0)%997;
    const k=classify(spec);const hist=k.era!=null;
    TOD=hist?["day","day","dusk","night","dawn","day"][Math.floor(R()*6)]:"day";WX=hist?(R()<.12?"rain":R()<.06?"snow":R()<.05?"fog":"clear"):"clear";
    let note="";try{note=(SCN[k.s]||SCN.town)(k.s in SCN&&["town","assembly","market","temple","battle","voyage","workshop","launch","nuke","pyramid","wall","plague","volcano","train","plane","lab","stadium","future"].includes(k.s)?{era:k.era??5,region:spec.region,flags:k.flags,t:spec.title}:k.k)||"";}catch(e){console.error(e);}
    if(hist){try{const txt=(spec.title||"")+" "+(spec.desc||"");PROPS.forEach(([re,f])=>{if(re.test(txt))f();});weather();
        const ys=spec.y<0?"紀元前"+(-Math.round(spec.y)).toLocaleString()+"年":Math.floor(spec.y)+"年";sign(spec.title||"",ys);}catch(e){console.error(e);}}
    else if(spec.title){try{const ys=spec.y< -1e8?(-spec.y/1e8).toFixed(1)+"億年前":spec.y< -1e4?Math.round(-spec.y/1e4).toLocaleString()+"万年前":"";sign(spec.title,ys);}catch(e){}}
    if(!note&&k.era!=null)note=["先史の暮らし","古代","中世","近世","近代","現代","もしもの未来"][k.era]+"の人々の目線で描いた想像図。";
    return {anims,note:note+(hist?({dawn:"（夜明け）",dusk:"（夕暮れ）",night:"（夜）",day:""}[TOD]+({rain:"雨",snow:"雪",fog:"霧",clear:""}[WX])):""),kind:k.s,space:k.s==="space",yaw:(R()-.5)*1.2};}
  function mount(div,spec){if(!div)return;if(!renderer){renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio));cam=new THREE.PerspectiveCamera(60,1,.1,600);}
    host=div;div.innerHTML="";div.appendChild(renderer.domElement);const sc=new THREE.Scene();const r=build(sc,spec);cur={sc,r};const cap=document.createElement("div");cap.className="ev3dcap";cap.textContent="👤 "+(r.note||"人の目線で見た想像図");div.appendChild(cap);
    const w=div.clientWidth||320,h=div.clientHeight||200;renderer.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();t0=performance.now();ang=0;
    let dr=null;renderer.domElement.onpointerdown=e=>{dr=[e.clientX,e.clientY];};renderer.domElement.onpointermove=e=>{if(dr!=null){ang-=(e.clientX-dr[0])*.006;pitch=Math.max(-.6,Math.min(.9,pitch+(e.clientY-dr[1])*.004));dr=[e.clientX,e.clientY];held=true;}};renderer.domElement.onpointerup=()=>dr=null;
    renderer.domElement.onwheel=e=>{e.preventDefault();fov=Math.max(25,Math.min(80,fov*(e.deltaY>0?1.08:.92)));held=true;};pitch=0;fov=60;held=false;
    const rb=document.createElement("button");rb.className="ev3dreset";rb.textContent="↺ 視点を戻す";rb.onclick=()=>{ang=0;pitch=0;fov=60;held=false;t0=performance.now();};div.appendChild(rb);
    if(!run){run=true;requestAnimationFrame(loop);}}
  let pitch=0,fov=60,held=false;
  function loop(now){if(!cur||!host||!host.isConnected||host.offsetParent===null){run=false;return;}requestAnimationFrame(loop);const t=(now-t0)/1000;cur.r.anims.forEach(f=>f(t));
    const a=ang+(cur.r.yaw||0)+(held?0:Math.sin(t*.12)*.5);if(cam.fov!==fov){cam.fov=fov;cam.updateProjectionMatrix();}cam.position.set(0,1.6,4);cam.lookAt(Math.sin(a)*10,(cur.r.space?4:2.2)+pitch*10,4-Math.cos(a)*10);renderer.render(cur.sc,cam);}
  const GEN=new Set(["town","market","workshop","temple","battle","voyage","assembly"]);
  function isSpecial(spec){const k=classify(spec);const txt=(spec.title||"")+" "+(spec.desc||"");
    if(k.era!=null)return !GEN.has(k.s)||PROPS.some(([re,,weak])=>!weak&&re.test(txt));
    if(k.s==="ocean"&&k.k==="life")return /生命|細菌|LUCA|シアノ|ストロマト|共通祖先/.test(txt);if(k.s==="space"&&k.k==="stars")return /星/.test(txt);return true;}
  return {classify,build,mount,isSpecial};
})();
