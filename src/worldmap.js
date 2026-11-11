/* ---------- ③ 世界地図（ズーム・国選択） ---------- */
(()=>{
  const svg=document.getElementById("world"), wrap=document.getElementById("mapbox"), side=document.getElementById("info"), loc=document.getElementById("locinfo"), tl=document.getElementById("daytl"), tlbox=document.getElementById("daybox");
  const W=MAP.W,H=MAP.H;
  const CL=COUNTRIES.list, byId={}, byC3={}; CL.forEach(c=>{if(c.id)byId[c.id]=c;byC3[c.c3]=c;});
  const RCOL={"アジア":"#3d4f7a","ヨーロッパ":"#3f5a6e","アフリカ":"#5a4f3a","南北アメリカ":"#4a3f66","オセアニア":"#3c5a52","南極":"#4b5466"};
  const TODN={m:"朝",n:"昼",e:"夕",x:"夜"}, WXN={clear:"晴れ",rain:"雨",snow:"雪"};
  const BIOME={tropical:"熱帯",desert:"乾燥帯（砂漠）",temperate:"温帯",boreal:"冷帯（亜寒帯）",arctic:"寒帯（極地）",mountain:"高山",island:"島しょ（熱帯の島）"};
  const BIOME_DAY={
    tropical:[["06:00","m","日の出とともに市場が開く。果物と魚が並ぶ"],["12:00","n","強い日差し。昼過ぎにはスコールが来ることが多い"],["17:00","e","涼しくなった通りに屋台が出る"],["21:00","x","高床の家や集合住宅で、虫の声を聞きながら眠る"]],
    desert:[["05:00","m","暑くなる前に一日が始まる"],["13:00","n","日中は40℃近く。人通りが消える"],["18:00","e","日が傾くと街に人が戻ってくる"],["22:00","x","夜は涼しく、遅い夕食と散歩"]],
    temperate:[["07:30","m","電車やバスで通勤・通学"],["12:30","n","オフィス街のランチ"],["18:00","e","帰宅ラッシュ。夕食の買い物"],["21:00","x","家で動画を見たりして過ごす"]],
    boreal:[["08:00","m","冬は朝でも暗い。暖房の効いた家から出勤"],["12:00","n","短い昼の光の中で外仕事"],["16:00","e","冬は午後早くに日が暮れる"],["20:00","x","サウナやストーブで体を温める"]],
    arctic:[["09:00","m","冬は一日中暗い極夜。夏は太陽が沈まない"],["12:00","n","雪上車や犬ぞりで移動"],["17:00","e","漁や狩りの獲物を分け合う"],["22:00","x","空にオーロラ"]],
    mountain:[["06:00","m","冷たい空気。家畜を放牧に出す"],["11:00","n","段々畑で農作業。日差しが強い"],["17:00","e","山の影が谷を覆い、急に冷える"],["20:00","x","家族で温かいスープの夕食"]],
    island:[["06:00","m","漁船が港に戻る"],["10:00","m","観光客がビーチへ"],["15:00","n","スコールのあと、また青空"],["19:00","e","海に沈む夕日を眺める"]],
  };
  // 状態
  let vb={x:0,y:0,w:W,h:H}, layers={country:true,landmark:true,tourism:false}, selC=null, selP=null, cats=new Set(Object.keys(CAT)), hover=null;
  // 描画（静的）
  const gC=`<g id="g-countries">${CL.filter(c=>c.has).map(c=>`<path class="ctry" data-c="${c.c3}" d="${COUNTRIES.shapes[c.id]}" fill="${RCOL[c.reg]||"#3a4466"}"/>`).join("")}</g>`;
  svg.innerHTML=`<defs><filter id="fogblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2"/></filter></defs><path class="sphere" d="${MAP.sphere}"/><path class="grat" d="${MAP.grat}"/>${gC}<g id="g-fog" filter="url(#fogblur)" pointer-events="none"></g><g id="g-small"></g><g id="g-labels"></g><g id="g-bubbles"></g><g id="g-pins"></g>`;
  const $=id=>svg.querySelector("#"+id);
  function k(){return W/vb.w;}
  function setVB(){svg.setAttribute("viewBox",`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);decorate();document.getElementById("mapzoom").textContent=`×${k().toFixed(1)}`;}
  function clampVB(){vb.w=Math.min(W,Math.max(W/40,vb.w));vb.h=vb.w*H/W;vb.x=Math.min(W-vb.w*.3,Math.max(-vb.w*.7,vb.x));vb.y=Math.min(H-vb.h*.3,Math.max(-vb.h*.7,vb.y));}
  // ズーム・パン
  let outAcc=0;
  let inAcc=0;
  function zoomAt(px,py,f){if(f>1&&vb.w<=W/40+.5){inAcc+=f-1;if(inAcc>.8&&window.toMicro){inAcc=0;window.toMicro();}return;}inAcc=0;if(f<1&&vb.w>=W-1){outAcc+=1-f;if(outAcc>.7&&window.toSpace){outAcc=0;window.toSpace();}return;}outAcc=0;const r=svg.getBoundingClientRect();const mx=vb.x+(px-r.left)/r.width*vb.w,my=vb.y+(py-r.top)/r.height*vb.h;
    vb.w/=f;vb.h=vb.w*H/W;clampVB();vb.x=mx-(px-r.left)/r.width*vb.w;vb.y=my-(py-r.top)/r.height*vb.h;clampVB();setVB();}
  wrap.addEventListener("wheel",e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)));},{passive:false});
  const ptr=new Map();let drag=null,moved=0,pinch=null;
  wrap.addEventListener("pointerdown",e=>{if(e.target.closest(".mapctl"))return;e.preventDefault();wrap.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptr.size===1){drag={x:e.clientX,y:e.clientY,vx:vb.x,vy:vb.y};moved=0;}else if(ptr.size===2){const [a,b]=[...ptr.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);drag=null;}});
  wrap.addEventListener("pointermove",e=>{
    if(!ptr.has(e.pointerId)){const t=e.target.closest(".ctry");if(t!==hover){hover?.classList.remove("hov");hover=t;t?.classList.add("hov");showTip(t,e);}else if(t)showTip(t,e);return;}
    ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptr.size===2){const [a,b]=[...ptr.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoomAt((a.x+b.x)/2,(a.y+b.y)/2,d/pinch);pinch=d;moved=99;return;}
    if(drag){const r=svg.getBoundingClientRect();const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));
      vb.x=drag.vx-dx/r.width*vb.w;vb.y=drag.vy-dy/r.height*vb.h;clampVB();setVB();wrap.classList.add("dragging");}});
  const up=e=>{if(!ptr.has(e.pointerId))return;ptr.delete(e.pointerId);if(ptr.size<2)pinch=null;wrap.classList.remove("dragging");
    if(drag&&moved<5&&e.type==="pointerup"){const el=document.elementFromPoint(e.clientX,e.clientY);
      const pin=el?.closest(".pin"), sm=el?.closest(".sm"), ct=el?.closest(".ctry");
      if(pin)pickPlace(pin.dataset.id); else if(sm)pickCountry(sm.dataset.c,false); else if(ct)pickCountry(ct.dataset.c,false);}
    drag=null;};
  wrap.addEventListener("pointerup",up);wrap.addEventListener("pointercancel",up);
  wrap.addEventListener("dblclick",e=>{if(e.target.closest(".mapctl"))return;zoomAt(e.clientX,e.clientY,2);});
  wrap.addEventListener("pointerleave",()=>{tip.hidden=true;hover?.classList.remove("hov");hover=null;});
  const tip=document.getElementById("maptip");
  function showTip(t,e){if(!t){tip.hidden=true;return;}const c=byC3[t.dataset.c];const r=wrap.getBoundingClientRect();tip.hidden=false;tip.textContent=`${c.flag} ${c.ja}`;tip.style.left=(e.clientX-r.left+12)+"px";tip.style.top=(e.clientY-r.top+12)+"px";}
  document.getElementById("mz-in").onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1.6);};
  document.getElementById("mz-out").onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1/1.6);};
  document.getElementById("mz-fit").onclick=()=>{vb={x:0,y:0,w:W,h:H};setVB();};
  document.getElementById("mz-space").onclick=()=>window.toSpace&&window.toSpace();document.getElementById("mz-micro").onclick=()=>window.toMicro&&window.toMicro();
  function flyTo(x,y,w){const s={...vb},e={x:x-w/2,y:y-w*H/W/2,w,h:w*H/W},t0=performance.now();
    const step=now=>{const t=Math.min(1,(now-t0)/450),q=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;vb={x:s.x+(e.x-s.x)*q,y:s.y+(e.y-s.y)*q,w:s.w+(e.w-s.w)*q,h:s.h+(e.h-s.h)*q};clampVB();setVB();if(t<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
  // ズームに応じた装飾（ピン・ラベル・小国の点）
  function decorate(){
    const z=k(), s=1/z;
    $("g-countries").style.display=layers.country?"":"none";
    // 小さな国・形のない国は点で
    $("g-small").innerHTML=layers.country?CL.filter(c=>(!c.has||c.area<1500)&&c.ind!==false).map(c=>`<circle class="sm${selC===c.c3?" sel":""}" data-c="${c.c3}" cx="${c.x}" cy="${c.y}" r="${(z>3?3:2.2)*s}"/>`).join(""):"";
    // 国名ラベル（ズームに応じて）
    const minArea=3e6/(z*z*z);
    $("g-labels").innerHTML=layers.country&&z>=1.6?CL.filter(c=>c.area>minArea&&c.x>vb.x&&c.x<vb.x+vb.w&&c.y>vb.y&&c.y<vb.y+vb.h).map(c=>`<text x="${c.x}" y="${c.y}" font-size="${9*s}" class="clab">${c.ja}</text>`).join(""):"";
    // ランドマーク
    $("g-pins").innerHTML=layers.landmark?MAP.pins.filter(p=>cats.has(p.cat)&&(window.PIN_YEAR?window.PIN_YEAR(p.id):-1e12)<=(typeof window.KYEAR==="number"?window.KYEAR:1e12)).map(p=>{const c=CAT[p.cat][1],on=p.id===selP;
      return `<g class="pin${on?" sel":""}" data-id="${p.id}"><circle class="o" cx="${p.x}" cy="${p.y}" r="${6.5*s}" fill="${c}"/><circle class="i" cx="${p.x}" cy="${p.y}" r="${3*s}" fill="${c}" stroke-width="${1.4*s}"/>${typeof WHC!=="undefined"&&WHC[p.id]?`<rect x="${p.x-1.5*s}" y="${p.y-1.5*s}" width="${3*s}" height="${3*s}" fill="none" stroke="#0a0f1f" stroke-width="${.9*s}" transform="rotate(45 ${p.x} ${p.y})" pointer-events="none"/>`:""}${on||z>=3?`<text x="${p.x+7*s}" y="${p.y-7*s}" font-size="${10*s}" stroke-width="${2.6*s}">${p.name}</text>`:""}</g>`;}).join(""):"";
    // 観光
    $("g-bubbles").innerHTML=layers.tourism?(()=>{const max=Math.max(...MAP.regions.map(r=>r.m));return MAP.regions.map(r=>{const rad=14+Math.sqrt(r.m/max)*62;
      return `<g class="bubble"><circle cx="${r.x}" cy="${r.y}" r="${rad}"/><text x="${r.x}" y="${r.y-3}">${r.name}</text><text class="n" x="${r.x}" y="${r.y+12}">${r.m}百万人</text></g>`;}).join("");})():"";
    svg.querySelectorAll(".ctry").forEach(p=>p.classList.toggle("sel",p.dataset.c===selC));
  }
  // コントロール
  const layerBox=document.getElementById("maplayers"), chipBox=document.getElementById("mapchips");
  function renderCtl(){
    layerBox.innerHTML=[["country","国境・国"],["landmark","ランドマーク"],["tourism","観光の流れ（2025年）"]].map(([k2,t])=>`<button class="chip" aria-pressed="${layers[k2]}" data-l="${k2}">${t}</button>`).join("");
    chipBox.style.display=layers.landmark?"flex":"none";
    const ALL=cats.size===Object.keys(CAT).length;chipBox.innerHTML=`<button class="chip" data-c="__all" aria-pressed="${ALL}">すべて</button>`+Object.entries(CAT).map(([k2,[t,c]])=>`<button class="chip" aria-pressed="${!ALL&&cats.has(k2)}" data-c="${k2}"><span class="dot" style="background:${c}"></span>${t}</button>`).join("");
  }
  layerBox.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;layers[b.dataset.l]=!layers[b.dataset.l];renderCtl();decorate();});
  chipBox.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const c=b.dataset.c,all=Object.keys(CAT);if(c==="__all")cats=new Set(all);else if(cats.size===all.length)cats=new Set([c]);else{cats.has(c)?cats.delete(c):cats.add(c);if(!cats.size)cats=new Set(all);}renderCtl();decorate();});
  // 国の検索リスト
  const q=document.getElementById("csearch"), clist=document.getElementById("clist"), ccount=document.getElementById("ccount");
  const regs=["アジア","ヨーロッパ","アフリカ","南北アメリカ","オセアニア","南極"];
  function renderList(){const s=q.value.trim().toLowerCase();
    const items=CL.filter(c=>!s||c.ja.toLowerCase().includes(s)||c.en.toLowerCase().includes(s)||c.cap.toLowerCase().includes(s)).sort((a,b)=>a.ja.localeCompare(b.ja,"ja"));
    clist.innerHTML=(s?items:null)?items.map(li).join(""):regs.map(r=>{const it=items.filter(c=>c.reg===r);return it.length?`<li class="cgrp">${r}（${it.length}）</li>`+it.map(li).join(""):"";}).join("");
    ccount.textContent=`${CL.length}の国・地域`;}
  const li=c=>`<li><button data-c="${c.c3}" class="${c.c3===selC?"sel":""}">${c.flag} ${c.ja}${c.ind===false?'<small>（地域）</small>':""}</button></li>`;
  q.addEventListener("input",renderList);
  clist.addEventListener("click",e=>{const b=e.target.closest("button[data-c]");if(b)pickCountry(b.dataset.c,true);});
  // 選択
  const fmtN=n=>n>=1e8?(n/1e8).toFixed(n>=1e9?1:2).replace(/\.0+$/,"")+"億":n>=1e4?Math.round(n/1e4).toLocaleString()+"万":n.toLocaleString();
  const fmtG=b=>b>=1000?(b/1000).toFixed(2)+"兆ドル":b>=1?Math.round(b*10).toLocaleString()+"億ドル":(b*1000).toFixed(0)+"百万ドル";
  function pickCountry(c3,fly){
    const c=byC3[c3];if(!c)return; selC=c3; selP=null;
    if(fly){const p=svg.querySelector(`.ctry[data-c="${c3}"]`);let x=c.x,y=c.y,w=60;if(p){const bb=p.getBBox();if(bb.width<W*.6){x=bb.x+bb.width/2;y=bb.y+bb.height/2;w=Math.max(bb.width,bb.height*W/H)*1.8;}}
      w=Math.min(W,Math.max(25,w));flyTo(x,y,w);} else decorate();
    const pop=c.pop?c.pop[1]:null, dens=pop&&c.area?Math.round(pop/c.area):null, gpc=c.gdp&&pop?Math.round(c.gdp[1]*1e9/pop):null;
    const lm=MAP.pins.filter(p=>{const d=Math.hypot(p.lon-c.ll[1],p.lat-c.ll[0]);return d<Math.max(4,Math.sqrt(c.area)/90);});
    const wq=encodeURIComponent(c.ja);
    side.innerHTML=`<div class="cflag">${c.flag}</div><h3>${c.ja}</h3><div class="cen">${c.en}${c.ind===false?"（独立国ではない地域）":""}</div>
      <dl class="cdl">
        <dt>地域</dt><dd>${c.reg}・${c.sub}</dd>
        <dt>首都</dt><dd>${c.cap||"—"}</dd>
        <dt>人口</dt><dd>${pop?fmtN(pop)+"人<small>（"+c.pop[0]+"年）</small>":"データなし"}</dd>
        <dt>面積</dt><dd>${c.area?c.area.toLocaleString()+" km²":"—"}</dd>
        <dt>人口密度</dt><dd>${dens!=null?dens.toLocaleString()+" 人/km²":"—"}</dd>
        <dt>GDP</dt><dd>${c.gdp?fmtG(c.gdp[1])+"<small>（"+c.gdp[0]+"年）</small>":"データなし"}</dd>
        <dt>1人あたりGDP</dt><dd>${gpc?gpc.toLocaleString()+" ドル":"—"}</dd>
        <dt>言語</dt><dd>${c.lang.join("、")||"—"}</dd>
        <dt>通貨</dt><dd>${c.cur.join("、")||"—"}</dd>
        <dt>国境を接する国</dt><dd>${c.land?"内陸国・":""}${c.nb}か国</dd>
        <dt>国連加盟</dt><dd>${c.un?"加盟":"非加盟"}</dd>
        <dt>気候帯（3Dの風景）</dt><dd>${BIOME[c.biome]}</dd>
      </dl>
      ${lm.length?`<h4>この国の主なランドマーク</h4><div class="lineage">${lm.map(p=>`<button data-p="${p.id}">${p.name}</button>`).join("")}</div>`:""}
      <h4>外部サイト</h4><div class="photo"><a href="https://ja.wikipedia.org/wiki/${wq}" target="_blank" rel="noopener">Wikipedia</a><a href="https://www.google.com/search?tbm=isch&q=${wq}+風景" target="_blank" rel="noopener">写真を検索</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.cap||c.en)}" target="_blank" rel="noopener">Googleマップ</a></div>
      <button class="chip backlist" data-back="1">← 国の一覧に戻る</button>`;
    side.classList.add("detail-mode");
    renderLocCountry(c); renderList();
  }
  function pickPlace(id){
    selP=id; const p=MAP.pins.find(x=>x.id===id); selC=null; decorate();
    const d=PLACES[id],[ct,cc]=CAT[p.cat]; const q2=encodeURIComponent(p.name.replace(/（.*?）/g,""));
    side.innerHTML=`<span class="cat"><span class="dot" style="background:${cc};width:9px;height:9px;border-radius:50%;display:inline-block"></span> ${ct}</span><h3>${p.name}</h3><p>${p.desc}</p>
      ${typeof whcCard==="function"?whcCard(id,p):""}<h4>特色</h4><ul>${d.feat.map(f=>`<li>${f}</li>`).join("")}</ul><h4>気候</h4><p class="clim">${d.climate}</p>
      <h4>外部サイト</h4><div class="photo"><a href="https://www.google.com/search?tbm=isch&q=${q2}" target="_blank" rel="noopener">写真を検索</a><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}" target="_blank" rel="noopener">Googleマップ（ストリートビュー）</a><a href="https://ja.wikipedia.org/w/index.php?search=${q2}" target="_blank" rel="noopener">Wikipedia</a></div>
      <button class="chip backlist" data-back="1">← 国の一覧に戻る</button>`;
    side.classList.add("detail-mode");
    document.getElementById("locname").textContent=p.name;
    document.getElementById("locsub").textContent="ランドマークの風景";
    loc.innerHTML=`<p>${p.desc}</p><p class="clim" style="margin-top:6px">${d.climate}</p>`;
    tl.innerHTML=d.day.map(dayItem).join(""); tlbox.hidden=false;
    if(threeOK){S3D.load({id},d.scene);ctl();}
  }
  side.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.back){side.classList.remove("detail-mode");side.innerHTML="";side.append(listPanel);renderList();}
    if(b.dataset.p)pickPlace(b.dataset.p);});
  const dayItem=([t,k2,txt])=>`<button class="tlitem ${threeOK&&S3D.tod===k2?"on":""}" data-k="${k2}"><span class="time num">${t}</span><span class="tod tod-${k2}">${TODN[k2]}</span><span class="txt">${txt}</span></button>`;
  function renderLocCountry(c){
    document.getElementById("locname").textContent=`${c.flag} ${c.ja}`;
    document.getElementById("locsub").textContent=`${BIOME[c.biome]}の一般的な風景（この国の実際の景観の再現ではありません）`;
    loc.innerHTML=`<p>${c.reg}・${c.sub}。首都は${c.cap||"—"}。</p>`;
    tl.innerHTML=BIOME_DAY[c.biome].map(dayItem).join(""); tlbox.hidden=false;
    if(threeOK){S3D.load({id:"country",country:c},"biome");ctl();}
  }

  // 時代のもや
  const paleoBox=document.createElement("div");paleoBox.className="mappaleo";paleoBox.hidden=true;wrap.appendChild(paleoBox);
  function renderFog(){const Y=typeof window.KYEAR==="number"?window.KYEAR:1e12;
    $("g-fog").innerHTML=Y>=2026||!window.ERA_FOG?"":CL.filter(c=>c.has).map(c=>{const st=window.ERA_FOG(c,Y);return st?`<path d="${COUNTRIES.shapes[c.id]}" fill="${st===2?"#0a0f1f":"#d9def0"}" opacity="${st===2?.93:.4}"/>`:"";}).join("");
    if(Y< -1e6){paleoBox.hidden=false;
      if(Y< -4.54e9)paleoBox.innerHTML=`<div class="mpin"><b>${window.KERA?window.KERA.when:""}</b><p>地球はまだ存在しません。「宇宙と地球」の宇宙マップや年表の「宇宙」で、この時代の宇宙を見られます。</p></div>`;
      else{const ma=-Y/1e6;const c=document.createElement("canvas");if(typeof PALEO!=="undefined")PALEO.render(Math.min(ma,1800),c,Y< -3.2e9?[22,64,110]:[29,74,120],null,Y< -4.7e8?(r,g,b)=>{const l=(r+g+b)/3;return [l*.9+60,l*.6+40,l*.4+25];}:null);
        paleoBox.innerHTML=`<div class="mpin"><b>${window.KERA?window.KERA.when+"「"+window.KERA.name+"」":""}の地球</b><p>${Y< -3.2e9?"大陸はまだほとんどなく、海に覆われた惑星。":"大陸の配置："+PALEO.label(ma)+(ma<=540?"（PALEOMAP：Scotese 2016）":"（推定）")}　国境や地名はまだありません。スライダーを人類の時代に戻すと現在の地図に戻ります。</p></div>`;paleoBox.prepend(c);}}
    else paleoBox.hidden=true;}
  window.addEventListener("k-year",()=>{renderFog();decorate();});
  renderFog();
  // 3D
  const sceneEl=document.getElementById("scene"); let threeOK=false;
  if(typeof S3D!=="undefined"&&S3D){try{S3D.init(sceneEl);threeOK=true;}catch(e){console.error(e);}}
  if(!threeOK) sceneEl.innerHTML=`<div class="noscene">3D表示を読み込めませんでした（WebGLが使えない環境、または外部ライブラリが遮断されている可能性があります）。</div>`;
  function ctl(){
    document.getElementById("todbtns").innerHTML=Object.entries(TODN).map(([k2,t])=>`<button class="chip" aria-pressed="${S3D.tod===k2}" data-tod="${k2}">${t}</button>`).join("");
    document.getElementById("wxbtns").innerHTML=Object.entries(WXN).map(([k2,t])=>`<button class="chip" aria-pressed="${S3D.wx===k2}" data-wx="${k2}">${t}</button>`).join("");
    tl.querySelectorAll(".tlitem").forEach(b=>b.classList.toggle("on",b.dataset.k===S3D.tod));
  }
  document.getElementById("scenectl").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!threeOK)return;
    if(b.dataset.tod)S3D.setTod(b.dataset.tod);if(b.dataset.wx)S3D.setWeather(b.dataset.wx);if(b.dataset.reset)S3D.resetCam();ctl();});
  tl.addEventListener("click",e=>{const b=e.target.closest(".tlitem");if(!b||!threeOK)return;S3D.setTod(b.dataset.k);ctl();});
  window.addEventListener("hashchange",sync);function sync(){if(!threeOK)return;(location.hash==="#world-map")?S3D.start():S3D.stop();}
  // 初期化
  const listPanel=document.getElementById("clistpanel");
  renderCtl(); renderList(); setVB(); pickPlace("tokyo"); side.classList.remove("detail-mode"); side.innerHTML=""; side.append(listPanel); sync();
  window.MAP_PICK_COUNTRY=c3=>pickCountry(c3,true);window.MAP_PICK_PLACE=id=>pickPlace(id);
})();
