// カルダシェフ文明マップ：src/ の部品を1つの index.html にまとめる
// 使い方: node build.js          → index.html（three.js は CDN から読み込む。GitHub Pages で公開するのはこれ）
//        node build.js --local  → index.local.html（three.js を node_modules から読む。オフライン確認用）
const fs=require("fs"),path=require("path");
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
  "__GRAPHJS__":"graph.js",
  "__PALEO__":"paleo.js",
  "__PLATES__":"plates.json",
  "__PALEODEM__":"paleodem.json",
  "__EV3D__":"ev3d.js",
  "__THEATER__":"theater.js",
  "__LAWS3D__":"laws3d.js",
  "__LAWS__":"laws.js",
  "__EARTHBOOK__":"earthbook.js",
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
  "__TGUIDE__":"typeguide.js",
  "__ERADATA__":"eradata.js",
  "__COUNTRIES__":"countries.json",
  "__EARTHPATH__":"earthpath.json"
};
for(const [k,f] of Object.entries(r)){if(!t.includes(k))console.warn("missing placeholder",k);t=t.split(k).join(read(f));}
const local=process.argv.includes("--local");
const html=local?t.replace("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js","node_modules/three/build/three.min.js"):t;
const name=local?"index.local.html":"index.html";
fs.writeFileSync(path.join(__dirname,name),html);
console.log("built",name,(Buffer.byteLength(html)/1e6).toFixed(2)+" MB");
