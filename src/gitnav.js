/* ---------- GitHubの枝分かれのような階層セレクター（横並び） ---------- */
window.GITNAV=(function(){
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const wrap=(t,n)=>{const out=[];let s=String(t);while(s.length>n&&out.length<1){out.push(s.slice(0,n));s=s.slice(n);}out.push(s.length>n?s.slice(0,n-1)+"…":s);return out;};
  // spec: {lanes:[{id,name,color,from(nodeId)|null,merge(nodeId)?,dash?}], nodes:[{id,lane,label,num,col,fic?}]}
  function render(host,spec,cur,onPick){const CW=spec.cw||76,RH=spec.rh||54,PX=16,PY=16;
    const byId={};spec.nodes.forEach(n=>byId[n.id]=n);const rowOf={};const rows=[];
    spec.lanes.forEach((l,i)=>{const ns=spec.nodes.filter(n=>n.lane===l.id);if(!ns.length){rowOf[l.id]=0;return;}const c0=Math.min(...ns.map(n=>n.col)),c1=Math.max(...ns.map(n=>n.col));
      const ext=[c0-.7,c1+(i?(l.name.length*12+50)/CW:0)+.2];if(i===0){rowOf[l.id]=0;rows[0]=[[-1e9,1e9]];return;}
      const pr=l.from&&byId[l.from]?rowOf[byId[l.from].lane]:0;let r=pr+1;while(rows[r]&&rows[r].some(([a,b])=>!(ext[1]<a||ext[0]>b)))r++;(rows[r]=rows[r]||[]).push(ext);rowOf[l.id]=r;});
    const nRows=Math.max(...Object.values(rowOf))+1;
    const maxC=Math.max(...spec.nodes.map(n=>n.col));const W=PX*2+(maxC+1)*CW+220;const H=PY+nRows*RH+6;
    const X=c=>PX+CW/2+c*CW,Y=r=>PY+r*RH;let edges="",nodes="",tags="";
    spec.lanes.forEach((l,i)=>{const ns=spec.nodes.filter(n=>n.lane===l.id).sort((a,b)=>a.col-b.col);if(!ns.length)return;const y=Y(rowOf[l.id]),col=l.color||"#7fb2ff",da=l.dash?' stroke-dasharray="5 4"':"";
      const x0=X(ns[0].col),x1=X(ns[ns.length-1].col);
      if(l.from&&byId[l.from]){const f=byId[l.from],fx=X(f.col),fy=Y(rowOf[f.lane]);edges+=`<path d="M${fx},${fy} C${fx},${(fy+y)/2+6} ${x0-CW*.55},${y} ${x0},${y}" fill="none" stroke="${col}" stroke-width="2.4" opacity=".85"${da}/>`;}
      if(ns.length>1)edges+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${col}" stroke-width="2.4" opacity=".85"${da}/>`;
      if(l.merge&&byId[l.merge]){const m=byId[l.merge],mx=X(m.col),my=Y(rowOf[m.lane]);edges+=`<path d="M${x1},${y} C${x1+CW*.55},${y} ${mx},${(my+y)/2+6} ${mx},${my}" fill="none" stroke="${col}" stroke-width="2.4" opacity=".6"${da}/>`;}
      if(i>0)tags+=`<g><rect x="${x1+16}" y="${y-10}" rx="9" height="20" width="${l.name.length*12+26}" fill="${col}" opacity=".16"/><text x="${x1+28}" y="${y+4}" class="gn-tag" fill="${col}">⑂ ${esc(l.name)}</text></g>`;});
    spec.nodes.forEach(n=>{const x=X(n.col),y=Y(rowOf[n.lane]);const on=n.id===cur;const col=(spec.lanes.find(l=>l.id===n.lane)||{}).color||"#7fb2ff";const r=n.num!=null?11:7.5;
      const lines=wrap(n.label,6);
      nodes+=`<g class="gn-n${on?" on":""}" data-id="${esc(n.id)}" tabindex="0" role="button" aria-pressed="${on}"><title>${esc(n.label)}</title>`+
        `${on?`<circle cx="${x}" cy="${y}" r="${r+5}" fill="none" stroke="${col}" stroke-width="2" opacity=".6"/>`:""}<circle cx="${x}" cy="${y}" r="${r}" fill="${on?col:"#0b1020"}" stroke="${col}" stroke-width="2.4"${n.fic?' stroke-dasharray="3 2"':""}/>`+
        (n.num!=null?`<text x="${x}" y="${y+4}" text-anchor="middle" class="gn-num"${on?' fill="#0b1020"':""}>${n.num}</text>`:"")+
        lines.map((t,k)=>`<text x="${x}" y="${y+r+13+k*12}" text-anchor="middle" class="gn-lab${on?" on":""}">${esc(t)}</text>`).join("")+`</g>`;});
    host.innerHTML=`<div class="gitnav"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${edges}${tags}${nodes}</svg></div>`;
    const sv=host.querySelector("svg");sv.addEventListener("click",e=>{const g=e.target.closest(".gn-n");if(g)onPick(g.dataset.id);});
    sv.addEventListener("keydown",e=>{if(e.key==="Enter"){const g=e.target.closest(".gn-n");if(g)onPick(g.dataset.id);}});
    const c=host.querySelector(".gn-n.on");if(c){const box=host.querySelector(".gitnav");const cx=+c.querySelector("circle").getAttribute("cx");if(cx<box.scrollLeft+40||cx>box.scrollLeft+box.clientWidth-40)box.scrollLeft=Math.max(0,cx-box.clientWidth/2);}}
  return {render};
})();
