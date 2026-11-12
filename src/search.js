/* ---------- 全体検索（／・Ctrl+K）・ショートカット・使い方・はじめてガイド ---------- */
(function(){
  const nav=document.getElementById("views");if(!nav)return;
  const $=id=>document.getElementById(id);
  nav.insertAdjacentHTML("beforeend",`<span class="navera" id="navera" title="スライダーの時代（押すと上へ）"></span><button class="navsearch" id="navsearch" aria-label="全体を検索"><span aria-hidden="true">🔍</span>検索<kbd>/</kbd></button><button class="navhelp" id="navhelp" aria-label="使い方とショートカット">?</button>`);
  document.body.insertAdjacentHTML("beforeend",`
  <div class="sx" id="sx" hidden><div class="sxbox" role="dialog" aria-modal="true" aria-label="全体検索">
    <div class="sxin"><span aria-hidden="true">🔍</span><input id="sxq" type="search" placeholder="出来事・国・元素・生き物・天体・発明… なんでも" autocomplete="off" spellcheck="false" aria-controls="sxres"><kbd>Esc</kbd></div>
    <div class="sxfil" id="sxfil"></div><div class="sxres" id="sxres" role="listbox"></div>
    <div class="sxfoot"><span><kbd>↑</kbd><kbd>↓</kbd> 選ぶ</span><span><kbd>Enter</kbd> 開く</span><span><kbd>Esc</kbd> 閉じる</span><span id="sxcount"></span></div></div></div>
  <div class="sx" id="hx" hidden><div class="sxbox hxbox" role="dialog" aria-modal="true" aria-label="使い方"><button class="gclose" data-hclose="1" aria-label="閉じる">×</button><div id="hxbody"></div></div></div>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`);
  const sx=$("sx"),q=$("sxq"),res=$("sxres"),fil=$("sxfil"),hx=$("hx");
  // ---- 正規化（カタカナ→ひらがな、全角→半角、小文字） ----
  const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s・,，、。「」『』"']/g,"");
  const KIND={view:["🧭","ページ"],book:["📘","地球大全"],era:["⏳","時代"],field:["🗂","分野"],hist:["🏛","世界史"],tl:["🌌","宇宙・地球史"],tree:["🌳","系統樹"],country:["🏳","国・地域"],place:["📍","ランドマーク"],space:["🔭","宇宙"],micro:["🔬","ミクロ"],life:["🧬","生き物"],law:["⚛","法則・元素"]};
  const FIL=[["all","すべて",null],["ev","出来事",["hist","tl","era"]],["tree","系統樹・分野",["tree","field"]],["geo","国・場所",["country","place"]],["sp","宇宙",["space"]],["mi","ミクロ・生き物",["micro","life"]],["law","法則・元素",["law"]],["book","地球大全・ページ",["book","view"]]];
  let curF="all";
  // ---- 移動 ----
  const later=(f,ms=160)=>setTimeout(()=>{try{f();}catch(e){console.warn(e);}},ms);
  const goHash=h=>{if(location.hash!=="#"+h)location.hash=h;};
  const flash=el=>{if(!el)return;el.classList.remove("sxflash");void el.offsetWidth;el.classList.add("sxflash");setTimeout(()=>el.classList.remove("sxflash"),1800);};
  function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,4200);}
  window.KTOAST=toast;
  const KY=()=>typeof window.KYEAR==="number"?window.KYEAR:2026;
  const futNote=y=>{if(typeof y==="number"&&y>KY()+.5)toast("これはスライダーの時代より後の出来事です。スライダーを進めると年表にも表示されます。");};
  const go={
    wh(i){goHash("timeline");later(()=>{let L=null,j=-1;if(typeof HIST!=="undefined")for(const l of HIST.lanes){const k=(l.ev||[]).findIndex(e=>e[3]===i);if(k>=0){L=l;j=k;break;}}
      if(L&&window.TL_FOCUS)TL_FOCUS("hist",L.id,j);else{TL_SET("hist");WH_DETAIL(i);}});},
    tl(m,lid,j){goHash("timeline");later(()=>TL_FOCUS(m,lid,j));},
    tree(fk,id,y){goHash("lineage");later(()=>{if(!window.TREE_SELECT||!TREE_SELECT(fk,id))toast("この要素は系統樹に見つかりませんでした。");},220);},
    country(c3){goHash("world-map");later(()=>{MAP_PICK_COUNTRY(c3);document.getElementById("v-world-map").scrollIntoView({behavior:"smooth"});},220);},
    place(id){goHash("world-map");later(()=>MAP_PICK_PLACE(id),220);},
    sp(i){goHash("space-map");later(()=>SP_PICK(i),320);},
    splv(i){goHash("space-map");later(()=>SPZ.go(i,null,"out"),320);},
    brv(id){goHash("space-map");later(()=>SPZ.goBr(id),320);},
    micro(k,v){goHash("micro");later(()=>MICRO.open(k,v),220);},
    law(tab,sel,idx){goHash("laws");later(()=>{LAWS_TAB(tab);let el=null;if(sel)el=document.querySelector(sel);else if(idx)el=document.querySelectorAll(idx[0])[idx[1]];if(!el)return;if(sel)el.click();el.scrollIntoView({block:"center",behavior:"smooth"});flash(el);});},
    book(id){goHash("earth-book");later(()=>{const el=$("eb-"+id);if(el){el.scrollIntoView({behavior:"smooth"});flash(el);}},120);},
    view(h){goHash(h);later(()=>window.scrollTo({top:0,behavior:"smooth"}),60);},
    tg(k){goHash("overview");later(()=>{window.TG_SHOW&&TG_SHOW(k);const el=$("tguide");el.scrollIntoView({behavior:"smooth",block:"start"});flash(el);});},
    era(i){later(()=>{KSET(i);window.scrollTo({top:0,behavior:"smooth"});},10);},
    field(f){goHash("lineage");later(()=>openTreeField(FIELD2TREE[f]),120);},
  };
  // ---- 索引 ----
  let IDX=null;
  const fy=y=>typeof y!=="number"?"":y<=-10000?`約${Math.round(-y/1e4).toLocaleString()}万年前`:y<0?`紀元前${-y}年`:`${y}年`;
  function build(){IDX=[];const add=(k,t,s,txt,fn,y)=>{const nt=norm(String(t).replace(/[\u{1F1E6}-\u{1F1FF}]/gu,""));IDX.push({k,t:String(t),s:s||"",nt,nb:norm(String(t).replace(/[\u{1F1E6}-\u{1F1FF}]/gu,"").replace(/（.*?）|\(.*?\)/g,"")),h:norm((t||"")+" "+(s||"")+" "+(txt||"")),fn,y});};
    const T=(f)=>{try{f();}catch(e){console.warn("search index",e);}};
    T(()=>[["overview","全体マップ","12分野の現在地・文明タイプ・ガイド"],["timeline","年表（宇宙・地球・世界史）","ブランチ表示の3つの年表と3Dシアター"],["space-map","宇宙","12段階の宇宙ズーム"],["world-map","世界地図","国・ランドマーク・世界遺産・3Dの風景"],["micro","ミクロの世界","細胞から超ひもまで11段階"],["lineage","系統樹（分野別）","17分野・約1,400要素の系譜（分野ごとに独立。未来は5つの世界線＋SFノート）"],["laws","宇宙の法則","4つの力・公式・素粒子・周期表・分子・未解決問題"],["earth-book","地球大全","宇宙人のための地球ガイド"]].forEach(([h,t,s])=>add("view",t,s,"",()=>go.view(h))));
    T(()=>{add("view","歴史シアター（3D）","年表の中の3D映像で通し再生","シアター 映像 再生",()=>{goHash("timeline");later(()=>{const d=$("thdock");if(d){d.open=true;d.scrollIntoView({behavior:"smooth"});}});});});
    T(()=>window.EBOOK&&EBOOK.chapters.forEach(c=>add("book",c.t,"地球大全の章",c.text,()=>go.book(c.id))));
    T(()=>[["t1","Type I 文明ガイド（惑星文明）"],["t2","Type II 文明ガイド（恒星文明）"],["t3","Type III 文明ガイド（銀河文明）"]].forEach(([k,t])=>add("view",t,"全体マップ・もしもの世界","タイプ カルダシェフ 文明",()=>go.tg(k))));
    T(()=>(window.KSTAGES||[]).forEach((st,i)=>add("era",st[2],`時代（スライダー）・${st[1]}`,st[7]||"",()=>go.era(i))));
    T(()=>FIELDS.forEach(f=>add("field",f.t,`分野・${f.v}（${f.l}）`,f.lead+" "+f.pts.join(" "),()=>go.field(f.id))));
    T(()=>WH.forEach((w,i)=>add("hist",w[3],`${w[0]}・${w[2]}`,(w[4]||"")+" "+(w[5]||[]).join(" "),()=>go.wh(i),w[1])));
    T(()=>[["cosmos",COSMOS,"宇宙年表"],["earth",EARTH,"地球史年表"]].forEach(([m,D,lab])=>D.lanes.forEach(l=>{add("tl",l.name,`${lab}のブランチ`,l.desc||"",()=>go.tl(m,l.id));(l.ev||[]).forEach((e,j)=>add("tl",e[1],`${lab}・${l.name}`,e[2]||"",()=>go.tl(m,l.id,j)));})));
    T(()=>TREE.forEach(f=>f.nodes.forEach(n=>add("tree",n[1],`${f.name}・${fy(n[3])}〜${n[3]>2026.5?"（もしも）":""}`,n[6]||"",()=>go.tree(f.key,n[0],n[3]),n[3]))));
    T(()=>COUNTRIES.list.forEach(c=>add("country",`${c.flag||""} ${c.ja}`,`${c.reg}・${c.sub}${c.cap?"・首都 "+c.cap:""}`,`${c.en} ${(c.lang||[]).join(" ")} ${(c.cur||[]).join(" ")}`,()=>go.country(c.c3))));
    T(()=>MAP.pins.forEach(p=>add("place",p.name,`ランドマーク・${(CAT[p.cat]||["その他"])[0]}`,p.desc||"",()=>go.place(p.id))));
    T(()=>(window.SP_P||[]).forEach((q,i)=>{const L=SPZ.LEVELS.find(x=>x.id===q[2]);add("space",q[0],`${L?L.name:""}`,"",()=>go.sp(i));}));
    T(()=>SPZ.LEVELS.forEach((L,i)=>{const d=window.LVINFO&&LVINFO[L.id];add("space",L.name,`宇宙のスケール ${i+1}/${SPZ.LEVELS.length}`,L.desc+(d?" "+d.f.map(x=>x.join(" ")).join(" ")+" "+d.p.join(" "):""),()=>go.splv(i));}));
    T(()=>(SPZ.ALL||[]).filter(L=>L.br).forEach(L=>add("space",L.name,"宇宙マップの分岐"+(L.fic||L.id==="mv"?"（空想）":""),L.desc||"",()=>go.brv(L.id))));
    T(()=>MICRO.LEVELS.forEach((L,i)=>{const d=window.LVINFO&&LVINFO[L.id];add("micro",L.name,`ミクロのスケール ${i+1}/${MICRO.LEVELS.length}・${L.scale}`,L.desc+(d?" "+d.f.map(x=>x.join(" ")).join(" ")+" "+d.p.join(" "):""),()=>go.micro(L.id));}));
    T(()=>ORGS.forEach(o=>add("life",o[1],`${o[2]}・${o[3]}`,`${o[4]} ${o[5]}`,()=>go.micro("life",o[0]))));
    T(()=>{const lv=c=>c==="細胞"?"cell":c==="ウイルス"?"virus":"microbe";MICROS.forEach(m=>add("life",m[1],`ミクロ・${m[2]}・${m[3]}`,m[4]||"",()=>go.micro(lv(m[2]),m[0])));});
    T(()=>ELEMENTS.forEach(e=>add("law",`${e.ja}（${e.sym}）`,`元素・原子番号${e.Z}・${(ECAT[e.cat]||[""])[0]}`,`${e.sym} 元素${e.Z}`,()=>go.law("pt",`#ptable [data-z="${e.Z}"]`))));
    T(()=>PARTICLES.forEach(p=>add("law",`${p[1]}（${p[0]}）`,`素粒子・${PCAT[p[2]][0]}・${p[4]}`,p[6],()=>go.law("parts",`#lparts [data-p="${p[0]}"]`))));
    T(()=>MOLS.forEach(m=>add("law",m[1],`分子・${m[2]}`,m[3],()=>go.law("mols",`#lmols [data-m="${m[0]}"]`))));
    T(()=>FORCES.forEach((f,i)=>add("law",f[0],"宇宙の4つの力",`${f[3]} ${f[4]}`,()=>go.law("forces",null,["#lforces .lforce",i]))));
    T(()=>FORMULAS.forEach((f,i)=>add("law",f[0],`公式・${f[2]}`,`${f[1]} ${f[3]}`,()=>go.law("formulas",null,["#lformulas .lformula",i]))));
    T(()=>CONSTS.forEach((c,i)=>add("law",c[0],`物理定数・${c[1]}`,c[2],()=>go.law("consts",null,["#lconsts tr",i]))));
    T(()=>UNSOLVED.forEach((u,i)=>add("law",u[1],`未解決問題・${u[0]}`,`${u[2]} ${u[3]||""}`,()=>go.law("unsolved",null,["#lunsolved .lun",i]))));
  }
  function search(str){if(!IDX)build();const toks=norm(str).length?String(str).normalize("NFKC").toLowerCase().split(/\s+/).map(norm).filter(Boolean):[];
    const allow=(FIL.find(f=>f[0]===curF)||FIL[0])[2];if(!toks.length)return [];const out=[];
    for(const it of IDX){if(allow&&!allow.includes(it.k))continue;let sc=0,ok=true;for(const t of toks){if(it.nb===t)sc+=130;else if(it.nt===t)sc+=120;else if(it.nt.startsWith(t))sc+=70;else if(it.nt.includes(t))sc+=45;else if(it.h.includes(t))sc+=12;else{ok=false;break;}}
      if(!ok)continue;sc-=Math.min(20,it.nt.length*.3);sc+=({view:6,book:6,country:9,place:7,law:5,life:5,space:5,micro:4,hist:3,tl:3,era:2,field:4,tree:0})[it.k]||0;out.push([sc,it]);}
    out.sort((a,b)=>b[0]-a[0]);return out.slice(0,80).map(x=>x[1]);}
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const hl=(t,str)=>{const s=String(str||"").trim();if(!s)return esc(t);const i=t.toLowerCase().indexOf(s.toLowerCase());return i<0?esc(t):esc(t.slice(0,i))+"<mark>"+esc(t.slice(i,i+s.length))+"</mark>"+esc(t.slice(i+s.length));};
  let cur=[],ai=0;
  const SUG=["地球大全","ビッグバン","恐竜","ピラミッド","産業革命","アポロ","日本","水","金","ヒッグス粒子","シロナガスクジラ","ブラックホール","ダイソン球","未解決問題"];
  function render(){const str=q.value;fil.innerHTML=FIL.map(([k,n])=>`<button class="chip" data-f="${k}" aria-pressed="${curF===k}">${n}</button>`).join("");
    if(!str.trim()){res.innerHTML=`<div class="sxsug"><b>試しに検索：</b>${SUG.map(s=>`<button class="chip" data-s="${s}">${s}</button>`).join("")}</div>`;cur=[];$("sxcount").textContent=IDX?`索引 ${IDX.length.toLocaleString()}件`:"";return;}
    cur=search(str);ai=Math.min(ai,Math.max(0,cur.length-1));
    $("sxcount").textContent=`${cur.length>=80?"80+":cur.length}件`;
    res.innerHTML=cur.length?cur.map((it,i)=>`<button class="sxr${i===ai?" on":""}" role="option" aria-selected="${i===ai}" data-i="${i}"><span class="sxk" title="${KIND[it.k][1]}">${KIND[it.k][0]}</span><span class="sxt"><b>${hl(it.t,str)}</b><small>${KIND[it.k][1]}・${esc(it.s)}</small></span><span class="sxgo">↵</span></button>`).join(""):`<div class="sxnone">「${esc(str)}」は見つかりませんでした。ひらがな・カタカナ・漢字を変えるか、短い言葉で試してください。</div>`;}
  function open(){sx.hidden=false;document.body.classList.add("sxopen");if(!IDX)build();q.select();render();setTimeout(()=>q.focus(),20);}
  function close(){sx.hidden=true;q.blur();document.body.classList.remove("sxopen");}
  function pick(i){const it=cur[i];if(!it)return;close();it.fn();}
  q.addEventListener("input",()=>{ai=0;render();});
  q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!cur.length)return;ai=(ai+(e.key==="ArrowDown"?1:-1)+cur.length)%cur.length;res.querySelectorAll(".sxr").forEach((b,i)=>{b.classList.toggle("on",i===ai);b.setAttribute("aria-selected",i===ai);});res.querySelector(".sxr.on")?.scrollIntoView({block:"nearest"});}
    else if(e.key==="Enter"){e.preventDefault();pick(ai);}else if(e.key==="Escape"){e.preventDefault();close();}});
  res.addEventListener("click",e=>{const b=e.target.closest("[data-i]");if(b){pick(+b.dataset.i);return;}const s=e.target.closest("[data-s]");if(s){q.value=s.dataset.s;ai=0;render();q.focus();}});
  fil.addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(!b)return;curF=b.dataset.f;ai=0;render();q.focus();});
  sx.addEventListener("mousedown",e=>{if(e.target===sx)close();});
  $("navsearch").addEventListener("click",open);
  // ---- 使い方・ショートカット ----
  const HELP=()=>`<h3>使い方</h3>
    <ol class="hxsteps"><li><b>時代を選ぶ</b>：上の「カルダシェフ・スライダー」を動かすと、宇宙誕生（138億年前）からType III（100万年後・もしも）まで、すべてのページがその時代の姿に変わります。</li>
    <li><b>見方を選ぶ</b>：タブで「全体マップ・年表・宇宙/地球/ミクロ・系統樹・宇宙の法則・地球大全」を切り替えます。</li>
    <li><b>なんでも検索</b>：🔍（<kbd>/</kbd>キー）で、出来事・国・元素・生き物・天体など約${(IDX||[]).length.toLocaleString()}件から探して、その場所へ飛べます。</li>
    <li><b>地球の外から来た方へ</b>：まず「地球大全」を読むと、地球と人類の全体像がつかめます。</li></ol>
    <h3>キーボード</h3><table class="ltable hxkeys"><tbody>
    <tr><th><kbd>/</kbd> または <kbd>Ctrl</kbd>+<kbd>K</kbd></th><td>全体検索</td></tr><tr><th><kbd>1</kbd>〜<kbd>6</kbd></th><td>タブを切り替え（1＝全体マップ … 6＝地球大全）</td></tr>
    <tr><th><kbd>[</kbd> <kbd>]</kbd></th><td>ひとつ前／次の時代へ</td></tr><tr><th><kbd>0</kbd></th><td>現在（2026年）に戻る</td></tr><tr><th><kbd>?</kbd></th><td>この使い方を開く</td></tr><tr><th><kbd>Esc</kbd></th><td>閉じる</td></tr></tbody></table>
    <h3>記号の意味</h3><table class="ltable hxkeys"><tbody>
    <tr><th><span class="hxstar">★</span></th><td>年表：その出来事専用の3D映像がある</td></tr><tr><th><span class="hxdot"></span></th><td>年表：ふつうの出来事（3Dは時代と地域の風景）</td></tr>
    <tr><th><span class="hxdia"></span></th><td>年表：ブランチ（国・系統）の終わり</td></tr><tr><th>点線</th><td>仮説・予測・もしも</td></tr>
    <tr><th>暗い表示</th><td>スライダーの時代にはまだ存在しない・知られていない</td></tr><tr><th>もや</th><td>世界地図：その時代に文明がない／人がいない地域</td></tr></tbody></table>
    <p class="note">数値は2026年時点の概数です。2026年より先の内容は、予測・目標・想像（もしも）です。</p>`;
  function help(){if(!IDX)build();$("hxbody").innerHTML=HELP();hx.hidden=false;}
  $("navhelp").addEventListener("click",help);hx.addEventListener("click",e=>{if(e.target===hx||e.target.closest("[data-hclose]"))hx.hidden=true;});
  const typing=e=>{const t=e.target;return t&&(t.tagName==="INPUT"&&!["range","checkbox","radio","button"].includes(t.type)||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable);};
  window.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();sx.hidden?open():close();return;}
    if(e.key==="Escape"){if(!sx.hidden){close();return;}if(!hx.hidden){hx.hidden=true;return;}}
    if(typing(e)||e.ctrlKey||e.metaKey||e.altKey||!sx.hidden)return;
    if(e.key==="/"){e.preventDefault();open();}
    else if(e.key==="?"){e.preventDefault();hx.hidden?help():(hx.hidden=true);}
    else if(/^[1-6]$/.test(e.key)){const v=VIEWS[+e.key-1];if(v){location.hash=v[0];}}
    else if(e.key==="["){$("kprev")?.click();}else if(e.key==="]"){$("knext")?.click();}else if(e.key==="0"){$("know")?.click();}
  });
  // ---- ナビの時代表示 ----
  const era=$("navera");
  function syncEra(){const E=window.KERA;if(!E){era.hidden=true;return;}era.hidden=false;era.className="navera"+(E.now?" now":E.kind==="future"?" fut":E.kind==="pre"?" pre":" past");era.innerHTML=`<i></i>${E.when}`;}
  window.addEventListener("k-year",syncEra);syncEra();era.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  // ---- はじめての人へ ----
  let seen=false;try{seen=localStorage.getItem("kmap.hello")==="1";}catch(e){}
  const head=document.querySelector("#v-overview .view-head");
  if(!seen&&head){head.insertAdjacentHTML("afterend",`<div class="hello" id="hello"><div><b>はじめての方へ</b><span>① 上のスライダーで時代を動かす（宇宙誕生〜Type III）　② タブで見方を切り替える　③ <kbd>/</kbd> キーや🔍で何でも検索　─　地球の外から来た方は「06 地球大全」からどうぞ。</span></div><div class="hellob"><button class="chip" data-h="book">📘 地球大全を読む</button><button class="chip" data-h="help">使い方</button><button class="chip" data-h="x">閉じる</button></div></div>`);
    $("hello").addEventListener("click",e=>{const b=e.target.closest("[data-h]");if(!b)return;const k=b.dataset.h;if(k==="book")location.hash="earth-book";if(k==="help")help();if(k==="x"){$("hello").remove();try{localStorage.setItem("kmap.hello","1");}catch(e){}}});}
})();
