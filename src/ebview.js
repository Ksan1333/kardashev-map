/* ---------- ⑥ 地球大全：文明マップの中で読む（表紙・目次・章・本文検索） ----------
   行き先（URL の # のあと）
     #earth-book          表紙と全体の目次
     #eb-part-<部のid>     表紙のその部
     #eb-<章のid>          章          #eb-<章のid>.<番号>  章の中の見出し
     #eb-q=<語>           本文検索の結果
   章の中身は src/eb_p*.js（EB.add）。部品は src/eb_core.js。 */
window.EBVIEW=(()=>{
  const $=id=>document.getElementById(id);
  const {parts,chapters}=EB;
  const byId=Object.fromEntries(chapters.map(c=>[c.id,c]));
  const pById=Object.fromEntries(parts.map(p=>[p.id,p]));
  const pLabel=p=>{const i=parts.indexOf(p);return i===0?"序":`第${i}部`;};
  const view=$("v-earth-book"),main=$("ebmain"),side=$("ebside"),toc=$("ebtoc"),tocb=$("ebtocb"),q=$("ebq"),qres=$("ebqres");
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const plain=h=>h.replace(/<(script|style)[\s\S]*?<\/\1>/g," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim();
  const norm=s=>s.normalize("NFKC").toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
  const store={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
  const TITLE_TAIL="｜カルダシェフ文明マップ";

  // ---- 検索の材料（本文の文字だけ） ----
  const IDX=chapters.map(c=>{const hs=[...c.h.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/g)].map(m=>plain(m[1]));const t=plain(c.h);return {c,t,nt:norm(t),nti:norm(c.t+" "+(c.k||"")),hs,nhs:hs.map(norm)};});
  const nTables=(chapters.map(c=>c.h).join("").match(/<table/g)||[]).length;
  const nHeads=IDX.reduce((a,x)=>a+x.hs.length,0);
  $("ebcount").textContent=`序＋${parts.length-1}部・${chapters.length}章`;

  // ---- 目次（「目次」ボタンで開く） ----
  toc.innerHTML=`<a class="ebtoc-home" href="#earth-book" data-id=""><span aria-hidden="true">📘</span>表紙と全体の目次</a><div class="ebtocg">`+
    parts.map(p=>`<div class="ebtoc-part"><div class="ebtoc-ph"><span aria-hidden="true">${p.ic}</span><small>${pLabel(p)}</small>${p.t}</div>${p.ch.map(c=>`<a class="ebtoc-ch" href="#eb-${c.id}" data-id="${c.id}"><span class="ebn">${c.n}</span><span>${c.t}</span></a>`).join("")}</div>`).join("")+`</div>`;
  function openToc(){toc.hidden=false;tocb.setAttribute("aria-expanded","true");qres.hidden=true;const a=toc.querySelector("a.on");if(a)a.scrollIntoView({block:"nearest"});}
  function closeToc(){if(toc.hidden)return;toc.hidden=true;tocb.setAttribute("aria-expanded","false");}
  tocb.addEventListener("click",()=>toc.hidden?openToc():closeToc());
  toc.addEventListener("click",e=>{if(e.target.closest("a"))closeToc();});
  function setOn(id){toc.querySelectorAll("[data-id]").forEach(a=>{const on=a.dataset.id===id;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});}

  // ---- 表紙 ----
  function cover(pid){
    const last=byId[store.get("eb:last")];
    main.innerHTML=`<section class="ebcover">
      <div class="cv-hero"><div><h3 class="cv-title">この世のしくみを、順に<small>数と物質から、宇宙・地球・生命・人間・社会・文化・技術・歴史まで</small></h3>
        <p class="eblead">地球の外から来た知的存在が「地球とは何か、人類とは何か」を理解するための手引きです。前の章の言葉を使って次の章を説明するので、はじめから順に読むと全体がつながります。</p>
        <div class="cv-act"><a class="ebbtn pri" href="#eb-${chapters[0].id}">最初から読む</a>${last?`<a class="ebbtn" href="#eb-${last.id}">続きから：${esc(last.t)}</a>`:""}</div></div>
        <div class="cv-stats"><div><b class="num">${parts.length-1}</b><small>部（＋序）</small></div><div><b class="num">${chapters.length}</b><small>章</small></div><div><b class="num">${nTables}</b><small>表</small></div><div><b class="num">${nHeads}</b><small>見出し</small></div></div></div>
      <div class="cv-parts">${parts.map(p=>`<section class="cv-part" id="eb-part-${p.id}"><h3><span aria-hidden="true">${p.ic}</span><small>${pLabel(p)}</small>${p.t}</h3><p>${p.desc}</p><ol>${p.ch.map(c=>`<li><a href="#eb-${c.id}"><span class="ebn">${c.n}</span><span>${c.t}</span></a></li>`).join("")}</ol></section>`).join("")}</div>
      <p class="cv-foot">数字は概数です。年によって変わる数字には、年と出典を添えています（各章の終わりの「出典・注」）。2027年より後のことは予測や想像で、全体マップの「もしもの世界（Type I〜IV）」とつながっています。</p>
    </section>`;
    side.innerHTML="";side.hidden=true;view.classList.remove("eb-reading");
    document.title="地球大全"+TITLE_TAIL;setOn("");curId=null;
    if(pid){const el=$("eb-part-"+pid);if(el){el.scrollIntoView({block:"start"});el.classList.add("flash");setTimeout(()=>el.classList.remove("flash"),1600);}}
  }

  // ---- 章 ----
  let curId=null;
  function chapter(c,sec,terms){
    const p=pById[c.part],prev=chapters[c.n-1],next=chapters[c.n+1];
    main.innerHTML=`<article class="ebch" data-id="${c.id}">
      <nav class="crumb" aria-label="現在地"><a href="#earth-book">地球大全</a><span aria-hidden="true">›</span><a href="#eb-part-${p.id}">${pLabel(p)} ${p.t}</a></nav>
      <header class="ebch-h"><span class="ebic" aria-hidden="true">${c.ic}</span><div><small>第${c.n}章</small><h3>${c.t}</h3></div></header>
      <ul class="outl" aria-label="この章の見出し"></ul>
      ${c.c3d?`<canvas class="c3d ebc3d" data-k="${c.c3d}" data-hi="2" aria-label="${esc(c.t)}の立体図"></canvas>`:""}
      <div class="ebbody">${c.h}</div>
      <nav class="ebpager" aria-label="前後の章">${prev?`<a class="pv" href="#eb-${prev.id}"><small>← 前の章（第${prev.n}章）</small><b>${prev.t}</b></a>`:""}${next?`<a class="nx" href="#eb-${next.id}"><small>次の章（第${next.n}章） →</small><b>${next.t}</b></a>`:`<a class="nx" href="#earth-book"><small>おわり</small><b>表紙へ戻る</b></a>`}</nav>
    </article>`;
    const hs=[...main.querySelectorAll(".ebbody h4")];
    hs.forEach((h,k)=>h.id=`eb-${c.id}.${k+1}`);
    const links=hs.map((h,k)=>`<a href="#eb-${c.id}.${k+1}">${esc(h.textContent)}</a>`);
    const outl=main.querySelector(".outl");
    if(hs.length)outl.innerHTML=links.map(a=>`<li>${a}</li>`).join("");else outl.remove();
    side.innerHTML=hs.length?`<b>この章の見出し</b>${links.join("")}`:"";side.hidden=!hs.length;view.classList.toggle("eb-reading",hs.length>0);
    document.title=`${c.t}｜地球大全`+TITLE_TAIL;
    setOn(c.id);curId=c.id;store.set("eb:last",c.id);
    if(terms&&terms.length)highlight(terms);
    const target=sec?document.getElementById(`eb-${c.id}.${sec}`):main.querySelector("mark.hit");
    if(target)target.scrollIntoView({block:terms&&!sec?"center":"start"});else toTop();
    if(window.L3D&&main.querySelector("canvas.c3d"))L3D.scan(main);
    watchSections(hs);
  }
  // 章の題名が、上の固定の行（時代バー・地球大全の道具の行）のすぐ下に来る位置へ
  function toTop(){const sh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--stickyH"))||0;const th=view.querySelector(".ebtools").offsetHeight;window.scrollTo(0,Math.max(0,scrollY+main.getBoundingClientRect().top-sh-th-12));}
  let so=null;
  function watchSections(hs){if(so)so.disconnect();if(!hs.length)return;so=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)side.querySelectorAll("a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id));});},{rootMargin:"-25% 0px -65% 0px"});hs.forEach(h=>so.observe(h));}
  // 検索語を本文の中で光らせる
  function highlight(terms){const root=main.querySelector(".ebch");const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);let n=0;
    for(const tn of nodes){if(n>60)break;const s=tn.nodeValue,ns=norm(s);let hit=-1,len=0;for(const t of terms){const i=ns.indexOf(t);if(i>=0&&(hit<0||i<hit)){hit=i;len=t.length;}}if(hit<0||tn.parentNode.closest("mark,script,style"))continue;
      const m=document.createElement("mark");m.className=n?"":"hit";const r=document.createRange();r.setStart(tn,hit);r.setEnd(tn,Math.min(s.length,hit+len));try{r.surroundContents(m);n++;}catch(e){}}}

  // ---- 本文検索 ----
  function find(raw){
    const terms=norm(raw).split(/[\s　]+/).filter(Boolean);const out=[];
    if(!terms.length)return {terms,out};
    for(const x of IDX){let sc=0,ok=true;for(const t of terms){const inT=x.nti.includes(t),hi=x.nhs.findIndex(h=>h.includes(t)),cnt=x.nt.split(t).length-1;if(!inT&&hi<0&&!cnt){ok=false;break;}sc+=(inT?30:0)+(hi>=0?12:0)+Math.min(cnt,20);}
      if(!ok)continue;const hi=x.nhs.findIndex(h=>terms.some(t=>h.includes(t)));const i=x.nt.indexOf(terms[0]);
      const snip=i>=0?x.t.slice(Math.max(0,i-36),i+70):x.t.slice(0,90);out.push({x,sc,hi,snip});}
    out.sort((a,b)=>b.sc-a.sc);return {terms,out};
  }
  const mark=(s,terms)=>{let o=esc(s);terms.forEach(t=>{const re=new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");o=o.replace(re,m=>`<mark>${m}</mark>`);});return o;};
  const item=(r,k,terms,selK)=>{const c=r.x.c,p=pById[c.part];return `<a href="#eb-${c.id}${r.hi>=0?"."+(r.hi+1):""}" data-k="${k}" role="option"${k===selK?' class="sel"':""}><b>${mark(c.t,terms)}</b><small>第${c.n}章 ・ ${pLabel(p)} ${p.t}${r.hi>=0?" ・ "+esc(r.x.hs[r.hi]):""}</small><span>…${mark(r.snip,terms)}…</span></a>`;};
  let sel=-1;
  function live(raw){
    const {terms,out}=find(raw);
    if(!terms.length){qres.hidden=true;return;}
    sel=out.length?0:-1;closeToc();
    qres.innerHTML=`<div class="qh">「${esc(raw)}」— ${out.length}章で見つかりました${out.length>40?"（上位40件）":""}</div>`+out.slice(0,40).map((r,k)=>item(r,k,terms,sel)).join("")+
      (out.length?`<a class="qall" href="#eb-q=${encodeURIComponent(raw.trim())}">結果をすべて本文の場所に並べて見る →</a>`:`<div class="qh">見つかりませんでした。言い方を変えるか、画面の上の🔍（<kbd>/</kbd>キー）で文明マップ全体から探してください。</div>`);
    qres.hidden=false;qres._terms=terms;
  }
  function results(raw){
    const {terms,out}=find(raw);q.value=raw;
    main.innerHTML=`<section class="ebres"><h3>「${esc(raw)}」の検索結果 <small>${out.length}章</small></h3>${out.length?`<div class="ebres-list">${out.map((r,k)=>item(r,k,terms,-1)).join("")}</div>`:`<p class="note">見つかりませんでした。言い方を変えてみてください。</p>`}</section>`;
    main._terms=terms;
    side.innerHTML="";side.hidden=true;view.classList.remove("eb-reading");setOn("");curId=null;
    document.title=`「${raw}」の検索結果｜地球大全`+TITLE_TAIL;toTop();
  }
  let qt=0;q.addEventListener("input",()=>{clearTimeout(qt);qt=setTimeout(()=>live(q.value),120);});
  q.addEventListener("focus",()=>{if(q.value.trim())live(q.value);});
  q.addEventListener("keydown",e=>{const items=[...qres.querySelectorAll("a[data-k]")];
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!items.length)return;sel=(sel+(e.key==="ArrowDown"?1:-1)+items.length)%items.length;items.forEach((a,k)=>a.classList.toggle("sel",k===sel));items[sel].scrollIntoView({block:"nearest"});}
    else if(e.key==="Enter"){e.preventDefault();const a=items[Math.max(0,sel)];if(a)a.click();else if(q.value.trim())location.hash="eb-q="+encodeURIComponent(q.value.trim());}
    else if(e.key==="Escape"){qres.hidden=true;q.blur();}});
  // 検索結果から章へ：見つかった言葉を本文の中で光らせる
  let pendingTerms=null;
  function go(a,terms){pendingTerms=terms;qres.hidden=true;q.blur();const h=a.getAttribute("href");if(location.hash===h)route(h.slice(1));else location.hash=h;}
  qres.addEventListener("click",e=>{const a=e.target.closest("a[data-k]");if(!a)return;e.preventDefault();go(a,qres._terms);});
  main.addEventListener("click",e=>{const a=e.target.closest(".ebres a[data-k]");if(!a)return;e.preventDefault();go(a,main._terms);});
  document.addEventListener("click",e=>{if(!e.target.closest("#ebsrch"))qres.hidden=true;if(!e.target.closest("#ebtoc,#ebtocb"))closeToc();});

  // ---- 行き先 ----
  function route(h){
    h=decodeURIComponent(h||"");closeToc();qres.hidden=true;
    if(!h||h==="earth-book"){cover();return;}
    if(h.startsWith("eb-part-")){cover(h.slice(8));return;}
    if(h.startsWith("eb-q=")){results(h.slice(5));return;}
    const [id,sec]=h.slice(3).split(".");const c=byId[id];
    if(!c){cover();return;}
    if(c.id===curId&&sec&&!pendingTerms){const el=document.getElementById(`eb-${c.id}.${sec}`);if(el){el.scrollIntoView({block:"start"});return;}}
    const t=pendingTerms;pendingTerms=null;chapter(c,sec,t);
  }

  // ---- キー：← → 前後の章、Esc 目次と検索を閉じる（地球大全を見ているときだけ） ----
  document.addEventListener("keydown",e=>{
    if(!view.classList.contains("on"))return;
    if(e.key==="Escape"){closeToc();qres.hidden=true;return;}
    const ae=document.activeElement;
    if(e.metaKey||e.ctrlKey||e.altKey||(ae&&(/INPUT|TEXTAREA|SELECT/.test(ae.tagName)||ae.closest('[role="slider"],.eradock'))))return;
    if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&curId){const c=byId[curId];const t=chapters[c.n+(e.key==="ArrowRight"?1:-1)];if(t){e.preventDefault();location.hash="eb-"+t.id;}}
  });

  return {route,chapters:chapters.length};
})();
