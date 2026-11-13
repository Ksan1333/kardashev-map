/* ---------- ④ 宇宙ズーム（目盛り・操作） ---------- */
(()=>{
  const bar=document.getElementById("spbar"), lv=document.getElementById("splevels"), info=document.getElementById("spinfo"), barbox=document.getElementById("spbarbox");
  const P=[ // 名前, km, スケールid, 対象, 種別
   ["地球",6371,"leo","earth","crew"],["カーマン線",100,"leo","karman","crew"],["ISS・天宮",400,"leo","iss","crew"],["ハッブル",530,"leo","hubble","robot"],["Starlink",550,"leo","starlinksat","robot"],["GPS衛星",20200,"leo","gps","robot"],["静止軌道",35786,"leo","geo","robot"],
   ["月",384400,"moon","moon","crew"],["人類の最遠到達",406771,"moon","artemis","crew"],["JWST（L2）",1.5e6,"moon","jwst","robot"],
   ["金星（最接近）",4.1e7,"inner","venus","robot"],["火星（最接近）",5.46e7,"inner","mars","robot"],["水星",9.2e7,"inner","mercury","robot"],["太陽",1.496e8,"inner","sun","none"],["ケレス",4.1e8,"inner","ceres","robot"],
   ["木星",6.3e8,"outer","jupiter","robot"],["土星",1.28e9,"outer","saturn","robot"],["天王星",2.7e9,"outer","uranus","robot"],["海王星",4.3e9,"outer","neptune","robot"],["冥王星",5.9e9,"outer","pluto","robot"],["ハレー彗星（遠日点）",5.2e9,"outer","halley","none"],
   ["太陽圏の境界",1.8e10,"helio","heliopause","robot"],["ボイジャー1号",2.59e10,"helio","voyager1","robot"],["オールトの雲",1.5e12,"helio","oort","none"],
   ["プロキシマ・ケンタウリ",4.0e13,"stars","proxima","none"],["シリウス",8.1e13,"stars","sirius","none"],["TRAPPIST-1",3.85e14,"stars","trappist","none"],
   ["プレアデス星団",4.2e15,"nebula","pleiades","none"],["ベテルギウス",5.2e15,"nebula","betelgeuse","none"],["オリオン大星雲",1.27e16,"nebula","orion","none"],["Gaia BH1",1.48e16,"nebula","gaiabh1","none"],["かに星雲",6.1e16,"nebula","crab","none"],["創造の柱",5.4e16,"nebula","eagle","none"],["はくちょう座X-1",6.8e16,"nebula","cygx1","none"],
   ["オメガ星団",1.6e17,"galaxy","omegacen","none"],["いて座A*",2.5e17,"galaxy","sgra","none"],["天の川銀河",9.5e17,"galaxy","mw","none"],["大マゼラン雲",1.5e18,"galaxy","lmc","none"],
   ["アンドロメダ銀河",2.4e19,"local","andromeda","none"],["さんかく座銀河",2.6e19,"local","triangulum","none"],
   ["ケンタウルス座A",1.1e20,"lania","cena","none"],["子持ち銀河",2.2e20,"lania","m51","none"],["M87*",5.2e20,"lania","m87","none"],["グレート・アトラクター",2.4e21,"lania","ga","none"],["かみのけ座銀河団",3.0e21,"lania","coma","none"],
   ["シャプレー超銀河団",6.1e21,"web","shapley","none"],["うしかい座ボイド",6.6e21,"web","bootes","none"],["スローン・グレートウォール",9.5e21,"web","sloan","none"],["TON 618",1.0e23,"web","ton618","none"],["最も遠い銀河",3.2e23,"web","jades","none"],["観測可能な宇宙の果て",4.4e23,"web","edge","none"],["宇宙の形（説）",3e24,"shape","uni_shape","none"]];
  P.sort((a,b)=>a[1]-b[1]);
  const col={crew:"var(--accent)",robot:"var(--cool)",none:"#8e98b5"};
  const MIN=1.5,MAX=24; let lo=MIN,hi=MAX, W=1200; const L=30;
  function render(){W=Math.max(900,barbox.clientWidth-20);const Rr=W-30,X=km=>L+(Math.log10(km)-lo)/(hi-lo)*(Rr-L);
    let g=`<rect x="0" y="0" width="${W}" height="110" fill="transparent"/>`;
    const seg=(a,b,c)=>{const x1=Math.max(L,X(a)),x2=Math.min(Rr,X(b));if(x2>x1)g+=`<rect x="${x1}" y="40" width="${x2-x1}" height="8" rx="4" fill="${c}"/>`;};
    seg(10**MIN,406771,"#f4b94255");seg(406771,2.59e10,"#7fb2ff33");seg(2.59e10,10**MAX,"#ffffff12");
    const span=hi-lo, st=span>12?2:span>6?1:span>3?.5:.25;
    for(let e=Math.ceil(lo/st)*st;e<=hi;e+=st){const x=X(10**e);const lab=Number.isInteger(e)?`10${String(e).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}km`:"";g+=`<line x1="${x}" x2="${x}" y1="50" y2="${lab?56:53}" stroke="#8e98b5"/>${lab?`<text x="${x}" y="68" text-anchor="middle" class="sp-axis">${lab}</text>`:""}`;}
    const rows=[14,28,90,104];let lastX=[-1e9,-1e9,-1e9,-1e9];
    P.forEach(([n,km,l,o,k],i)=>{const x=X(km);if(x<L-5||x>Rr+5)return;let r=0,best=-1;for(let j=0;j<4;j++){if(x-lastX[j]>n.length*12+10){r=j;best=j;break;}}const show=best>=0;if(show)lastX[r]=x;const ty=rows[r],up=r<2;
      g+=`<g class="spp" data-i="${i}" tabindex="0" role="button"><title>${n}</title>${show?`<line x1="${x}" x2="${x}" y1="44" y2="${up?ty+3:ty-10}" stroke="${col[k]}" stroke-opacity=".5"/>`:""}<circle cx="${x}" cy="44" r="5.5" fill="${col[k]}" stroke="#02030a" stroke-width="1.5"/>${show?`<text x="${x}" y="${ty}" text-anchor="middle" class="sp-name">${n}</text>`:""}</g>`;});
    bar.setAttribute("viewBox",`0 0 ${W} 110`);bar.style.width=W+"px";bar.innerHTML=g;sync2();}
  // 目盛りのズーム・パン
  barbox.addEventListener("wheel",e=>{e.preventDefault();const r=bar.getBoundingClientRect();const fx=Math.min(1,Math.max(0,(e.clientX-r.left-L)/(r.width-L-30)));const c=lo+fx*(hi-lo);
    if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){const d=(e.deltaX||e.deltaY)*(hi-lo)/800;lo+=d;hi+=d;}else{const f=Math.exp(e.deltaY*.0015);let s=Math.min(MAX-MIN,Math.max(1.5,(hi-lo)*f));lo=c-fx*s;hi=lo+s;}
    if(lo<MIN){hi+=MIN-lo;lo=MIN;}if(hi>MAX){lo-=hi-MAX;hi=MAX;}render();},{passive:false});
  let drag=null;barbox.addEventListener("pointerdown",e=>{drag={x:e.clientX,lo,hi,m:0};});
  window.addEventListener("pointermove",e=>{if(!drag)return;const r=bar.getBoundingClientRect();const d=-(e.clientX-drag.x)/(r.width-60)*(drag.hi-drag.lo);drag.m=Math.max(drag.m,Math.abs(e.clientX-drag.x));let a=drag.lo+d,b=drag.hi+d;if(a<MIN){b+=MIN-a;a=MIN;}if(b>MAX){a-=b-MAX;b=MAX;}lo=a;hi=b;render();});
  window.addEventListener("pointerup",e=>{if(drag&&drag.m<4){const p=document.elementFromPoint(e.clientX,e.clientY)?.closest(".spp");if(p)pick(+p.dataset.i);}drag=null;});
  document.getElementById("spb-in").onclick=()=>{const c=(lo+hi)/2,s=Math.max(1.5,(hi-lo)/1.6);lo=Math.max(MIN,c-s/2);hi=Math.min(MAX,lo+s);render();};
  document.getElementById("spb-out").onclick=()=>{const c=(lo+hi)/2,s=Math.min(MAX-MIN,(hi-lo)*1.6);lo=Math.max(MIN,c-s/2);hi=Math.min(MAX,lo+s);if(hi-lo<s)lo=Math.max(MIN,hi-s);render();};
  document.getElementById("spb-all").onclick=()=>{lo=MIN;hi=MAX;render();};
  bar.addEventListener("keydown",e=>{if(e.key==="Enter"){const p=e.target.closest(".spp");if(p)pick(+p.dataset.i);}});
  if(typeof SPZ==="undefined"||!SPZ){document.getElementById("spscene").innerHTML=`<div class="noscene">3D表示を読み込めませんでした。</div>`;render();return;}
  const SHORT={leo:"地球周回",moon:"地球と月",inner:"内太陽系",outer:"外太陽系",helio:"太陽圏",stars:"近くの恒星",nebula:"星雲",galaxy:"天の川銀河",local:"局部銀河群",lania:"ラニアケア",web:"大規模構造",shape:"宇宙の形"};
  function navSpec(){const lanes=[{id:"main",name:"本線（実在の宇宙）",color:"#f4b942"}];const nodes=SPZ.LEVELS.map((L2,i)=>({id:L2.id,lane:"main",label:L2.short||SHORT[L2.id]||L2.name,num:i+1,col:i}));const colOf={};nodes.forEach(n=>colOf[n.id]=n.col);
    // 空想の上位層（マルチバース→法則の海→オムニバース）は本線の延長として点線で描く
    const up=["mv","meta","omni","imposs","void"].map(id=>SPZ.ALL.find(x=>x.id===id)).filter(Boolean);const last=SPZ.LEVELS[SPZ.LEVELS.length-1].id;
    lanes.push({id:"upx",name:"ここから先は空想（さらに外側）",color:"#c99cf2",from:last,dash:1,inline:1});up.forEach((L2,j)=>{const n={id:L2.id,lane:"upx",label:L2.short||L2.name,num:SPZ.LEVELS.length+1+j,col:SPZ.LEVELS.length+j,fic:1};nodes.push(n);colOf[L2.id]=n.col;});
    const GRP={ga:"gx",gc:"gx"},seen={};
    SPZ.LANES.forEach(l=>{if(l.id==="mv")return;const gid=GRP[l.id]||l.id;const br=SPZ.ALL.filter(L2=>L2.br&&L2.lane===l.id);
      if(!seen[gid]){seen[gid]=1;lanes.push({id:gid,name:gid==="gx"?"銀河の中（近く・遠く）":l.name,color:l.color,from:l.from,dash:["uv","mt","om"].includes(l.id)});}
      const base=nodes.filter(n=>n.lane===gid).length;br.forEach((L2,j)=>{const n={id:L2.id,lane:gid,label:L2.short||L2.name,col:(colOf[l.from]??0)+.8+(base+j)*.9,fic:!!L2.fic};nodes.push(n);});});
    return {lanes,nodes,cw:74};}
  const drawNav=()=>GITNAV.render(lv,navSpec(),SPZ.levelId,id=>{const i=SPZ.ALL.findIndex(x=>x.id===id);if(i>=0)SPZ.go(i,null,"out");});
  SPZ.init(document.getElementById("spscene"),document.getElementById("splabels"),info,document.getElementById("spfade"));
  const pick=i=>{const [,,l,o]=P[i];SPZ.goId(l,o);};window.SP_P=P;window.SP_PICK=pick;

  info.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.shape){window.UNI_SHAPE=b.dataset.shape;SPZ.go(SPZ.level);return;}if(b.dataset.unfocus)SPZ.unfocus();if(b.dataset.o2)SPZ.focusOn(b.dataset.o2);if(b.dataset.earth)toEarth();if(b.dataset.pmap){window.toPlanetMap&&window.toPlanetMap(b.dataset.pmap);return;}if(b.dataset.map!==undefined){window.SPZ_MAP=b.dataset.map==="1";if(!b.dataset.br){SPZ.go(SPZ.level);return;}}if(b.dataset.br)SPZ.goBr(b.dataset.br);if(b.dataset.back)SPZ.outward();});
  document.getElementById("sp-out").onclick=()=>SPZ.outward();
  document.getElementById("sp-in").onclick=()=>SPZ.inward();
  document.getElementById("sp-home").onclick=()=>SPZ.home();
  let curObj=null;
  function sync2(){const id=SPZ&&SPZ.LEVELS[SPZ.level]?.id;bar.querySelectorAll(".spp").forEach(p=>{const q=P[+p.dataset.i];const lq=SPZ.SUBMAP[q[2]]||q[2];p.classList.toggle("lv",lq===id);p.classList.toggle("sel",q[3]===curObj&&lq===id);});}
  window.addEventListener("spz-level",e=>{drawNav();curObj=null;sync2();});drawNav();
  window.addEventListener("spz-obj",e=>{curObj=e.detail;sync2();});
  // 地球へ降りる／宇宙へ上がる
  const veil=document.getElementById("veil");
  function toEarth(){veil.textContent="地球へ降下中…";veil.classList.add("on");setTimeout(()=>{location.hash="world-map";setTimeout(()=>veil.classList.remove("on"),350);},450);}
  window.addEventListener("spz-earth",toEarth);
  window.addEventListener("spz-loop",()=>{veil.textContent="一周して、ミクロのいちばん底「描けない底」へ…";veil.classList.add("on");setTimeout(()=>{location.hash="micro";setTimeout(()=>{if(window.MICRO)MICRO.open("bottom","uroboros");setTimeout(()=>veil.classList.remove("on"),700);},300);},1100);});
  window.toSpace=()=>{veil.textContent="宇宙へ上昇中…";veil.classList.add("on");setTimeout(()=>{location.hash="space-map";SPZ.goFrom("leo","earth");setTimeout(()=>veil.classList.remove("on"),400);},450);};
  let started=false;function sync(){if(location.hash==="#space-map"){if(!started){started=true;SPZ.go(0,null);}SPZ.start();render();}else SPZ.stop();}
  window.addEventListener("hashchange",sync);window.addEventListener("resize",()=>location.hash==="#space-map"&&render());render();sync();
})();
