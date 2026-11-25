import { LANGS, getLang, setLang, applyI18n, t } from './i18n.js';

/**
 * Mount a always-visible flag language switcher.
 * Uses local SVG files (never emoji / remote CDN).
 */
export function mountLangSwitcher(onChange) {
  setLang(getLang());

  let bar = document.getElementById('langBar');
  if (!bar) {
    bar = document.createElement('nav');
    bar.id = 'langBar';
    bar.className = 'lang-bar';
    bar.setAttribute('aria-label', t('lang.label'));
    document.body.prepend(bar);
  }

  function paint() {
    const current = getLang();
    bar.setAttribute('aria-label', t('lang.label'));
    bar.innerHTML = LANGS.map(
      (l) => `<button type="button" class="lang-btn${l.code === current ? ' is-active' : ''}"
        data-lang="${l.code}" aria-label="${l.label}" aria-pressed="${l.code === current}">
        <img src="${l.flag}" alt="" width="28" height="19" decoding="async">
        <span class="lang-code">${l.code.toUpperCase()}</span>
      </button>`
    ).join('');
  }

  bar.onclick = (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    const code = btn.getAttribute('data-lang');
    if (!code || code === getLang()) return;
    setLang(code);
    applyI18n();
    paint();
    if (typeof onChange === 'function') onChange(code);
  };

  paint();
  applyI18n();
  return { refresh: () => { applyI18n(); paint(); } };
}
