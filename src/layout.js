/* ---------- 画面の共通レイアウト：見出し → 操作できる画面（中央）→ チップ・切り替え（下） ---------- */
(()=>{const CFG={
  overview:{stage:[".kpanel","#mm"],ctl:[]},
  timeline:{stage:["#tlw-cosmos","#tlw-earth","#tlw-hist"],ctl:["#tlswitch",".tllegend","#thdock"],inner:[["#tlw-hist","#histsw"],["#hist-grid","#tlregions",".whbar"]],pull:[["#hist-grid>.panel","#hist-grid","append"]]},
  "world-map":{stage:["#pmap",".maprow"],ctl:["#bodysel","#maplayers","#mapchips",".scaleswitch"]},
  "space-map":{stage:[".spwrap"],ctl:["#splevels",".scaleswitch"]},
  micro:{stage:[".mcwrap"],ctl:["#mclevels",".scaleswitch"],pull:[["#mclist","#mclevels","before"]]},
  lineage:{stage:[".gwrap"],ctl:["#gchips",".legend"]},
  laws:{stage:[".ctabbody"],ctl:["#ltabs"]},
 };
 Object.entries(CFG).forEach(([id,c])=>{const sec=document.getElementById("v-"+id);if(!sec)return;const kids=s=>[...sec.children].filter(e=>e.matches(s));
  const head=sec.querySelector(":scope>.view-head");if(!head)return;sec.prepend(head);let at=head;const bar=sec.querySelector(":scope>.erabar");if(bar){at.after(bar);at=bar;}
  const stage=[];c.stage.forEach(s=>kids(s).forEach(e=>{at.after(e);at=e;stage.push(e);}));
  if(c.ctl.length){const box=document.createElement("div");box.className="stagectl";c.ctl.forEach(s=>kids(s).forEach(e=>box.appendChild(e)));if(box.children.length){at.after(box);at=box;}}
  (c.inner||[]).forEach(([host,...sels])=>{const h=sec.querySelector(host);if(!h)return;const box=document.createElement("div");box.className="stagectl inner";sels.forEach(s=>{const e=h.querySelector(":scope>"+s);if(e)box.appendChild(e);});if(!box.children.length)return;
    h.appendChild(box);});
  (c.pull||[]).forEach(([src,ref,where])=>{const e=sec.querySelector(src),r=sec.querySelector(ref);if(e&&r)r[where](e);});
  sec.classList.add("staged");});
})();
