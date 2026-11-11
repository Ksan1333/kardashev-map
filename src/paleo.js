/* ---------- 大陸移動（簡略モデル） ---------- */
// プレートごとに「現在の重心がどこへ動き、どれだけ回転したか」をキーフレームで与え、球面上で補間する
const PALEO=(function(){
  const PL=__PLATES__;
  const NAMES={africa:"アフリカ",arabia:"アラビア",madagascar:"マダガスカル",india:"インド",eurasia:"ユーラシア",na:"北アメリカ",greenland:"グリーンランド",sa:"南アメリカ",australia:"オーストラリア",antarctica:"南極"};
  const C0={africa:[5,20],arabia:[23,46],madagascar:[-19,46.5],india:[22,79],eurasia:[52,75],na:[45,-98],greenland:[73,-41],sa:[-15,-60],australia:[-25,134],antarctica:[-82,20]};
  // [百万年前, {plate:[lat,lon,spin]}]  spinは度（正＝外から見て反時計回り）
  const K=[
   [0,{}],
   [50,{india:[8,78,10],australia:[-42,118,-5],antarctica:[-82,20,0],sa:[-20,-52,-5],na:[47,-90,-5],greenland:[70,-35,-5],arabia:[17,42,-5],africa:[0,18,-5],madagascar:[-24,44,-5]}],
   [100,{africa:[-5,15,-10],arabia:[12,38,-12],madagascar:[-28,40,-12],india:[-25,62,25],australia:[-58,105,-15],antarctica:[-80,10,0],sa:[-25,-32,10],na:[40,-70,-12],greenland:[65,-28,-12],eurasia:[50,70,-5]}],
   [150,{africa:[-10,12,-15],arabia:[8,36,-17],madagascar:[-23,40,-50],india:[-35,58,55],australia:[-56,92,-25],antarctica:[-68,35,-25],sa:[-24,-30,20],na:[28,-48,-20],greenland:[54,-22,-22],eurasia:[45,58,-10]}],
   [200,{africa:[-12,12,-18],arabia:[6,36,-20],madagascar:[-20,38,-60],india:[-32,55,65],australia:[-55,85,-35],antarctica:[-62,35,-35],sa:[-24,-26,22],na:[22,-36,-25],greenland:[46,-16,-28],eurasia:[40,50,-18]}],
   [250,{africa:[-20,10,-22],arabia:[-2,34,-24],madagascar:[-28,36,-64],india:[-40,53,70],australia:[-62,85,-40],antarctica:[-70,30,-40],sa:[-32,-28,26],na:[14,-38,-28],greenland:[38,-18,-30],eurasia:[32,48,-22]}],
   [330,{africa:[-30,5,-30],arabia:[-12,28,-32],madagascar:[-36,30,-70],india:[-50,38,75],australia:[-72,60,-50],antarctica:[-78,0,-50],sa:[-48,-28,40],na:[10,-38,-35],greenland:[34,-12,-38],eurasia:[25,50,-35]}],
   [420,{africa:[-40,-5,-40],arabia:[-22,18,-42],madagascar:[-45,20,-80],india:[-55,28,80],australia:[-70,40,-60],antarctica:[-80,-30,-60],sa:[-55,-45,45],na:[5,-75,-60],greenland:[25,-55,-60],eurasia:[30,40,-60]}],
   [540,{africa:[-35,-10,-50],arabia:[-18,10,-52],madagascar:[-40,15,-90],india:[-45,25,70],australia:[-55,35,-70],antarctica:[-70,-30,-70],sa:[-50,-50,40],na:[0,-100,-80],greenland:[20,-80,-80],eurasia:[-5,60,-80]}],
   [750,{africa:[-15,10,-40],arabia:[0,28,-40],madagascar:[-20,32,-80],india:[-30,45,50],australia:[5,60,-100],antarctica:[-20,70,-90],sa:[-25,-15,20],na:[5,-25,-60],greenland:[25,-15,-60],eurasia:[30,30,-60]}],
   [1100,{africa:[-25,0,-20],arabia:[-10,20,-20],madagascar:[-30,25,-60],india:[-35,40,30],australia:[0,40,-120],antarctica:[-15,60,-110],sa:[-35,-25,0],na:[0,-20,-90],greenland:[22,-10,-90],eurasia:[30,25,-90]}],
   [1800,{africa:[10,-40,40],arabia:[25,-20,40],madagascar:[-5,-20,0],india:[-10,10,0],australia:[30,40,-150],antarctica:[-35,60,-140],sa:[-30,-70,-30],na:[45,-10,-120],greenland:[60,10,-120],eurasia:[20,90,-120]}],
  ];
  // プレートが現れる時期（それ以前は海の下＝まだ大陸として育っていない、の簡略表現）
  const BORN={africa:3600,australia:3600,na:3200,sa:3000,eurasia:3000,india:2800,greenland:2700,antarctica:2600,arabia:2500,madagascar:2500};
  const V3=(a,b,c)=>[a,b,c];
  const toV=(lat,lon)=>{const p=lat*Math.PI/180,l=lon*Math.PI/180;return [Math.cos(p)*Math.cos(l),Math.cos(p)*Math.sin(l),Math.sin(p)];};
  const qMul=(a,b)=>[a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]];
  const qAxis=(ax,ang)=>{const s=Math.sin(ang/2);return [Math.cos(ang/2),ax[0]*s,ax[1]*s,ax[2]*s];};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l);};
  function poseQ(pl,pose){const a=toV(...C0[pl]),b=toV(pose[0],pose[1]);const ang=Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])));
    let q=ang<1e-6?[1,0,0,0]:qAxis(norm(cross(a,b)),ang);return qMul(qAxis(b,(pose[2]||0)*Math.PI/180),q);}
  function slerp(a,b,t){let d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3];if(d<0){b=b.map(x=>-x);d=-d;}if(d>.9995){const r=a.map((x,i)=>x+(b[i]-x)*t);const l=Math.hypot(...r);return r.map(x=>x/l);}
    const th=Math.acos(d),s=Math.sin(th);return a.map((x,i)=>(x*Math.sin((1-t)*th)+b[i]*Math.sin(t*th))/s);}
  const keyQ=K.map(([ma,p])=>[ma,Object.fromEntries(Object.keys(C0).map(k=>[k,p[k]?poseQ(k,p[k]):[1,0,0,0]]))]);
  // 0Maで指定がないプレートは直前のキーを引き継ぐ
  for(let i=1;i<keyQ.length;i++)for(const k of Object.keys(C0))if(!K[i][1][k])keyQ[i][1][k]=keyQ[i-1][1][k];
  function qAt(pl,ma){if(ma<=0)return [1,0,0,0];for(let i=1;i<keyQ.length;i++)if(ma<=keyQ[i][0]){const[a,qa]=keyQ[i-1],[b,qb]=keyQ[i];return slerp(qa[pl],qb[pl],(ma-a)/(b-a));}return keyQ[keyQ.length-1][1][pl];}
  function mat(q){const[w,x,y,z]=q;return [1-2*(y*y+z*z),2*(x*y-w*z),2*(x*z+w*y),2*(x*y+w*z),1-2*(x*x+z*z),2*(y*z-w*x),2*(x*z-w*y),2*(y*z+w*x),1-2*(x*x+y*y)];}
  // 現在の地図（プレート番号と色）
  let SW=1024,SH=512,idx=null,col=null;
  function prepare(colorDraw){const c=document.createElement("canvas");c.width=SW;c.height=SH;const g=c.getContext("2d");
    const ids=new Uint8Array(SW*SH).fill(255);
    PL.forEach(([k,d],i)=>{g.clearRect(0,0,SW,SH);g.fillStyle="#fff";g.fill(new Path2D(d));const a=g.getImageData(0,0,SW,SH).data;for(let p=0;p<SW*SH;p++)if(a[p*4+3]>100&&ids[p]===255)ids[p]=i;});
    const ai=PL.findIndex(x=>x[0]==="antarctica");for(let p=Math.floor(SH*174/180)*SW;p<SW*SH;p++)ids[p]=ai;
    g.clearRect(0,0,SW,SH);colorDraw(g,SW,SH);col=g.getImageData(0,0,SW,SH).data;idx=ids;}
  function defaultDraw(g,w,h){g.fillStyle="#4d7a3a";PL.forEach(([k,d])=>g.fill(new Path2D(d)));let s=5;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};
    g.save();PL.forEach(([k,d])=>g.clip(new Path2D(d)));g.restore();
    for(let i=0;i<1400;i++){g.globalAlpha=.3*R();g.fillStyle=i%2?"#a88f5a":"#2f5f2a";g.beginPath();g.arc(R()*w,R()*h,3+R()*14,0,7);g.fill();}g.globalAlpha=1;
    // 海に塗った斑点は消す（陸だけ残す）
    const tmp=document.createElement("canvas");tmp.width=w;tmp.height=h;const t=tmp.getContext("2d");t.fillStyle="#fff";PL.forEach(([k,d])=>t.fill(new Path2D(d)));g.globalCompositeOperation="destination-in";g.drawImage(tmp,0,0);g.globalCompositeOperation="source-over";
    g.fillStyle="#eef3f7";g.fillRect(0,h-34,w,34);}
  // ---- 実データ：PALEOMAP（Scotese 2016／Scotese & Wright 2018, CC BY 4.0）を2°格子にしたもの（0〜5.4億年前、500万年ごと） ----
  const DEM=__PALEODEM__;const DW=180,DH=91,dc={};
  function grid(a){if(dc[a])return dc[a];const s=DEM[a];if(!s)return null;const g=new Uint8Array(DW*DH);let i=0;const re=/([a-g])(\d*)/g;let m;while((m=re.exec(s))){const v=m[1].charCodeAt(0)-97,n=m[2]?+m[2]:1;g.fill(v,i,i+n);i+=n;}dc[a]=g;return g;}
  const DCOL=[[27,63,110],[36,84,138],[63,134,184],[95,138,60],[140,122,78],[238,243,247],[168,154,134]];
  function renderDEM(ma,out,ocean,tint){const a=Math.round(Math.min(540,Math.max(0,ma))/5)*5;const g=grid(String(a*1e6));if(!g)return false;
    const sm=document.createElement("canvas");sm.width=DW;sm.height=DH;const sg=sm.getContext("2d"),img=sg.createImageData(DW,DH);const snowO=ocean&&ocean[0]>150;
    for(let p=0;p<DW*DH;p++){const v=g[p];let c=DCOL[v];if(v<=2&&snowO)c=[ocean[0]+v*8,ocean[1]+v*6,ocean[2]];else if(v>=3&&tint)c=tint(...c);else if(v===3&&ma>470)c=[150,118,82];img.data.set([c[0],c[1],c[2],255],p*4);}
    sg.putImageData(img,0,0);out.width=W;out.height=H;const o=out.getContext("2d");o.imageSmoothingEnabled=true;o.imageSmoothingQuality="high";
    // 経度の継ぎ目をなめらかにするため左右に1列ずつ足して拡大
    o.filter="blur(2.5px)";o.drawImage(sm,0,0,DW,DH,0,0,W,H);o.filter="none";
    o.globalAlpha=.10;for(let i=0;i<600;i++){o.fillStyle=i%2?"#000":"#fff";o.fillRect(Math.random()*W,Math.random()*H,2+Math.random()*4,1+Math.random()*2);}o.globalAlpha=1;return true;}
  // 過去の地図を描く（出力 W×H）
  const W=768,H=384;let dirs=null;
  function render(ma,out,ocean=[29,74,120],colorDraw,tint){
    if(ma<=542&&renderDEM(ma,out,ocean,tint))return out;
    if(!idx)prepare(colorDraw||defaultDraw);
    if(!dirs){dirs=new Float32Array(W*H*3);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=toV(90-(y+.5)/H*180,(x+.5)/W*360-180);dirs.set(v,(y*W+x)*3);}}
    const g=out.getContext("2d"),img=g.createImageData(W,H),d=img.data;
    const Ms=PL.map(([k])=>(ma>=(BORN[k]||1e9))?null:mat(qAt(k,ma)));
    for(let p=0;p<W*H;p++){const vx=dirs[p*3],vy=dirs[p*3+1],vz=dirs[p*3+2];let r=ocean[0],gg=ocean[1],b=ocean[2];
      for(let i=0;i<Ms.length;i++){const m=Ms[i];if(!m)continue;
        // 逆回転（転置）で現在位置へ
        const x=m[0]*vx+m[3]*vy+m[6]*vz,y=m[1]*vx+m[4]*vy+m[7]*vz,z=m[2]*vx+m[5]*vy+m[8]*vz;
        const lat=Math.asin(Math.max(-1,Math.min(1,z))),lon=Math.atan2(y,x);
        const sx=Math.min(SW-1,Math.floor((lon/Math.PI+1)/2*SW)),sy=Math.min(SH-1,Math.floor((.5-lat/Math.PI)*SH));const q=sy*SW+sx;
        if(idx[q]===i){r=col[q*4];gg=col[q*4+1];b=col[q*4+2];if(tint){const t=tint(r,gg,b);r=t[0];gg=t[1];b=t[2];}break;}}
      d[p*4]=r;d[p*4+1]=gg;d[p*4+2]=b;d[p*4+3]=255;}
    out.width=W;out.height=H;g.putImageData(img,0,0);return out;}
  const label=ma=>(ma<=540?"":"推定・")+(ma<=0?"現在":ma<=25?"ほぼ現在の配置":ma<=120?"大西洋が広がっていく":ma<=180?"パンゲアの分裂":ma<=300?"超大陸パンゲア":ma<=480?"ゴンドワナ大陸とローレンシア":ma<=650?"大陸がばらばらに":ma<=1200?"超大陸ロディニア":ma<=2000?"超大陸ヌーナ（コロンビア）":"小さな原始大陸")+(ma<=540?"":"");
  return {render,qAt,label,NAMES,PL,W,H};
})();
