/* ---------- ⑧ 系統樹（ズーム式ブランチグラフ） ---------- */
(()=>{
  const END=1000000;
  const B=[-300000,-40000,-10000,-3500,-500,500,1450,1760,1880,1945,1990,2026].concat(END>2026?[END]:[]);
  const ERA=[["先史",-300000,-3500],["古代",-3500,500],["中世",500,1450],["近世",1450,1760],["近代",1760,1945],["現代",1945,2026],["Type Iへ（もしも）",2026,2300],["Type IIへ（もしも）",2300,6000],["Type IIIへ（もしも）",6000,END]];
  let EY=END;
  const Y0=-300000, W0=END-Y0, RH=20, AX=40;   // 1年＝1単位の均等な時間軸
  const X0=y=>Math.max(Y0,Math.min(END,y))-Y0;
  const man=n=>n>=10000?(n%10000?`${Math.floor(n/10000)}万${n%10000}`:`${n/10000}万`):`${n}`;
  const fy=y=>y<=-10000?`約${man(-y)}年前`:y<0?`前${-y}年頃`:`${y}年`;
  const fyShort=y=>y<=-10000?`${man(-y)}年前`:y<0?`前${-y}`:`${y}`;
  const eraOf=y=>ERA.find(([,a,b])=>y>=a&&y<b)?.[0]||"現代";
  const endOf=n=>typeof n.d==="number"?n.d:EY;
  const status=n=>typeof n.d==="number"?"dead":n.d==="f"?"fade":"alive";
  const STAT={alive:["現役","alive"],fade:["衰退中","fade"],dead:["消滅","dead"]};
  const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");

  const ORDER=["academia","culture","politics","nations","war","economy","work","medicine","food","agri","tools","energy","transport","info","space","ent"];
  const F=ORDER.map(k=>TREE.find(t=>t.key===k)).filter(Boolean).map(f=>({...f,nodes:f.nodes.map(([id,name,p,b,d,to,desc])=>({id,name,p,b,d,to,desc,fk:f.key}))}));
  const byKey=Object.fromEntries(F.map(f=>[f.key,f]));
  F.forEach(f=>{f.map=Object.fromEntries(f.nodes.map(n=>[n.id,n]));f.start=Math.min(...f.nodes.map(n=>n.b));f.color=f.color;});
  const INVK={"活版印刷":"info:press","蒸気機関":"tools:steam","ワクチン":"medicine:vaccine","電力網":"energy:grid","自動車（内燃機関）":"transport:car","ハーバー・ボッシュ法":"agri:fertilizer","抗生物質":"medicine:antibiotics","トランジスタ":"tools:transistor","コンテナ船":"transport:container","人工衛星":"space:sat","インターネット":"info:internet","GPS":"space:gps","リチウムイオン電池":"energy:battery","スマートフォン":"info:smartphone","再使用ロケット":"space:reuse","mRNAワクチン":"medicine:mrna","大規模言語モデル（生成AI）":"info:chatai"};
  const INVD={}; (typeof INV!=="undefined"?INV:[]).forEach(([n,y,c,d,w])=>{if(INVK[n])INVD[INVK[n]]={d,w,y};});
  const PAGE={}; if(typeof FIELDS!=="undefined"){const m={history:["nations"],politics:["politics"],war:["war"],tech:["tools","info"],energy:["energy"],space:["space"],medicine:["medicine"],academia:["academia"],agriculture:["agri"],food:["food"],culture:["culture"],subculture:["ent"]};FIELDS.forEach(f=>(m[f.id]||[]).forEach(k=>PAGE[k]=f));}
  const aliveAt=(n,y)=>n.b<=y&&(typeof n.d!=="number"||n.d>y);
  function order(f){const kids={};f.nodes.forEach(n=>{(kids[n.p||"_"]??=[]).push(n);});
    Object.values(kids).forEach(a=>a.sort((a,b)=>a.b-b.b));const out=[];const walk=n=>{out.push(n);(kids[n.id]||[]).forEach(walk);};(kids._||[]).forEach(walk);return out;}
  function ancestors(f,id){const a=[];let n=f.map[id];while(n){a.unshift(n);n=n.p?f.map[n.p]:null;}return a;}

  // レーンの構築
  let showDead=true, lanes=[], laneOf={}, H0=0, only=new Set(), FV=F;
  function build(){
    lanes=[{t:"trunk"}]; laneOf={}; FV=only.size?F.filter(f=>only.has(f.key)):F;
    F.forEach(f=>{f.lane=-1;f.last=-1;});
    FV=FV.filter(f=>f.nodes.some(n=>n.b<=EY));
    FV.forEach(f=>{
      lanes.push({t:"gap"});
      f.lane=lanes.length; lanes.push({t:"field",f});
      order(f).forEach(n=>{ if(n.b>EY)return; if(!showDead&&typeof n.d==="number")return; laneOf[f.key+":"+n.id]=lanes.length; lanes.push({t:"node",f,n}); });
      f.last=lanes.length-1;
    });
    H0=lanes.length*RH;
  }
  function applyEra(){const Y=Math.min(END,typeof window.KYEAR==="number"?window.KYEAR:END);EY=Y;
    F.forEach(f=>{f.nodes.forEach(n=>{if(n.d0===undefined)n.d0=n.d;n.d=(typeof n.d0==="number"&&n.d0>Y)?null:n.d0;});const bs=f.nodes.filter(n=>n.b<=Y).map(n=>n.b);f.start=bs.length?Math.min(...bs):Y;});}
  applyEra();build();

  // ビュー状態
  const cv=document.getElementById("gcanvas"), svg=document.getElementById("gsvg"), panel=document.getElementById("gpanel");
  let vw=0,vh=0,kx=1,ky=1,tx=0,ty=0,fit={kx:1,ky:1}, sel=null, raf=0;
  const sx=y=>X0(y)*kx+tx, syL=i=>(i*RH+RH/2)*ky+ty+AX;
  function measure(){const r=cv.getBoundingClientRect();if(r.width<50)return false;vw=r.width;vh=r.height;fit.kx=(vw-150)/W0;fit.ky=(vh-AX-10)/H0;}
  function viewRange(a,b){kx=(vw-150)/(b-a);tx=120-X0(a)*kx;}
  function clamp(){kx=Math.min(Math.max(kx,fit.kx*.9),vw/3);ky=Math.min(Math.max(ky,fit.ky*.8),70/RH);
    const minTx=vw-(W0*kx)-140, maxTx=130; tx=Math.min(Math.max(tx,Math.min(minTx,maxTx)),Math.max(minTx,maxTx));
    const minTy=vh-AX-H0*ky-40, maxTy=40; ty=Math.min(Math.max(ty,Math.min(minTy,maxTy)),Math.max(minTy,maxTy));}
  function fitAll(){if(measure()===false)return;ky=fit.ky;ty=0;viewRange(-3500,Math.min(EY,6000));clamp();draw();}
  function fitFull(){if(measure()===false)return;ky=fit.ky;ty=0;viewRange(Y0,EY);clamp();draw();}
  const draw=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;render();});};

  function curve(x0,y0,x1,y1,col,w,dash,op){
    const dx=Math.max(8,Math.min(22,(x1-x0)*.9));
    return `<path d="M${x0},${y0} C${x0+dx},${y0} ${x1-dx},${y1} ${x1},${y1}" fill="none" stroke="${col}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:""}${op!=null?` opacity="${op}"`:""}/>`;
  }

  function render(){
    if(vw<50||fit.kx<=0)return;
    const lp=RH*ky, mode=lp<9?0:lp<15?1:lp<34?2:3; // 0:全体 1:中 2:名前 3:説明
    const vis=y=>y>AX-40&&y<vh+40;
    const path=new Set(); if(sel){ancestors(byKey[sel.f],sel.id).forEach(n=>path.add(sel.f+":"+n.id));}
    let g=[], con=[];
    // 時代の帯
    ERA.forEach(([nm,a,b],i)=>{const x1=sx(a),x2=sx(b);if(x2<0||x1>vw)return;if(i%2===0)g.push(`<rect x="${x1}" y="${AX}" width="${x2-x1}" height="${vh}" fill="#ffffff07"/>`);});
    // 分野の帯
    FV.forEach((f,i)=>{const y1=syL(f.lane)-lp/2,y2=syL(f.last)+lp/2;if(y2<AX||y1>vh)return;
      g.push(`<rect x="0" y="${y1}" width="${vw}" height="${y2-y1}" fill="${f.color}" opacity="${i%2?.035:.06}"/>`);});
    const W=mode===0?1:mode===1?1.6:2.4, dim=sel?0.45:1;
    // 幹
    const yT=syL(0);
    if(vis(yT)) g.push(`<line x1="${sx(-300000)}" x2="${sx(EY)}" y1="${yT}" y2="${yT}" stroke="#dfe5f5" stroke-width="${W+1.5}"/>`);
    // レーン
    const lab=[];
    lanes.forEach((L,i)=>{
      if(L.t==="field"){
        const f=L.f,y=syL(i),x1=sx(f.start);
        if(Math.min(y,yT)<vh&&Math.max(y,yT)>AX-10) con.push(curve(x1-18,yT,x1,y,f.color,W+.6));
        if(vis(y)){g.push(`<line x1="${x1}" x2="${sx(EY)}" y1="${y}" y2="${y}" stroke="${f.color}" stroke-width="${W+1}"/>`,
          `<circle cx="${x1}" cy="${y}" r="${mode?5:3}" fill="${f.color}" stroke="#0a0f1f" stroke-width="1.5"/>`);
          g.push(`<rect class="g-hit" data-field="${f.key}" x="${x1-6}" y="${y-Math.max(lp/2,5)}" width="${sx(EY)-x1+6}" height="${Math.max(lp,10)}" fill="transparent"/>`);}
        return;
      }
      if(L.t!=="node")return;
      const {f,n}=L, y=syL(i), pi=n.p?laneOf[f.key+":"+n.p]:f.lane, py=syL(pi??f.lane);
      if(Math.max(y,py)<AX-20||Math.min(y,py)>vh+20){ // 画面外
        if(!(typeof n.d==="number"&&n.to))return;
      }
      const key=f.key+":"+n.id, on=path.has(key), st=status(n);
      const col=st==="dead"?"#6a7090":f.color, op=sel?(on?1:dim):1, ww=on?W+1.4:W;
      const x1=sx(n.b), x2=sx(endOf(n));
      // 分岐
      const p=n.p?f.map[n.p]:null;
      if(p&&typeof p.d==="number"&&p.d<n.b&&pi!==undefined){
        const xe=sx(p.d); con.push(`<line x1="${xe}" x2="${x1-18}" y1="${py}" y2="${py}" stroke="${col}" stroke-width="${ww*.7}" stroke-dasharray="3 3" opacity="${op}"/>`);
        con.push(curve(x1-18,py,x1,y,on?"var(--accent)":col,ww*.8,"3 3",op));
      } else con.push(curve(Math.max(x1-18,sx(p?p.b:f.start)),py,x1,y,on?"var(--accent)":col,ww*.85,null,op));
      if(!vis(y)&&!(typeof n.d==="number"&&n.to))return;
      // ブランチ本体
      if(st==="fade") g.push(`<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="url(#gf-${f.key})" stroke-width="${ww}" opacity="${op}"/>`);
      else g.push(`<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="${col}" stroke-width="${ww}" opacity="${op}"/>`);
      // 合流（置き換え先へ）
      if(st==="dead"&&n.to&&laneOf[f.key+":"+n.to]!==undefined){
        const ty2=syL(laneOf[f.key+":"+n.to]), xt=Math.max(sx(f.map[n.to].b),x2+14);
        if(Math.min(y,ty2)<vh&&Math.max(y,ty2)>AX) con.push(curve(x2,y,xt,ty2,"#8e98b5",Math.max(1,ww*.6),"4 3",sel?(on?1:.35):.8));
      }
      if(!vis(y))return;
      // コミット点
      const r=mode===0?1.6:mode===1?3:mode===2?4.2:5.5;
      if(INVD[key]&&mode>=1){const rr=r+2.5;g.push(`<rect x="${x1-rr/1.414}" y="${y-rr/1.414}" width="${rr*1.414}" height="${rr*1.414}" transform="rotate(45 ${x1} ${y})" fill="#f4b942" stroke="${sel&&sel.f===f.key&&sel.id===n.id?"#fff":"#0a0f1f"}" stroke-width="1.5" opacity="${op}"/>`);}
      else g.push(`<circle cx="${x1}" cy="${y}" r="${sel&&sel.f===f.key&&sel.id===n.id?r+2:r}" fill="${col}" stroke="${sel&&sel.f===f.key&&sel.id===n.id?"#fff":"#0a0f1f"}" stroke-width="1.5" opacity="${op}"/>`);
      if(st==="dead"&&mode>=1) g.push(`<text x="${x2+3}" y="${y+4}" font-size="${mode>=2?11:9}" fill="#9aa0b8" opacity="${op}">✕</text>`);
      // 当たり判定
      g.push(`<rect class="g-hit" data-f="${f.key}" data-id="${n.id}" x="${x1-8}" y="${y-Math.max(lp/2,4)}" width="${Math.max(x2-x1+16,mode>=2?140:20)}" height="${Math.max(lp,8)}" fill="transparent"/>`);
      // ラベル
      if(mode>=1){
        const fs=mode===1?9.5:mode===2?12:13.5, tcol=st==="dead"?"#9aa0b8":"#e9edf7";
        const rightSide=x1>vw-170, lx=rightSide?x1-7:Math.max(x1+7,4);
        let t=`<text x="${lx}" y="${y-(mode===1?3:5)}" font-size="${fs}" fill="${tcol}" opacity="${op}" font-weight="${on?700:500}" class="g-lab"${rightSide?' text-anchor="end"':""}>${esc(n.name)}`;
        if(mode>=2) t+=`<tspan fill="#8e98b5" font-size="${fs-2}" font-family="IBM Plex Mono,monospace">　${fyShort(n.b)}${typeof n.d==="number"?"–"+fyShort(n.d):""}</tspan>`;
        t+=`</text>`;
        if(mode===3) t+=`<text x="${lx}" y="${y+16}"${rightSide?' text-anchor="end"':""} font-size="12" fill="#b9c2da" opacity="${op}" class="g-lab">${esc(n.desc)}</text>`;
        lab.push(t);
      }
    });
    // 分野名（左に固定）
    FV.forEach(f=>{
      const y1=syL(f.lane),y2=syL(f.last); if(y2<AX||y1-20>vh)return;
      if(mode===0){const cy=Math.min(Math.max((y1+y2)/2,AX+14),vh-8);
        lab.push(`<text x="10" y="${cy+5}" font-size="14" font-weight="900" font-family="Murecho,sans-serif" fill="${f.color}" class="g-lab">${f.name}</text>`);}
      else{const yy=Math.min(Math.max(y1,AX+16),y2), bw=f.name.length*13+20, bx=mode>=2?vw-bw-8:4;
        lab.push(`<rect x="${bx}" y="${yy-13}" width="${bw}" height="20" rx="5" fill="#0a0f1fdd" stroke="${f.color}" stroke-opacity=".6"/><text x="${bx+8}" y="${yy+2}" font-size="12.5" font-weight="700" fill="${f.color}">${f.name}</text>`);}
    });
    // 時間軸（上に固定）
    let grid="", ax=`<rect x="0" y="0" width="${vw}" height="${AX}" fill="#0a0f1f"/><line x1="0" x2="${vw}" y1="${AX}" y2="${AX}" stroke="var(--line)"/>`;
    ERA.forEach(([nm,a,b])=>{const x1=Math.max(sx(a),0),x2=Math.min(sx(b),vw);if(x2-x1<30)return;ax+=`<text x="${(x1+x2)/2}" y="15" text-anchor="middle" font-size="12" font-weight="700" fill="#e9edf7" font-family="Murecho,sans-serif">${nm}</text>`;});
    const ya=(0-tx)/kx+Y0, yb=(vw-tx)/kx+Y0, steps=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000];
    const step=steps.find(s=>s*kx>=72)||100000, cand=[]; for(let y=Math.ceil(ya/step)*step;y<=Math.min(yb,EY);y+=step)cand.push(y);
    let last=-1e9; cand.forEach(y=>{const x=sx(y);if(x<-5||x>vw+5||x-last<50)return;last=x;
      ax+=`<line x1="${x}" x2="${x}" y1="${AX-8}" y2="${AX}" stroke="#8e98b5"/><text x="${x}" y="${AX-12}" text-anchor="middle" font-size="10" fill="#8e98b5" font-family="IBM Plex Mono,monospace">${fyShort(y)}</text>`;grid+=`<line x1="${x}" x2="${x}" y1="${AX}" y2="${vh}" stroke="#ffffff0b"/>`;});
    const defs=`<defs>${F.map(f=>`<linearGradient id="gf-${f.key}" x1="0" x2="1"><stop offset="0" stop-color="${f.color}"/><stop offset=".6" stop-color="${f.color}" stop-opacity=".7"/><stop offset="1" stop-color="${f.color}" stop-opacity="0"/></linearGradient>`).join("")}</defs>`;
    svg.setAttribute("viewBox",`0 0 ${vw} ${vh}`);
    svg.innerHTML=defs+grid+g.join("")+lab.join("")+con.join("")+ax+(FV.length?"":`<text x="${vw/2}" y="${vh/2}" text-anchor="middle" fill="#9aa6c2" font-size="15" font-family="Murecho,sans-serif">この時代にはまだ人類がいないため、系統樹は空です。年表の「地球史」で生命の系統樹を見られます。</text>`);
    document.getElementById("gzoom").textContent=`×${(ky/fit.ky).toFixed(1)}　${["全体","分野","名前","説明"][mode]}表示`;
  }

  // ズーム・パン
  function zoomAt(cx,cy,fx,fy2){
    const wx=(cx-tx)/kx, wy=(cy-AX-ty)/ky;
    kx*=fx; ky*=fy2; clamp();
    tx=cx-wx*kx; ty=cy-AX-wy*ky; clamp(); draw();
  }
  cv.addEventListener("wheel",e=>{
    e.preventDefault(); const r=cv.getBoundingClientRect(), cx=e.clientX-r.left, cy=e.clientY-r.top;
    if(e.shiftKey){tx-=(e.deltaY||e.deltaX);clamp();draw();return;}
    const f=Math.exp(-e.deltaY*(e.ctrlKey?.01:.0018));
    if(e.altKey) zoomAt(cx,cy,f,1); else zoomAt(cx,cy,f,f);
    document.getElementById("ghint").classList.add("off");
  },{passive:false});
  const ptrs=new Map(); let drag=null, moved=0, pinch=null;
  cv.addEventListener("pointerdown",e=>{
    if(e.target.closest(".gtools,.gpanel"))return;
    cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===1){drag={x:e.clientX,y:e.clientY,tx,ty};moved=0;}
    if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)};drag=null;}
  });
  cv.addEventListener("pointermove",e=>{
    if(!ptrs.has(e.pointerId))return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y),r=cv.getBoundingClientRect();
      zoomAt((a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top,d/pinch.d,d/pinch.d);pinch.d=d;moved=99;return;}
    if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));
      tx=drag.tx+dx;ty=drag.ty+dy;clamp();draw();cv.classList.add("dragging");}
  });
  const up=e=>{
    if(!ptrs.has(e.pointerId))return; ptrs.delete(e.pointerId); cv.classList.remove("dragging");
    if(ptrs.size<2)pinch=null;
    if(drag&&moved<5&&e.type==="pointerup"){
      const el=document.elementFromPoint(e.clientX,e.clientY)?.closest(".g-hit");
      if(el?.dataset.id) select(el.dataset.f,el.dataset.id,false);
      else if(el?.dataset.field) fieldInfo(el.dataset.field);
    }
    drag=null;
  };
  cv.addEventListener("pointerup",up); cv.addEventListener("pointercancel",up);
  cv.addEventListener("dblclick",e=>{if(e.target.closest(".gtools,.gpanel"))return;const r=cv.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,2,2);});
  cv.addEventListener("keydown",e=>{
    if(e.target!==cv)return; const c=[vw/2,vh/2];
    if(e.key==="+"||e.key==="="){zoomAt(...c,1.4,1.4);} else if(e.key==="-"){zoomAt(...c,1/1.4,1/1.4);}
    else if(e.key==="ArrowLeft"){tx+=60;clamp();draw();} else if(e.key==="ArrowRight"){tx-=60;clamp();draw();}
    else if(e.key==="ArrowUp"){ty+=60;clamp();draw();} else if(e.key==="ArrowDown"){ty-=60;clamp();draw();}
    else return; e.preventDefault();
  });
  document.getElementById("gz-in").onclick=()=>zoomAt(vw/2,vh/2,1.6,1.6);
  document.getElementById("gz-out").onclick=()=>zoomAt(vw/2,vh/2,1/1.6,1/1.6);
  document.getElementById("gz-fit").onclick=()=>fitFull();
  document.getElementById("gz-civ").onclick=()=>{viewRange(-3500,EY);clamp();draw();};
  document.getElementById("gz-mod").onclick=()=>{viewRange(1750,EY);clamp();draw();};
  document.getElementById("gz-read").onclick=()=>{const f=(24/RH)/ky;zoomAt(vw/2,vh/2,Math.max(f,1),f);};
  document.getElementById("gdead").addEventListener("change",e=>{showDead=e.target.checked;
    if(sel&&!showDead&&typeof byKey[sel.f].map[sel.id].d==="number"){sel=null;closePanel();}
    build();measure();clamp();draw();});

  function focusLane(i,year){
    const want=26/RH; if(ky<want){const f=want/ky;ky*=f;kx*=f;}
    clamp(); ty=(vh-AX)/2-(i*RH+RH/2)*ky; tx=vw*.3-X0(year)*kx; clamp(); draw();
  }
  // 分野チップ
  const chips=document.getElementById("gchips");
  function renderChips(){chips.innerHTML=`<button class="chip" data-all="1" aria-pressed="${only.size===0}">すべて</button>`+F.map(f=>`<button class="chip" data-k="${f.key}" aria-pressed="${only.has(f.key)}"><span class="dot" style="background:${f.color}"></span>${f.name}</button>`).join("");}
  renderChips();
  function setOnly(s){only=s;renderChips();if(sel&&only.size&&!only.has(sel.f)){sel=null;closePanel();}build();fitAll();if(only.size===1)fieldInfo([...only][0]);}
  function zoomField(key){const f=byKey[key];if(!f)return;measure();
    const n=f.last-f.lane+1; ky=Math.max((vh-AX-30)/(n*RH),14/RH); kx=Math.max(fit.kx,kx); clamp();
    ty=-(f.lane*RH)*ky+10; tx=110-X0(-300000)*kx; clamp(); fieldInfo(f.key); draw();}
  chips.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.all){setOnly(new Set());return;}const s=new Set(only);s.has(b.dataset.k)?s.delete(b.dataset.k):s.add(b.dataset.k);setOnly(s);});
  window.openTreeField=k=>{setOnly(new Set([k]));};
  window.TREE_SELECT=(fk,id)=>{const f=byKey[fk];if(!f||!f.map||!f.map[id])return false;if(only.size&&!only.has(fk))setOnly(new Set());try{select(fk,id,true);}catch(e){console.warn(e);return false;}return true;};

  // 詳細パネル
  function plate(f,n){
    const seed=[...n.id].reduce((a,c)=>a+c.charCodeAt(0),0);let rings="";
    for(let i=0;i<6;i++){rings+=`<circle cx="${30+((seed*(i+7))%260)}" cy="${20+((seed*(i+11))%110)}" r="${20+((seed*(i+3))%70)}" fill="${f.color}" opacity="${.05+i*.025}"/>`;}
    return `<div class="plate" style="background:linear-gradient(135deg,#0e1830,#1c2748)"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">${rings}
      <text x="16" y="62" fill="${f.color}" font-family="Murecho,sans-serif" font-weight="900" font-size="30">${esc(n.name.replace(/（.*?）/,"").slice(0,10))}</text>
      <text x="16" y="88" fill="#ffffffaa" font-family="IBM Plex Mono,monospace" font-size="13">${fy(n.b)}〜${typeof n.d==="number"?fy(n.d):"現在"}</text></svg>
      <span class="cap">図版（写真は下のリンクから）</span></div>`;
  }
  function openPanel(){panel.hidden=false;document.querySelector('.gwrap').classList.add('open');}
  function closePanel(){panel.hidden=true;document.querySelector('.gwrap').classList.remove('open');}
  const closeBtn=`<button class="gclose" data-close="1" aria-label="閉じる">×</button>`;
  function select(fk,id,center){
    sel={f:fk,id}; const f=byKey[fk], n=f.map[id], st=status(n), [sl,sc]=STAT[st];
    const anc=ancestors(f,id), kids=f.nodes.filter(x=>x.p===id).sort((a,b)=>a.b-b.b), to=n.to?f.map[n.to]:null;
    const from=f.nodes.filter(x=>x.to===id);
    const y=Math.max(n.b,-300000);
    const snap=F.filter(o=>o.key!==fk).map(o=>{const list=o.nodes.filter(x=>aliveAt(x,y)).sort((a,b)=>b.b-a.b).slice(0,3);
      return list.length?`<div><span>${o.name}</span>${list.map(x=>`<button class="linkbtn" data-f="${o.key}" data-id="${x.id}">${esc(x.name)}</button>`).join("")}</div>`:"";}).join("");
    const q=encodeURIComponent(n.name.replace(/（.*?）/g,""));
    const btn=(fkey,x)=>`<button data-f="${fkey}" data-id="${x.id}" class="${typeof x.d==="number"?"linkbtn dead":""}">${esc(x.name)}</button>`;
    panel.innerHTML=closeBtn+plate(f,n)+`
      <div class="meta"><span class="pill ${sc}">${sl}</span><span style="color:${f.color}">${f.name}</span><span>・${eraOf(n.b)}に誕生</span></div>
      <h3>${esc(n.name)}</h3>
      <div class="meta num">${fy(n.b)} 〜 ${typeof n.d==="number"?fy(n.d)+"に消滅":n.d==="f"?"現在（衰退中）":"現在"}</div>
      <p>${esc(n.desc)}</p>
      ${INVD[fk+":"+id]?`<div class="invbox"><b>◆ 暮らしを変えた発明</b><p>${esc(INVD[fk+":"+id].d)}</p><p class="without"><span>なかったら</span>　${esc(INVD[fk+":"+id].w)}</p></div>`:""}
      ${to?`<div><h4>合流した先（後継）</h4><div class="lineage">${btn(fk,to)}</div></div>`:""}
      ${from.length?`<div><h4>ここに合流した要素</h4><div class="lineage">${from.map(x=>btn(fk,x)).join("")}</div></div>`:""}
      <div><h4>系譜</h4><div class="lineage"><span style="color:var(--muted)">人類 → ${f.name} →</span>${anc.map((a,i)=>(i?"<span>→</span>":"")+btn(fk,a)).join("")}</div></div>
      ${kids.length?`<div><h4>ここから分かれた要素（${kids.length}）</h4><div class="lineage">${kids.map(k=>btn(fk,k)).join("")}</div></div>`:""}
      <div><h4>${fy(y)}ごろ、他の分野では</h4><div class="snap">${snap||"<div>この時代の記録はまだ少ない</div>"}</div></div>
      <div><h4>写真を見る（外部サイト）</h4><div class="photo">
        <a href="https://ja.wikipedia.org/w/index.php?search=${q}" target="_blank" rel="noopener">Wikipediaで調べる</a>
        <a href="https://www.google.com/search?tbm=isch&q=${q}" target="_blank" rel="noopener">画像検索</a></div></div>`;
    openPanel(); requestAnimationFrame(()=>panel.scrollTop=0);
    const li=laneOf[fk+":"+id]; if(center&&li!==undefined) focusLane(li,n.b); else draw();
  }
  function fieldInfo(fk){
    const f=byKey[fk], pts=[["先史末",-3500],["古代末",500],["中世末",1450],["近世末",1760],["近代末",1945],["現在",2026]];
    const vals=pts.map(([l,y])=>[l,f.nodes.filter(n=>aliveAt(n,y-.5)).length]), max=Math.max(...vals.map(v=>v[1]),1);
    const dead=f.nodes.filter(n=>typeof n.d==="number");
    panel.innerHTML=closeBtn+`<div class="meta"><span class="pill" style="color:${f.color};border-color:${f.color}">分野</span></div><h3>${f.name}</h3>
      ${PAGE[fk]?`<p>${PAGE[fk].lead}</p><div class="stats">${PAGE[fk].stats.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join("")}</div><ul class="fpts">${PAGE[fk].pts.map(p=>`<li>${p}</li>`).join("")}</ul>`:""}
      <p>${f.nodes.length}の要素。いま現役なのは${f.nodes.filter(n=>typeof n.d!=="number").length}、消えたのは${dead.length}。</p>
      <div><h4>時代ごとの要素数</h4><div class="counts">${vals.map(([l,v])=>`<div><b>${v}</b><i style="height:${6+v/max*40}px;background:${f.color}"></i><span>${l}</span></div>`).join("")}</div></div>
      <div><h4>根（最初の要素）</h4><div class="lineage">${f.nodes.filter(n=>!n.p).map(n=>`<button data-f="${fk}" data-id="${n.id}">${esc(n.name)}</button>`).join("")}</div></div>
      ${f.nodes.some(n=>INVD[fk+":"+n.id])?`<div><h4>◆ 暮らしを変えた発明</h4><div class="lineage">${f.nodes.filter(n=>INVD[fk+":"+n.id]).map(n=>`<button data-f="${fk}" data-id="${n.id}">${esc(n.name)}</button>`).join("")}</div></div>`:""}
      ${dead.length?`<div><h4>消えた要素</h4><div class="lineage">${dead.map(n=>`<button data-f="${fk}" data-id="${n.id}" class="linkbtn dead">${esc(n.name)}</button>`).join("")}</div></div>`:""}`;
    openPanel(); sel=null; draw();
  }
  panel.addEventListener("click",e=>{
    if(e.target.closest("[data-close]")){closePanel();sel=null;draw();return;}
    const b=e.target.closest("button[data-id]"); if(b) select(b.dataset.f,b.dataset.id,true);
  });

  new ResizeObserver(()=>{const first=!vw, wasFitY=ky<=fit.ky*1.02, ya=(120-tx)/kx+Y0, yb=(vw-30-tx)/kx+Y0;if(measure()===false)return;if(first)fitAll();else{viewRange(ya,yb);if(wasFitY){ky=fit.ky;}clamp();draw();}}).observe(cv);
  window.addEventListener("k-year",()=>{applyEra();build();if(measure()!==false){ky=fit.ky;ty=0;if(EY>-3000)viewRange(-3500,Math.min(EY,6000));else viewRange(-300000,Math.max(EY,-200000));clamp();draw();}});
})();
