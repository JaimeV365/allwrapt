import { startSnow } from './snow.js';
import { api, say } from './api.js';
import { mountLangSwitcher } from './lang.js';
import { t } from './i18n.js';

startSnow();
mountLangSwitcher(() => {
  // Re-apply budget label if already loaded
  const bud = document.getElementById('rbud');
  if (bud?.dataset.budget) {
    bud.textContent = t('reveal.budget', { budget: bud.dataset.budget });
  }
});

const token = new URLSearchParams(location.search).get('t') || '';

const $ = (s) => document.querySelector(s);

async function boot() {
  if (!token) {
    showBroken(t('reveal.brokenHint'));
    return;
  }
  try {
    const data = await api(`/api/reveal/${encodeURIComponent(token)}`);
    document.title = t('reveal.docTitle', { title: data.title || 'AllWrapt' });
    $('#rhello').textContent = `Hi ${data.hello}!`;
    // Keep greeting simple multilingual
    const hi = { en: 'Hi', es: '¡Hola', fr: 'Salut' };
    const lang = localStorage.getItem('allwrapt-lang') || 'en';
    const prefix = hi[lang] || 'Hi';
    $('#rhello').textContent =
      lang === 'es' ? `¡Hola ${data.hello}!` : `${prefix} ${data.hello}!`;
    $('#revent').textContent = data.title || 'Secret Santa';
    $('#rtarget').textContent = data.target;
    if (data.budget) {
      $('#rbud').dataset.budget = data.budget;
      $('#rbud').textContent = t('reveal.budget', { budget: data.budget });
    } else {
      $('#rbud').textContent = '';
      delete $('#rbud').dataset.budget;
    }
    $('#rnote').textContent = data.note || '';
    $('#revealApp').hidden = false;
  } catch (e) {
    showBroken(e.message || t('reveal.brokenHint'));
  }
}

function showBroken(message) {
  $('#revealApp').hidden = true;
  $('#broken').hidden = false;
  say($('#brokenMsg'), message, 'err');
}

$('#showBtn')?.addEventListener('click', () => {
  $('#rcover').hidden = true;
  $('#rshow').hidden = false;
});

$('#hideBtn')?.addEventListener('click', () => {
  $('#rcover').hidden = false;
  $('#rshow').hidden = true;
});

boot();
