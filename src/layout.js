/* ---------- 画面の共通レイアウト：見出し → 切り替え・チップ → 操作できる画面（中央・全幅）→ 情報パネル（下） ---------- */
(()=>{const sec=id=>document.getElementById("v-"+id);
  // 全体マップ：見出しを先頭に
  const ov=sec("overview");if(ov){const h=ov.querySelector(":scope>.view-head");if(h)ov.prepend(h);}
  // ミクロ：左の縦リストを画面の上のチップ列に
  const mi=sec("micro");if(mi){const l=mi.querySelector("#mclist"),w=mi.querySelector(".mcwrap");if(l&&w)w.before(l);}
  document.querySelectorAll(".view").forEach(v=>v.classList.add("staged"));
})();
