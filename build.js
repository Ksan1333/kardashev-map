// カルダシェフ文明マップ：src/ の部品を1つの index.html にまとめる
// 使い方: node build.js          → index.html と earth.html（three.js は CDN から読み込む。GitHub Pages で公開するのはこれ）
//        node build.js --local  → index.local.html と earth.local.html（three.js を node_modules から読む。オフライン確認用）
// earth.html は「地球大全」の読む画面。章は src/eb_p*.js（部ごと）に書く。
const fs=require("fs"),path=require("path"),vm=require("vm");
const SRC=path.join(__dirname,"src");
const read=f=>fs.readFileSync(path.join(SRC,f),"utf8");
let t=read("guide.template.html");
// プレースホルダー → ファイル（この順に差し込む）
const r={
  "__MAPDATA__":"mapdata.json",
  "__TREEDATA__":"treedata.js",
  "__TREEADD__":"treeadd.js",
  "__TREEADD2__":"treeadd2.js",
  "__TREEADD3__":"treeadd3.js",
  "__FUTMAP__":"futmap.js",
  "__LAYOUT__":"layout.js",
  "__GRAPHJS__":"graph.js",
  "__PALEO__":"paleo.js",
  "__PLATES__":"plates.json",
  "__PALEODEM__":"paleodem.json",
  "__EV3D__":"ev3d.js",
  "__THEATER__":"theater.js",
  "__LAWS3D__":"laws3d.js",
  "__LAWS__":"laws.js",
  "__LVINFO__":"levelinfo.js",
  "__SEARCH__":"search.js",
  "__ORG3D__":"org3d.js",
  "__CUTE__":"cute.js",
  "__MICROHQ__":"microhq.js",
  "__MICRO3D__":"micro3d.js",
  "__MICROX__":"microx.js",
  "__MICRODATA__":"microdata.js",
  "__NEWVIEWS__":"newviews.js",
  "__BRANCHDATA__":"branchdata.js",
  "__HISTBRANCH__":"histbranch.js",
  "__BRANCH__":"branch.js",
  "__WHDATA__":"worldhist.js",
  "__WHDATA2__":"worldhist2.js",
  "__PLACES__":"places.js",
  "__SCENE3D__":"scene3d.js",
  "__SPACE3D__":"space3d.js",
  "__SPACEFX__":"spacefx.js",
  "__SPACEPLANET__":"spaceplanet.js",
  "__SPACEBR__":"spacebr.js",
  "__WORLDMAP__":"worldmap.js",
  "__GITNAV__":"gitnav.js",
  "__SPACEVIEW__":"spaceview.js",
  "__PLANETMAP__":"planetmap.js",
  "__TYPE1__":"type1data.js",
  "__TYPE2__":"t2data.js",
  "__TYPE3__":"t3data.js",
  "__FUTACAD__":"futacad.js",
  "__FUTTREE__":"futtree.js",
  "__SFNOTE__":"sfnote.js",
  "__T1PINS__":"t1pins.json",
  "__ERA__":"era.js",
  "__WHC__":"whc.js",
  "__KSLIDER__":"kslider.js",
  "__SHELL__":"shell.js",
  "__TGUIDE__":"typeguide.js",
  "__ERADATA__":"eradata.js",
  "__COUNTRIES__":"countries.json",
  "__EARTHPATH__":"earthpath.json"
};
for(const [k,f] of Object.entries(r)){if(!t.includes(k))console.warn("missing placeholder",k);t=t.split(k).join(read(f));}
const local=process.argv.includes("--local");
const CDN3="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",LOCAL3="node_modules/three/build/three.min.js";
const URLS={"__MAP_URL__":local?"index.local.html":"index.html","__EARTH_URL__":local?"earth.local.html":"earth.html","__THREE_URL__":local?LOCAL3:CDN3};
const fill=s=>{for(const [k,v] of Object.entries(URLS))s=s.split(k).join(v);return s;};

// ---- 地球大全（章のファイルを順に読み、部・章・見出しを取り出す） ----
const ebFiles=fs.readdirSync(SRC).filter(f=>/^eb_p\d+\.js$/.test(f)).sort();
const ebSrc=ebFiles.map(read).join("\n");
const ctx={console};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(read("eb_core.js")+"\n"+ebSrc,ctx,{filename:"eb"});
const EB=ctx.EB;
const strip=h=>h.replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").trim();
const ids=new Set();EB.chapters.forEach(c=>{if(ids.has(c.id)||/[.\s]/.test(c.id))throw new Error("章のidが重複または不正: "+c.id);ids.add(c.id);});
// 章どうしのリンク（EB.see）が、ある章を指しているか確かめる
{const bad=[];EB.chapters.forEach(c=>{for(const m of c.h.matchAll(/class="ebsee" href="#([^".]+)/g))if(!ids.has(m[1]))bad.push(c.id+"→"+m[1]);});if(bad.length)console.warn("地球大全：行き先のない章リンク",bad.join(", "));}
// 文明マップの検索に渡す目次（部・章・見出し）
const EBIDX={p:EB.parts.map(p=>[p.id,p.t,p.ic]),c:EB.chapters.map(c=>[c.id,c.t,c.ic,EB.parts.findIndex(p=>p.id===c.part),[...c.h.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/g)].map(m=>strip(m[1])),c.k||""])};
t=t.split("__EBINDEX__").join(JSON.stringify(EBIDX));

const html=fill(local?t.replace(CDN3,LOCAL3):t);
const name=local?"index.local.html":"index.html";
fs.writeFileSync(path.join(__dirname,name),html);
console.log("built",name,(Buffer.byteLength(html)/1e6).toFixed(2)+" MB");

// ---- earth.html ----
{const md=(()=>{const c={console};c.window=c;vm.createContext(c);return vm.runInContext(read("microdata.js")+"\n;({MOLS,ATOMCOL,ATOMR})",c);})();
 const r2=a=>a.map(([e,x,y,z])=>[e,+x.toFixed(2),+y.toFixed(2),+z.toFixed(2)]);
 const mols=md.MOLS.filter(m=>["dna","h2o","co2","ch4","glu","nacl","benz","diam","c60","etoh","o3","nh3"].includes(m[0])).map(m=>[m[0],m[1],m[2],m[3],r2(m[4])]);
 let e=read("earth.template.html");
 const R={"__EBCORE__":read("eb_core.js"),"__EBCH__":ebSrc,"__MOL3D__":"var MOLS="+JSON.stringify(mols)+",ATOMCOL="+JSON.stringify(md.ATOMCOL)+",ATOMR="+JSON.stringify(md.ATOMR)+";","__LAWS3D__":read("laws3d.js")};
 for(const [k,v] of Object.entries(R)){if(!e.includes(k))console.warn("missing placeholder",k);e=e.split(k).join(v);}
 e=fill(e);
 const en=local?"earth.local.html":"earth.html";
 fs.writeFileSync(path.join(__dirname,en),e);
 const tabs=(EB.chapters.map(c=>c.h).join("").match(/<table/g)||[]).length;
 console.log("built",en,(Buffer.byteLength(e)/1e6).toFixed(2)+" MB",EB.parts.length+"部",EB.chapters.length+"章",tabs+"表");}
