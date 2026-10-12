# farm-site

高橋牧場株式会社のホームページ。[Eleventy](https://www.11ty.dev/) で部品（テンプレート）から静的HTMLを生成する。

## 使い方

```sh
npm install      # 初回のみ
npm start        # 確認用サーバーを起動（表示された http://localhost:8080 を開く。保存すると自動で再読み込み）
npm run build    # _site/ に完成版のHTMLを出力
```

`_site/` の HTML はリンクを相対パスで出力しているので、`_site/index.html` をダブルクリックで開いても表示できる。

## ディレクトリ構成

```
src/
├── _data/                  … サイト全体で使う情報（ここを直すと全ページに反映）
│   ├── site.json           … 牧場名・代表者・住所・電話・メール・YouTube URL・フォームのキー
│   ├── nav.json            … メニュー項目（ヘッダーとフッター）
│   └── gallery.json        … 写真館のテーマと写真
├── _includes/
│   ├── layouts/
│   │   ├── base.njk        … 全ページ共通の骨組み（head・ヘッダー・フッター）
│   │   └── post.njk        … ブログ記事のレイアウト
│   └── components/
│       ├── header.njk      … ヘッダー
│       ├── footer.njk      … フッター（YouTube ボタン含む）
│       ├── page-header.njk … 各ページ上部の緑の見出し
│       └── ui.njk          … 写真枠・写真と文章の2列・準備中表示
├── pages/                  … 各ページの中身（ファイル名.html として出力）
│   ├── index.njk           … ホーム
│   ├── about.njk           … 高橋牧場について（ごあいさつ）
│   ├── commitment.njk      … 当牧場のこだわり
│   ├── daily.njk           … 牧場の一日
│   ├── gallery.njk         … 牧場風景写真館
│   ├── blog.njk            … ブログ一覧（記事は自動で並ぶ）
│   └── contact.njk         … お問い合わせ・採用情報・アクセス
├── blog/                   … ブログ記事（Markdown。1記事 = 1ファイル）
├── css/
│   ├── style.css           … 入口（下の各ファイルを読み込むだけ）
│   ├── base.css            … 色・文字・共通の小物
│   ├── layout.css          … ヘッダー・ヒーロー・セクション・フッター
│   └── components/         … 部品ごとのスタイル（card, photo, gallery, contact など）
├── js/main.js              … フェードイン・写真の読み込み・写真館・フォーム送信
└── images/                 … 写真置き場
eleventy.config.js          … Eleventy の設定
_site/                      … 出力先（自動生成。直接編集しない・git 管理外）
```

## よくある編集

### 牧場の情報（電話番号・住所・YouTube など）を変える

`src/_data/site.json` を書き換える。`【 】` の部分がまだ決まっていない項目。

### メニューを追加・変更する

`src/_data/nav.json` に1行追加・変更する。ヘッダーとフッターの両方に反映される。
新しいページは `src/pages/` に `.njk` ファイルを作る（既存のページをコピーすると早い）。

### ブログ記事を追加する

`src/blog/` に `日付.md`（例：`2026-11-01.md`）を作り、次の形で書く。一覧ページには新しい順で自動で並ぶ。

```md
---
title: 記事のタイトル
date: 2026-11-01
tag: お知らせ
excerpt: 一覧ページに表示する短い紹介文
---

本文。段落の間は1行空ける。

写真を入れるときは ![写真の説明](/images/blog/ファイル名.jpg)
```

### 写真を入れる

`src/images/` に次の名前で入れると自動で表示される（無い間は仮の枠を表示）。

| ファイル名 | 場所 |
|---|---|
| `logo.png` | 全ページ：ヘッダーのロゴ（背景は透明） |
| `header.jpg` | 全ページ：ヘッダーの帯の背景 |
| `hero.jpg` | ホーム：トップの大きな写真（横長がおすすめ） |
| `hoikusha.jpg` / `rinyusha.jpg` / `ikuseisha.jpg` | ホーム：哺育舎・離乳舎・育成舎 |
| `school.jpg` | ホーム：「仔牛たちの小学校」 |
| `shihoro.jpg` | ホーム：「士幌について」 |
| `commitment-1.jpg` 〜 `commitment-3.jpg` | こだわり：牛舎の消毒・石灰塗布・水槽掃除 |
| `daily.jpg` | 牧場の一日：ページ上部の横長の写真 |
| `daily-morning.jpg` / `daily-afternoon.jpg` | 牧場の一日：朝・昼〜夕方 |

### 写真館に写真を追加する

テーマは「カメラ目線（camera）」「牧場内の風景（scenery）」「作業の一コマ（work）」の3つ。

- 写真は横幅1000〜2400px程度に縮小し、位置情報などを消してから入れる（元の写真は `_photos/` に置き、git には含めない）。
- **表紙写真**：`src/images/gallery/camera.jpg`・`scenery.jpg`・`work.jpg`
- **各テーマの写真**：`src/images/gallery/camera/` などに入れ、`src/_data/gallery.json` の該当テーマの `photos` に追加する。1枚でも追加すると「準備中」の表示は消える。

```json
"photos": [
  { "src": "/images/gallery/camera/ファイル名.jpg", "alt": "写真の説明（画面には出ない）" },
  { "src": "/images/gallery/camera/ファイル名.jpg", "alt": "写真の説明", "caption": "写真の下に表示する一言" }
]
```

### 採用情報

`src/pages/contact.njk` の先頭にある `recruiting: false` を `true` にすると募集要項が表示される。

### お問い合わせフォーム

送信には外部サービス Web3Forms（https://web3forms.com）を使う。

1. Web3Forms のサイトで、問い合わせを受け取りたいメールアドレスを入力して Access Key を発行
2. `src/_data/site.json` の `web3formsKey` を発行されたキーに置き換える
3. 公開後に実際に送信して、メールが届くか確認する

キーを設定するまでは、送信ボタンを押すと「準備中」のメッセージが表示される。

### 地図

Googleマップの「共有 → 地図を埋め込む」の iframe を `src/pages/contact.njk` の `.map-placeholder` の中に貼る。

### 検索結果に出さない（仮公開中など）

`src/_data/site.json` の `noindex` を `true` にすると、全ページに検索除けの設定が入る。

## 書き方のルール

- リンクや画像のパスは `/css/style.css` `/images/x.jpg` のようにサイトのルートから書く。出力時に各ページからの相対パスへ自動で変換される。
- CSS は `src/css/style.css` の読み込み順に意味がある（後のものが優先）。

## 公開（GitHub Pages）

`main` ブランチに push すると、GitHub Actions（`.github/workflows/deploy.yml`）が自動でサイトを生成して公開する。
進み具合はリポジトリの「Actions」タブで確認できる。

- 公開URL：https://tkdk-hokkaido.github.io/farm-site/
- 仮公開中は `src/_data/site.json` の `noindex` を `true` にしておく（本番公開時に `false` へ）
