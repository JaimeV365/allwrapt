import { startSnow } from './snow.js?v=6';
import { api, say } from './api.js?v=6';
import { mountLangSwitcher } from './lang.js?v=6';
import { t, formatApiError, applyI18n, getLang } from './i18n.js?v=6';
import { formatDueDate } from './ui.js?v=6';

startSnow();

const token = new URLSearchParams(location.search).get('t') || '';
const $ = (s) => document.querySelector(s);

let revealData = null;
let brokenMessage = '';

function setDetail(wrapId, valueId, value) {
  const wrap = $(wrapId);
  const val = $(valueId);
  if (!wrap || !val) return;
  const text = (value || '').trim();
  if (text) {
    val.textContent = text;
    wrap.hidden = false;
  } else {
    val.textContent = '';
    wrap.hidden = true;
  }
}

function paintReveal() {
  applyI18n();
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

  setDetail('#rbudWrap', '#rbud', revealData.budget || '');
  setDetail('#rdueWrap', '#rdue', formatDueDate(revealData.dueDate || ''));
  setDetail('#rnoteWrap', '#rnote', revealData.note || '');

  const hasDetails = Boolean(
    (revealData.budget || '').trim() ||
      (revealData.dueDate || '').trim() ||
      (revealData.note || '').trim()
  );
  const details = $('#rdetails');
  if (details) details.hidden = !hasDetails;
}

mountLangSwitcher(() => {
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

getLang();
boot();
