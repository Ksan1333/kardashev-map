/* ---------- ⑤ 歴史シアター（宇宙→地球→人類を3Dで再生） ---------- */
(function(){
  const host=document.getElementById("thstage"); if(!host) return;
  const hasThree=typeof THREE!=="undefined";
  const T1=true;
  // ---- 出来事 ----
  // [表示年, 年, 題, 説明, 種類, 緯度, 経度]
  const COS=[
   ["138億年前",-13.8e9,"ビッグバン","宇宙が超高温・高密度の状態から膨張を始める。時間と空間もここから始まった。","bigbang"],
   ["138億年前（誕生38万年後）",-13.7996e9,"宇宙の晴れ上がり","温度が下がって原子ができ、光がまっすぐ進めるようになる。この光は今も「宇宙背景放射」として全天から届く。","cmb"],
   ["約136億年前",-13.6e9,"最初の星が輝く","「暗黒時代」が終わり、水素とヘリウムだけでできた巨大な星が生まれる。","stars"],
   ["約135億年前",-13.5e9,"最初の銀河","ジェイムズ・ウェッブ宇宙望遠鏡は、宇宙誕生から約3億年後の銀河まで観測している。","galaxies"],
   ["約100億年前",-10e9,"星づくりの最盛期","宇宙全体で星が最も盛んに生まれた時代（宇宙の正午）。","galaxies"],
   ["約88億年前",-8.8e9,"天の川銀河の円盤ができる","私たちの銀河が今のような渦巻きの円盤の形に育っていく。","milky"],
   ["約50億年前",-5e9,"宇宙の膨張が加速し始める","正体不明の「ダークエネルギー」が重力に勝ち、膨張のスピードが上がり始める。","milky"],
   ["約46億年前",-4.6e9,"太陽の誕生","天の川銀河の片隅で、ガスとちりの雲が縮んで太陽が生まれる。","sun"],
   ["約45.7億年前",-4.567e9,"惑星の誕生","太陽のまわりの円盤で、ちりが集まり微惑星になり、衝突と合体を繰り返して惑星が育つ。","disk"],
   ["約45.4億年前",-4.54e9,"地球の誕生","生まれたばかりの地球は、表面がどろどろに溶けたマグマの海だった。","molten"],
   ["約45億年前",-4.5e9,"ジャイアント・インパクトと月の誕生","火星ほどの天体が地球に衝突し、飛び散った破片が集まって月になったと考えられている。","moonimpact"],
   ["約44億年前",-4.4e9,"最初の海","地表が冷え、雨が降り続いて海ができる。","ocean"],
   ["約38億年前",-3.8e9,"生命の誕生","海の中で、自分を複製できる最初の単細胞生物が現れる（時期には諸説あり）。","life"],
   ["約35億年前",-3.5e9,"光合成をする細菌","シアノバクテリアがストロマトライトという岩の層を作り、酸素を出し始める。","life",-22,114],
   ["約24億年前",-2.4e9,"大酸化イベント","大気中の酸素が一気に増える。多くの嫌気性生物にとっては大災害だった。","oxygen"],
   ["約23億年前",-2.3e9,"最初の全球凍結","地球全体が氷に覆われる「スノーボールアース」。","snow"],
   ["約20億年前",-2.0e9,"真核生物の登場","細胞の中に核を持つ、複雑な細胞が生まれる（時期には諸説あり）。","life"],
   ["約12億年前",-1.2e9,"多細胞生物と有性生殖","紅藻の化石が、多細胞で有性生殖をする生物の古い証拠。","life"],
   ["約7億年前",-7.2e8,"ふたたび全球凍結","赤道まで凍る氷河時代が数千万年続く。","snow"],
   ["約5.4億年前",-5.41e8,"カンブリア爆発","目や殻を持つさまざまな動物が短い期間に一斉に現れる。","life"],
   ["約4.7億年前",-4.7e8,"植物の上陸","コケのような植物が陸に広がり、大地が緑になり始める。","land"],
   ["約3.75億年前",-3.75e8,"魚が陸へ","ひれが足に変わり、四足動物の祖先が陸に上がる。","land",78,-90],
   ["約3.35億年前",-3.35e8,"超大陸パンゲア","ほぼすべての大陸が一つにまとまる（このシアターの大陸は現在の形で簡略化）。","land"],
   ["約2.52億年前",-2.52e8,"史上最大の大量絶滅","ペルム紀末、海の生物種の9割以上が絶滅。シベリアの巨大な火山活動が原因とされる。","extinct",62,100],
   ["約2.3億年前",-2.3e8,"恐竜の登場","三畳紀に恐竜が現れ、その後1億6000万年以上、陸の主役になる。","dino",-30,-68],
   ["約2.25億年前",-2.25e8,"哺乳類の登場","小さな夜行性の哺乳類が、恐竜の陰で生き延びる。","dino"],
   ["約1.75億年前",-1.75e8,"パンゲアの分裂","大陸が分かれて大西洋ができ始める。","land",20,-40],
   ["約1.5億年前",-1.5e8,"鳥の登場","恐竜から鳥が進化する（始祖鳥）。","dino",49,11],
   ["約1.3億年前",-1.3e8,"花を咲かせる植物","被子植物が現れ、昆虫とともに広がる。","land"],
   ["約6600万年前",-6.6e7,"小惑星の衝突と恐竜の絶滅","直径約10kmの小惑星がメキシコ・ユカタン半島に衝突。鳥以外の恐竜が絶滅し、哺乳類の時代が始まる。","impact",21.3,-89.5],
   ["約5500万年前",-5.5e7,"霊長類の広がり","サルの仲間が森の中で多様化する。","dino"],
   ["約700万年前",-7e6,"人類の系統が分かれる","人類とチンパンジーの祖先が分かれる。最古の人類化石はアフリカのチャドで見つかった。","human",16,19],
   ["約320万年前",-3.2e6,"ルーシー（アウストラロピテクス）","二本足で歩いた人類の祖先。エチオピアで化石が見つかった。","human",11,40.5],
   ["約260万年前",-2.6e6,"最初の石器","石を割って刃物を作る。技術の始まり。","human",11,40.5],
   ["約190万年前",-1.9e6,"ホモ・エレクトスの出アフリカ","人類がアフリカを出て、ユーラシアに広がる。","human",41,44],
   ["約100万年前",-1e6,"火の使用","火で暖をとり、料理をし、獣から身を守る。","human",-27.6,23.6],
  ];
  // 地域の範囲（経度, 緯度）と地名の位置
  const RBOX={"ヨーロッパ":[-9,30,37,58],"中東・北アフリカ":[-8,58,16,38],"アフリカ":[-15,42,-30,12],"南・東南アジア・オセアニア":[70,150,-35,28],"東アジア":[100,142,22,45],"南北アメリカ":[-120,-45,-35,50],"世界":[-120,140,-30,55]};
  const PLACE=[["日本|縄文|江戸|明治|平安|奈良|鎌倉|室町|戦国|東京|大阪|京都|昭和|平成|令和|種子島",36,138],["朝鮮|韓国|高麗|新羅",37.5,127],["中国|秦|漢|唐|宋|元|明|清|殷|周|北京|上海|三国|隋|長安",34,112],["モンゴル|チンギス",47.9,106.9],["インド|ガンジス|ムガル|マウリヤ|仏教|ブッダ|ガンディー",23,79],["インダス",27,68],["ベトナム",16,107],["カンボジア|アンコール|クメール",13.4,103.9],["インドネシア|ジャワ|スマトラ",-6,107],["オーストラリア",-28,140],["ニュージーランド|マオリ",-40,175],["フィリピン",14.6,121],["タイ|アユタヤ",14.4,100.5],["メソポタミア|シュメール|バビロン|ウル|ハンムラビ|アッシリア",32.5,44.4],["エジプト|ピラミッド|ファラオ|ナイル",28,31],["ペルシア|イラン|アケメネス|ササン",30,53],["エルサレム|イスラエル|ユダヤ|パレスチナ",31.8,35.2],["メッカ|イスラーム|イスラム|ムハンマド|サウジ",21.4,39.8],["トルコ|オスマン|コンスタンティノープル|イスタンブール|ビザンツ|アナトリア|ヒッタイト",41,29],["ギリシャ|アテネ|スパルタ|アレクサンドロス|オリンピア",38,23.7],["ローマ|イタリア|ルネサンス|ヴェネツィア|フィレンツェ",41.9,12.5],["フランス|パリ|ナポレオン|ガリア",48.8,2.3],["イギリス|英国|ロンドン|イングランド|産業革命|スコットランド",51.5,-.1],["ドイツ|プロイセン|ベルリン|神聖ローマ",52.5,13.4],["スペイン|イベリア|コロンブス",40.4,-3.7],["ポルトガル|リスボン",38.7,-9.1],["オランダ",52.4,4.9],["ロシア|ソ連|モスクワ|ソビエト",55.7,37.6],["ポーランド",52.2,21],["スウェーデン|ノルウェー|ヴァイキング|北欧",59.3,18],["スイス|ジュネーヴ|CERN",46.2,6.1],["チュニジア|カルタゴ",36.8,10.2],["モロッコ",34,-6.8],["エチオピア|アクスム",14,39],["マリ|ガーナ|トンブクトゥ|ソンガイ",16.8,-3],["ジンバブエ",-20,30],["南アフリカ|マンデラ|アパルトヘイト",-26,28],["ケニア|東アフリカ",-1.3,36.8],["コンゴ",-4.3,15.3],["ナイジェリア",9,7.5],["メキシコ|アステカ|テノチティトラン|オルメカ",19.4,-99],["マヤ",17,-89.6],["インカ|ペルー|マチュピチュ|アンデス",-13.5,-72],["ブラジル",-15.8,-47.9],["アルゼンチン",-34.6,-58.4],["キューバ",23.1,-82.4],["ハイチ",18.5,-72.3],["カナダ",45.4,-75.7],["アメリカ|合衆国|ワシントン|ニューヨーク|独立宣言|南北戦争|NASA|アポロ|シリコンバレー|ハリウッド",39,-98],["パナマ",9,-79.5],["火星",0,-50],["月",0,0]];
  const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%1000003;return h;};
  let landCtx=null;
  function isLand(lon,lat){if(!landCtx){const c=document.createElement("canvas");c.width=1024;c.height=512;landCtx=c.getContext("2d");landCtx.fillStyle="#fff";landCtx.fill(new Path2D(EARTHPATH));}
    const x=Math.floor((lon+180)/360*1024),y=Math.floor((90-lat)/180*512);return landCtx.getImageData(x,y,1,1).data[3]>0;}
  function locate(title,desc,region){
    const txt=title+" "+desc;
    for(const [k,la,lo] of PLACE){if(new RegExp(k).test(title))return [la,lo];}
    for(const [k,la,lo] of PLACE){if(new RegExp(k).test(txt))return [la,lo];}
    const b=RBOX[region]||RBOX["世界"];let h=hash(title);
    for(let i=0;i<30;i++){h=(h*16807)%2147483647;const lo=b[0]+(h%1000)/1000*(b[1]-b[0]);h=(h*16807)%2147483647;const la=b[2]+(h%1000)/1000*(b[3]-b[2]);if(isLand(lo,la))return [la,lo];}
    return [(b[2]+b[3])/2,(b[0]+b[1])/2];
  }
  const EV=[];
  COS.forEach(e=>EV.push({lab:e[0],y:e[1],t:e[2],d:e[3],k:e[4],ll:e[5]!==undefined?[e[5],e[6]]:null,reg:e[4]==="human"?"アフリカ":"宇宙・地球",w:e[1]< -4.5e9?2.4:2}));
  (typeof WH!=="undefined"?WH:[]).slice().sort((a,b)=>a[1]-b[1]).forEach(e=>{EV.push({lab:e[0],y:e[1],t:e[3],d:e[4],k:"hist",reg:e[2],tags:e[5],ll:null,w:1});});
  EV.sort((a,b)=>a.y-b.y);
  let acc=0;EV.forEach(e=>{e.p=acc;acc+=e.w;});const TOTAL_ALL=acc;let TOTAL=acc;
  const calcLim=()=>{TOTAL=TOTAL_ALL;};calcLim();
  const yearAt=p=>{let i=EV.findIndex(e=>e.p>p)-1;if(i<-1)i=EV.length-1;if(i<0)return [EV[0].y,0];const a=EV[i],b=EV[i+1];if(!b)return [a.y,i];return [a.y+(b.y-a.y)*((p-a.p)/a.w),i];};
  const posOfYear=y=>{const i=EV.findIndex(e=>e.y>=y);return i<0?TOTAL-0.01:EV[i].p;};
  // ---- UI ----
  const cap=document.getElementById("thcap"),phaseEl=document.getElementById("thphase"),logEl=document.getElementById("thlog"),scr=document.getElementById("thscrub"),yr=document.getElementById("thyear"),play=document.getElementById("thplay"),ticks=document.getElementById("thticks"),jumps=document.getElementById("thjumps"),speedBox=document.getElementById("thspeed");
  scr.max=1000;
  const JUMP=[["宇宙の誕生",-13.8e9],["太陽系と地球",-4.6e9],["生命",-3.8e9],["恐竜",-2.3e8],["人類",-7e6],["文明",-3500],["近代",1760],["現代",1945]].concat(T1?[["未来（もしも）",2026.6]]:[]);
  // ---- ズームできる出来事バー ----
  const bar=document.getElementById("thbar2");let v0=0,v1=TOTAL,follow=true,hov=-1;
  const RC={"ヨーロッパ":"#7fb2ff","中東・北アフリカ":"#e8a46a","アフリカ":"#8fd16a","南・東南アジア・オセアニア":"#e6a0c4","東アジア":"#ff8f8f","南北アメリカ":"#c99cf2","世界":"#f4b942"};
  const evCol=e=>e.k!=="hist"?(e.y< -4.6e9?"#b48cff":e.y< -7e6?"#6fd2a0":"#ffb070"):(e.y>2026.5?"#7ee0ff":RC[e.reg]||"#f4b942");
  const PH=[["宇宙",-1e12,-4.6e9,"#2a1f4a"],["太陽系・地球",-4.6e9,-5.4e8,"#1f3a3a"],["生命の進化",-5.4e8,-7e6,"#1f3a24"],["人類",-7e6,-3500,"#3a2f1f"],["文明",-3500,1450,"#3a2424"],["近世〜近代",1450,1945,"#2a2a44"],["現代",1945,2026.5,"#24304a"],["未来（もしも）",2026.5,1e9,"#1a3a44"]];
  function drawBar(){if(!bar)return;const W=bar.clientWidth||900,H=96;bar.setAttribute("viewBox",`0 0 ${W} ${H}`);bar.setAttribute("height",H);
    if(v1>TOTAL){v1=TOTAL;}if(v1-v0<3){v1=Math.min(TOTAL,v0+3);}const X=p=>(p-v0)/(v1-v0)*W;let g="";
    PH.forEach(([n,a,b,c])=>{const pa=posOfYear(a),pb=b>2026.5&&TOTAL<=posOfYear(2026.6)?TOTAL:posOfYear(b);const x1=Math.max(0,X(pa)),x2=Math.min(W,X(pb));if(x2<=x1)return;g+=`<rect x="${x1}" y="0" width="${x2-x1}" height="${H}" fill="${c}"/>`+(x2-x1>50?`<text x="${x1+5}" y="12" class="tbph">${n}</text>`:"");});
    let lastL=[-1e9,-1e9];const vis=EV.filter(e=>e.p>=v0-1&&e.p<=v1+1&&e.p<TOTAL);
    vis.forEach(e=>{const x=X(e.p),i=EV.indexOf(e);if(e.sp===undefined)e.sp=typeof EV3D!=="undefined"&&EV3D?EV3D.isSpecial({title:e.t,desc:e.d,y:e.y,kind:e.k,tags:e.tags}):false;
      const R=i===hov?9:7;g+=e.sp?`<polygon points="${[...Array(10)].map((_,k)=>{const a=k*Math.PI/5-Math.PI/2,q=k%2?R*.45:R;return (x+Math.cos(a)*q).toFixed(1)+","+(40+Math.sin(a)*q).toFixed(1);}).join(" ")}" fill="${evCol(e)}" stroke="#fff" stroke-width=".8" data-i="${i}" class="tbev"/>`:`<circle cx="${x}" cy="40" r="${i===hov?6:4}" fill="${evCol(e)}" stroke="#0a0f1f" stroke-width="1" data-i="${i}" class="tbev"/>`;
      const row=lastL[0]<=lastL[1]?0:1;if(x-lastL[row]>110){lastL[row]=x;g+=`<line x1="${x}" x2="${x}" y1="44" y2="${row?76:60}" stroke="#ffffff30"/><text x="${x+3}" y="${row?86:70}" class="tbl">${e.t.length>12?e.t.slice(0,12)+"…":e.t}</text>`;}});
    const px=X(pos);g+=`<line x1="${px}" x2="${px}" y1="16" y2="${H}" stroke="#f4b942" stroke-width="2"/><polygon points="${px-6},16 ${px+6},16 ${px},24" fill="#f4b942"/>`;
    if(hov>=0&&EV[hov]){const e=EV[hov],x=Math.min(W-220,Math.max(4,X(e.p)-110));g+=`<rect x="${x}" y="18" width="216" height="20" rx="5" fill="#0a0f1fe8" stroke="#ffffff30"/><text x="${x+6}" y="32" class="tbtip">${e.lab}　${e.t}</text>`;}
    bar.innerHTML=g;document.getElementById("thzoom").textContent=`表示中：${fmtYear(yearAt(v0)[0])} 〜 ${fmtYear(yearAt(Math.min(v1,TOTAL-.01))[0])}（${Math.round(v1-v0)}件分）`;}
  const zoomBar=(cx,f)=>{const W=bar.clientWidth,c=v0+(cx/W)*(v1-v0);let w=Math.min(TOTAL,Math.max(4,(v1-v0)*f));v0=Math.max(0,c-(cx/W)*w);v1=Math.min(TOTAL,v0+w);v0=Math.max(0,v1-w);follow=false;drawBar();};
  if(bar){bar.addEventListener("wheel",e=>{e.preventDefault();const r=bar.getBoundingClientRect();if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){const d=(e.deltaX||e.deltaY)/r.width*(v1-v0);const w=v1-v0;v0=Math.max(0,Math.min(TOTAL-w,v0+d));v1=v0+w;follow=false;drawBar();return;}zoomBar(e.clientX-r.left,e.deltaY>0?1.25:.8);},{passive:false});
    let dr=null,mv=0;bar.addEventListener("pointerdown",e=>{dr={x:e.clientX,v0,v1};mv=0;bar.setPointerCapture(e.pointerId);});
    bar.addEventListener("pointermove",e=>{const r=bar.getBoundingClientRect();if(dr){const d=(e.clientX-dr.x)/r.width*(dr.v1-dr.v0);mv=Math.max(mv,Math.abs(e.clientX-dr.x));const w=dr.v1-dr.v0;v0=Math.max(0,Math.min(TOTAL-w,dr.v0-d));v1=v0+w;if(mv>3)follow=false;drawBar();return;}
      const t=e.target.closest(".tbev");const h=t?+t.dataset.i:-1;if(h!==hov){hov=h;drawBar();}});
    bar.addEventListener("pointerup",e=>{if(dr&&mv<4){const r=bar.getBoundingClientRect();const t=e.target.closest(".tbev");pos=t?EV[+t.dataset.i].p+.02:v0+(e.clientX-r.left)/r.width*(v1-v0);lastI=-1;clearMarks();update(true);}dr=null;});
    bar.addEventListener("pointerleave",()=>{if(hov>=0){hov=-1;drawBar();}});
    document.getElementById("thbz").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const W=bar.clientWidth;const px=(pos-v0)/(v1-v0)*W;
      if(b.dataset.z==="in")zoomBar(Math.max(0,Math.min(W,px)),.5);else if(b.dataset.z==="out")zoomBar(Math.max(0,Math.min(W,px)),2);else if(b.dataset.z==="all"){v0=0;v1=TOTAL;follow=false;drawBar();}else{follow=true;const w=Math.min(TOTAL,Math.max(20,v1-v0));v0=Math.max(0,pos-w/2);v1=Math.min(TOTAL,v0+w);drawBar();}});
    new ResizeObserver(drawBar).observe(bar);}
  function followBar(){if(!follow||!bar)return;const w=v1-v0;if(pos>v1-w*.15||pos<v0){v0=Math.max(0,Math.min(TOTAL-w,pos-w*.3));v1=v0+w;}}
  function renderTicks(){const J=JUMP.filter(([n,y])=>posOfYear(y)<TOTAL);ticks.innerHTML=J.map(([n,y])=>`<span style="left:${posOfYear(y)/TOTAL*100}%">${n}</span>`).join("");
  jumps.innerHTML=J.map(([n,y])=>`<button class="chip" data-y="${y}">${n}</button>`).join("");}renderTicks();
  window.addEventListener("k-year",()=>{calcLim();if(v1>TOTAL||v1===v0)v1=TOTAL;renderTicks();if(pos>TOTAL)pos=TOTAL-.01;update(true);});
  let speed=1;speedBox.innerHTML=[.5,1,2,4,8].map(s=>`<button class="chip" data-s="${s}" aria-pressed="${s===speed}">×${s}</button>`).join("");
  speedBox.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;speed=+b.dataset.s;speedBox.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  let pos=0,playing=false,lastI=-1;
  const setPlay=v=>{playing=v;play.textContent=v?"❚❚ 一時停止":"▶ 再生";play.setAttribute("aria-pressed",v);};
  play.addEventListener("click",()=>{if(!playing&&pos>=TOTAL-0.02){pos=0;lastI=-1;clearMarks();}setPlay(!playing);});
  scr.addEventListener("input",()=>{pos=scr.value/1000*TOTAL;lastI=-1;clearMarks();update(true);});
  jumps.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;pos=posOfYear(+b.dataset.y);lastI=-1;clearMarks();update(true);});
  const fmtYear=y=>{if(y<-1e8)return `${(-y/1e8).toFixed(1)}億年前`;if(y<-1e4)return `${Math.round(-y/1e4).toLocaleString()}万年前`;if(y<0)return `紀元前${Math.round(-y).toLocaleString()}年`;return (y>=10000?`西暦約${Math.round(y/1e4).toLocaleString()}万年`:`${Math.floor(y)}年`)+(y>2026.5?"（もしも）":"");};
  const phaseOf=y=>y< -4.6e9?["宇宙","宇宙の誕生と銀河"]:y< -4.54e9?["太陽系","太陽系の誕生"]:y< -7e6?["地球","地球と生命の歴史"]:y< -3500?["人類","人類の誕生と旅"]:y<2026.5?["文明","世界史"]:["未来","もしもの未来（Type Iへ）"];

  // ---- 3D ----
  let renderer,scene,camera,running=false,t0=performance.now(),last=0,inited=false;
  let G={},earth,tilt,moon,clouds,atm,lights,lightPop=[],marks=[],uni,galaxy,disk,sunS,flash,impactL,planets=[];
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const R=(()=>{let s=11;return ()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};})();
  function glowTex(col){const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d");const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,col);r.addColorStop(.3,col);r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
  const sprite=(col,s,op=1)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));m.scale.set(s,s,1);return m;};
  function tex(draw){const c=document.createElement("canvas");c.width=1024;c.height=512;draw(c.getContext("2d"),1024,512);return new THREE.CanvasTexture(c);}
  function noise(g,w,h,n,col,r0,r1,a){for(let i=0;i<n;i++){g.globalAlpha=a*R();g.fillStyle=col;g.beginPath();g.arc(R()*w,R()*h,r0+R()*(r1-r0),0,7);g.fill();}g.globalAlpha=1;}
  let TX={};
  function makeTex(){const P=()=>new Path2D(EARTHPATH);
    TX.molten=tex((g,w,h)=>{g.fillStyle="#3a0e04";g.fillRect(0,0,w,h);noise(g,w,h,1400,"#ff5a1a",2,16,.7);noise(g,w,h,500,"#ffc04a",1,6,.8);noise(g,w,h,300,"#1a0602",6,30,.6);});
    TX.ocean=tex((g,w,h)=>{g.fillStyle="#1d4f7a";g.fillRect(0,0,w,h);noise(g,w,h,300,"#2a6a9a",6,30,.4);noise(g,w,h,60,"#6a5a4a",2,6,.8);});
    TX.barren=tex((g,w,h)=>{g.fillStyle="#1d4a78";g.fillRect(0,0,w,h);g.fillStyle="#8a6a4a";g.fill(P());g.save();g.clip(P());noise(g,w,h,900,"#5a4030",3,16,.45);g.restore();});
    TX.snow=tex((g,w,h)=>{g.fillStyle="#cfe2f0";g.fillRect(0,0,w,h);g.fillStyle="#f4f8fb";g.fill(P());noise(g,w,h,400,"#ffffff",4,20,.5);});
    TX.green=tex((g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#1d3f73");gr.addColorStop(.5,"#1f5a9a");gr.addColorStop(1,"#1d3f73");g.fillStyle=gr;g.fillRect(0,0,w,h);
      g.fillStyle="#4d7a3a";g.fill(P());g.save();g.clip(P());noise(g,w,h,900,"#a88f5a",3,18,.35);noise(g,w,h,500,"#2f5f2a",3,14,.3);g.restore();g.fillStyle="#f2f6fa";g.fillRect(0,0,w,20);g.fillRect(0,h-38,w,38);});
  }

  // 大陸移動を反映した地球のテクスチャ
  let pc=null,pLast={ma:-1,st:"",t:0};
  function paleoTex(ma,st,now){
    if(!pc){pc={c:document.createElement("canvas")};PALEO.render(0,pc.c,[29,74,120],null);pc.t=new THREE.CanvasTexture(pc.c);}
    const need=st!==pLast.st||Math.abs(ma-pLast.ma)>Math.max(.8,ma*.012);
    if(need&&(now-pLast.t>140||st!==pLast.st)){
      const tint=st==="barren"?(r,g,b)=>{const l=(r+g+b)/3;return [l*.9+60,l*.6+40,l*.4+25];}:st==="snow"?(r,g,b)=>{const l=(r+g+b)/3;return [225+l*.1,232+l*.08,240];}:null;
      PALEO.render(ma,pc.c,st==="snow"?[190,212,230]:[29,74,120],null,tint);pc.t.needsUpdate=true;pLast={ma,st,t:now};
      const lab=document.getElementById("thpaleo");if(lab)lab.textContent="大陸の配置："+PALEO.label(ma)+"（"+(ma>=100?(ma/100).toFixed(1)+"億年前":Math.round(ma*100).toLocaleString()+"万年前")+(ma<=540?"・PALEOMAP）":"・推定）");}
    return pc.t;}
  const toXYZ=(lat,lon,r)=>{const u=(lon+180)/360*Math.PI*2,p=lat*Math.PI/180;return V(-Math.cos(u)*Math.cos(p)*r,Math.sin(p)*r,Math.sin(u)*Math.cos(p)*r);};
  function init(){
    if(inited||!hasThree)return;inited=true;
    renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio));host.appendChild(renderer.domElement);
    scene=new THREE.Scene();scene.background=new THREE.Color("#02030a");camera=new THREE.PerspectiveCamera(45,1,.1,5000);
    scene.add(new THREE.AmbientLight("#ffffff",.25));const sun=new THREE.DirectionalLight("#fff",1.2);sun.position.set(-40,10,30);scene.add(sun);
    // 背景の星
    const bs=[];for(let i=0;i<3000;i++){const a=R()*6.283,u=R()*2-1,r=1500;bs.push(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r);}
    G.bg=pts(bs,"#ffffff",1.6,.8,false);scene.add(G.bg);
    // 宇宙（膨張する物質と銀河）
    G.cos=new THREE.Group();scene.add(G.cos);
    const N=7000,uP=new Float32Array(N*3),cP=new Float32Array(N*3);const centers=[];for(let k=0;k<70;k++){const a=R()*6.283,u=R()*2-1,r=Math.pow(R(),.5);centers.push(V(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r));}
    for(let i=0;i<N;i++){const a=R()*6.283,u=R()*2-1,r=Math.pow(R(),.33);uP.set([Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r],i*3);
      const c=centers[i%70],t=R()*6.283,rr=.035*Math.pow(R(),.6);cP.set([c.x+Math.cos(t)*rr,c.y+(R()-.5)*.008,c.z+Math.sin(t)*rr],i*3);}
    const ug=new THREE.BufferGeometry();ug.setAttribute("position",new THREE.BufferAttribute(new Float32Array(N*3),3));
    uni={g:ug,uP,cP,N,m:new THREE.PointsMaterial({color:"#ffd8a0",size:1.6,sizeAttenuation:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false})};
    G.cos.add(new THREE.Points(ug,uni.m));
    flash=sprite("#fff2d0",60,1);G.cos.add(flash);
    // 天の川銀河
    const gp=[],gc=[];for(let i=0;i<6000;i++){const arm=i%2,r=Math.pow(R(),.7)*30,th=r*.22+arm*Math.PI+(R()-.5)*.5;gp.push(Math.cos(th)*r,(R()-.5)*(2-r/20),Math.sin(th)*r);
      const c=new THREE.Color(r<6?"#ffe2b0":R()<.3?"#ff9ad0":"#bcd4ff");gc.push(c.r,c.g,c.b);}
    const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.Float32BufferAttribute(gp,3));gg.setAttribute("color",new THREE.Float32BufferAttribute(gc,3));
    galaxy=new THREE.Points(gg,new THREE.PointsMaterial({size:.5,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));galaxy.rotation.x=.5;G.cos.add(galaxy);
    const core=sprite("#ffe2b0",14,0);galaxy.add(core);galaxy.userData.core=core;
    // 太陽系の誕生
    G.sol=new THREE.Group();scene.add(G.sol);sunS=sprite("#ffcf6a",14,1);G.sol.add(sunS);
    const dp=[];for(let i=0;i<5000;i++){const r=3+Math.pow(R(),.8)*40,a=R()*6.283;dp.push(Math.cos(a)*r,(R()-.5)*.6,Math.sin(a)*r);}
    disk=pts(dp,"#d8a070",.35,.75,true);G.sol.add(disk);
    [[6,.35,"#b0a090"],[9,.55,"#e0c080"],[13,.6,"#5a8ad0"],[18,.45,"#c0603a"],[28,1.8,"#d8b890"],[38,1.5,"#e8d8a8"]].forEach(([r,s,c],i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(s,24,12),new THREE.MeshStandardMaterial({color:c,roughness:.8}));m.userData={r,s,a:R()*6.28};G.sol.add(m);planets.push(m);});
    G.sol.rotation.x=.35;
    // 地球
    makeTex();G.earth=new THREE.Group();scene.add(G.earth);tilt=new THREE.Group();G.earth.add(tilt);
    earth=new THREE.Mesh(new THREE.SphereGeometry(6,64,32),new THREE.MeshStandardMaterial({map:TX.molten,roughness:.85,emissive:"#000"}));tilt.add(earth);
    clouds=new THREE.Mesh(new THREE.SphereGeometry(6.08,48,24),new THREE.MeshStandardMaterial({map:tex((g,w,h)=>{for(let i=0;i<500;i++){g.globalAlpha=.08+R()*.18;g.fillStyle="#fff";g.beginPath();g.ellipse(R()*w,h*.1+R()*h*.8,8+R()*40,3+R()*10,0,0,7);g.fill();}}),transparent:true,depthWrite:false}));earth.add(clouds);
    atm=sprite("#6fb6ff",17,.45);G.earth.add(atm);
    moon=new THREE.Mesh(new THREE.SphereGeometry(1.6,32,16),new THREE.MeshStandardMaterial({color:"#9a9a96",roughness:1}));G.earth.add(moon);
    // 都市の灯り（陸の上にランダム）
    const lp=[];let tries=0;while(lp.length<4000*3&&tries<60000){tries++;const lo=R()*360-180,la=Math.asin(R()*2-1)*180/Math.PI;if(la>68||la<-48)continue;if(!isLand(lo,la))continue;
      if(la>12&&la<32&&lo>-15&&lo<45&&R()<.85)continue;if(la<-18&&la>-32&&lo>118&&lo<145&&R()<.9)continue;if(la>-12&&la<3&&lo>-75&&lo<-50&&R()<.8)continue;if(la>55&&lo>60&&R()<.75)continue;
      const p=toXYZ(la,lo,6.03);lp.push(p.x,p.y,p.z);}
    const lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));lg.setDrawRange(0,0);
    lights=new THREE.Points(lg,new THREE.PointsMaterial({color:"#ffcf7a",size:.09,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));earth.add(lights);
    // Type I：軌道リングと宇宙エレベーター
    G.ring=new THREE.Mesh(new THREE.TorusGeometry(7.2,.04,8,200),new THREE.MeshBasicMaterial({color:"#7ee0ff",transparent:true,opacity:0}));G.ring.rotation.x=Math.PI/2;tilt.add(G.ring);
    G.elev=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,0)]),new THREE.LineBasicMaterial({color:"#9fe8ff",transparent:true,opacity:0}));earth.add(G.elev);
    const eb=toXYZ(0,-92,6),et=toXYZ(0,-92,20);G.elev.geometry.setFromPoints([eb,et]);
    // 隕石
    impactL=sprite("#ffb070",3,0);G.earth.add(impactL);
    G.earth.userData.flash=sprite("#fff0c0",4,0);earth.add(G.earth.userData.flash);
    resize();new ResizeObserver(resize).observe(host);
    // 視点の手動回転（ドラッグ）
    let drag=null;host.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);});
    host.addEventListener("pointermove",e=>{if(!drag)return;camOff.x-=(e.clientX-drag.x)*.005;camOff.y=Math.max(-1.2,Math.min(1.2,camOff.y+(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};});
    host.addEventListener("pointerup",()=>drag=null);
    host.addEventListener("wheel",e=>{e.preventDefault();camOff.z=Math.max(.4,Math.min(2.5,camOff.z*(e.deltaY>0?1.1:.9)));},{passive:false});
  }
  const camOff={x:0,y:0,z:1};
  {const rb=document.getElementById("threset");if(rb)rb.onclick=()=>{camOff.x=0;camOff.y=0;camOff.z=1;if(pip)pip.t0=performance.now();};}
  function pts(arr,col,size,op,attn){const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(arr,3));return new THREE.Points(g,new THREE.PointsMaterial({color:col,size,sizeAttenuation:attn,transparent:true,opacity:op,depthWrite:false}));}
  function resize(){if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  // 年ごとの人口（灯りの量の目安）
  const POP=[[-3500,1.5e7],[1,2.3e8],[1000,3e8],[1500,4.5e8],[1800,1e9],[1900,1.65e9],[1950,2.5e9],[2000,6.1e9],[2026,8.2e9],[2100,1.03e10],[2300,1e10]];
  const popAt=y=>{if(y<=POP[0][0])return y< -12000?0:POP[0][1]*Math.max(0,(y+12000)/8500);for(let i=1;i<POP.length;i++)if(y<=POP[i][0]){const[a,pa]=POP[i-1],[b,pb]=POP[i];return Math.exp(Math.log(pa)+(Math.log(pb)-Math.log(pa))*(y-a)/(b-a));}return POP[POP.length-1][1];};
  function clearMarks(){marks.forEach(m=>earth&&earth.remove(m.g));marks=[];}
  function addMark(ev){if(!earth)return;if(ev.y< -1e6&&ev.y>-5.45e8)return;if(!ev.ll)ev.ll=ev.k==="hist"?locate(ev.t,ev.d,ev.reg):null;if(!ev.ll)return;
    const g=new THREE.Group();const p=toXYZ(ev.ll[0],ev.ll[1],6.05);g.position.copy(p);g.lookAt(p.clone().multiplyScalar(2));
    const col=ev.y>2026.5?"#7ee0ff":ev.k==="hist"?"#ffd27a":"#ff8a6a";
    const s=sprite(col,1.2,1);g.add(s);const rg=new THREE.Mesh(new THREE.RingGeometry(.25,.32,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.9,side:THREE.DoubleSide}));g.add(rg);
    earth.add(g);marks.push({g,s,rg,t:performance.now()});if(marks.length>14){const o=marks.shift();earth.remove(o.g);}}
  let target={ry:0,rx:.3},cur={ry:0,rx:.3},camD=160;
  function phaseVis(y){const ph=y< -4.6e9?0:y< -4.54e9?1:2;G.cos.visible=ph===0;G.sol.visible=ph===1;G.earth.visible=ph===2;return ph;}
  let prevPh=-1;
  function update(fromUser){
    const [y,i]=yearAt(pos);scr.value=Math.round(pos/TOTAL*1000);yr.textContent=fmtYear(y);drawBar();
    const [pk,pn]=phaseOf(y);phaseEl.innerHTML=`<b>${pk}</b>${pn}`;
    const ev=EV[Math.max(0,i)];
    if(i!==lastI){
      if(fromUser||i<lastI||lastI<0){logEl.innerHTML="";}
      const from=fromUser||lastI<0?i:lastI+1;
      for(let k=Math.max(from,i-5);k<=i;k++){const e=EV[k];if(!e)continue;addMark(e);if(e.k==="impact"||e.k==="moonimpact")G.earth&&(G.earth.userData.boom=performance.now());
        const li=document.createElement("li");li.innerHTML=`<span class="num">${e.lab}</span>${e.t}`;if(e.y>2026.5)li.className="fut";logEl.prepend(li);while(logEl.children.length>6)logEl.lastChild.remove();}
      lastI=i;pipWant=i;
      cap.innerHTML=`<div class="thmeta"><span class="pill">${ev.reg}</span>${ev.tags&&ev.tags.includes("もしも")?'<span class="pill fut">もしも</span>':ev.y>2026.5?'<span class="pill fut">予定・予測</span>':""}</div><div class="thy num">${ev.lab}</div><h3>${ev.t}</h3><p>${ev.d||""}</p><div class="thlinks">${ev.k==="hist"?`<button class="chip" data-tl="hist">📜 年表で詳しく</button>`:`<button class="chip" data-tl="${ev.y< -4.6e9?"cosmos":"earth"}">${ev.y< -4.6e9?"🌌 宇宙年表へ":"🌏 地球史年表へ"}</button>`}</div>`;
      const ll=ev.y< -1e6?(ev.y>-5.45e8?[ev.y< -4.2e8?-35:5,20]:ev.ll):ev.ll;if(ll){const p=toXYZ(ll[0],ll[1],1);target.ry=-Math.atan2(p.x,p.z);target.rx=ll[0]*Math.PI/180*.75;}
    }
  }
  function frame(now){
    if(!running)return;requestAnimationFrame(frame);
    const dt=Math.min(.1,(now-last)/1000||0);last=now;const t=(now-t0)/1000;
    if(playing){followBar();pos+=dt*speed/1.5;if(pos>=TOTAL-0.01){pos=TOTAL-0.01;setPlay(false);}update(false);}
    if(!inited)return;
    const [y]=yearAt(pos);const ph=phaseVis(y);
    if(ph!==prevPh){host.classList.remove("thfade");void host.offsetWidth;host.classList.add("thfade");prevPh=ph;}
    let cd=40,look=V(0,0,0);
    if(ph===0){ // 宇宙
      const age=y+13.8e9, f=Math.min(1,age/9.2e9);
      const sc=6+180*Math.pow(f,.55)+Math.min(60,age/2e5*.0);const cl=Math.min(1,Math.max(0,(age-.2e9)/3.5e9));
      const a=uni.g.attributes.position.array;for(let k=0;k<uni.N*3;k++)a[k]=(uni.uP[k]*(1-cl)+uni.cP[k]*cl)*sc;uni.g.attributes.position.needsUpdate=true;
      const hot=age<4e5, dark=age>=4e5&&age<2e8;
      uni.m.color.set(hot?"#ffd090":dark?"#6a4030":"#cfe0ff");uni.m.opacity=dark?.25:1;uni.m.size=hot?2.4:1.4;
      flash.material.opacity=Math.max(0,1-age/2e7);flash.scale.setScalar(20+age/1e6);
      const gf=Math.min(1,Math.max(0,(y+9.5e9)/4e9));galaxy.material.opacity=gf;galaxy.userData.core.material.opacity=gf*.8;galaxy.rotation.y=t*.05;
      uni.m.opacity*=1-gf*.85;cd=260-gf*200;G.bg.material.opacity=Math.min(.8,f);
    } else if(ph===1){
      const f=(y+4.6e9)/.06e9;sunS.material.opacity=.5+f*.5;sunS.scale.setScalar(8+f*8);disk.material.opacity=.8*(1-f*.6);disk.rotation.y=t*.15;
      planets.forEach(m=>{const d=m.userData;d.a+=dt*1.2/Math.sqrt(d.r);m.position.set(Math.cos(d.a)*d.r,0,Math.sin(d.a)*d.r);m.scale.setScalar(Math.max(.05,f));});cd=90;
    } else {
      const st=y< -4.4e9?"molten":(y< -3.2e9?"ocean":((y>-2.4e9&&y< -2.1e9)||(y>-7.2e8&&y< -6.35e8))?"snow":y< -4.7e8?"barren":"green");
      const ma=-y/1e6, usePaleo=typeof PALEO!=="undefined"&&ma>0.5&&(st==="barren"||st==="green"||st==="snow");
      if(usePaleo){const tx=paleoTex(ma,st,now);if(earth.material.map!==tx){earth.material.map=tx;earth.material.emissive.set("#000");earth.material.needsUpdate=true;}earth.userData.st="paleo";}
      else if(earth.userData.st!==st){earth.material.map=TX[st];earth.material.emissive.set(st==="molten"?"#5a1a05":"#000");earth.material.needsUpdate=true;earth.userData.st=st;}
      if(!usePaleo){const lab=document.getElementById("thpaleo");if(lab&&lab.textContent)lab.textContent=y< -3.2e9&&y>=-4.4e9?"まだ大陸のない、海だけの惑星":"";}
      clouds.visible=st!=="molten";clouds.material.opacity=y< -1e6&&y>-5.45e8?.35:1;atm.material.opacity=st==="molten"?.15:.45;
      const hasMoon=y>=-4.5e9;moon.visible=hasMoon;const md=y< -4e9?13:19;moon.position.set(Math.cos(t*.12)*md,Math.sin(t*.12)*md*.12,Math.sin(t*.12)*md*.5-md*.55);
      const pop=popAt(y),n=lights.geometry.attributes.position.count;
      const fr=pop<=0?0:Math.max(0,Math.min(1,(Math.log10(pop)-6.3)/(Math.log10(1.2e10)-6.3)));lights.geometry.setDrawRange(0,Math.floor(n*Math.pow(fr,2.6)));
      lights.material.color.set(y>1880?(y>2026.5?"#bfeaff":"#ffe2a0"):"#ff9a4a");lights.material.size=y>1880?.1:.07;
      const fut=Math.max(0,Math.min(1,(y-2100)/150));G.ring.material.opacity=fut*.9;G.elev.material.opacity=Math.max(0,Math.min(1,(y-2105)/20));
      cur.ry+=(((target.ry-cur.ry+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI)*Math.min(1,dt*2.2);cur.rx+=(target.rx-cur.rx)*Math.min(1,dt*2.2);
      earth.rotation.y=cur.ry;tilt.rotation.x=cur.rx;clouds.rotation.y=t*.01;
      marks.forEach(m=>{const a=(now-m.t)/1000;m.rg.scale.setScalar(1+((a*1.2)%1)*2.5);m.rg.material.opacity=.9*(1-((a*1.2)%1));m.s.material.opacity=Math.max(.35,1-a/6);});
      const bt=(now-(G.earth.userData.boom||0))/1000,fl=G.earth.userData.flash;
      if(bt<2.5&&lastI>=0&&EV[lastI].ll){const e=EV[lastI];const p=toXYZ(e.ll[0],e.ll[1],6.1);fl.position.copy(p);fl.material.opacity=Math.max(0,1-bt/2.5);fl.scale.setScalar(2+bt*6);}else fl.material.opacity=0;
      if(bt<2.5&&lastI>=0&&EV[lastI].k==="moonimpact"){impactL.position.set(14-bt*3,4,8);impactL.material.opacity=Math.max(0,1-bt/2);}else impactL.material.opacity=0;
      cd=y< -7e6?24:17;
    }
    camD+=(cd*camOff.z-camD)*Math.min(1,dt*1.5);
    camera.position.set(Math.sin(camOff.x)*Math.cos(camOff.y)*camD,Math.sin(camOff.y)*camD+camD*.08,Math.cos(camOff.x)*Math.cos(camOff.y)*camD);camera.lookAt(look);
    if(pip===null&&lastI>=0){pipBuild(lastI);}
    const W=host.clientWidth,H=host.clientHeight,hasPip=renderPip(now);
    if(hasPip&&pipMode==="human"){pip.cam.aspect=W/H;pip.cam.updateProjectionMatrix();renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.render(pip.sc,pip.cam);
      const w=Math.round(W*.3),h=Math.round(w*.62);renderer.setScissorTest(true);renderer.setScissor(W-w-14,14,w,h);renderer.setViewport(W-w-14,14,w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);renderer.setScissorTest(false);camera.aspect=W/H;camera.updateProjectionMatrix();}
    else{renderer.setViewport(0,0,W,H);renderer.render(scene,camera);
      if(hasPip){const w=Math.round(W*.34),h=Math.round(w*.62);pip.cam.aspect=w/h;pip.cam.updateProjectionMatrix();renderer.setScissorTest(true);renderer.setScissor(W-w-14,14,w,h);renderer.setViewport(W-w-14,14,w,h);renderer.render(pip.sc,pip.cam);renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);}}
    const lab=document.getElementById("thpiplab");if(lab){const w=Math.round(W*(pipMode==="human"?.3:.34));lab.style.width=w+"px";lab.style.bottom=(Math.round(w*.62)+16)+"px";const tx=pipMode==="human"?"🌍 地球全体":(lab.dataset.t||"👤 人の目線");if(lab.textContent!==tx)lab.textContent=tx;}
  }
  // ---- 人の目線 ----
  let pip=null,pipMode="both",pipT=0,pipWant=-1,pipHas=-1;
  function pipBuild(i){if(!hasThree||typeof EV3D==="undefined"||!EV3D)return;const e=EV[i];if(!e)return;const sc=new THREE.Scene();const r=EV3D.build(sc,{title:e.t,desc:e.d,y:e.y,kind:e.k,tags:e.tags,region:e.reg});
    if(pip&&pip.sc)pip.sc.traverse(o=>{o.geometry&&o.geometry.dispose();});pip={sc,r,cam:pip?pip.cam:new THREE.PerspectiveCamera(60,1,.1,600),t0:performance.now()};pipHas=i;
    const lab=document.getElementById("thpiplab");if(lab)lab.dataset.t="👤 人の目線："+(r.note||"その場にいた人から見た想像図");}
  const vb=document.getElementById("thview");if(vb){vb.innerHTML=[["both","地球＋人の目線"],["earth","地球のみ"],["human","人の目線を大きく"]].map(([k,t])=>`<button class="chip" data-v="${k}" aria-pressed="${k===pipMode}">${t}</button>`).join("");
    vb.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;pipMode=b.dataset.v;vb.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));document.getElementById("thpiplab").hidden=pipMode==="earth";});}
  function renderPip(now){if(pipMode==="earth"||!pip)return false;if(pipWant!==pipHas&&now-pipT>700){pipT=now;pipBuild(pipWant);}
    const t=(now-pip.t0)/1000;pip.r.anims.forEach(f=>f(t));const a=Math.sin(t*.12)*.5;pip.cam.position.set(0,1.6,4);pip.cam.lookAt(Math.sin(a)*10,pip.r.space?4:2.2,4-Math.cos(a)*10);return true;}
  function start(){if(!hasThree){cap.innerHTML="<p>3D表示（three.js）を読み込めませんでした。</p>";return;}init();if(running)return;running=true;last=performance.now();requestAnimationFrame(frame);update(true);}
  function stop(){running=false;}
  function sync(){(location.hash==="#timeline"||location.hash==="#theater")&&document.getElementById("thdock").open?start():stop();}
  document.getElementById("thdock").addEventListener("toggle",sync);
  window.addEventListener("hashchange",sync);sync();
  setPlay(false);update(true);
  cap.addEventListener("click",e=>{const b=e.target.closest("[data-tl]");if(!b)return;const ev=EV[lastI];const m=b.dataset.tl;document.getElementById("tlswitch").scrollIntoView({behavior:"smooth"});setTimeout(()=>{window.TL_SET&&window.TL_SET(m);if(m==="hist"&&window.WH_DETAIL){const id=WH.findIndex(w=>w[3]===ev.t&&w[1]===ev.y);if(id>=0)window.WH_DETAIL(id);}},120);});
  function seek(y,title){let i=EV.findIndex(e=>e.y===y&&(!title||e.t===title));if(i<0)i=Math.max(0,EV.findIndex(e=>e.y>=y));pos=EV[i].p+.02;lastI=-1;clearMarks();update(true);}
  document.addEventListener("click",e=>{const b=e.target.closest(".thgo");if(!b)return;const y=+b.dataset.th,t=b.dataset.tt;if(location.hash!=="#timeline")location.hash="timeline";const dk=document.getElementById("thdock");dk.open=true;dk.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>{start();seek(y,t);setPlay(true);},150);});
  window.THX={start,stop,EV,locate,seek,quiet(y,t){if(document.getElementById("thdock").open)start();seek(y,t);},get pos(){return pos;},set pos(v){pos=v;lastI=-1;update(true);},play:()=>setPlay(true)};
})();
