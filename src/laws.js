/* ---------- ⑥ 宇宙の法則（力・公式・定数・素粒子・周期表・分子） ---------- */
(function(){
  const $=id=>document.getElementById(id);if(!$("v-laws"))return;
  const KY=()=>1e12;
  // 4つの力
  $("lforces").innerHTML=FORCES.map(([n,st,rg,car,d,col,bar],i)=>`<div class="lforce" style="--fc:${col}"><canvas class="c3d" data-k="force:${i}"></canvas><div class="lfh"><b>${n}</b><span class="num">相対的な強さ ${st}</span></div>
    <div class="lfbar"><i style="width:${bar*100}%"></i></div><dl><dt>届く範囲</dt><dd>${rg}</dd><dt>伝える粒子</dt><dd>${car}</dd></dl><p>${d}</p></div>`).join("");
  $("lformulas").innerHTML=FORMULAS.map(([n,f,who,d],i)=>`<div class="lformula"><canvas class="c3d" data-k="formula:${i}"></canvas><div class="lfm">${f.replace(/([A-Za-zΛψħ])_([A-Za-zμν]+)/g,"$1<sub>$2</sub>").replace(/\^μ/g,"<sup>μ</sup>")}</div><b>${n}</b><span class="lwho">${who}</span><p>${d}</p></div>`).join("");
  $("lconsts").innerHTML=`<table class="ltable"><tbody>${CONSTS.map(([n,s,v])=>`<tr><th>${n}</th><td class="num">${s}</td><td>${v}</td></tr>`).join("")}</tbody></table>`;
  // 素粒子
  function renderParticles(){const Y=KY();
    const cell=p=>{const [s,n,c,q,m,y,d]=p;const off=y===null||y>Y;return `<button class="lpart${off?" off":""}" style="--pc:${PCAT[c][1]}" data-p="${s}"><canvas class="c3d sm" data-k="particle|${s}"></canvas><span class="lps">${s}</span><span class="lpn">${n}</span><span class="lpm num">${m}</span><span class="lpq num">電荷 ${q}</span></button>`;};
    const by=c=>PARTICLES.filter(p=>p[2]===c);
    $("lparts").innerHTML=`<div class="lpgrid"><div class="lpcol"><h4>クオーク</h4><div class="lp2">${by("quark").map(cell).join("")}</div></div><div class="lpcol"><h4>レプトン</h4><div class="lp2">${by("lepton").map(cell).join("")}</div></div><div class="lpcol"><h4>力を伝える粒子</h4><div class="lp1">${by("boson").map(cell).join("")}</div></div><div class="lpcol"><h4>質量の源・仮説</h4><div class="lp1">${by("higgs").concat(by("hypo")).map(cell).join("")}</div></div></div>`;}
  // 周期表
  function renderPT(){const Y=KY();let h="";
    ELEMENTS.forEach(e=>{const row=e.frow?e.frow+8:e.per;const off=e.y>Y;h+=`<button class="pt${off?" off":""}" style="grid-row:${row+(e.frow?.0:0)};grid-column:${e.grp};--ec:${ECAT[e.cat][1]}" data-z="${e.Z}" title="${e.ja}"><span class="ptz">${e.Z}</span><b>${e.sym}</b><span class="ptn">${e.ja}</span></button>`;});
    h+=`<div class="ptgap" style="grid-row:6;grid-column:3">57-71</div><div class="ptgap" style="grid-row:7;grid-column:3">89-103</div>`;
    $("ptable").innerHTML=h;
    const n=ELEMENTS.filter(e=>e.y<=Y).length;$("ptcount").textContent=Y<2026?`${window.KERA?window.KERA.when:""}の時点で知られていた元素：${n}個（暗い元素はまだ未発見）`:`118個（2016年に7周期目まですべて命名）`;}
  $("ptlegend").innerHTML=Object.values(ECAT).map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join("");
  // 分子
  $("lmols").innerHTML=MOLS.map(([id,n,f,d])=>`<button class="lmol" data-m="${id}"><canvas class="c3d" data-k="mol|${id}"></canvas><b>${n}</b><span class="num">${f}</span><small>${d}</small></button>`).join("");
  // 詳細
  const pan=$("lpanel");
  function show(html){pan.innerHTML=`<button class="gclose" data-close="1">×</button>`+html;pan.hidden=false;window.L3D&&L3D.scan(pan);}
  document.getElementById("v-laws").addEventListener("click",e=>{
    const t=e.target.closest("[data-z],[data-p],[data-m],[data-close],[data-go]");if(!t)return;
    if(t.dataset.close){pan.hidden=true;return;}
    if(t.dataset.go){const [k,v]=t.dataset.go.split(":");location.hash="micro";setTimeout(()=>window.MICRO&&MICRO.open(k,v),120);return;}
    if(t.dataset.z){const el=ELEMENTS[+t.dataset.z-1];const N=Math.round(parseFloat(String(el.m).replace(/[\[\]]/g,"")))-el.Z;
      show(`<div class="meta"><span class="pill" style="color:${ECAT[el.cat][1]};border-color:${ECAT[el.cat][1]}">${ECAT[el.cat][0]}</span></div><canvas class="c3d" data-k="atom|${el.Z}"></canvas><div class="ptbig"><span>${el.Z}</span><b>${el.sym}</b></div><h3>${el.ja}</h3>
        <dl class="kdl"><dt>原子番号</dt><dd>${el.Z}（陽子 ${el.Z}個・電子 ${el.Z}個）</dd><dt>中性子</dt><dd>約${N}個（代表的な同位体）</dd><dt>原子量</dt><dd>${el.m}</dd><dt>周期・族</dt><dd>第${el.per}周期・${el.frow?"f-ブロック":el.grp+"族"}</dd><dt>発見</dt><dd>${el.y<0?"古代から知られる":el.y+"年"}</dd></dl>
        ${ENOTE[el.Z]?`<p>${ENOTE[el.Z]}</p>`:""}<div class="whnav"><button class="chip" data-go="atom:${el.Z}">⚛ 3Dで原子を見る</button><button class="chip" data-go="nucleus:${el.Z}">原子核を見る</button></div>`);}
    if(t.dataset.p){const p=PARTICLES.find(x=>x[0]===t.dataset.p);show(`<div class="meta"><span class="pill" style="color:${PCAT[p[2]][1]};border-color:${PCAT[p[2]][1]}">${PCAT[p[2]][0]}</span></div><h3>${p[1]}（${p[0]}）</h3><dl class="kdl"><dt>質量</dt><dd>${p[4]}</dd><dt>電荷</dt><dd>${p[3]}</dd><dt>発見</dt><dd>${p[5]?p[5]+"年":"未発見"}</dd></dl><p>${p[6]}</p>${p[2]==="quark"?`<div class="whnav"><button class="chip" data-go="quark:p">陽子の中のクオークを3Dで</button></div>`:""}`);}
    if(t.dataset.m){const m=MOLS.find(x=>x[0]===t.dataset.m);show(`<h3>${m[1]}</h3><div class="num" style="font-size:18px;color:var(--accent)">${m[2]}</div><p>${m[3]}</p><p class="clim">原子の数：${m[4].length}（3Dモデルは簡略）</p><div class="whnav"><button class="chip" data-go="mol:${m[0]}">🧪 3Dで分子を見る</button></div>`);}
  });
  // 未解決問題
  let lastCat="";$("lunsolved").innerHTML=UNSOLVED.map(([c,t,d,st,k],i)=>{const h=c!==lastCat?`<h4 class="lunh">${c}</h4>`:"";lastCat=c;return h+`<div class="lun"><canvas class="c3d" data-k="un|${k}"></canvas><span class="lunc">${c}</span><b>${t}</b><p>${d}</p><span class="lunst">現状：${st}</span></div>`;}).join("");
  // タブ
  const tabs=$("ltabs");function tab(t){tabs.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.t===t));document.querySelectorAll("#v-laws .ltab").forEach(d=>d.hidden=d.dataset.t!==t);}
  tabs.addEventListener("click",e=>{const b=e.target.closest("button");if(b)tab(b.dataset.t);});tab("forces");window.LAWS_TAB=tab;
  renderParticles();renderPT();const SC3=()=>{if(typeof L3D!=="undefined"&&L3D)L3D.scan(document.getElementById("v-laws"));};SC3();
  window.addEventListener("k-year",()=>{renderParticles();renderPT();SC3();});
})();
