// ===== 世界遺産の登録情報（ランドマーク） =====
const WHC_CRIT={1:"人類の創造的才能を表す傑作",2:"建築・技術・都市計画などで、文化の重要な交流を示す",3:"現存する、または消滅した文化的伝統・文明の証拠",4:"人類の歴史の重要な段階を物語る建築・景観の見本",5:"伝統的な集落や土地利用の見本",6:"普遍的な意義を持つ出来事・思想・信仰・芸術と結びつく",7:"すぐれた自然美・自然現象",8:"地球の歴史の主要な段階を示す見本",9:"生態系や生物の進化・発展を示す見本",10:"生物多様性の保全にとって重要な生息地"};
const WHC={
 giza:["cultural","メンフィスとその墓地遺跡―ギーザからダハシュールまでのピラミッド地帯","エジプト",1979,[1,3,6]],
 wall:["cultural","万里の長城","中国",1987,[1,2,3,4,6]],
 machu:["mixed","マチュ・ピチュの歴史保護区","ペルー",1983,[1,3,7,9]],
 angkor:["cultural","アンコール","カンボジア",1992,[1,2,3,4],"内戦後の荒廃で1992〜2004年は危機遺産に登録されていた。"],
 athens:["cultural","アテネのアクロポリス","ギリシャ",1987,[1,2,3,4,6]],
 rome:["cultural","ローマ歴史地区、教皇領とサン・パオロ・フォーリ・レ・ムーラ大聖堂","イタリア／バチカン",1980,[1,2,3,4,6],"コロッセオはこの中に含まれる。"],
 taj:["cultural","タージ・マハル","インド",1983,[1]],
 kyoto:["cultural","古都京都の文化財（京都市、宇治市、大津市）","日本",1994,[2,4]],
 hiroshima:["cultural","原爆ドーム","日本",1996,[6],"負の遺産とも呼ばれる。核兵器の惨禍を伝える。"],
 eiffel:["cultural","パリのセーヌ河岸","フランス",1991,[1,2,4],"エッフェル塔はこの範囲に含まれる。"],
 liberty:["cultural","自由の女神像","アメリカ",1984,[1,6]],
 opera:["cultural","シドニー・オペラハウス","オーストラリア",2007,[1],"完成から34年で登録された、最も新しい時代の建築の一つ。"],
 everest:["natural","サガルマータ国立公園","ネパール",1979,[7]],
 canyon:["natural","グランド・キャニオン国立公園","アメリカ",1979,[7,8,9,10]],
 amazon:["natural","中央アマゾン保全地域群","ブラジル",2000,[9,10],"2003年に範囲を拡大。"],
 reef:["natural","グレート・バリア・リーフ","オーストラリア",1981,[7,8,9,10],"サンゴの白化が続き、危機遺産への登録がたびたび議論されている。"],
 victoria:["natural","モシ・オ・トゥニャ／ヴィクトリアの滝","ザンビア／ジンバブエ",1989,[7,8]],
};
const WHC_OTHER={normandy:"世界遺産には未登録（フランスの暫定リストに「ノルマンディー上陸作戦の海岸」として記載）。",sahara:"サハラ砂漠全体は未登録。域内にタッシリ・ナジェール（複合遺産）やアイル・テネレ自然保護区などがある。",antarctica:"南極大陸は南極条約によりどの国の領土でもないため、世界遺産の対象外。条約で環境が保護されている。"};
const WHC_TYPE={cultural:["文化遺産","#e8a46a"],natural:["自然遺産","#8fd16a"],mixed:["複合遺産","#c99cf2"],other:["世界遺産以外（現代建築・科学施設など）","#6fd3c7"],future:["Type I（もしも）","#7ee0ff"]};
// 地図のピンを世界遺産の区分に並べ替え
MAP.pins.forEach(p=>{p.cat0=p.cat;p.cat=WHC[p.id]?WHC[p.id][0]:(p.cat==="future"?"future":"other");});
Object.keys(CAT).forEach(k=>delete CAT[k]);Object.assign(CAT,WHC_TYPE);
function whcCard(id,p){const w=WHC[id];
  if(w)return `<div class="whc"><div class="whch"><span class="whcemb" style="--wc:${WHC_TYPE[w[0]][1]}"><i></i></span><div><div class="whct" style="color:${WHC_TYPE[w[0]][1]}">世界遺産・${WHC_TYPE[w[0]][0]}</div><b>${w[1]}</b></div></div>
    <dl><dt>国</dt><dd>${w[2]}</dd><dt>登録年</dt><dd>${w[3]}年</dd><dt>登録基準</dt><dd>${w[4].map(c=>`<span class="whcc"><b>(${["","i","ii","iii","iv","v","vi","vii","viii","ix","x"][c]})</b>${WHC_CRIT[c]}</span>`).join("")}</dd></dl>${w[5]?`<p class="whcn">${w[5]}</p>`:""}</div>`;
  const fut=p&&p.cat==="future";
  return `<div class="whc none"><div class="whch"><span class="whcemb off"><i></i></span><div><div class="whct">${fut?"もしもの未来の施設":"世界遺産には未登録"}</div><b>${p?p.name:""}</b></div></div><p class="whcn">${WHC_OTHER[id]||(fut?"想像上の施設です。":"現代の建築・施設・自然地域などで、世界遺産には登録されていません。")}</p></div>`;}
