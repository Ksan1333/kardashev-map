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
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    down:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>'};
  window.KICON=IC;

  // ---- 1) ページのメニュー（PCの左）と下のタブ（スマホ） ----
  const NAV=[
    {id:"overview",n:"01",t:"全体マップ",s:"12分野と文明タイプ",ic:"ov",tab:"全体"},
    {id:"timeline",n:"02",t:"年表",s:"宇宙・地球史・世界史",ic:"tl",tab:"年表",sub:[["tl:cosmos","宇宙"],["tl:earth","地球史"],["tl:hist","世界史"]]},
    {id:"space-map",n:"03",t:"宇宙・地球・ミクロ",s:"スケールを行き来する",ic:"sp",tab:"宇宙・地球",also:["world-map","micro"],sub:[["space-map","宇宙"],["world-map","世界地図"],["micro","ミクロ"]]},
    {id:"lineage",n:"04",t:"系統樹",s:"17分野・約1,600要素",ic:"tr",tab:"系統樹"},
    {id:"laws",n:"05",t:"宇宙の法則",s:"力・素粒子・元素",ic:"lw",tab:"法則"},
    {id:"earth-book",n:"06",t:"地球大全",s:"宇宙人のための地球ガイド",ic:"bk",tab:"地球大全"}];
  const TITLE={overview:"全体マップ",timeline:"年表","space-map":"宇宙と地球","world-map":"世界地図",micro:"ミクロの世界",lineage:"系統樹",laws:"宇宙の法則","earth-book":"地球大全"};
  const groupOf=id=>NAV.find(v=>v.id===id||(v.also||[]).includes(id));
  const side=$("views"), tabbar=$("tabbar");
  side.innerHTML=NAV.map(v=>`<a class="sn" href="#${v.id}" data-v="${v.id}"><span class="sni">${IC[v.ic]}</span><span class="snt"><b>${v.t}</b><small>${v.s}</small></span><span class="snr">${v.tab}</span><span class="snn num">${v.n}</span></a>`+
    (v.sub?`<div class="snsub" data-for="${v.id}">${v.sub.map(([k,t])=>`<a href="#${k.startsWith("tl:")?"timeline":k}" data-sub="${k}">${t}</a>`).join("")}</div>`:"")).join("");
  tabbar.innerHTML=NAV.map(v=>`<a class="tb" href="#${v.id}" data-v="${v.id}">${IC[v.ic]}<span>${v.tab}</span></a>`).join("");
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

  // ---- 3) 詳細パネル：スマホでは画面の下から出るシートに、PCでは画面外なら「詳細を見る」を出す ----
  const PANELS=[
    {id:"gpanel",view:"lineage",close:p=>p.querySelector("[data-close]"),prefer:p=>p.querySelector(".plate")?"full":"peek"},
    {id:"bgpanel",view:"timeline",close:p=>p.querySelector("[data-close]")},
    {id:"whpanel",view:"timeline",close:p=>p.querySelector("[data-close]")},
    {id:"lpanel",view:"laws",close:p=>p.querySelector("[data-close]")},
    {id:"info",view:"world-map",active:p=>p.classList.contains("detail-mode"),close:p=>p.querySelector("[data-back]")}].map(o=>({...o,el:$(o.id)})).filter(o=>o.el);
  const ds=document.createElement("div");ds.className="dsheet";ds.id="dsheet";ds.hidden=true;ds.setAttribute("role","region");ds.setAttribute("aria-label","詳細");
  ds.innerHTML=`<div class="ds-bar"><button type="button" class="ds-grip" aria-label="パネルを広げる／たたむ"><i></i></button><button type="button" class="ds-x" aria-label="閉じる">${IC.x}</button></div><div class="ds-body"></div>`;
  body.appendChild(ds);
  const dsBody=ds.querySelector(".ds-body");
  PANELS.forEach(p=>{p.mark=document.createComment("panel:"+p.id);p.el.before(p.mark);p.t=0;});
  let lastUser=0;["pointerup","keydown"].forEach(t=>window.addEventListener(t,()=>{lastUser=Date.now();},true));
  const userish=()=>Date.now()-lastUser<1500;
  const isOpen=p=>!p.el.hidden&&(!p.active||p.active(p.el))&&curView===p.view;
  let inSheet=null;
  function sheetOpen(){return !ds.hidden;}
  function setState(s){ds.dataset.state=s;ds.querySelector(".ds-grip").setAttribute("aria-expanded",s==="full");}
  const pill=document.createElement("button");pill.type="button";pill.className="jumppill";pill.hidden=true;pill.innerHTML=`${IC.down}<span>下に詳細を表示しました</span>`;body.appendChild(pill);
  let pillFor=null,pillT=0;
  pill.addEventListener("click",()=>{if(pillFor)pillFor.scrollIntoView({behavior:"smooth",block:"start"});pill.hidden=true;});
  function syncSheets(changed){
    const open=PANELS.filter(isOpen).sort((a,b)=>b.t-a.t);
    if(isM()){
      const p=open[0]||null;
      PANELS.forEach(q=>{if(q!==p&&q.el.parentNode===dsBody)q.mark.after(q.el);});
      if(p){if(p.el.parentNode!==dsBody){dsBody.appendChild(p.el);}inSheet=p;ds.hidden=false;body.classList.add("ds-on");
        if(changed===p||!ds.dataset.state){const want=userish()?(p.prefer?p.prefer(p.el):"full"):"peek";setState(want);dsBody.scrollTop=0;}}
      else{inSheet=null;ds.hidden=true;body.classList.remove("ds-on");}
      pill.hidden=true;
    }else{
      PANELS.forEach(q=>{if(q.el.parentNode===dsBody)q.mark.after(q.el);});inSheet=null;ds.hidden=true;body.classList.remove("ds-on");
      if(changed&&isOpen(changed)&&userish()){const r=changed.el.getBoundingClientRect();if(r.top>innerHeight-90||r.bottom<0){pillFor=changed.el;pill.hidden=false;clearTimeout(pillT);pillT=setTimeout(()=>pill.hidden=true,6000);}}
    }
  }
  const mo=new MutationObserver(recs=>{const seen=new Set();recs.forEach(r=>{const p=PANELS.find(q=>q.el===r.target||q.el.contains(r.target));if(p&&!seen.has(p)){seen.add(p);if(r.type==="childList"||!p.el.hidden)p.t=performance.now();}});
    let last=null;seen.forEach(p=>{if(!last||p.t>last.t)last=p;});syncSheets(last);});
  PANELS.forEach(p=>mo.observe(p.el,{attributes:true,attributeFilter:["hidden","class"],childList:true}));
  ds.querySelector(".ds-grip").addEventListener("click",()=>setState(ds.dataset.state==="full"?"peek":"full"));
  ds.querySelector(".ds-x").addEventListener("click",()=>{if(!inSheet)return;const b=inSheet.close(inSheet.el);if(b)b.click();else inSheet.el.hidden=true;});
  // バーを上下にスワイプして広げる／たたむ
  {let sy=null;const bar=ds.querySelector(".ds-bar");
    bar.addEventListener("pointerdown",e=>{sy=e.clientY;});
    bar.addEventListener("pointerup",e=>{if(sy===null)return;const d=e.clientY-sy;sy=null;if(d>40){if(ds.dataset.state==="peek")ds.querySelector(".ds-x").click();else setState("peek");}else if(d<-40)setState("full");});
    bar.addEventListener("pointercancel",()=>{sy=null;});}
  // たたんだ状態でパネルの中身を押したら広げる（リンクやボタンはそのまま動かす）
  dsBody.addEventListener("click",e=>{if(ds.dataset.state==="peek"&&!e.target.closest("button,a,input,summary,canvas"))setState("full");});
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting&&en.target===pillFor)pill.hidden=true;});},{threshold:.15});
  PANELS.forEach(p=>io.observe(p.el));
  mqM.addEventListener("change",()=>{closeEra();syncSheets();setSticky();});

  // ---- 4) 全画面（図・地図・3Dを画面いっぱいに） ----
  let fsEl=null;
  function addFs(box,into){if(!box||box._fs)return;box._fs=true;const b=document.createElement("button");b.type="button";b.className="fsbtn";b.innerHTML=IC.fs;b.setAttribute("aria-label","全画面で表示");b.title="全画面で表示（F キー）";
    (into||box).appendChild(b);b.addEventListener("pointerdown",e=>e.stopPropagation());b.addEventListener("click",e=>{e.stopPropagation();toggleFs(box);});box._fsb=b;}
  function toggleFs(box,on){on=on===undefined?!box.classList.contains("is-fs"):on;
    if(on){if(fsEl&&fsEl!==box)toggleFs(fsEl,false);fsEl=box;box.classList.add("is-fs");}else{box.classList.remove("is-fs");if(fsEl===box)fsEl=null;}
    body.classList.toggle("fs-on",!!fsEl);const b=box._fsb;if(b){b.innerHTML=on?IC.fsx:IC.fs;b.setAttribute("aria-label",on?"全画面を閉じる":"全画面で表示");b.title=on?"全画面を閉じる（Esc）":"全画面で表示（F キー）";b.classList.toggle("on",on);}
    requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));syncSheets();});}
  addFs($("gcanvas"));addFs($("spscene"));addFs($("mcscene"));addFs($("mapbox"));addFs(document.querySelector(".thwrap"));addFs(document.querySelector(".loc3d"));
  const hookBranch=el=>{const w=el.matches&&el.matches(".bgwrap")?el:null;if(w)addFs(w,w.querySelector(".bgtools"));};
  document.querySelectorAll(".bgwrap").forEach(hookBranch);
  new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){hookBranch(n);n.querySelectorAll&&n.querySelectorAll(".bgwrap").forEach(hookBranch);}}))).observe($("v-timeline"),{childList:true,subtree:true});
  function mainCanvas(){const v=document.querySelector("section.view.on");if(!v)return null;
    return {lineage:$("gcanvas"),"space-map":$("spscene"),micro:$("mcscene"),"world-map":$("mapbox")}[curView]||[...v.querySelectorAll(".bgwrap")].find(w=>w.offsetParent)||null;}

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
  const ROWS="#gchips,#maplayers,#mapchips,#bodysel,#tlregions,#thview,#thspeed,#thjumps,.tlswitch,.histsw,.ctabs,.ptlegend";
  function centerActive(scope){if(!scope)return;scope.querySelectorAll(ROWS).forEach(row=>{if(row.scrollWidth<=row.clientWidth+2)return;const a=row.querySelector('[aria-pressed="true"],[aria-selected="true"],.on');if(!a)return;row.scrollLeft=Math.max(0,a.offsetLeft-row.clientWidth/2+a.offsetWidth/2);});}
  document.addEventListener("click",e=>{const row=e.target.closest(ROWS);if(row)requestAnimationFrame(()=>centerActive(row.parentElement||row));});

  // ---- 7) キー操作：Esc で閉じる・F で全画面 ----
  window.addEventListener("keydown",e=>{
    const dlg=!$("sx")?.hidden||!$("hx")?.hidden;
    if(e.key==="Escape"&&!dlg){if(fsEl){e.preventDefault();toggleFs(fsEl,false);return;}if(dock.classList.contains("open")||dock.classList.contains("pop")){e.preventDefault();closeEra();return;}if(isM()&&sheetOpen()){e.preventDefault();ds.querySelector(".ds-x").click();return;}}
    const t=e.target;if(dlg||e.ctrlKey||e.metaKey||e.altKey||(t&&(t.tagName==="INPUT"&&!["range","checkbox","radio","button"].includes(t.type)||t.tagName==="TEXTAREA"||t.isContentEditable)))return;
    if(e.key==="f"||e.key==="F"){const c=mainCanvas();if(c){e.preventDefault();toggleFs(c);}}
  });

  // 全体マップの「前の時代／時代を選ぶ／次の時代」
  document.addEventListener("click",e=>{const b=e.target.closest("[data-kstep]");if(!b)return;const d=+b.dataset.kstep;if(d)window.KSTEP&&KSTEP(d);else openEra();});

  window.KSHELL={onView,openEra,closeEra,flashEra,toggleFs,addFs,syncSheets,isMobile:isM};
  setSticky();
})();
