const path = require("node:path");

module.exports = function (eleventyConfig) {
  // CSS・JS・画像は変換せずにそのままコピー
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js", "src/images": "images" });

  // ブログ記事の一覧（日付の新しい順）
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date)
  );

  // 日付の表示形式（2026.10.11 / 2026-10-11）
  const pad = (n) => String(n).padStart(2, "0");
  eleventyConfig.addFilter("dotDate", (d) => `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`);
  eleventyConfig.addFilter("isoDate", (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`);
  eleventyConfig.addFilter("pad2", pad);

  // テンプレートでは "/css/style.css" のようにサイトのルートから書き、
  // 出力時に各ページから見た相対パスに直す。
  // → GitHub Pages のサブディレクトリ公開でも、_site の HTML をダブルクリックで開いても表示が崩れない
  eleventyConfig.addTransform("relative-urls", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) return content;
    const dir = path.posix.dirname(this.page.url.endsWith("/") ? this.page.url + "index.html" : this.page.url);
    const toRelative = (p) => path.posix.relative(dir, p) || "./";
    return content
      .replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, p) => `${attr}="${toRelative("/" + p)}"`)
      .replace(/url\('\/(?!\/)([^']*)'\)/g, (_, p) => `url('${toRelative("/" + p)}')`);
  });

  return {
    dir: { input: "src", output: "_site" },
    // ブログの Markdown は文章としてそのまま扱う（テンプレート構文を解釈しない）
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
};
