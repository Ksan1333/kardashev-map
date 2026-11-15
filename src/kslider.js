/* ---------- ① 時代スライダー（カルダシェフスケール） ---------- */
(()=>{
  // K, 時代, 見出し, 消費電力W, 人口, 主な動力, 活動範囲, 説明, 種別（past/now/future）
  const S=[
   [.29,"約1万年前","狩猟採集の世界",8e8,"約400万人","人の筋肉・たき火","徒歩で行ける範囲","少人数の群れで移動しながら暮らす。夜の地球に人工の光はほとんどない。","past"],
   [.43,"前3000年ごろ","最初の文明",1.8e10,"約4500万人","人力・家畜・薪","川沿いの都市と周辺の農地","メソポタミアやエジプトで都市・文字・国家が生まれる。","past"],
   [.51,"西暦1年ごろ","古代の帝国",1.25e11,"約2.5億人","人力・家畜・薪・水車","ローマ帝国と漢が並び、シルクロードで結ばれる","道路網と大都市。それでもエネルギーの大半は食べ物と薪。","past"],
   [.54,"1500年ごろ","大航海時代",2.7e11,"約4.5億人","人力・家畜・薪・風（帆船・風車）","海路で地球全体がつながり始める","帆船が大洋を渡り、大陸どうしが結ばれる。","past"],
   [.58,"1800年ごろ","産業革命",6.3e11,"約10億人","石炭と蒸気機関","鉄道と蒸気船で移動が速くなる","化石燃料を使い始め、エネルギー消費が急増する。","past"],
   [.61,"1900年ごろ","電気と石油の時代",1.4e12,"約16億人","石炭・石油・電力","電信が地球を結ぶ","電灯・自動車・電話が登場。都市の夜が明るくなる。","past"],
   [.65,"1950年ごろ","戦後の高度成長",3.4e12,"約25億人","石油・石炭・水力、原子力の始まり","ジェット機で世界が1日圏に。まもなく宇宙へ","大量生産・大量消費の社会。人口が急増し始める。","past"],
   [.71,"2000年ごろ","情報化の時代",1.27e13,"約61億人","化石燃料が中心、原子力・水力","地球全体と低軌道","インターネットと携帯電話が普及。国際宇宙ステーションに人が常駐。","past"],
   [.73,"2025年（現在）","現在の地球",1.9e13,"約82億人","化石燃料86%、太陽光・風力が急成長","地球と地球周辺（月の近くまで有人）","エネルギー供給は年600EJ超。このガイドブックの他のビューで詳しく描いている世界。","now"],
   [.8,"近未来","惑星文明への途上",1e14,"100億人前後？","核融合・宇宙太陽光・再生可能エネルギー","月面基地、火星への有人飛行","エネルギーが今の約5倍に。気候を安定させつつ、宇宙での生産が始まる——という想像。","future"],
   [1,"Type I（想定）","惑星文明",1e16,"未知数","惑星に届く太陽光のかなりの部分","地球全体の管理、月と火星に定住","惑星規模の電力網、気象や地震の制御、軌道エレベーター——といった姿がよく想像される。","future"],
   [1.5,"Type I.5（想定）","太陽系文明",1e21,"未知数","宇宙空間の巨大太陽光発電、小惑星資源","太陽系の惑星と衛星","小惑星を資源として採掘し、太陽系のあちこちに居住地を持つ。","future"],
   [2,"Type II（想定）","恒星文明",1e26,"未知数","太陽の全出力（ダイソン・スウォーム）","太陽系全体、近くの恒星へ探査機","太陽を無数の発電衛星で取り囲み、その光をほぼすべて使う。","future"],
   [2.5,"Type II.5（想定）","恒星間文明",1e31,"未知数","多数の恒星のエネルギー","数百〜数千光年の範囲の恒星系","光速に近い宇宙船で、近くの恒星系に広がっていく。","future"],
   [3,"Type III（想定）","銀河文明",1e36,"未知数","銀河全体の恒星（約1000億個以上）","天の川銀河全体","銀河中の恒星のエネルギーを使う。外から見ると、銀河が赤外線でしか光らなく見えるかもしれない。","future"],
   [4,"Type IV（構想）","超銀河団文明",1e46,"未知数","ワームホール網でつないだ数万〜数十万の銀河","ラニアケア超銀河団（約10万個の銀河）から宇宙の大規模構造へ","ワームホールの「近道」で、光でも数億年かかる銀河どうしを行き来する。カルダシェフの元の分類にはない、後から考えられた段階。","future"]];
  const PRE=[
   [-.6,"138億年前","宇宙の誕生",null,"—","ビッグバンの熱","宇宙全体（まだ原子もない）","時間と空間が始まり、宇宙が急膨張する。38万年後に原子ができ、光がまっすぐ進めるようになる。","pre"],
   [-.5,"約130億年前","星と銀河の誕生",null,"—","星の核融合","できたばかりの銀河","最初の星が輝き、銀河が集まっていく。炭素や酸素など、生命の材料になる元素は星の中で作られる。","pre"],
   [-.4,"約46億年前","太陽と地球の誕生",null,"—","太陽の光","太陽系","ガスとちりの円盤から太陽と惑星が生まれる。若い地球はマグマの海で、まもなく巨大衝突で月ができる。","pre"],
   [-.3,"約38億年前","生命の誕生",null,"—","海底の熱水・太陽の光","海の中","海の中で最初の単細胞生物が生まれる。大陸はまだ小さく、空気に酸素はほとんどない。","pre"],
   [-.2,"約2億年前","恐竜の時代",null,"—","—","超大陸パンゲア","恐竜が陸の主役。大陸はひとつにまとまり、これから分かれていく。","pre"],
   [-.1,"約300万年前","道具を使う人類",null,"数万人？","人の筋肉","アフリカのサバンナ","二本足で歩く人類が石を割って道具を作り始める。まだ火も言葉も確かではない。","pre"]];
  S.unshift(...PRE);window.KSTAGES=S;
  const YEAR=[-13.8e9,-13e9,-4.54e9,-3.8e9,-2e8,-3e6,-10000,-3000,1,1500,1800,1900,1950,2000,2026,2100,2250,2700,4000,50000,1000000,1e9];
  const N=S.length,NOWI=S.findIndex(s=>s[8]==="now");
  const $=id=>document.getElementById(id);
  const track=$("track"), fill=$("fill"), knob=$("knob"), card=$("kcard"), cv=$("kcanvas"), list=$("edList");
  // 時代の止まる場所は等間隔に並べる（どの時代も同じ幅で選べるように）。K値は表示に使う
  const pos=i=>i/(N-1)*100;
  const KIND={pre:"宇宙・地球史",past:"人類の歴史",now:"現在",future:"未来（想定）"};
  const typeOf=s=>s[8]==="pre"?"文明以前":s[0]>=4?"Type IV":s[0]>=3?"Type III":s[0]>=2?"Type II":s[0]>=1?"Type I":"Type 0";
  const typeShort=s=>s[8]==="pre"?"文明以前":typeOf(s).replace("Type ","T");
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  // ---- つまみの通り道：区間（宇宙・地球史／人類の歴史／現在／未来）と、止まる点 ----
  const segs=Object.keys(KIND).map(kind=>{const is=S.map((s,i)=>s[8]===kind?i:-1).filter(i=>i>=0);return [kind,is[0],is[is.length-1]];});
  track.insertAdjacentHTML("beforeend",
    segs.map(([kind,a,b])=>`<div class="kseg k-${kind}" style="left:calc(${pos(a)}% - 7px);width:calc(${pos(b)-pos(a)}% + 14px)"></div><div class="kseglab k-${kind}" style="left:${pos((a+b)/2)}%">${KIND[kind]}</div>`).join("")+
    S.map((s,i)=>{const ty=s[8]!=="pre"&&s[0]>=1&&Number.isInteger(s[0]);return `<span class="kstop k-${s[8]}${ty?" kty":""}" style="left:${pos(i)}%" data-i="${i}" title="${esc(s[1]+"　"+s[2])}"></span>${ty?`<span class="ktylab" style="left:${pos(i)}%">${typeOf(s).replace("Type ","")}</span>`:""}`;}).join("")+
    `<div class="ktip" id="ktip" hidden></div>`);
  const tip=$("ktip");
  // ---- 時代の一覧（PCは読み出しを押すと開く／スマホはシートの中） ----
  list.innerHTML=Object.keys(KIND).map(kind=>`<div class="edg"><div class="edgh k-${kind}">${KIND[kind]}</div>${S.map((s,i)=>s[8]!==kind?"":`<button type="button" class="edi k-${kind}" role="option" data-i="${i}" aria-selected="false"><i></i><span class="w">${esc(s[1])}</span><b>${esc(s[2])}</b><span class="t">${typeOf(s)}</span></button>`).join("")}</div>`).join("");
  const sup=n=>String(n).split("").map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹⁻"["0123456789-".indexOf(c)]).join("");
  const fmtW=w=>{const e=Math.floor(Math.log10(w)),m=w/10**e;return `${m.toFixed(1).replace(/\.0$/,"")}×10${sup(e)} W`;};
  const ratio=w=>{const r=w/1.9e13;return r>=1?(r<1e4?`現在の約${Math.round(r).toLocaleString()}倍`:`現在の約10${sup(Math.round(Math.log10(r)))}倍`):`現在の約${(1/r)<100?(1/r).toFixed(0):Math.round(1/r).toLocaleString()}分の1`;};
  let K=.73, Kd=.73, idx=NOWI, lastIdx=-1;
  // 読み出し（PCの時代バー・スマホの上バーのボタン）を書き換える
  function readout(i,preview){const s=S[i];
    const dot=`k-${s[8]}`;
    document.querySelectorAll("[data-era-when]").forEach(el=>el.textContent=s[1]);
    document.querySelectorAll("[data-era-name]").forEach(el=>el.textContent=s[2]);
    document.querySelectorAll("[data-era-type]").forEach(el=>{el.textContent=el.dataset.eraType==="short"?typeShort(s):typeOf(s);});
    document.querySelectorAll("[data-era-dot]").forEach(el=>el.className="edot "+dot);
    const note=$("edNote");if(note&&!preview)note.textContent=s[8]==="now"?"いまは「現在の地球（2025〜26年）」を表示中。スライダーを動かすと、すべてのページがその時代の姿に変わります。":s[8]==="future"?"2026年より先は、予測・目標と想像（もしもの世界）です。":s[8]==="pre"?"人類が登場する前の宇宙・地球です。":"その時代までに起きたこと・知られていたことだけを表示します。";
    track.classList.toggle("previewing",!!preview);
  }
  function place(p){fill.style.width=p+"%";knob.style.left=p+"%";}
  function set(i,o){i=Math.max(0,Math.min(N-1,Math.round(i)));idx=i;K=S[i][0];place(pos(i));readout(i);
    track.setAttribute("aria-valuenow",i);track.setAttribute("aria-valuetext",`${S[i][1]}　${S[i][2]}（${typeOf(S[i])}）`);
    track.querySelectorAll(".kstop").forEach((b,j)=>b.classList.toggle("on",j===i));
    list.querySelectorAll(".edi").forEach(b=>{const on=+b.dataset.i===i;b.classList.toggle("on",on);b.setAttribute("aria-selected",on);});
    updateMap();window.dispatchEvent(new CustomEvent("k-stage",{detail:idx}));
    if(idx!==lastIdx){lastIdx=idx;window.KYEAR=YEAR[idx];window.KERA={i:idx,name:S[idx][2],when:S[idx][1],kind:S[idx][8],now:idx===NOWI,k:S[idx][0],type:typeOf(S[idx])};window.dispatchEvent(new CustomEvent("k-year",{detail:YEAR[idx]}));}
    const s=S[idx], fut=s[8]==="future", pre=s[8]==="pre";
    card.innerHTML=`<div class="kera k-${s[8]}">${s[1]}${fut?'<span class="kif">推測・想定の世界</span>':""}</div><h3>${s[2]}</h3>
      <div class="kstat"><div><b class="num">${pre?"—":"K≈"+s[0].toFixed(2)}</b><span>${pre?"文明はまだない":"カルダシェフ値"}</span></div><div><b class="num">${pre?"—":fmtW(s[3])}</b><span>文明全体の消費電力（${s[8]==="past"?"推定":fut?"定義上の目安":"2025年"}）</span></div><div><b>${s[8]==="now"||pre?"—":ratio(s[3])}</b><span>現在と比べて</span></div></div>
      <dl class="kdl"><dt>人口</dt><dd>${s[4]}</dd><dt>主な動力</dt><dd>${s[5]}</dd><dt>活動範囲</dt><dd>${s[6]}</dd></dl><p>${s[7]}</p>
      ${s[8]==="now"?`<div class="klinks"><a href="#timeline" class="chip">世界史年表</a><a href="#space-map" class="chip">宇宙と地球</a><a href="#lineage" class="chip">系統樹</a></div>`:fut?(s[0]===1?`<div class="klinks"><a href="#timeline" class="chip">未来の年表</a><a href="#world-map" class="chip">Type Iの世界地図</a><a href="#space-map" class="chip">軌道エレベーターと宇宙</a><a href="#lineage" class="chip">系統樹（未来の枝）</a><a href="#timeline" class="chip">歴史シアター</a></div>`:`<div class="klinks">${s[0]<1?`<p class="knote">Type Iへ向かう途中の段階（予測と想像）。</p>`:`<button class="chip" onclick="document.getElementById('tguide').scrollIntoView({behavior:'smooth'})">📘 文明タイプ・ガイドを読む ↓</button><a href="#timeline" class="chip">未来の年表</a><a href="#space-map" class="chip">宇宙マップ</a>`}</div>`):pre?`<div class="klinks"><a href="#timeline" class="chip">宇宙・地球の年表</a><a href="#timeline" class="chip">歴史シアターで見る</a></div>`:`<p class="knote">過去の値は人口と1人あたりのエネルギー消費からの大まかな推定。</p>`}`;
    if(o&&o.from)window.dispatchEvent(new CustomEvent("k-picked",{detail:{i:idx,from:o.from}}));
  }
  function updateMap(){const s=S[idx],data=ERA_FIELDS[idx];const nodes=document.querySelectorAll("#mm .mnode");
    nodes.forEach((n,i)=>{const [v,l]=data?data[i]:[FIELDS[i].v,FIELDS[i].l];n.querySelector(".v").textContent=v;n.querySelector(".l").textContent=l;n.classList.toggle("fut",s[8]==="future");n.classList.toggle("past",s[8]==="past"||s[8]==="pre");});
    const core=document.getElementById("core");core.querySelector(".eyebrow").textContent=s[1];core.querySelector("h3").textContent=s[2];core.querySelector(".big").innerHTML=s[8]==="pre"?`— <small>文明以前`:`K≈${s[0].toFixed(2)} <small>${typeOf(s)}</small>`;
    core.querySelector(".facts").innerHTML=`人口 ${s[4]}<br>活動範囲 ${s[6].length>14?s[6].slice(0,14)+"…":s[6]}<br>主な動力 ${s[5].length>14?s[5].slice(0,14)+"…":s[5]}`;
    core.classList.toggle("fut",s[8]==="future");document.getElementById("mmnote").textContent=s[8]==="now"?"12分野の現在地。カードを押すと、その分野の系統樹へ移動します。":s[8]==="pre"?`${s[1]}：人類の文明はまだありません。各カードは、その時代の宇宙・地球のようすです。`:s[8]==="past"?`${s[1]}の12分野（大まかな概要）。時代を「現在」に戻すと今の地球に戻ります。`:`${s[1]}の12分野（推測・想定の世界）。`;}
  // ---- 操作：ドラッグ（離したところで決定）・クリック・キーボード ----
  const fromX=x=>{const r=track.getBoundingClientRect();return Math.max(0,Math.min(N-1,(x-r.left)/r.width*(N-1)));};
  let drag=null;
  function showTip(i){const s=S[i];tip.hidden=false;tip.innerHTML=`<b>${esc(s[1])}</b>${esc(s[2])}`;tip.style.left=pos(i)+"%";}
  track.addEventListener("pointerdown",e=>{if(e.button)return;e.preventDefault();track.setPointerCapture(e.pointerId);drag={id:e.pointerId,f:fromX(e.clientX)};place(pos(drag.f));readout(Math.round(drag.f),true);showTip(Math.round(drag.f));track.focus({preventScroll:true});});
  track.addEventListener("pointermove",e=>{const f=fromX(e.clientX);if(drag&&e.pointerId===drag.id){drag.f=f;place(pos(f));readout(Math.round(f),true);showTip(Math.round(f));return;}if(e.pointerType==="mouse")showTip(Math.round(f));});
  const end=e=>{if(!drag||e.pointerId!==drag.id)return;const i=Math.round(drag.f);drag=null;tip.hidden=true;set(i,{from:"track"});};
  track.addEventListener("pointerup",end);track.addEventListener("pointercancel",e=>{if(drag&&e.pointerId===drag.id){drag=null;tip.hidden=true;set(idx);}});
  track.addEventListener("pointerleave",e=>{if(!drag)tip.hidden=true;});
  track.addEventListener("keydown",e=>{const m={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-3,PageUp:3}[e.key];
    if(m!==undefined){e.preventDefault();set(idx+m,{from:"key"});}else if(e.key==="Home"){e.preventDefault();set(0,{from:"key"});}else if(e.key==="End"){e.preventDefault();set(N-1,{from:"key"});}});
  list.addEventListener("click",e=>{const b=e.target.closest(".edi");if(b)set(+b.dataset.i,{from:"list"});});
  $("kprev").onclick=()=>set(idx-1,{from:"btn"});
  $("knext").onclick=()=>set(idx+1,{from:"btn"});
  $("know").onclick=()=>set(NOWI,{from:"btn"});
  track.setAttribute("aria-valuemin",0);track.setAttribute("aria-valuemax",N-1);
  // 目盛りの文字が重なるときは、重なった方を隠す（狭い画面で「III」「IV」がくっつかないように）
  function declutter(){[".kseglab",".ktylab"].forEach(sel=>{let last=-1e9;track.querySelectorAll(sel).forEach(el=>{el.classList.remove("off");const r=el.getBoundingClientRect();if(!r.width)return;if(r.left<last+4)el.classList.add("off");else last=r.right;});});}
  new ResizeObserver(declutter).observe(track);
  // ---- イラスト（2D canvas） ----
  const g=cv.getContext("2d");let W=0,H=0;const stars=[...Array(220)].map(()=>[Math.random(),Math.random(),Math.random()]);
  const lights=[...Array(900)].map(()=>{const a=Math.random()*6.283,r=Math.sqrt(Math.random());return [Math.cos(a)*r,Math.sin(a)*r*.98,Math.random()];});
  const swarm=[...Array(700)].map(()=>[Math.random()*6.283,(Math.random()-.5)*2,.9+Math.random()*.6]);
  const galaxy=[...Array(2600)].map((_,i)=>{const arm=i%2,r=Math.pow(Math.random(),.7),a=arm*Math.PI+Math.log(1+r*8)*1.6+(Math.random()-.5)*.5;return [Math.cos(a)*r,Math.sin(a)*r,Math.random()];});
  function resize(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*devicePixelRatio;cv.height=H*devicePixelRatio;g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
  new ResizeObserver(resize).observe(cv);
  const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
  function earth(cx,cy,R,t,lit){const gr=g.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R);gr.addColorStop(0,"#1b3560");gr.addColorStop(1,"#08142c");g.fillStyle=gr;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
    g.strokeStyle="rgba(120,180,255,.35)";g.lineWidth=2;g.beginPath();g.arc(cx,cy,R+2,0,7);g.stroke();
    const n=Math.floor(lights.length*lit);for(let i=0;i<n;i++){const [x,y,b]=lights[i];const fl=.6+.4*Math.sin(t*2+b*20);g.fillStyle=`rgba(255,${190+b*50|0},110,${(.35+b*.6)*fl})`;const s=1+b*1.6*(lit>.6?1.4:1);g.fillRect(cx+x*R*.95-s/2,cy+y*R*.95-s/2,s,s);}}
  function draw(t){if(!W)return;g.clearRect(0,0,W,H);g.fillStyle="#02040c";g.fillRect(0,0,W,H);
    stars.forEach(([x,y,b])=>{g.fillStyle=`rgba(220,230,255,${.2+b*.6})`;g.fillRect(x*W,y*H,1+b,1+b);});
    const cx=W/2,cy=H/2,k=Kd;
    if(S[idx][8]==="pre"){drawPre(idx,cx,cy,t);g.fillStyle="rgba(233,237,247,.75)";g.font="12px 'Noto Sans JP',sans-serif";g.fillText(S[idx][1]+"　"+S[idx][2],12,H-12);return;}
    const aE=1-sm(1.15,1.45,k), aS=sm(1.15,1.45,k)*(1-sm(2.6,2.85,k)), aG=sm(2.6,2.85,k)*(1-sm(3.3,3.8,k)), aV=sm(3.3,3.8,k);
    if(aE>0){g.globalAlpha=aE;const R=Math.min(W,H)*.32;
      const lit=k<.3?.01:k<.73?sm(.28,.73,k)*.55:.55+sm(.73,1,k)*.45;earth(cx,cy,R,t,lit);
      if(k>=.65){const ns=Math.floor(sm(.65,1.1,k)*120);for(let i=0;i<ns;i++){const a=i/ns*6.283+t*.15*(1+i%3*.3),rr=R*(1.12+(i%4)*.05),inc=.35+(i%5)*.12;g.fillStyle="rgba(200,230,255,.9)";g.fillRect(cx+Math.cos(a)*rr-1,cy+Math.sin(a)*rr*inc-1,2,2);}}
      if(k>=.85){g.strokeStyle=`rgba(244,185,66,${sm(.85,1,k)*.8})`;g.lineWidth=3;g.beginPath();g.ellipse(cx,cy,R*1.45,R*.28,-.15,0,7);g.stroke();
        g.fillStyle=`rgba(180,180,190,${sm(.75,1,k)})`;g.beginPath();g.arc(cx+R*1.9,cy-R*.7,R*.22,0,7);g.fill();g.fillStyle=`rgba(255,210,120,${sm(.78,1,k)})`;g.fillRect(cx+R*1.9-3,cy-R*.7-2,5,4);}
      g.globalAlpha=1;}
    if(aS>0){g.globalAlpha=aS;const R=Math.min(W,H)*.1, dim=sm(1.7,2.1,k);
      const sg=g.createRadialGradient(cx,cy,0,cx,cy,R*3);sg.addColorStop(0,`rgba(255,240,190,${1-dim*.7})`);sg.addColorStop(.3,`rgba(255,180,60,${.6-dim*.45})`);sg.addColorStop(1,"rgba(255,140,40,0)");g.fillStyle=sg;g.beginPath();g.arc(cx,cy,R*3,0,7);g.fill();
      [[.9,"#9c9890"],[1.3,"#e8c98a"],[1.75,"#3d7fd0"],[2.3,"#c1552d"],[3.3,"#d8b48a"],[4.2,"#e8d6a8"]].forEach(([r,c],i)=>{const a=t*(.5/(i+1))+i;const rr=R*r*1.1;g.strokeStyle="rgba(120,140,190,.25)";g.lineWidth=1;g.beginPath();g.ellipse(cx,cy,rr,rr*.4,0,0,7);g.stroke();
        g.fillStyle=c;g.beginPath();g.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.4,3+i*.4,0,7);g.fill();if(k>1.4){g.fillStyle="rgba(255,210,120,.9)";g.fillRect(cx+Math.cos(a)*rr+4,cy+Math.sin(a)*rr*.4-1,2,2);}});
      const ns=Math.floor(swarm.length*sm(1.4,2.05,k));for(let i=0;i<ns;i++){const [a,y,r]=swarm[i];const aa=a+t*.2*(1/r);g.fillStyle=`rgba(244,185,66,${.55+.4*Math.sin(i)})`;g.fillRect(cx+Math.cos(aa)*R*r*1.4-1.2,cy+Math.sin(aa)*R*r*.55+y*R*.4-1.2,2.4,2.4);}
      if(k>2.2){const nn=Math.floor(sm(2.2,2.6,k)*8);for(let i=0;i<nn;i++){const a=i*.8+.3,d=Math.min(W,H)*(.35+i%3*.08);const x=cx+Math.cos(a)*d*1.3,y=cy+Math.sin(a)*d*.7;g.strokeStyle="rgba(127,178,255,.4)";g.beginPath();g.moveTo(cx,cy);g.lineTo(x,y);g.stroke();g.fillStyle="#ffd27a";g.beginPath();g.arc(x,y,3,0,7);g.fill();g.strokeStyle="rgba(244,185,66,.7)";g.beginPath();g.arc(x,y,7,0,7);g.stroke();}}
      g.globalAlpha=1;}
    if(aG>0){g.globalAlpha=aG;const R=Math.min(W,H)*.45;g.save();g.translate(cx,cy);g.rotate(t*.03);
      galaxy.forEach(([x,y,b],i)=>{const red=i%3!==0;g.fillStyle=red?`rgba(255,${120+b*60|0},80,${.5+b*.4})`:`rgba(200,220,255,${.3+b*.5})`;g.fillRect(x*R,y*R*.55,1.6,1.6);});
      const cg=g.createRadialGradient(0,0,0,0,0,R*.25);cg.addColorStop(0,"rgba(255,200,140,.8)");cg.addColorStop(1,"rgba(255,140,80,0)");g.fillStyle=cg;g.beginPath();g.arc(0,0,R*.25,0,7);g.fill();g.restore();g.globalAlpha=1;}
    if(aV>0){g.globalAlpha=aV;const GP=[[0,0,1.3],[-.33,-.2,.8],[.35,-.25,.9],[-.38,.25,.7],[.3,.28,.75],[-.05,-.38,.6],[.05,.4,.6],[-.62,.02,.55],[.62,0,.6]].map(([x,y,s2])=>[cx+x*W,cy+y*H,s2]);
      GP.forEach(([x,y],i)=>{if(!i)return;const [x0,y0]=GP[0];const mx=(x+x0)/2,my=(y+y0)/2-40;g.strokeStyle="rgba(158,232,255,.45)";g.lineWidth=1.2;g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo(mx,my,x,y);g.stroke();
        const f=(t*.25+i*.13)%1,u=1-f;g.fillStyle="rgba(200,240,255,.95)";g.fillRect(u*u*x0+2*u*f*mx+f*f*x-1.5,u*u*y0+2*u*f*my+f*f*y-1.5,3,3);});
      GP.forEach(([x,y,s2],k2)=>{const rr=40*s2;g.save();g.translate(x,y);g.rotate(t*.05+k2);galaxy.slice(0,500).forEach(([gx,gy,b],i)=>{const red=i%3!==0;g.fillStyle=red?`rgba(255,${120+b*60|0},80,${.4+b*.4})`:`rgba(200,220,255,${.3+b*.5})`;g.fillRect(gx*rr,gy*rr*.55,1.2,1.2);});g.restore();
        g.strokeStyle="rgba(200,160,255,.8)";g.lineWidth=1.5;g.beginPath();g.ellipse(x+rr*1.1,y-rr*.4,5,8,0,0,7);g.stroke();});g.globalAlpha=1;}
    g.fillStyle="rgba(233,237,247,.75)";g.font="12px 'Noto Sans JP',sans-serif";g.fillText(S[idx][1]+"　"+S[idx][2],12,H-12);}
  let paleoC=null;
  function drawPre(i,cx,cy,t){const R=Math.min(W,H)*.32;
    if(i===0){const r=(t*40)%(Math.min(W,H)*.6);const gl=g.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*.5);gl.addColorStop(0,"rgba(255,250,230,1)");gl.addColorStop(.15,"rgba(255,200,120,.8)");gl.addColorStop(.6,"rgba(200,80,40,.25)");gl.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gl;g.fillRect(0,0,W,H);
      lights.forEach(([x,y,b],j)=>{const d=((t*.15+b)%1);g.fillStyle=`rgba(255,${180+b*70|0},120,${1-d})`;g.fillRect(cx+x*d*W*.6,cy+y*d*H*.6,1.6,1.6);});return;}
    if(i===1){for(let k=0;k<7;k++){const gx=cx+Math.cos(k*2.1)*W*.3*(k%3+1)/3,gy=cy+Math.sin(k*1.7)*H*.3*(k%2?.7:1),rr=18+k*4;g.save();g.translate(gx,gy);g.rotate(t*.1+k);
      galaxy.slice(0,350).forEach(([x,y,b])=>{g.fillStyle=`rgba(${190+b*60|0},210,255,${.3+b*.5})`;g.fillRect(x*rr,y*rr*.5,1.2,1.2);});g.restore();}return;}
    if(i===2){const sg=g.createRadialGradient(cx-R*1.6,cy,0,cx-R*1.6,cy,R*1.3);sg.addColorStop(0,"rgba(255,240,190,1)");sg.addColorStop(.3,"rgba(255,170,60,.7)");sg.addColorStop(1,"rgba(255,120,30,0)");g.fillStyle=sg;g.beginPath();g.arc(cx-R*1.6,cy,R*1.3,0,7);g.fill();
      g.strokeStyle="rgba(220,170,120,.25)";for(let r=1;r<6;r++){g.beginPath();g.ellipse(cx-R*1.6,cy,R*r*.7,R*r*.18,0,0,7);g.stroke();}
      const eg=g.createRadialGradient(cx+R*.4-R*.2,cy-R*.2,R*.1,cx+R*.4,cy,R*.7);eg.addColorStop(0,"#ffb04a");eg.addColorStop(.6,"#c2410c");eg.addColorStop(1,"#3a0e04");g.fillStyle=eg;g.beginPath();g.arc(cx+R*.4,cy,R*.7,0,7);g.fill();
      for(let j=0;j<60;j++){const [x,y,b]=lights[j];g.fillStyle=`rgba(255,${200+b*55|0},90,${.4+.4*Math.sin(t*3+j)})`;g.fillRect(cx+R*.4+x*R*.6,cy+y*R*.6,2,2);}return;}
    // 地球（海・パンゲア・現在）
    const ma=i===3?3600:i===4?200:0;
    if(typeof PALEO!=="undefined"&&(!paleoC||paleoC.ma!==ma)){paleoC={c:document.createElement("canvas"),ma};PALEO.render(ma,paleoC.c,i===3?[22,64,110]:[29,74,120],null,i===3?(r,gg,b)=>[120,100,80]:null);}
    g.save();g.beginPath();g.arc(cx,cy,R,0,7);g.clip();
    if(paleoC){const c=paleoC.c,sw=c.width/2,off=((t*12)%c.width);g.drawImage(c,off,0,sw,c.height,cx-R,cy-R,R*2,R*2);if(off+sw>c.width)g.drawImage(c,0,0,off+sw-c.width,c.height,cx-R+(c.width-off)/sw*R*2,cy-R,(off+sw-c.width)/sw*R*2,R*2);}
    const sh=g.createRadialGradient(cx-R*.35,cy-R*.35,R*.2,cx,cy,R*1.05);sh.addColorStop(0,"rgba(255,255,255,.08)");sh.addColorStop(.7,"rgba(0,0,0,.1)");sh.addColorStop(1,"rgba(0,0,0,.75)");g.fillStyle=sh;g.fillRect(cx-R,cy-R,R*2,R*2);g.restore();
    g.strokeStyle="rgba(120,180,255,.35)";g.lineWidth=2;g.beginPath();g.arc(cx,cy,R+2,0,7);g.stroke();
    if(i===3){g.fillStyle="rgba(120,255,170,.6)";for(let j=0;j<80;j++){const [x,y]=lights[j];g.fillRect(cx+x*R*.9,cy+y*R*.9,1.5,1.5);}}
  }
  const still=matchMedia("(prefers-reduced-motion: reduce)");
  let run=false;function loop(now){if(!run)return;Kd=still.matches?K:Kd+(K-Kd)*.12;if(Math.abs(K-Kd)<.002)Kd=K;draw(now/1000);requestAnimationFrame(loop);}
  function sync(){const on=!location.hash||location.hash==="#overview";if(on&&!run){run=true;Kd=K;requestAnimationFrame(loop);}else if(!on)run=false;}
  window.KSET=(i,o)=>set(i,o||{from:"api"});
  window.KSETK=(k)=>{let best=0;S.forEach((s,i)=>{if(Math.abs(s[0]-k)<Math.abs(S[best][0]-k))best=i;});set(best,{from:"api"});};
  window.KSTEP=d=>set(idx+d,{from:"api"});
  window.addEventListener("hashchange",sync);set(NOWI);sync();
})();
