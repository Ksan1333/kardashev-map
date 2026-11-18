/* ---------- 地球大全：章の部品（表・棒グラフ・図・リンク）と、部・章の登録 ----------
   章のファイル（eb_p*.js）は EB.part(...) で部を始め、EB.add({...}) で章を足す。並びは足した順。
   地図アプリへのリンクは EB.map("timeline","年表で見る") のように書く（ビルドで地図のファイル名に置き換わる）。 */
window.EB=(function(){
  const MAP="__MAP_URL__";
  const parts=[],chapters=[];
  // 棒グラフ：[名前, 値, 色, 補足]
  const bar=(rows,unit="",max)=>{const m=max||Math.max(...rows.map(r=>typeof r[1]==="number"?r[1]:0));return `<div class="ebbars">${rows.map(([n,v,c,note])=>`<div class="ebbar"><span class="ebbn">${n}</span><span class="ebbt"><i style="width:${typeof v==="number"?Math.max(.6,v/m*100):0}%;background:${c||"var(--accent)"}"></i></span><span class="ebbv num">${typeof v==="number"?v.toLocaleString():v}${unit}${note?`<small>${note}</small>`:""}</span></div>`).join("")}</div>`;};
  // 表：見出し行なしのときは1列目を見出しにする。列の数をクラス（c3 など）に入れ、スマホでは4列以上を横スクロールにする
  const tbl=(rows,head)=>`<div class="ebscroll"><table class="ltable ebt c${(head||rows[0]||[]).length}">${head?`<thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead>`:""}<tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0&&!head?`<th>${c}</th>`:`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const fig=(svg,cap)=>`<figure class="ebfig">${svg}<figcaption>${cap}</figcaption></figure>`;
  const dots=n=>`<span class="ebdots">${"●".repeat(n)}</span>`;
  // 地図アプリへ／ほかの章へ
  const map=(hash,label)=>`<a class="ebmap" href="${MAP}#${hash}"><span aria-hidden="true">🗺</span>${label}</a>`;
  const see=(id,label)=>`<a class="ebsee" href="#${id}">${label}</a>`;
  // カード：[見出し, 本文, 色]
  const cards=(items,min=200)=>`<div class="ebcards" style="--min:${min}px">${items.map(([t,b,c])=>`<div class="ebcard"${c?` style="--c:${c}"`:""}><b>${t}</b><p>${b}</p></div>`).join("")}</div>`;
  // 流れ：A → B → C
  const flow=items=>`<div class="ebflow">${items.map(x=>`<span>${x}</span>`).join('<i aria-hidden="true">→</i>')}</div>`;
  const note=(t,kind="")=>`<div class="ebnote ${kind}">${t}</div>`;
  const src=t=>`<p class="ebsrc">出典・注：${t}</p>`;
  const links=(...a)=>`<div class="eblinks">${a.join("")}</div>`;
  let curPart=null;
  return {MAP,parts,chapters,bar,tbl,fig,dots,map,see,cards,flow,note,src,links,
    part(id,t,ic,desc){curPart={id,t,ic,desc,ch:[]};parts.push(curPart);},
    add(c){if(!curPart)throw new Error("EB.part が先");c.part=curPart.id;c.n=chapters.length;chapters.push(c);curPart.ch.push(c);}};
})();
