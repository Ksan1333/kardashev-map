/* ---------- 時代フィルター（スライダーの時代に合わせて各ビューを絞る） ---------- */
(function(){
  // 宇宙の天体・人工物が「知られた／作られた」年（目安）
  window.SPZ_DISC={karman:1957,iss:1998,tiangong:2021,starlinksat:2019,hubble:1990,starlink:2019,gps:1978,geo:1963,apollo11:1969,jwst:2021,artemis:2026,
    olympus:1971,ceres:1801,aries:-1000,taurus:-1000,gemini:-1000,cancer:-1000,leo:-1000,libra:-1000,scorpius:-1000,sagittarius:-1000,capricornus:-1000,aquarius:-1000,pisces:-1000,ophiuchus:-150,
    belt:1801,grs:1831,europa:1610,titan:1655,uranus:1781,neptune:1846,halley:-240,pluto:1930,kuiper:1992,voyager1:1977,voyager2:1977,heliopause:2012,oort:1950,lightyear:1838,
    proxima:1915,barnard:1916,wolf359:1918,lalande:1801,luyten:1948,ross154:1925,trappist:2016,orion:1610,horsehead:1888,helix:1824,ring:1779,catseye:1786,crab:1054,eagle:1745,carina:1752,
    gaiabh1:2022,cygx1:1971,sgra:1974,omegacen:1677,sunpos:1785,triangulum:1764,dwarfs:1938,ga:1986,lg:1936,m87:1781,m51:1773,sombrero:1781,cena:1826,coma:1785,laniakea:2014,edge:1965,home:2014,
    void:1978,filament:1986,shapley:1930,bootes:1981,sloan:2003,herc:2013,ton618:1957,jades:2024,andromeda:964,
    t1elev:2110,t2swarm:2500,t3reach:6000,t3andro:1000000,t2venus:2350,t2ship:2800,t2colony:5000,t1ring:2150,t1sps:2070,t1hab:2180,t1def:2200,t1mooncity:2100};
  // おとめ座（星座）と おとめ座銀河団 は同じid。星座として扱う
  window.SPZ_DISC.virgo=-1000;
  window.SPZ_ART=new Set(["karman","iss","tiangong","starlinksat","hubble","starlink","gps","geo","apollo11","jwst","artemis","voyager1","voyager2","t1elev","t1ring","t1sps","t1hab","t1def","t1mooncity"]);
  // ランドマークの完成年（自然のものは常に表示）
  const PY={giza:-2560,wall:-220,machu:1450,angkor:1150,athens:-438,rome:80,taj:1653,kyoto:794,hiroshima:1915,normandy:1944,burj:2010,eiffel:1889,liberty:1886,opera:1973,tokyo:1932,three:2003,panama:1914,ksc:1962,baikonur:1955,cern:1954,alma:2011,wenchang:2014,seed:2008,
    t1elevator:2110,t1sahara:2115,t1fusion:2050,t1arco:2185,t1seacity:2175,t1spaceport:2155,t1rewild:2235,t1climate:2125,t1archive:2060,t1moonview:2100};
  window.PIN_YEAR=id=>PY[id]??-1e12;
  // 国ごとの「人が住み始めた年」と「国家・文明が生まれた年」（地域単位の目安＋例外）
  const SUB={"北アフリカ":[-300000,-3200],"東アフリカ":[-300000,-800],"中部アフリカ":[-300000,1390],"西アフリカ":[-300000,300],"南部アフリカ":[-300000,1100],
    "西アジア":[-120000,-3500],"南アジア":[-70000,-2600],"東南アジア":[-65000,100],"東アジア":[-60000,-1600],"中央アジア":[-50000,-500],
    "南ヨーロッパ":[-45000,-750],"南東ヨーロッパ":[-45000,-700],"西ヨーロッパ":[-45000,-50],"中央ヨーロッパ":[-45000,900],"東ヨーロッパ":[-40000,880],"北ヨーロッパ":[-12000,800],
    "オーストラリア・ニュージーランド":[-50000,1788],"メラネシア":[-45000,1880],"ミクロネシア":[-1500,1500],"ポリネシア":[1000,1100],
    "北アメリカ":[-15000,1600],"中央アメリカ":[-13000,-1000],"南アメリカ":[-14000,1550],"カリブ海":[-5000,1500],"":[1820,1959]};
  const OV={EGY:[-300000,-3200],SDN:[-300000,-2500],ETH:[-300000,-900],ERI:[-300000,-900],IRQ:[-120000,-3500],IRN:[-100000,-3200],SYR:[-120000,-2500],TUR:[-100000,-1700],SAU:[-100000,-300],YEM:[-100000,-1000],OMN:[-100000,-2500],ARE:[-100000,-2500],BHR:[-100000,-2500],
    PAK:[-70000,-2600],IND:[-70000,-2600],CHN:[-60000,-1600],JPN:[-38000,250],KOR:[-40000,1],PRK:[-40000,1],MNG:[-40000,-209],GRC:[-45000,-2000],ITA:[-45000,-750],GBR:[-12000,43],IRL:[-10000,800],ISL:[874,930],NZL:[1280,1840],MDG:[500,1500],
    MEX:[-13000,-1200],GTM:[-13000,-1000],BLZ:[-13000,-1000],HND:[-13000,-500],PER:[-14000,-2500],BOL:[-14000,500],ECU:[-14000,1460],GRL:[-2500,1953],USA:[-15000,1607],CAN:[-15000,1608],AUS:[-50000,1788],FJI:[-1000,1871],TON:[-800,950],WSM:[-800,1100],PNG:[-45000,1975],ZWE:[-300000,1100]};
  window.ERA_FOG=(c,Y)=>{const [inh,civ]=OV[c.c3]||SUB[c.sub]||[-1e5,1500];return Y<inh?2:Y<civ?1:0;};
  // 各ビューの上に「いつの時点か」の帯
  const MSG={timeline:"その時代までに起きた出来事だけを表示しています。",lineage:"その時代までに生まれた要素だけを表示しています（その後に消えたものは、まだ現役として表示）。",
    "world-map":"もやの濃い地域＝まだ人類が住んでいない／薄い地域＝まだ国家や文明がない（国境は現在のもの）。その時代にまだないランドマークは隠しています。",
    "space-map":"その時代に知られていなかった天体や、まだない人工衛星は隠しています。",laws:"その時代にまだ見つかっていない元素・素粒子は暗く表示しています。"};
  const bars={};
  Object.keys(MSG).forEach(id=>{const sec=document.getElementById("v-"+id);if(!sec)return;const b=document.createElement("div");b.className="erabar";b.hidden=true;const h=sec.querySelector(".view-head");(h||sec.firstChild).after(b);bars[id]=b;});
  const yfmt=y=>y< -1e8?(-y/1e8).toFixed(1).replace(/\.0$/,"")+"億年前":y< -1e4?Math.round(-y/1e4).toLocaleString()+"万年前":y<0?"紀元前"+(-y).toLocaleString()+"年":y>1e8?"":y+"年";
  function upd(){const E=window.KERA;if(!E)return;const now=E.now;
    Object.entries(bars).forEach(([id,b])=>{b.hidden=now||E.kind==="future"&&window.KYEAR>1e8;if(b.hidden)return;
      b.innerHTML=`<span class="erapill ${E.kind}">${E.when}</span><b>「${E.name}」の時点</b><span class="eramsg">${MSG[id]}</span><button class="chip" data-now="1">現在に戻す</button><button class="chip" data-top="1">↑ 上のスライダーで変える</button>`;});}
  document.addEventListener("click",e=>{if(e.target.closest(".erabar [data-top]"))window.scrollTo({top:0,behavior:"smooth"});if(e.target.closest(".erabar [data-now]"))window.KSETK&&window.KSETK(.73);});
  window.addEventListener("k-year",upd);
  // 宇宙マップ：時代が変わったら今のスケールを作り直す
  window.addEventListener("k-year",()=>{try{if(typeof SPZ!=="undefined"&&SPZ.level!==undefined&&document.querySelector("#spscene canvas"))SPZ.go(SPZ.level);}catch(e){}});
})();
