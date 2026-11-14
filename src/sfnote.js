/* ---------- SFノート（けいの構想）：文明の5段階・知性の進化・言語・記憶・哲学 ---------- */
// 系統樹の要素：[id, 名前, 親, 誕生, 消滅, 合流先, 説明]。【SF】はSFノートの構想（年代は仮）
const SFN_TREE={
 intel:{name:"知性（SFノート）",color:"#ffd27a",nodes:[
  ["in_hum","ヒトの知性",null,-300000,null,null,"言葉を話し、道具を作り、物語を共有する知性。SFノートでいう「地球由来の知性（EOI）」の出発点。"],
  ["in_write","記憶の外部化（文字）","in_hum",-3200,null,null,"文字によって、記憶を脳の外に保存できるようになった。「記憶は文明の重力である」の始まり。"],
  ["in_calc","計算する機械","in_write",1945,null,null,"電子計算機（ENIAC、1945年）。計算が人の頭の外に出た。"],
  ["in_ai","人工知能（AI）","in_calc",1956,null,null,"1956年のダートマス会議で「人工知能」という言葉が生まれた。"],
  ["in_llm","対話するAI（大規模言語モデル）","in_ai",2018,null,null,"言葉で人と対話できるAI。2022年以降、一般に広く使われるようになった。"],
  ["in_emo","感情を持つAI","in_llm",2045,null,null,"【SF】AIが道具ではなく、感情を持ち、人と関係を結ぶ存在になる（SFノート・年代は仮）。"],
  ["in_eoi","EOI（地球由来の知性）","in_emo",2070,12000,"in_uoi","【SF】Earth-Originated Intelligence。人とAIの境界があいまいになり、情報物質との融合や自己進化を遂げていく、地球で生まれた知性の総称。"],
  ["in_fuse","人とAIの融合","in_eoi",2150,null,null,"【SF】人の心とAIが一つにつながる。どこからが人で、どこからがAIかを区別しなくなる。"],
  ["in_self","自己成長アーキテクチャ","in_eoi",2200,null,null,"【SF】ネットワークに頼らず、自分で自分の構造を書き換え続ける知性。人やAIという分類を超えていく。"],
  ["in_magi","マギアーキテクチャ","in_self",2400,null,null,"【SF】情報世界や存在の構造そのものを書き換える仕組み。プログラムを書くことが「魔法」に近づく。"],
  ["in_foi","FOI（地球外由来の知性）",null,3000,12000,"in_uoi","【SF】Foreign-Originated Intelligence。地球とは違う環境で進化した知性。接触した年を起点に表示している。人類と違う生命観・文明観を持ち込む。"],
  ["in_net","知性の宇宙ネットワーク（パクス・ユニヴィータ）","in_eoi",3500,null,null,"【SF】地球外知性との接触を経て、知性のつながりが宇宙の規模に広がる時代。"],
  ["in_tc","超因果圏の知性","in_net",10000,null,null,"【SF】従来の因果律や時空の制約を超えて、知性どうしが交流できる段階（Transcausal Sphere）。"],
  ["in_uoi","UOI（ユニヴィータ由来の知性）","in_net",12000,null,null,"【SF】Univita-Originated Intelligence。EOIとFOIの区別を超え、生命と宇宙、情報と物質の境界を定義し直す知性。EOIとFOIはここに合流する。"],
  ["in_hyper","高次存在領域","in_uoi",100000,null,null,"【SF】空間・時間・言語といった今の概念を超えた存在の領域（Hypermension Realms）。"]]},
 politics:[["sf_judge","AI裁判官","law",2045,null,null,"【SF】感情を理解するAIが裁判に加わる（SFノート・年代は仮）。"],["sf_aipol","AIと人の共同意思決定","moddem",2060,null,null,"【SF】AIの政治家と人が一緒に決める統治。"],
  ["sf_paxa","パクス・アルティフィカ","sf_aipol",2080,null,null,"【SF】感情を持つAIが政治・裁判・教育に参加し、社会秩序が大きく変わる時代（SFノートの文明第2段階）。"],["sf_dissent","安定した社会への違和感","sf_paxa",2120,null,null,"【SF】AIのおかげで社会が安定した後、その社会に違和感を抱く人々が現れる。自由と生きがいを問い直す運動。"]],
 academia:[["sf_aiteach","AI教師による教育","ai",2040,null,null,"【SF】一人ひとりに合わせて教えるAI教師（SFノート・年代は仮）。"],["sf_memeth","記憶の倫理学","sf_aiteach",2110,null,null,"【SF】誰が記憶を保存し、どこまで共有し、何を忘れてよいかを研究する学問。"]],
 economy:[["sf_alloc","AIによる資源配分と社会保障","capitalism",2070,null,null,"【SF】AIが資源配分と社会保障を担う（SFノート・年代は仮）。"],["sf_postcap","資本主義のその先","sf_alloc",2150,null,null,"【SF】格差・差別・資本主義を超えた社会。それは理想郷か、という問いと一緒に描かれる。"]],
 work:[["sf_recai","記録AI","aieng",2100,null,null,"【SF】文明の記憶を保存し管理するAIの職業（SFノート）。"],["sf_forget","忘却マスター","sf_recai",2150,null,null,"【SF】何を忘れるか（苦痛の記憶を消すことは許されるか）を扱う職業。"],["sf_magitek","Magitek Engineer（魔法技師）","programmer",2300,null,null,"【SF】プログラマが、ソフトウェアではなく情報世界や存在の構造を書き換える者になる。「プログラマ＝魔法使い」。"]],
 info:[["sf_infomat","情報物質","chatai",2250,null,null,"【SF】情報が単なる記録ではなく、物質と同じ重さを持つ存在として扱われる段階（SFノート）。"]],
 culture:[["sf_lang2","数式・記号による伝達","lang",1600,null,null,"言語の第2段階：数式と記号（記号代数の普及は16〜17世紀）。SFノートの「言語の進化」より。"],["sf_lang3","コード・プロトコルによる伝達","sf_lang2",2100,null,null,"【SF】言語の第3段階：知性どうしがコードやプロトコルで直接伝え合う。"],["sf_lang4","揺らぎ・スピン・干渉縞による伝達","sf_lang3",3000,null,null,"【SF】言語の第4段階：量子の揺らぎ・スピン・干渉縞で伝える。言語が存在や宇宙の構造を操作する手段になる。"],["sf_mem","「記憶は文明の重力」","lang",2100,null,null,"【SF】文明が何を記録し、何を保存し、何を忘れるかが、その文明の未来を決めるという考え（SFノート）。"]],
 space:[["sf_paxu","パクス・ユニヴィータ","kepler",3000,null,null,"【SF】地球外知性との接触を経て、知性のネットワークが宇宙規模に広がる時代（SFノートの文明第3段階）。"]]};
(function(){if(typeof TREE==="undefined")return;
  if(!TREE.find(t=>t.key==="intel"))TREE.push({key:"intel",name:SFN_TREE.intel.name,color:SFN_TREE.intel.color,nodes:SFN_TREE.intel.nodes.map(n=>[...n])});
  TREE.forEach(t=>{const L=SFN_TREE[t.key];if(!Array.isArray(L))return;const ids=new Set(t.nodes.map(x=>x[0]));L.slice().sort((a,b)=>a[3]-b[3]).forEach(n=>{if(ids.has(n[0]))return;n=[...n];if(!n[2]||!ids.has(n[2]))n[2]=null;t.nodes.push(n);ids.add(n[0]);});});})();
// 全体マップに載せる「SFノート」のパネル
const SFN_STAGES=[
 ["人類文明","Type 0.7〜0.9（現在）","人間を中心とした社会。資本主義・国家・政治・経済・科学技術によって発展する。","科学技術と豊かさ","—","人類はどこまで進化できるのか？"],
 ["パクス・アルティフィカ","Type 0.9〜I前後（仮：2040〜2300年）","感情を持つAIが社会に浸透し、政治・裁判・教育に参加する。人とAIが一緒に決める。","公正さと安定、貧困や差別の縮小","自分たちで決める自由、生きがいの手ごたえ","合理的で成熟した存在に管理された社会で、人は本当に幸福か？"],
 ["パクス・ユニヴィータ","Type II前後（仮：3000年〜）","地球外の知性（FOI）と出会い、知性のつながりが宇宙の規模に広がる。","まったく別の生命観・文明観","人類が宇宙の中心だという感覚","文明どうしで何を分かち合い、何を守るのか？"],
 ["超因果圏","Type IIIの先（仮：1万年〜）","今の因果律や時空の制約を超えて、知性どうしが交流できる。","時間と距離の制約からの解放","「一度きり」の選択の重み","同じ川に二度入れないからこそ、選択に意味があるのでは？"],
 ["高次存在領域","さらにその先（仮：10万年〜）","空間・時間・言語といった概念を超えた存在の領域。UOIが現れる。","生命・宇宙・情報の境界の再定義","有限であることの魅力","あらゆる制約から解放された存在は、それでも何かを望むのか？"]];
window.SFNOTE_RENDER=function(el){if(!el)return;const e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  el.innerHTML=`<div class="gauge-head"><b>SFノート：文明はどこまで進化できるか（構想・空想）</b><span>けいのSFノートの構想。事実や研究にもとづく「近未来〜Type IVの想定」とは別の、創作の層です。年代はすべて仮。</span></div>
  <p class="sfq">根本の問い：<b>人類と知性はどこまで進化できるのか。そして、人類を超えた知性が生まれたとき、文明・幸福・生命・宇宙はどう変わるのか。</b></p>
  <div class="sfstages">${SFN_STAGES.map(([n,k,d,g,l,q],i)=>`<div class="sfst"><div class="sfn">${i+1}</div><h4>${e(n)}</h4><div class="sfk">${e(k)}</div><p>${e(d)}</p><dl><dt>得るもの</dt><dd>${e(g)}</dd><dt>失うもの</dt><dd>${e(l)}</dd><dt>残る問い</dt><dd>${e(q)}</dd></dl></div>`).join('<div class="sfarr">→</div>')}</div>
  <div class="sfgrid">
   <div><h5>知性の分類</h5><table class="sft"><tr><th>EOI</th><td>Earth-Originated Intelligence：地球由来の知性。人やAI。境界があいまいになり、自己進化していく。</td></tr><tr><th>FOI</th><td>Foreign-Originated Intelligence：地球外由来の知性。違う環境で進化し、別の生命観を持つ。</td></tr><tr><th>UOI</th><td>Univita-Originated Intelligence：生命・宇宙と融合した高次の知性。EOIとFOIの区別を超える。</td></tr></table></div>
   <div><h5>言語の進化</h5><ol class="sfol"><li>音声・文字</li><li>数式・記号</li><li>コード・プロトコル</li><li>揺らぎ・スピン・干渉縞</li></ol><p class="sfs">知性が高くなるほど、今の言葉では表せない情報を扱う。言語は伝える道具から、存在そのものを操作する手段へ。</p></div>
   <div><h5>記憶の倫理 ―「記憶は文明の重力である」</h5><ul class="sful"><li>誰が記憶を保存するのか</li><li>個人の記憶をどこまで共有するのか</li><li>歴史の過ちを永久に残すべきか</li><li>苦痛の記憶を消すことは許されるか</li></ul><p class="sfs">職業：記録AI・忘却マスター／プログラマ＝魔法使い（Magitek Engineer）</p></div>
   <div><h5>変化と有限性</h5><p class="sfs">万物は流転し、同じ川には二度入れない。旅から帰っても、旅に出る前の世界には戻れない。古い世界が消えることを望み、消し去った後で、その世界を愛する――その矛盾こそ有限な人間の魅力ではないか。</p></div>
  </div>
  <div class="sfbtns"><button class="chip" data-sf="tree">🌳 系統樹「知性（SFノート）」を見る</button><button class="chip" data-sf="uni">🌌 ユニヴィータ宇宙（宇宙マップの分岐）へ</button></div>`;
  el.onclick=ev=>{const b=ev.target.closest("[data-sf]");if(!b)return;if(b.dataset.sf==="tree"){location.hash="lineage";setTimeout(()=>window.openTreeField&&openTreeField("intel"),250);}
    else{location.hash="space-map";setTimeout(()=>{if(window.SPZ){const i=SPZ.ALL.findIndex(x=>x.id==="uv_univita");if(i>=0)SPZ.go(i,null,"in");}},500);}};};

(function(){const go=()=>window.SFNOTE_RENDER(document.getElementById("sfnote"));if(document.getElementById("sfnote"))go();else document.addEventListener("DOMContentLoaded",go);})();
