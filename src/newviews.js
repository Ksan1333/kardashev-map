/* ---------- ② 世界史年表（横向き・詳細パネル） ---------- */
(()=>{
  const box=document.getElementById("tl"), rc=document.getElementById("tlregions"), panel=document.getElementById("whpanel"), wrap=document.getElementById("whwrap");
  const RCOL={"ヨーロッパ":"#7fb2ff","中東・北アフリカ":"#e8a46a","アフリカ":"#8fd16a","南・東南アジア・オセアニア":"#e6a0c4","東アジア":"#ff8f8f","南北アメリカ":"#c99cf2","世界":"#f4b942"};
  WH.forEach((e,i)=>e.id=i);
  const KY=()=>typeof window.KYEAR==="number"?window.KYEAR:1e12;
  const WHV=()=>WH.filter(e=>e[1]<=KY());
  let only=new Set(), selId=null;
  const visRegs=()=>WH_REGIONS.filter(r=>!only.size||only.has(r));
  const eraOf=y=>WH_ERAS.find(([,a,b])=>y>=a&&y<b)?.[0]||"現代";
  function renderChips(){rc.innerHTML=`<button class="chip" data-all="1" aria-pressed="${!only.size}">すべて</button>`+WH_REGIONS.map(r=>`<button class="chip" aria-pressed="${only.has(r)}" data-r="${r}"><span class="dot" style="background:${RCOL[r]}"></span>${r}</button>`).join("");}
  let render=function(){
    const regs=visRegs(), eras=WH_ERAS.filter(e=>e[1]<=KY());
    let h=`<div class="whh" style="grid-template-columns:150px repeat(${eras.length},minmax(250px,1fr))"><div class="whcorner">地域 ＼ 時代</div>${eras.map(([nm,a,b])=>`<div class="whhead">${nm}<small>${a<-1e8?"〜前3500年":a>2026?(a>=10000?(a/1e4)+"万年〜":Math.floor(a)+"〜")+(b>=1e6?"":b>=10000?(b/1e4)+"万年":Math.floor(b)+"年"):b>2050?"1945年〜":(a<0?"前"+(-a):a)+"〜"+(b<0?"前"+(-b):Math.floor(b))+"年"}</small></div>`).join("")}`;
    regs.forEach(r=>{h+=`<div class="whreg" style="--rc:${RCOL[r]}"><b>${r}</b><small>${WHV().filter(e=>e[2]===r).length}件</small></div>`;
      eras.forEach(([nm,a,b])=>{const evs=WHV().filter(e=>e[2]===r&&e[1]>=a&&e[1]<b).sort((x,y)=>x[1]-y[1]);
        h+=`<div class="whcell">${evs.map(e=>`<button class="whev${e.id===selId?" sel":""}" data-fut="${e[1]>2026.4?1:0}" data-id="${e.id}" style="--rc:${RCOL[r]}"><span class="y num">${e[0]}</span><b>${typeof EV3D!=="undefined"&&EV3D&&EV3D.isSpecial({title:e[3],desc:e[4],y:e[1],tags:e[5],kind:"hist"})?'<i class="spstar">★</i>':""}${e[3]}</b></button>`).join("")}</div>`;});});
    box.innerHTML=h+`</div>`;document.getElementById("whcount").textContent=`${WHV().filter(e=>regs.includes(e[2])).length}件を表示（全${WH.length}件）`+(KY()<2026?`・${KY()<0?"前"+(-KY()).toLocaleString():KY()}年までに起きた出来事のみ`:"");
    if(!eras.length)box.innerHTML=`<p class="erapre">この時代にはまだ人類の歴史がありません。「宇宙」「地球史」の年表に切り替えてください。</p>`;
  };
  const near=(y)=>y<-10000?20000:y<-3000?1000:y<0?150:y<1500?40:y<1900?15:y<2000?4:2;
  function detail(id){
    const e=WH[id];selId=id;const [y,yr,r,t,d,tags]=e;const w=near(yr);
    const same=WH.filter(x=>x[2]===r).sort((a,b)=>a[1]-b[1]);const k=same.indexOf(e);
    const others=WH.filter(x=>x!==e&&x[2]!==r&&Math.abs(x[1]-yr)<=w).sort((a,b)=>Math.abs(a[1]-yr)-Math.abs(b[1]-yr)).slice(0,8);
    // 系統樹から同じ時期に生まれた要素
    const tree=(typeof TREE!=="undefined")?TREE.flatMap(f=>f.nodes.filter(n=>Math.abs(n[3]-yr)<=w).map(n=>[f.name,n[1],n[3]])).sort((a,b)=>Math.abs(a[2]-yr)-Math.abs(b[2]-yr)).slice(0,8):[];
    const q=encodeURIComponent(t.replace(/（.*?）/g,"").split(/[・と]/)[0]);
    const btn=x=>`<button class="linkbtn" data-id="${x.id}"><span class="num">${x[0]}</span>　${x[3]}</button>`;
    panel.innerHTML=`<button class="gclose" data-close="1" aria-label="閉じる">×</button><div class="ev3d"></div><button class="chip thgo" data-th="${yr}" data-tt="${t}">🎬 地球の映像で通し再生</button>
      <div class="meta"><span class="pill" style="color:${RCOL[r]};border-color:${RCOL[r]}">${r}</span><span>${eraOf(yr)}</span></div>
      <div class="whdy num">${y}</div><h3>${t}</h3>${d?`<p>${d}</p>`:""}
      <div class="whtags">${tags.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
      <div><h4>同じ地域の前後</h4><div class="whnav">${k>0?btn(same[k-1]):""}${k<same.length-1?btn(same[k+1]):""}</div></div>
      ${others.length?`<div><h4>同じころ、ほかの地域では（±${w}年）</h4><div class="whnav">${others.map(btn).join("")}</div></div>`:""}
      ${tree.length?`<div><h4>同じころ生まれた要素（系統樹より）</h4><ul class="whtree">${tree.map(([f,n,b])=>`<li><span>${f}</span>${n}</li>`).join("")}</ul></div>`:""}
      ${tags.includes("もしも")?`<p class="clim">この出来事は想像（もしもの未来）です。実際の予定ではありません。</p>`:tags.includes("予定")||tags.includes("予測")?`<p class="clim">2026年時点の計画・目標・予測です。変わる可能性があります。</p>`:""}
      <div><h4>もっと詳しく（外部サイト）</h4><div class="photo"><a href="https://ja.wikipedia.org/w/index.php?search=${q}" target="_blank" rel="noopener">Wikipediaで調べる</a><a href="https://www.google.com/search?tbm=isch&q=${q}" target="_blank" rel="noopener">画像検索</a></div></div>`;
    panel.hidden=false;wrap.classList.add("open");panel.scrollTop=0;
    if(typeof EV3D!=="undefined"&&EV3D)EV3D.mount(panel.querySelector(".ev3d"),{title:t,desc:d,y:yr,tags,region:r,kind:"hist"});
    if(yr<=2026&&window.THX)THX.quiet(yr,t);
    box.querySelectorAll(".whev").forEach(b=>b.classList.toggle("sel",+b.dataset.id===id));
  }
  rc.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.all)only=new Set();else{only.has(b.dataset.r)?only.delete(b.dataset.r):only.add(b.dataset.r);}renderChips();render();});
  box.addEventListener("click",e=>{const b=e.target.closest(".whev");if(b)detail(+b.dataset.id);});
  panel.addEventListener("click",e=>{if(e.target.closest("[data-close]")){panel.hidden=true;wrap.classList.remove("open");selId=null;box.querySelectorAll(".whev.sel").forEach(b=>b.classList.remove("sel"));return;}
    const b=e.target.closest("button[data-id]");if(b){const id=+b.dataset.id;const r=WH[id][2];if(only.size&&!only.has(r)){only.add(r);renderChips();render();}detail(id);
      const el=box.querySelector(`.whev[data-id="${id}"]`);if(el){const s=box.querySelector(".whscroll")||box;el.scrollIntoView({block:"nearest",inline:"center"});}}});
  // ---- ズーム・パン ----
  let z=1; const zl=document.getElementById("whzoom");
  function setZ(nz,cx,cy){const r=box.getBoundingClientRect();cx=cx??r.width/2;cy=cy??r.height/2;nz=Math.min(2.6,Math.max(.45,nz));
    const ax=(box.scrollLeft+cx)/z, ay=(box.scrollTop+cy)/z; z=nz; const g=box.querySelector(".whh"); if(g)g.style.zoom=z;
    box.scrollLeft=ax*z-cx; box.scrollTop=ay*z-cy; zl.textContent=Math.round(z*100)+"%";}
  box.addEventListener("wheel",e=>{if(e.shiftKey){box.scrollLeft+=e.deltaY;e.preventDefault();return;}e.preventDefault();const r=box.getBoundingClientRect();setZ(z*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)),e.clientX-r.left,e.clientY-r.top);},{passive:false});
  let pd=null;
  box.addEventListener("pointerdown",e=>{if(e.button!==0)return;pd={x:e.clientX,y:e.clientY,l:box.scrollLeft,t:box.scrollTop,m:0,id:e.pointerId};});
  box.addEventListener("pointermove",e=>{if(!pd)return;const dx=e.clientX-pd.x,dy=e.clientY-pd.y;pd.m=Math.max(pd.m,Math.abs(dx)+Math.abs(dy));if(pd.m>5){if(!box.hasPointerCapture(pd.id))box.setPointerCapture(pd.id);box.classList.add("dragging");box.scrollLeft=pd.l-dx;box.scrollTop=pd.t-dy;}});
  const end=e=>{if(pd&&pd.m>5){const stop=ev=>{ev.stopPropagation();ev.preventDefault();};box.addEventListener("click",stop,{capture:true,once:true});}pd=null;box.classList.remove("dragging");};
  box.addEventListener("pointerup",end);box.addEventListener("pointercancel",end);
  document.getElementById("whz-in").onclick=()=>setZ(z*1.25);document.getElementById("whz-out").onclick=()=>setZ(z/1.25);document.getElementById("whz-reset").onclick=()=>setZ(1);
  const _render=render; render=function(){_render();const g=box.querySelector(".whh");if(g)g.style.zoom=z;};
  renderChips();render();setZ(1);window.WH_RENDER=()=>render();window.WH_DETAIL=id=>{if(window.HISTVIEW==="branch"){document.querySelector('#histsw [data-hv="grid"]').click();}const r=WH[id][2];if(only.size&&!only.has(r)){only.add(r);renderChips();render();}detail(id);const b=box.querySelector(`.whev[data-id="${id}"]`);if(b)b.scrollIntoView({block:"nearest",inline:"center"});};
})();

window.addEventListener("k-year",()=>{try{window.WH_RENDER&&window.WH_RENDER();}catch(e){}});
