// src/blog/ 内の記事共通の設定
module.exports = {
  layout: "layouts/post.njk",
  // 2026-10-11.md → blog/2026-10-11.html
  permalink: (data) => `blog/${data.page.fileSlug}.html`,
  // 検索結果などに出る説明文は、記事の excerpt（一覧に出る要約）を使う
  eleventyComputed: {
    description: (data) => data.excerpt,
  },
};
