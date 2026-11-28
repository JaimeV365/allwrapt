import { startSnow } from './snow.js?v=5';
import { api, say } from './api.js?v=5';
import { mountLangSwitcher } from './lang.js?v=5';
import { t, withLang, getLang } from './i18n.js?v=5';

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
      body: { title: t('home.defaultTitle') },
    });
    location.href = withLang(data.managePath || data.manageUrl, getLang());
  } catch (e) {
    say(msg, e.message || t('home.createError'), 'err');
    btn.disabled = false;
  }
});
