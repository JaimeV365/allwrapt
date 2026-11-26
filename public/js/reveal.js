import { startSnow } from './snow.js';
import { api, say } from './api.js';
import { mountLangSwitcher } from './lang.js';
import { t, formatApiError, applyI18n, getLang } from './i18n.js';

startSnow();

const token = new URLSearchParams(location.search).get('t') || '';
const $ = (s) => document.querySelector(s);

let revealData = null;
let brokenMessage = '';

function paintReveal() {
  applyI18n();
  // Ensure OK/Error badges follow language if present
  document.querySelectorAll('[data-i18n-badge]').forEach((el) => {
    el.textContent = el.dataset.i18nBadge === 'ok' ? t('msg.ok') : t('msg.err');
  });

  if (brokenMessage) {
    say($('#brokenMsg'), brokenMessage, 'err');
    document.querySelectorAll('#brokenMsg [data-i18n-badge]').forEach((el) => {
      el.textContent = t('msg.err');
    });
  }

  if (!revealData) return;

  document.title = t('reveal.docTitle', {
    title: revealData.title || t('home.defaultTitle'),
  });
  $('#rhello').textContent = t('reveal.hello', { name: revealData.hello });
  $('#revent').textContent = revealData.title || t('home.defaultTitle');
  $('#rtarget').textContent = revealData.target;
  if (revealData.budget) {
    $('#rbud').dataset.budget = revealData.budget;
    $('#rbud').textContent = t('reveal.budget', { budget: revealData.budget });
  } else {
    $('#rbud').textContent = '';
    delete $('#rbud')?.dataset.budget;
  }
  $('#rnote').textContent = revealData.note || '';
}

mountLangSwitcher(() => {
  // Re-translate reveal copy when the recipient switches language
  if (brokenMessage) brokenMessage = formatApiError({ data: { code: 'REVEAL_BAD' } });
  paintReveal();
});

async function boot() {
  if (!token) {
    showBroken(t('reveal.brokenHint'));
    return;
  }
  try {
    revealData = await api(`/api/reveal/${encodeURIComponent(token)}`);
    $('#revealApp').hidden = false;
    paintReveal();
  } catch (e) {
    showBroken(formatApiError(e) || t('reveal.brokenHint'));
  }
}

function showBroken(message) {
  revealData = null;
  brokenMessage = message;
  $('#revealApp').hidden = true;
  $('#broken').hidden = false;
  paintReveal();
}

$('#showBtn')?.addEventListener('click', () => {
  $('#rcover').hidden = true;
  $('#rshow').hidden = false;
});

$('#hideBtn')?.addEventListener('click', () => {
  $('#rcover').hidden = false;
  $('#rshow').hidden = true;
});

// Touch getLang so URL ?lang= is respected before first paint
getLang();
boot();
