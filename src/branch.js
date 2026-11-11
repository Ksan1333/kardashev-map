/* ---------- 年表：宇宙／地球史（ブランチ表示） ---------- */
function BranchGraph(host,D,panel){
  const RH=30, TOP=74, LX=10;
  const lanes=D.lanes, byId=Object.fromEntries(lanes.map(l=>[l.id,l]));
  // 並び順：親のすぐ下に子
  const order=[];const kids={};lanes.forEach(l=>{(kids[l.p||"_"]??=[]).push(l);});
  const walk=l=>{if(order.includes(l))return;order.push(l);(kids[l.id]||[]).forEach(walk);};
  // 合流するレーン（into）は合流先の上に置く
  lanes.filter(l=>!l.p&&!l.into).forEach(l=>{lanes.filter(x=>x.into===l.id).forEach(walk);walk(l);});
  lanes.forEach(walk);
  order.forEach((l,i)=>l.row=i);
  const seg=D.seg, X01=t=>{if(t<=seg[0][0])return 0;for(let i=1;i<seg.length;i++)if(t<=seg[i][0]){const[a,fa]=seg[i-1],[b,fb]=seg[i];return fa+(fb-fa)*(t-a)/(b-a);}return 1;};
  const T0=seg[0][0],T1=seg[seg.length-1][0];
  host.innerHTML=`<div class="bgwrap"><svg class="bgsvg"></svg><div class="bgtools"><button data-z="in">＋</button><button data-z="out">−</button><button data-z="fit">全体</button></div></div>`;
  const wrap=host.firstChild,svg=wrap.querySelector("svg");
  let W0=1200,k=1,tx=0,sel=null;
  const cut=()=>{const Y=window.KYEAR;if(typeof Y!=="number")return null;if(D.unit==="yr")return Y>=1e8?null:Y;if(D.unit==="ma"){if(Y>=2026)return null;return Y/1e6;}
    if(Y>=2026)return null;const sec=(Y+13.8e9)*3.156e7;return Math.log10(Math.max(1e-50,sec));};
  const sx=t=>LX+X01(t)*W0*k+tx;
  const star=(x,y,R,r)=>[...Array(10)].map((_,i)=>{const a=i*Math.PI/5-Math.PI/2,q=i%2?r:R;return (x+Math.cos(a)*q).toFixed(1)+","+(y+Math.sin(a)*q).toFixed(1);}).join(" ");
  const specOf=(l,e)=>{if(typeof EV3D==="undefined"||!EV3D)return false;try{return EV3D.isSpecial(D.unit==="yr"?(e[3]!=null?{title:e[1],desc:e[2],y:e[0],tags:WH[e[3]][5],kind:"hist"}:{title:e[1],y:e[0],kind:"hist",tags:[]}):{title:e[1],desc:(e[2]||"")+" "+l.name,y:0,src:D.unit==="ma"?"earth":"cosmos"});}catch(x){return false;}};
  function fit(){const w=wrap.clientWidth||1000;W0=w-30;k=1;tx=0;}
  function render(){
    const w=wrap.clientWidth||1000,c=cut(),h=TOP+order.length*RH+20;svg.setAttribute("width",w);svg.setAttribute("height",h);
    const vis=l=>c===null||l.a<=c;const endT=l=>{let b=l.b===null||l.b===undefined?T1:l.b;if(c!==null)b=Math.min(b,c);return b;};
    let g=[];
    // 時代の帯
    D.bands.forEach(([a,b,n,col])=>{const x1=sx(a),x2=sx(b);if(x2<0||x1>w)return;g.push(`<rect x="${x1}" y="0" width="${x2-x1}" height="${h}" fill="${col}" opacity=".35"/><text x="${Math.max(x1,0)+6}" y="16" class="bgband">${Math.min(x2,w)-Math.max(x1,0)>n.length*11.5+12?n:""}</text>`);});
    (D.bands2||[]).forEach(([a,b,n],i)=>{const x1=sx(a),x2=sx(b);if(x2-x1>34)g.push(`<rect x="${x1}" y="22" width="${x2-x1}" height="16" fill="${i%2?"#ffffff10":"#ffffff1c"}"/><text x="${(x1+x2)/2}" y="34" text-anchor="middle" class="bgband2">${n}</text>`);});
    let lastX=-1e9;D.ticks.forEach(([t,l])=>{const x=sx(t);if(x<-40||x>w+40)return;if(x-lastX<l.length*10+8)return;lastX=x;g.push(`<line x1="${x}" x2="${x}" y1="42" y2="${h}" class="bgtick"/><text x="${x}" y="56" text-anchor="middle" class="bgtl">${l}</text>`);});
    (D.marks||[]).forEach(([t,l])=>{if(c!==null&&t>c)return;const x=sx(t);g.push(`<line x1="${x}" x2="${x}" y1="62" y2="${h}" class="bgmark"/><text x="${x+3}" y="70" class="bgml">${k>1.6?l:"✕"}</text>`);});
    const yOf=l=>TOP+l.row*RH+RH/2;
    let con=[],lines=[],labs=[];
    order.forEach(l=>{if(!vis(l))return;const y=yOf(l),x1=sx(l.a),x2=sx(endT(l)),on=sel===l;
      const dash=l.dash?' stroke-dasharray="6 4"':"",sw=on?4:2.6;
      if(l.p&&byId[l.p]){const py=yOf(byId[l.p]);con.push(`<path d="M${x1-22},${py} C${x1-8},${py} ${x1-14},${y} ${x1},${y}" fill="none" stroke="${l.col}" stroke-width="${sw*.8}"${dash}/>`);}
      if(l.into&&byId[l.into]&&(c===null||l.b<=c)){const iy=yOf(byId[l.into]),xe=sx(l.b);con.push(`<path d="M${xe},${y} C${xe+14},${y} ${xe+8},${iy} ${xe+22},${iy}" fill="none" stroke="${l.col}" stroke-width="${sw*.8}"${dash}/>`);}
      lines.push(`<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="${l.col}" stroke-width="${sw}"${dash} class="bgl" data-l="${l.id}"/><line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="transparent" stroke-width="16" class="bgl" data-l="${l.id}"/>`);
      lines.push(`<circle cx="${x1}" cy="${y}" r="${on?6:4.5}" fill="${l.col}" stroke="#0a0f1f" stroke-width="1.5"/>`);
      if(l.b!==null&&l.b!==undefined&&!l.into&&(c===null||l.b<=c))lines.push(`<rect x="${x2-4}" y="${y-4}" width="8" height="8" fill="#0a0f1f" stroke="${l.col}" stroke-width="2" transform="rotate(45 ${x2} ${y})"/>`);
      const lx=Math.max(x1+8,4);labs.push(`<text x="${lx}" y="${y-7}" class="bgname${l.dash?" th":""}" data-l="${l.id}">${l.name}${l.dash&&!/仮説|予測/.test(l.name)?"（仮説）":""}</text>`);
      let lastR=-1e9;(l.ev||[]).forEach((ev,i)=>{const [t,n,d]=ev;if(c!==null&&t>c)return;const x=sx(t);if(x<-20||x>w+20)return;if(ev.sp===undefined)ev.sp=specOf(l,ev);
        lines.push(ev.sp?`<polygon points="${star(x,y,8,3.6)}" fill="#f4d06a" stroke="#0a0f1f" stroke-width="1.2" class="bge" data-l="${l.id}" data-e="${i}"><title>★ ${n}（専用の3D映像あり）</title></polygon>`:`<circle cx="${x}" cy="${y}" r="5" fill="#0a0f1f" stroke="${l.col}" stroke-width="2.4" class="bge" data-l="${l.id}" data-e="${i}"><title>${n}</title></circle>`);
        if((k>=1.5||(l.ev.length<6))&&x>lastR){labs.push(`<text x="${x+7}" y="${y+16}" class="bgev" data-l="${l.id}" data-e="${i}">${n}</text>`);lastR=x+12+n.length*10.5;}});});
    if(c!==null){const x=sx(c);g.push(`<rect x="${x}" y="0" width="${Math.max(0,w-x)}" height="${h}" fill="#05070f" opacity=".72"/><line x1="${x}" x2="${x}" y1="0" y2="${h}" stroke="#b48cff" stroke-width="2"/><text x="${x+8}" y="${TOP+14}" class="bgcut">◀ ${window.KERA?window.KERA.when:""}の時点（ここから先はまだ起きていない）</text>`);}
    else{const x=sx(D.now);g.push(`<line x1="${x}" x2="${x}" y1="42" y2="${h}" stroke="#f4b942" stroke-width="1.6" stroke-dasharray="4 3"/>`);}
    svg.innerHTML=g.join("")+con.join("")+lines.join("")+labs.join("");
  }
  function detail(l,ei){sel=l;render();const e=ei!=null?l.ev[ei]:null;
    const kidsL=(kids[l.id]||[]).map(x=>`<button class="linkbtn" data-l="${x.id}">${x.name}</button>`).join("");
    const T=e?e[0]:l.a,yrs=D.unit==="yr"?T:D.unit==="ma"?T*1e6:(T< -43?-13.8e9:Math.pow(10,T)/3.156e7-13.8e9);
    panel.innerHTML=`<button class="gclose" data-close="1" aria-label="閉じる">×</button><div class="ev3d"></div>${yrs<=Math.max(2026,typeof window.KYEAR==="number"?window.KYEAR:2026)?`<button class="chip thgo" data-th="${yrs}"${D.unit==="yr"&&e?` data-tt="${e[1]}"`:""}>🎬 地球の映像で通し再生</button>`:""}
      <div class="meta"><span class="pill" style="color:${l.col};border-color:${l.col}">${l.dash?"仮説・予測":"観測・定説"}</span></div>
      ${e?`<div class="whdy num">${fmt(e[0])}</div><h3>${e[1]}</h3>${e[2]?`<p>${e[2]}</p>`:""}<h4>所属するブランチ</h4>`:""}
      <h3 style="${e?"font-size:16px":""}">${l.name}</h3><div class="num" style="color:var(--muted);font-size:12px">${fmt(l.a)} 〜 ${l.b==null?"（つづく）":fmt(l.b)}</div><p>${l.desc||""}</p>
      ${l.p&&byId[l.p]?`<h4>分かれた元</h4><div class="whnav"><button class="linkbtn" data-l="${l.p}">${byId[l.p].name}</button></div>`:""}
      ${l.into?`<h4>合流先</h4><div class="whnav"><button class="linkbtn" data-l="${l.into}">${byId[l.into].name}</button></div>`:""}
      ${kidsL?`<h4>ここから分かれたもの</h4><div class="whnav">${kidsL}</div>`:""}
      ${l.ev&&l.ev.length?`<h4>主な出来事</h4><div class="whnav">${l.ev.map((x,i)=>`<button class="linkbtn" data-l="${l.id}" data-e="${i}"><span class="num">${fmt(x[0])}</span>　${x[1]}</button>`).join("")}</div>`:""}`;
    panel.hidden=false;panel.scrollTop=0;
    if(yrs<=2026&&window.THX)THX.quiet(yrs,D.unit==="yr"&&e?e[1]:undefined);
    if(typeof EV3D!=="undefined"&&EV3D)EV3D.mount(panel.querySelector(".ev3d"),D.unit==="yr"?(e&&e[3]!=null?{title:e[1],desc:e[2],y:e[0],tags:WH[e[3]][5],region:WH[e[3]][2],kind:"hist"}:{title:l.name,desc:l.desc,y:l.a,tags:[],region:l.reg,kind:"hist"}):{title:e?e[1]:l.name,desc:(e?e[2]:"")+" "+l.name,y:yrs,src:D.unit==="ma"?"earth":"cosmos"});}
  function fmt(t){if(D.unit==="yr"){if(t< -10000)return "約"+Math.round(-t/1e4)+"万年前";if(t<0)return "紀元前"+Math.round(-t).toLocaleString()+"年";return (t>=10000?"西暦約"+Math.round(t/1e4).toLocaleString()+"万年":Math.floor(t)+"年")+(t>2026.5?"（もしも）":"");}
    if(D.unit==="ma"){if(t===0)return "現在";const a=Math.abs(t);const s=a>=100?(a/100).toFixed(a>=1000?0:1).replace(/\.0$/,"")+"億年":a>=1?Math.round(a*100).toLocaleString()+"万年":Math.round(a*1e6).toLocaleString()+"年";return s+(t<0?"前":"後");}
    if(t< -43)return "ビッグバン以前";const sec=10**t,yr=sec/3.156e7;
    if(sec<1){const n=String(Math.round(t));return "10"+n.split("").map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹⁻"["0123456789-".indexOf(c)]).join("")+"秒後";}if(yr<1)return sec<3600?Math.round(sec)+"秒後":Math.round(sec/86400)+"日後";
    if(yr<1e4)return Math.round(yr).toLocaleString()+"年後";if(yr<1e8)return Math.round(yr/1e4).toLocaleString()+"万年後";if(yr<1e12)return (yr/1e8).toFixed(yr<1e10?1:0)+"億年後";if(yr<1e16)return Math.round(yr/1e12)+"兆年後";return "10の"+Math.round(Math.log10(yr))+"乗年後";}
  svg.addEventListener("click",e=>{if(moved>4)return;const t=e.target.closest("[data-l]");if(!t)return;detail(byId[t.dataset.l],t.dataset.e!=null?+t.dataset.e:null);});
  panel.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!host.isConnected||panel.dataset.owner!==D.title)return;if(b.dataset.close){panel.hidden=true;sel=null;render();}else if(b.dataset.l)detail(byId[b.dataset.l],b.dataset.e!=null?+b.dataset.e:null);});
  const zoomAt=(x,f)=>{const nk=Math.min(40,Math.max(1,k*f));tx=x-(x-tx-LX)*(nk/k)-LX;k=nk;clampX();render();};
  const clampX=()=>{const w=wrap.clientWidth;tx=Math.min(0,Math.max(tx,w-30-W0*k));};
  wrap.addEventListener("wheel",e=>{if(e.shiftKey){tx-=e.deltaY;clampX();render();e.preventDefault();return;}e.preventDefault();const r=wrap.getBoundingClientRect();zoomAt(e.clientX-r.left,e.deltaY<0?1.2:1/1.2);},{passive:false});
  let drag=null,moved=0;wrap.addEventListener("pointerdown",e=>{if(e.target.closest(".bgtools"))return;drag={x:e.clientX,tx};moved=0;});
  window.addEventListener("pointermove",e=>{if(!drag)return;moved=Math.abs(e.clientX-drag.x);tx=drag.tx+(e.clientX-drag.x);clampX();render();});
  window.addEventListener("pointerup",()=>{drag=null;});
  wrap.querySelector(".bgtools").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const w=wrap.clientWidth/2;if(b.dataset.z==="in")zoomAt(w,1.5);else if(b.dataset.z==="out")zoomAt(w,1/1.5);else{fit();render();}});
  new ResizeObserver(()=>{if(wrap.clientWidth){const rel=k;fit();k=rel;clampX();render();}}).observe(wrap);
  window.addEventListener("k-year",render);
  fit();render();
  function focus(lid,ei){const l=byId[lid];if(!l)return false;const t=ei!=null&&l.ev&&l.ev[ei]?l.ev[ei][0]:l.a;const w=wrap.clientWidth||1000;if(!wrap.clientWidth)return false;fit();k=Math.max(k,3);tx=w*.4-(LX+X01(t)*W0*k);clampX();panel.dataset.owner=D.title;detail(l,ei);
    const r=wrap.getBoundingClientRect();window.scrollTo({top:Math.max(0,window.scrollY+r.top+TOP+l.row*RH-innerHeight*.4),behavior:"smooth"});return true;}
  return {render,focus,show(){panel.dataset.owner=D.title;panel.hidden=true;sel=null;fit();render();}};
}
(function(){
  const sw=document.getElementById("tlswitch");if(!sw)return;
  const panes={cosmos:document.getElementById("tlw-cosmos"),earth:document.getElementById("tlw-earth"),hist:document.getElementById("tlw-hist")};
  const bp=document.getElementById("bgpanel");const G={};
  function setMode(m){Object.entries(panes).forEach(([k,el])=>el.hidden=k!==m);sw.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m));
    document.getElementById("tlhead").textContent={cosmos:"宇宙年表",earth:"地球史年表",hist:"世界史年表"}[m];
    if(m!=="hist"){const D=m==="cosmos"?COSMOS:EARTH;if(!G[m])G[m]=BranchGraph(document.getElementById("bg-"+m),D,bp);G[m].show();}
    else histView(window.HISTVIEW||"branch");
    bp.hidden=true;window.TLMODE=m;}
  window.TL_SET=setMode;
  window.TL_FOCUS=(m,lid,ei)=>{if(m==="hist"){setMode("hist");histView("branch");}else setMode(m);const g=G[m];if(g)setTimeout(()=>g.focus(lid,ei),60);};
  function histView(v){window.HISTVIEW=v;document.getElementById("hist-branch").hidden=v!=="branch";document.getElementById("hist-grid").hidden=v==="branch";
    document.querySelectorAll("#histsw button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.hv===v));
    if(v==="branch"){if(!G.hist)G.hist=BranchGraph(document.getElementById("bg-hist"),HIST,bp);G.hist.show();}else bp.hidden=true;}
  document.getElementById("histsw").addEventListener("click",e=>{const b=e.target.closest("button");if(b)histView(b.dataset.hv);});
  sw.addEventListener("click",e=>{const b=e.target.closest("button");if(b)setMode(b.dataset.m);});
  // 形の説
  const sh=document.getElementById("cshapes");
  const ill={flat:'<path d="M10 40 L60 30 L110 40 L60 50Z" fill="none" stroke="#7fb2ff" stroke-width="2"/><path d="M40 39 L70 34 L60 45Z" fill="#f4b94255" stroke="#f4b942"/>',
    sphere:'<circle cx="60" cy="40" r="28" fill="none" stroke="#7fb2ff" stroke-width="2"/><ellipse cx="60" cy="40" rx="28" ry="9" fill="none" stroke="#7fb2ff55"/><path d="M48 24 L76 30 L58 50Z" fill="#f4b94255" stroke="#f4b942"/>',
    saddle:'<path d="M10 25 Q60 55 110 25 M10 55 Q60 25 110 55 M10 25 L10 55 M110 25 L110 55" fill="none" stroke="#7fb2ff" stroke-width="2"/><path d="M45 36 Q60 41 75 36 Q66 42 60 50 Q55 42 45 36Z" fill="#f4b94255" stroke="#f4b942"/>',
    torus:'<ellipse cx="60" cy="40" rx="45" ry="22" fill="none" stroke="#7fb2ff" stroke-width="2"/><ellipse cx="60" cy="38" rx="16" ry="6" fill="none" stroke="#7fb2ff" stroke-width="2"/>'};
  if(sh)sh.innerHTML=COSMOS.shapes.map(([n,d,k])=>`<div class="cshape"><svg viewBox="0 0 120 80">${ill[k]}</svg><b>${n}</b><p>${d}</p></div>`).join("");
  setMode("cosmos");
  window.addEventListener("k-year",()=>{const Y=window.KYEAR;if(typeof Y==="number"&&Y< -300000&&window.TLMODE==="hist")setMode(Y< -4.54e9?"cosmos":"earth");});
})();
