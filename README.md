# カルダシェフ文明マップ

宇宙誕生（138億年前）から、Type I〜III の「もしもの」未来文明までを、ひとつの時代スライダーで行き来できるインタラクティブ・ガイドブックです。基準は「現在の地球（2026年）」です。

**▶ 公開ページ：https://ksan1333.github.io/kardashev-map/**

## できること

| タブ | 内容 |
|---|---|
| 01 全体マップ | 12分野の現在地、エネルギー利用量で見る文明の歩み、Type I〜III 文明ガイド |
| 02 年表 | 宇宙・地球史・世界史の3つの年表。GitHub のブランチのような枝分かれ表示で、出来事を押すと3Dの場面が出る。歴史シアター（3D）付き |
| 03 宇宙・地球・ミクロ | 宇宙12段階（地球周回軌道〜宇宙の形）、世界地図（国・ランドマーク・世界遺産・大陸移動、3Dジオラマ40か所＋国別）、ミクロ12段階（デフォルメした生き物34種〜超ひも、1〜11次元） |
| 04 系統樹 | 16分野・約1,370要素の系譜（誕生・分岐・合流・消滅）。うち約460は2026年より先の「もしも」（点線）で、協調・分断・加速・再建・宇宙の5つの世界線に分かれる |
| 05 宇宙の法則 | 4つの力、公式、物理定数、素粒子、周期表（118元素）、分子、未解決問題 |
| 06 地球大全 | 地球の外から来た知的存在のための「地球の取扱説明書」（全12章） |

- 上部の **カルダシェフ・スライダー** を動かすと、すべてのタブがその時代の姿に切り替わります。
- **全体検索**：`/` キーまたは `Ctrl`+`K` で、出来事・国・元素・生き物・天体・発明などを横断検索し、その場所へ移動できます。

### キーボード

| キー | 動作 |
|---|---|
| `/` または `Ctrl`+`K` | 全体検索 |
| `1`〜`6` | タブ切り替え |
| `[` `]` | 前／次の時代 |
| `0` | 現在に戻る |
| `?` | 使い方と記号の凡例 |

## ファイル構成

```
index.html        ビルド済みの1ファイル（GitHub Pages で公開しているもの）
build.js          src/ の部品を index.html にまとめるスクリプト
src/
  guide.template.html   ページの骨組み（HTML・CSS）。__PLACEHOLDER__ にJS・データを差し込む
  *.js                  各ビューの処理・3D（three.js）・データ
  *.json                地図・国・古地理などのデータ
```

主な部品：

| 分類 | ファイル |
|---|---|
| 時代スライダー・時代連動 | `kslider.js` `era.js` `eradata.js` `typeguide.js` |
| 年表・シアター | `branch.js` `branchdata.js` `histbranch.js` `newviews.js` `worldhist*.js` `theater.js` `ev3d.js` |
| 宇宙・地図・ミクロ | `space3d.js` `spaceview.js` `worldmap.js` `scene3d.js` `paleo.js` `micro3d.js` `cute.js`（生き物のデフォルメ3D）`org3d.js` `levelinfo.js` |
| 系統樹 | `graph.js` `treedata.js` `treeadd*.js` |
| 法則・地球大全・検索 | `laws.js` `laws3d.js` `microdata.js` `earthbook.js` `search.js` |
| 未来（もしも） | `type1data.js` `t2data.js` `t3data.js` `t1pins.json` `futacad.js`（Type I・IIの学問150）`futtree.js`（文化・政治・国家・戦争・経済 各50） |

## ビルド

Node.js があれば追加のインストールは不要です。

```bash
node build.js            # index.html を作る（three.js r128 は CDN から読み込み）
node build.js --local    # index.local.html を作る（node_modules/three を使うオフライン確認用）
```

`src/` を編集したら `node build.js` を実行して、`index.html` も一緒にコミットしてください。

## データと出典

- 古地理（大陸移動）：PALEOMAP（Scotese 2016、Scotese & Wright 2018、CC BY 4.0）を2°格子に変換して使用。5.4億年より前はプレート回転による大まかな推定です。
- 3D描画：[three.js](https://threejs.org/) r128（MIT License、cdnjs から読み込み）
- 統計（2025〜2026年）：Energy Institute、SIPRI、UCDP、FAO ほか、ITU、UN Tourism、UNESCO、国連人口推計、WMO、NOAA、IUCN、NASA Exoplanet Archive、Ethnologue、Pew Research Center、KeepTrack・CelesTrak など。詳細はページ下部の出典欄を参照してください。

## 注意

- 数値は概数です。2026年より先の内容（Type I〜III）は予測・目標・想像にもとづく「もしもの世界」で、事実とは区別しています。
- 3Dモデルは特徴をつかむための簡略表現で、大きさや色は実物どおりではありません。
