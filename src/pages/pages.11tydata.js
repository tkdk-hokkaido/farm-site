const path = require("node:path");

// src/pages/ 内のページ共通の設定
module.exports = {
  layout: "layouts/base.njk",
  // about.njk → about.html のように、ファイル名と同じ名前の HTML を出力する
  permalink: (data) => `${path.basename(data.page.filePathStem)}.html`,
};
