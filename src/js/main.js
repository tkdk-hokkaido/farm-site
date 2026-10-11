// スクロールで各セクションをふわっと表示
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section .container').forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// 写真館：写真が1枚でも入っていれば「準備中」を隠す
document.querySelectorAll('.gallery').forEach((gallery) => {
  const emptyState = gallery.nextElementSibling;
  if (emptyState && emptyState.matches('.empty-state') && gallery.querySelector('figure, img')) {
    emptyState.hidden = true;
  }
});

// 写真館：テーマをクリックすると、そのテーマの写真一覧を表示
const themes = document.querySelectorAll('.theme');
const showTheme = (name, scroll) => {
  const panel = document.getElementById(name);
  if (!panel) return;
  document.querySelectorAll('.theme-panel').forEach((p) => { p.hidden = p !== panel; });
  themes.forEach((t) => t.setAttribute('aria-pressed', t.dataset.theme === name));
  history.replaceState(null, '', '#' + name);
  if (scroll) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
themes.forEach((t) => {
  t.setAttribute('aria-pressed', 'false');
  t.addEventListener('click', () => showTheme(t.dataset.theme, true));
});
// gallery.html#camera のように直接開かれたときはそのテーマを表示
if (themes.length && location.hash) showTheme(location.hash.slice(1), false);

// 写真枠：画像が読み込めたら仮のラベルを消す
document.querySelectorAll('.photo').forEach((el) => {
  const match = el.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
  if (!match) return;
  const img = new Image();
  img.onload = () => el.classList.add('has-photo');
  img.src = match[1];
});

// お問い合わせフォーム：ページを移動せずに送信し、結果を表示
const form = document.querySelector('.contact-form');
if (form) {
  const result = form.querySelector('.form-result');
  const button = form.querySelector('button[type="submit"]');
  const showResult = (message, ok) => {
    result.textContent = message;
    result.className = 'form-result ' + (ok ? 'is-success' : 'is-error');
    result.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.access_key.value.startsWith('【')) {
      showResult('現在フォームは準備中です。お手数ですがお電話またはメールにてご連絡ください。', false);
      return;
    }
    button.disabled = true;
    button.textContent = '送信中…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      form.reset();
      showResult('送信が完了しました。お問い合わせいただきありがとうございます。内容を確認のうえ、ご連絡いたします。', true);
    } catch {
      showResult('送信に失敗しました。時間をおいて再度お試しいただくか、お電話またはメールにてご連絡ください。', false);
    } finally {
      button.disabled = false;
      button.textContent = '送信する';
    }
  });
}

// フッターの年を自動更新
document.querySelectorAll('.year-now').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
