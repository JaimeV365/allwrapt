import { LANGS, getLang, setLang, applyI18n, t, langFromUrl, syncLangToUrl } from './i18n.js?v=4';

/**
 * Mount a always-visible flag language switcher.
 * Uses local SVG files (never emoji / remote CDN).
 * Honour ?lang= / ?lan= and keep the URL shareable.
 */
export function mountLangSwitcher(onChange) {
  const fromUrl = langFromUrl();
  setLang(fromUrl || getLang(), { syncUrl: true });

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
    setLang(code, { syncUrl: true });
    applyI18n();
    paint();
    if (typeof onChange === 'function') onChange(code);
  };

  // Ensure address bar shows the active language for easy copying/sharing
  syncLangToUrl(getLang());
  function refreshBadges() {
    document.querySelectorAll('[data-i18n-badge]').forEach((el) => {
      el.textContent = el.dataset.i18nBadge === 'ok' ? t('msg.ok') : t('msg.err');
    });
  }

  paint();
  applyI18n();
  refreshBadges();
  return {
    refresh: () => {
      applyI18n();
      paint();
      refreshBadges();
    },
  };
}
