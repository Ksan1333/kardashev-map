/* ---------- 世界地図のページ：地球以外の天体の地図 ---------- */
(()=>{const sec=document.getElementById("v-world-map");const bar=document.getElementById("bodysel"),pm=document.getElementById("pmap");if(!sec||!bar||!pm||typeof SPZ==="undefined"||!SPZ)return;
  const ORDER=[["earth","🌏 地球"],["moon","月"],["mercury","水星"],["venus","金星"],["mars","火星"],["jupiter","木星"],["saturn","土星"],["uranus","天王星"],["neptune","海王星"],["pluto","冥王星"],["sun","太陽"]];
  const earthEls=[document.getElementById("maplayers"),document.getElementById("mapchips"),sec.querySelector(".maprow"),document.getElementById("locsec")];
  let cur="earth",z={s:1,x:0,y:0},sel=null;
  const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  function drawBar(){bar.innerHTML=ORDER.map(([k,n])=>`<button class="chip" data-b="${k}" aria-pressed="${k===cur}">${n}</button>`).join("");}
  function show(k){cur=k;drawBar();const earth=k==="earth";earthEls.forEach(e=>{if(e)e.hidden=!earth;});pm.hidden=earth;if(!earth)render(k);}
  function apply(){const inn=document.getElementById("pmin"),box=document.getElementById("pmbox");if(!inn||!box)return;const W=box.clientWidth,H=box.clientHeight,w=W*z.s,h=w/2;
    z.x=Math.min(0,Math.max(W-w,z.x));z.y=h<H?(H-h)/2:Math.min(0,Math.max(H-h,z.y));inn.style.width=w+"px";inn.style.height=h+"px";inn.style.transform=`translate(${z.x}px,${z.y}px)`;}
  function zoomAt(f,cx,cy){const box=document.getElementById("pmbox");const ns=Math.min(12,Math.max(1,z.s*f));const k=ns/z.s;z.x=cx-(cx-z.x)*k;z.y=cy-(cy-z.y)*k;z.s=ns;apply();}
  function pick(id){const B=SPZ.BODY[cur];const f=(B.feat||[]).find(x=>x[0]===id);sel=id;pm.querySelectorAll(".pmpin").forEach(p=>p.classList.toggle("on",p.dataset.f===id));pm.querySelectorAll(".pmlist li").forEach(l=>l.classList.toggle("on",l.dataset.f===id));
    const d=document.getElementById("pmdet");if(d&&f)d.innerHTML=`<h4>${esc(f[1])}</h4><div class="num">${Math.abs(f[2])}°${f[2]<0?"S":"N"} ${Math.abs(f[3])}°${f[3]<0?"W":"E"}</div><p>${esc(f[4])}</p>`;}
  function render(k){const B=SPZ.BODY[k];if(!B)return;z={s:1,x:0,y:0};sel=null;const url=SPZ.planetMapURL(k);let grid="";for(let lo=-150;lo<=150;lo+=30)grid+=`<line x1="${lo+180}" y1="0" x2="${lo+180}" y2="180"/>`;for(let la=-60;la<=60;la+=30)grid+=`<line x1="0" y1="${90-la}" x2="360" y2="${90-la}"${la===0?' class="eq"':""}/>`;
    const pins=(B.feat||[]).map(([id,nm,la,lo])=>`<button class="pmpin" data-f="${id}" style="left:${(lo+180)/360*100}%;top:${(90-la)/180*100}%"><i></i><span>${esc(nm)}</span></button>`).join("");
    pm.innerHTML=`<div class="pmhead"><h3>${esc(B.name)}の地図</h3><span>半径 ${esc(B.R)}・正距円筒図法（横：経度 −180°〜180°、縦：緯度 −90°〜90°）。ホイール・ピンチでズーム、ドラッグで移動。</span></div>
      <div class="pmrow"><div class="pmbox" id="pmbox"><div class="pmin" id="pmin"><img src="${url}" alt="${esc(B.name)}の地図" draggable="false"><svg viewBox="0 0 360 180" preserveAspectRatio="none" aria-hidden="true">${grid}</svg>${pins}</div>
        <div class="mapctl"><button data-z="in">＋</button><button data-z="out">−</button><button data-z="fit">全体</button><button data-z="space">🚀 宇宙で見る</button><button data-z="cut">🔍 中（断面）</button></div></div>
      <aside class="panel pminfo"><p>${esc(B.desc)}</p><div id="pmdet" class="pmdet"><p class="dayhint">地名を押すと説明が出ます</p></div><h4>主な地名（${(B.feat||[]).length}）</h4><ul class="pmlist">${(B.feat||[]).map(([id,nm,la,lo])=>`<li data-f="${id}">${esc(nm)}<small>${Math.abs(la)}°${la<0?"S":"N"} ${Math.abs(lo)}°${lo<0?"W":"E"}</small></li>`).join("")}</ul><p class="note">主な地名の位置は実際の緯度・経度。細かい模様は再現した想像図です。</p></aside></div>`;
    requestAnimationFrame(apply);const box=document.getElementById("pmbox");
    box.addEventListener("wheel",e=>{e.preventDefault();const r=box.getBoundingClientRect();zoomAt(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top);},{passive:false});
    let dr=null;box.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;dr={x:e.clientX,y:e.clientY,ox:z.x,oy:z.y};box.setPointerCapture(e.pointerId);});
    box.addEventListener("pointermove",e=>{if(!dr)return;z.x=dr.ox+e.clientX-dr.x;z.y=dr.oy+e.clientY-dr.y;apply();});box.addEventListener("pointerup",()=>dr=null);}
  pm.addEventListener("click",e=>{const p=e.target.closest(".pmpin,.pmlist li");if(p){pick(p.dataset.f);return;}const b=e.target.closest("[data-z]");if(!b)return;const box=document.getElementById("pmbox");const W=box.clientWidth,H=box.clientHeight;
    if(b.dataset.z==="in")zoomAt(1.6,W/2,H/2);if(b.dataset.z==="out")zoomAt(1/1.6,W/2,H/2);if(b.dataset.z==="fit"){z={s:1,x:0,y:0};apply();}
    if(b.dataset.z==="space"){location.hash="space-map";setTimeout(()=>SPZ.goId(cur==="moon"?"em":"solar",cur),400);}
    if(b.dataset.z==="cut"){window.SPZ_MAP=false;location.hash="space-map";setTimeout(()=>SPZ.goBr("in_"+cur),400);}});
  bar.addEventListener("click",e=>{const b=e.target.closest("[data-b]");if(b)show(b.dataset.b);});
  window.addEventListener("resize",()=>{if(cur!=="earth")apply();});
  window.toPlanetMap=(k,fid)=>{const v=document.getElementById("veil");if(v){v.textContent="地図へ移動中…";v.classList.add("on");}setTimeout(()=>{location.hash="world-map";setTimeout(()=>{show(k);if(fid)pick(fid);document.getElementById("bodysel").scrollIntoView({block:"start"});v&&v.classList.remove("on");},120);},350);};
  window.addEventListener("spz-earth",()=>show("earth"));
  drawBar();
})();
