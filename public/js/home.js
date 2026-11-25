import { startSnow } from './snow.js';
import { api, say } from './api.js';
import { mountLangSwitcher } from './lang.js';
import { t, withLang, getLang } from './i18n.js';

startSnow();
mountLangSwitcher();

const btn = document.getElementById('startBtn');
const msg = document.getElementById('startMsg');

btn?.addEventListener('click', async () => {
  btn.disabled = true;
  say(msg, '');
  try {
    const data = await api('/api/events', {
      method: 'POST',
      body: { title: 'Secret Santa' },
    });
    location.href = withLang(data.managePath || data.manageUrl, getLang());
  } catch (e) {
    say(msg, e.message || t('home.createError'), 'err');
    btn.disabled = false;
  }
});
