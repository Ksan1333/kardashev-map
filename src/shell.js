/* ---------- 画面の枠：左のメニュー（PC）・下のタブ（スマホ）・時代のシート・詳細シート・全画面・ピンチ操作 ---------- */
(()=>{
  const $=id=>document.getElementById(id);
  const root=document.documentElement, body=document.body;
  const mqM=matchMedia("(max-width: 767px)");
  const isM=()=>mqM.matches;
  const IC={
    ov:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.3"/><ellipse cx="12" cy="12" rx="9.6" ry="4.3" transform="rotate(-24 12 12)"/><circle cx="20.2" cy="8.7" r="1.4" class="f"/></svg>',
    tl:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6H21M6.5 6c3.4 0 3 6 7 6H21M10.5 12c3 0 2.6 6 6 6H21"/><circle cx="3.6" cy="6" r="1.5" class="f"/></svg>',
    sp:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5.2"/><ellipse cx="12" cy="12" rx="10.3" ry="3.4" transform="rotate(-18 12 12)"/></svg>',
    tr:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-9M12 12 6.6 6.4M12 12l5.4-5.6M12 16.4 8.3 13.5M12 16.4l3.7-2.9"/><circle cx="6" cy="5.7" r="1.7"/><circle cx="18" cy="5.7" r="1.7"/></svg>',
    lw:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6" class="f"/><ellipse cx="12" cy="12" rx="9.6" ry="3.7"/><ellipse cx="12" cy="12" rx="9.6" ry="3.7" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.6" ry="3.7" transform="rotate(120 12 12)"/></svg>',
    bk:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.6C10 5.1 7 4.6 3.5 5.1v13.2c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5.1C17 4.6 14 5.1 12 6.6zM12 6.6v13.2"/></svg>',
    fs:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    fsx:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
  window.KICON=IC;

  // ---- 1) ページのメニュー（PCの左）と下のタブ（スマホ） ----
  const NAV=[
    {id:"overview",n:"01",t:"全体マップ",s:"12分野と文明タイプ",ic:"ov",tab:"全体"},
    {id:"timeline",n:"02",t:"年表",s:"宇宙・地球史・世界史",ic:"tl",tab:"年表",sub:[["tl:cosmos","宇宙"],["tl:earth","地球史"],["tl:hist","世界史"]]},
    {id:"space-map",n:"03",t:"宇宙・地球・ミクロ",s:"スケールを行き来する",ic:"sp",tab:"宇宙・地球",also:["world-map","micro"],sub:[["space-map","宇宙"],["world-map","世界地図"],["micro","ミクロ"]]},
    {id:"lineage",n:"04",t:"系統樹",s:"17分野・約1,600要素",ic:"tr",tab:"系統樹"},
    {id:"laws",n:"05",t:"宇宙の法則",s:"力・素粒子・元素",ic:"lw",tab:"法則"}];
  const TITLE={overview:"全体マップ",timeline:"年表","space-map":"宇宙と地球","world-map":"世界地図",micro:"ミクロの世界",lineage:"系統樹",laws:"宇宙の法則"};
  const groupOf=id=>NAV.find(v=>v.id===id||(v.also||[]).includes(id));
  const side=$("views"), tabbar=$("tabbar");
  side.innerHTML=NAV.map(v=>`<a class="sn" href="#${v.id}" data-v="${v.id}"><span class="sni">${IC[v.ic]}</span><span class="snt"><b>${v.t}</b><small>${v.s}</small></span><span class="snr">${v.tab}</span><span class="snn num">${v.n}</span></a>`+
    (v.sub?`<div class="snsub" data-for="${v.id}">${v.sub.map(([k,t])=>`<a href="#${k.startsWith("tl:")?"timeline":k}" data-sub="${k}">${t}</a>`).join("")}</div>`:"")).join("");
  tabbar.innerHTML=NAV.map(v=>`<a class="tb" href="#${v.id}" data-v="${v.id}">${IC[v.ic]}<span>${v.tab}</span></a>`).join("");
  // 地球大全は別の画面（earth.html）。PCは左のメニューの下、スマホは上のバーの📘から開く
  {const EU=window.EARTH_URL||"earth.html",N=window.EBIDX?EBIDX.c.length:0;
   side.insertAdjacentHTML("afterend",`<div class="sidebook"><span class="sbh">資料（別の画面）</span><a class="sn sn-book" href="${EU}" aria-label="地球大全を別の画面で開く"><span class="sni">${IC.bk}</span><span class="snt"><b>地球大全</b><small>この世のしくみ・全${N}章</small></span><span class="snr">地球大全</span><span class="snn" aria-hidden="true">↗</span></a></div>`);
   const tb=$("topbar");const sb=tb&&tb.querySelector('[data-act="search"]');if(sb)sb.insertAdjacentHTML("afterend",`<a class="ibtn" href="${EU}" aria-label="地球大全を開く（別の画面）" title="地球大全">${IC.bk}</a>`);}
  side.addEventListener("click",e=>{const a=e.target.closest("[data-sub^='tl:']");if(!a)return;e.preventDefault();const m=a.dataset.sub.slice(3);
    const go=()=>{window.TL_SET&&TL_SET(m);syncSub();};if(location.hash!=="#timeline"){location.hash="timeline";setTimeout(go,60);}else go();});
  let curView=null;
  function syncSub(){side.querySelectorAll("[data-sub]").forEach(a=>{const k=a.dataset.sub;const on=k.startsWith("tl:")?curView==="timeline"&&window.TLMODE===k.slice(3):curView===k;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});}
  function onView(id){const prev=curView;curView=id;const g=groupOf(id);
    document.querySelectorAll(".sn,.tb").forEach(a=>{const on=g&&a.dataset.v===g.id;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
    syncSub();document.title=`${TITLE[id]||"カルダシェフ文明マップ"}｜カルダシェフ文明マップ`;
    if(prev&&prev!==id){window.scrollTo(0,0);closeEra();if(fsEl&&!fsEl.closest("section.view.on"))toggleFs(fsEl,false);}
    requestAnimationFrame(()=>{syncSheets();centerActive(document.querySelector("section.view.on"));});}
  document.addEventListener("click",()=>requestAnimationFrame(syncSub));
  window.addEventListener("k-year",()=>requestAnimationFrame(syncSub));

  // ---- 2) 時代（PC＝上のバーと一覧／スマホ＝下から出るシート） ----
  const dock=$("eradock"), chip=$("erachip"), nowBtn=$("edNow"), scrim=$("scrim"), list=$("edList");
  function scrollListToCurrent(){const cur=list.querySelector(".edi.on");if(cur){const pop=$("edPop");pop.scrollTop=Math.max(0,cur.offsetTop-pop.clientHeight/2+cur.offsetHeight/2);}}
  function setPop(on){dock.classList.toggle("pop",on);nowBtn.setAttribute("aria-expanded",on);if(on)requestAnimationFrame(scrollListToCurrent);}
  function openEra(){if(isM()){dock.classList.add("open");scrim.hidden=false;body.classList.add("sheet-lock");chip.setAttribute("aria-expanded","true");requestAnimationFrame(()=>{scrollListToCurrent();$("track").focus({preventScroll:true});});}else{setPop(true);$("track").focus({preventScroll:true});}}
  function closeEra(){const was=dock.classList.contains("open");dock.classList.remove("open");scrim.hidden=true;body.classList.remove("sheet-lock");chip.setAttribute("aria-expanded","false");setPop(false);if(was)chip.focus({preventScroll:true});}
  chip.addEventListener("click",openEra);
  nowBtn.addEventListener("click",()=>{if(!isM())setPop(!dock.classList.contains("pop"));});
  $("edClose").addEventListener("click",closeEra);
  scrim.addEventListener("click",closeEra);
  document.addEventListener("pointerdown",e=>{if(dock.classList.contains("pop")&&!dock.contains(e.target))setPop(false);});
  window.addEventListener("k-picked",e=>{if(e.detail.from==="list"){if(isM())closeEra();else setPop(false);}});
  function flashEra(){const E=window.KERA;[chip,nowBtn].forEach(el=>{el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");});if(E&&window.KTOAST)KTOAST(`時代を「${E.when}・${E.name}」に切り替えました。`);}
  // 高さ（固定のバー）を CSS に渡す：見出しへ飛んだときに隠れないように
  function setSticky(){const h=isM()?$("topbar").offsetHeight:dock.offsetHeight;root.style.setProperty("--stickyH",h+"px");}
  new ResizeObserver(setSticky).observe(dock);new ResizeObserver(setSticky).observe($("topbar"));

  // ---- 3) 詳細パネル（全ページ共通）：PCは画面の右、スマホは画面の下から出る ----
  // 押したもの（出来事・国・要素など）の詳細は、ページに関係なく同じ場所・同じ見た目・同じ閉じ方にする
  const mqPush=matchMedia("(min-width: 1280px)");
  const PANELS=[
    {id:"gpanel",view:"lineage",title:"系統樹の要素",close:p=>p.querySelector("[data-close]"),prefer:p=>p.querySelector(".plate")?"full":"peek"},
    {id:"bgpanel",view:"timeline",title:"年表の出来事",close:p=>p.querySelector("[data-close]")},
    {id:"whpanel",view:"timeline",title:"年表の出来事",active:()=>!$("hist-grid").hidden&&!$("tlw-hist").hidden,close:p=>p.querySelector("[data-close]")},
    {id:"lpanel",view:"laws",title:"宇宙の法則",close:p=>p.querySelector("[data-close]")},
    {id:"info",view:"world-map",title:"国・場所",active:p=>p.classList.contains("detail-mode")&&!document.querySelector("#v-world-map .maprow").hidden,close:p=>p.querySelector("[data-back]")},
    {id:"pmpanel",view:"world-map",title:"地名",active:()=>!$("pmap").hidden,close:p=>p.querySelector("[data-close]")},
    {id:"spinfo",view:"space-map",title:"いま見ているスケール",always:true},
    {id:"mcinfo",view:"micro",title:"いま見ているもの",always:true}].map(o=>({...o,el:$(o.id)})).filter(o=>o.el);
  const ds=document.createElement("div");ds.className="dsheet";ds.id="dsheet";ds.hidden=true;ds.setAttribute("role","region");ds.setAttribute("aria-label","詳細");
  ds.innerHTML=`<div class="ds-bar"><button type="button" class="ds-grip" aria-label="パネルを広げる／たたむ"><i></i></button><b class="ds-title">詳細</b><button type="button" class="ds-x" aria-label="詳細を閉じる" title="閉じる（Esc）">${IC.x}</button></div><div class="ds-body"></div>`;
  body.appendChild(ds);
  const dsBody=ds.querySelector(".ds-body"),dsTitle=ds.querySelector(".ds-title");
  PANELS.forEach(p=>{p.mark=document.createComment("panel:"+p.id);p.el.before(p.mark);p.t=0;});
  let lastUser=0;["pointerup","keydown"].forEach(t=>window.addEventListener(t,()=>{lastUser=Date.now();},true));
  const userish=()=>Date.now()-lastUser<1500;
  // always：そのページにいる間は開いておくパネル（宇宙・ミクロの「いま見ているもの」）。× で閉じたら、次に自分で選ぶまで閉じたまま。
  // タブレットの幅（図に重ねて出す）では自動では開かず、「詳細」を押したときだけ開く（図と操作バーを隠さないため。閉じている間は図の下に出る）
  const isOpen=p=>curView===p.view&&(p.always?!p.dismissed&&(modeOf()!=="over"||p.pinned)&&p.el.childElementCount>0:!p.el.hidden&&(!p.active||p.active(p.el)));
  const modeOf=()=>isM()?"sheet":mqPush.matches?"push":"over";
  let inSheet=null;
  function sheetOpen(){return !ds.hidden;}
  function setState(s){ds.dataset.state=s;ds.querySelector(".ds-grip").setAttribute("aria-expanded",s==="full");}
  function syncSheets(changed){
    if(changed&&changed.always&&userish())changed.dismissed=false;
    const m=modeOf(),p=PANELS.filter(isOpen).sort((a,b)=>b.t-a.t)[0]||null;
    PANELS.forEach(q=>{if(q!==p&&q.el.parentNode===dsBody)q.mark.after(q.el);});
    if(p){const switched=inSheet!==p;if(p.el.parentNode!==dsBody)dsBody.appendChild(p.el);inSheet=p;ds.hidden=false;dsTitle.textContent=p.title;
      if(m==="sheet"){const fresh=ds.dataset.state!=="full"&&ds.dataset.state!=="peek";if(p.always){if(switched||fresh)setState("peek");}else if(changed===p||switched||fresh)setState(userish()?(p.prefer?p.prefer(p.el):"full"):"peek");}
      else setState("full");
      if(changed===p||switched)dsBody.scrollTop=0;}
    else{inSheet=null;ds.hidden=true;}
    body.classList.toggle("ds-on",!!p&&m==="sheet");body.classList.toggle("dock-on",!!p&&m!=="sheet");body.classList.toggle("dock-push",!!p&&m==="push");
    document.querySelectorAll("[data-dock]").forEach(b=>{const q=PANELS.find(x=>x.id===b.dataset.dock);b.setAttribute("aria-pressed",String(!!q&&isOpen(q)));});
  }
  const mo=new MutationObserver(recs=>{const seen=new Set();recs.forEach(r=>{const p=PANELS.find(q=>q.el===r.target||q.el.contains(r.target));if(p&&!seen.has(p)){seen.add(p);if(r.type==="childList"||!p.el.hidden)p.t=performance.now();}});
    let last=null;seen.forEach(p=>{if(!last||p.t>last.t)last=p;});syncSheets(last);});
  PANELS.forEach(p=>mo.observe(p.el,{attributes:true,attributeFilter:["hidden","class"],childList:true}));
  // ページの中の表示が切り替わったら（天体・年表・世界史の表示）、出していた詳細が今も有効か見直す
  {const wo=new MutationObserver(()=>syncSheets());[$("pmap"),$("hist-grid"),$("tlw-hist"),document.querySelector("#v-world-map .maprow")].forEach(el=>{if(el)wo.observe(el,{attributes:true,attributeFilter:["hidden"]});});}
  function closeSheet(){const p=inSheet;if(!p)return;if(p.always){p.dismissed=true;p.pinned=false;syncSheets();return;}const b=p.close&&p.close(p.el);if(b)b.click();else p.el.hidden=true;}
  ds.querySelector(".ds-x").addEventListener("click",closeSheet);
  ds.querySelector(".ds-grip").addEventListener("click",()=>{if(isM())setState(ds.dataset.state==="full"?"peek":"full");});
  // 図の操作バーの「詳細」ボタン（いつも開いておくパネルを開く／閉じる）
  document.addEventListener("click",e=>{const b=e.target.closest("[data-dock]");if(!b)return;const p=PANELS.find(x=>x.id===b.dataset.dock);if(!p)return;
    if(isOpen(p)){p.dismissed=true;p.pinned=false;syncSheets();}else{p.dismissed=false;p.pinned=true;p.t=performance.now();syncSheets(p);if(isM())setState("full");}});
  // スマホ：バーを上下にスワイプして広げる／たたむ
  {let sy=null;const bar=ds.querySelector(".ds-bar");
    bar.addEventListener("pointerdown",e=>{sy=isM()&&!e.target.closest(".ds-x")?e.clientY:null;});
    bar.addEventListener("pointerup",e=>{if(sy===null)return;const d=e.clientY-sy;sy=null;if(d>40){if(ds.dataset.state==="peek")closeSheet();else setState("peek");}else if(d<-40)setState("full");});
    bar.addEventListener("pointercancel",()=>{sy=null;});}
  // スマホ：たたんだ状態でパネルの中身を押したら広げる（リンクやボタンはそのまま動かす）
  dsBody.addEventListener("click",e=>{if(isM()&&ds.dataset.state==="peek"&&!e.target.closest("button,a,input,summary,canvas"))setState("full");});
  mqM.addEventListener("change",()=>{closeEra();syncSheets();setSticky();});
  mqPush.addEventListener("change",()=>syncSheets());

  // ---- 4) 図の枠（共通）：操作バーに全画面ボタン、3Dの −／＋ ----
  let fsEl=null;
  function initStage(st){if(!st||st._ui)return;st._ui=true;new ResizeObserver(()=>{if(st.clientWidth)st.style.setProperty("--stw",st.clientWidth+"px");}).observe(st);const tools=st.querySelector(":scope>.ui-bar>.ui-tools");
    if(st.dataset.fs!==undefined&&tools){const b=document.createElement("button");b.type="button";b.className="ui-fs";b.innerHTML=IC.fs;b.setAttribute("aria-label","全画面で表示");b.setAttribute("aria-pressed","false");b.title="全画面で表示（F キー）";
      b.addEventListener("click",e=>{e.stopPropagation();toggleFs(st);});tools.appendChild(b);st._fsb=b;}}
  const scanStages=root=>{if(!root||root.nodeType!==1)return;if(root.matches(".ui-stage"))initStage(root);root.querySelectorAll(".ui-stage").forEach(initStage);};
  scanStages(document.body);
  {const so=new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(scanStages)));["bg-cosmos","bg-earth","bg-hist","pmap"].forEach(id=>{const el=$(id);if(el)so.observe(el,{childList:true});});}
  function toggleFs(st,on){if(!st)return;on=on===undefined?!st.classList.contains("is-fs"):on;
    if(on){if(fsEl&&fsEl!==st)toggleFs(fsEl,false);fsEl=st;st.classList.add("is-fs");}else{st.classList.remove("is-fs");if(fsEl===st)fsEl=null;}
    body.classList.toggle("fs-on",!!fsEl);const b=st._fsb;if(b){b.innerHTML=on?IC.fsx:IC.fs;b.setAttribute("aria-label",on?"全画面を閉じる":"全画面で表示");b.title=on?"全画面を閉じる（Esc）":"全画面で表示（F キー）";b.setAttribute("aria-pressed",String(on));}
    requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));syncSheets();});}
  // −／＋：ホイールにだけ対応している図（3D）には、ホイールと同じ操作を送る
  document.addEventListener("click",e=>{const b=e.target.closest("[data-wheel-dir]");if(!b)return;const st=b.closest(".ui-stage");if(!st)return;
    const t=(st.dataset.wheel&&st.querySelector(st.dataset.wheel))||st.querySelector(".ui-fig");if(!t)return;const r=t.getBoundingClientRect();
    t.dispatchEvent(new WheelEvent("wheel",{deltaY:+b.dataset.wheelDir*240,clientX:r.left+r.width/2,clientY:r.top+r.height/2,bubbles:true,cancelable:true}));});
  function mainStage(){const v=document.querySelector("section.view.on");return v?[...v.querySelectorAll(".ui-stage[data-fs]")].find(s=>s.offsetParent)||null:null;}

  // ---- 5) ピンチで拡大（ホイールだけに対応していた3Dに、2本指の操作を足す） ----
  function pinch(el,k,step,sel){if(!el)return;const pts=new Map();let d0=0,acc=0,on=false;
    const tgt=()=>(sel?el.querySelector(sel):el.querySelector("canvas"))||el;
    el.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch")return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size>=2){on=true;d0=0;acc=0;e.stopImmediatePropagation();}},true);
    el.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!on)return;e.stopImmediatePropagation();e.preventDefault();if(pts.size<2)return;
      const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(!d0){d0=d;return;}const lr=Math.log(d/d0);d0=d;const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
      const fire=dy=>tgt().dispatchEvent(new WheelEvent("wheel",{deltaY:dy,clientX:cx,clientY:cy,bubbles:true,cancelable:true}));
      if(step){acc+=lr;const s=Math.log(step);while(Math.abs(acc)>=s){fire(acc>0?-100:100);acc-=Math.sign(acc)*s;}}else fire(-lr*k);},true);
    const up=e=>{pts.delete(e.pointerId);if(!pts.size)on=false;};el.addEventListener("pointerup",up,true);el.addEventListener("pointercancel",up,true);}
  pinch($("mcscene"),1/.0012);pinch($("scene"),1/.001);pinch($("thstage"),0,1.1);pinch($("pmap"),1/.0015,0,".pmbox");

  // ---- 6) 横に流れるチップ・切り替え：選んでいるものを見える位置へ ----
  const ROWS=".ui-filter>.chips,.ui-filter>.mclist,.ui-seg,.ui-opts,.ptlegend";
  function centerActive(scope){if(!scope)return;scope.querySelectorAll(ROWS).forEach(row=>{if(row.scrollWidth<=row.clientWidth+2)return;const a=row.querySelector('[aria-pressed="true"],[aria-selected="true"],.on');if(!a)return;row.scrollLeft=Math.max(0,a.offsetLeft-row.clientWidth/2+a.offsetWidth/2);});}
  document.addEventListener("click",e=>{const row=e.target.closest(ROWS);if(row)requestAnimationFrame(()=>centerActive(row.parentElement||row));});

  // ---- 7) キー操作：Esc で閉じる・F で全画面 ----
  window.addEventListener("keydown",e=>{
    const dlg=!$("sx")?.hidden||!$("hx")?.hidden;
    if(e.key==="Escape"&&!dlg){if(fsEl){e.preventDefault();toggleFs(fsEl,false);return;}if(dock.classList.contains("open")||dock.classList.contains("pop")){e.preventDefault();closeEra();return;}if(sheetOpen()){e.preventDefault();closeSheet();return;}}
    const t=e.target;if(dlg||e.ctrlKey||e.metaKey||e.altKey||(t&&(t.tagName==="INPUT"&&!["range","checkbox","radio","button"].includes(t.type)||t.tagName==="TEXTAREA"||t.isContentEditable)))return;
    if(e.key==="f"||e.key==="F"){const s=mainStage();if(s){e.preventDefault();toggleFs(s);}}
  });

  // 全体マップの「前の時代／時代を選ぶ／次の時代」
  document.addEventListener("click",e=>{const b=e.target.closest("[data-kstep]");if(!b)return;const d=+b.dataset.kstep;if(d)window.KSTEP&&KSTEP(d);else openEra();});

  window.KSHELL={onView,openEra,closeEra,flashEra,toggleFs,syncSheets,isMobile:isM};
  setSticky();
})();
