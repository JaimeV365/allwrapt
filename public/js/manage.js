import { startSnow } from './snow.js';
import { api, esc, say, copyText } from './api.js';
import { mountLangSwitcher } from './lang.js';
import { t, formatApiError, applyI18n, withLang, getLang } from './i18n.js';
import { createSelect, createCheck, createDateField } from './ui.js';

startSnow();

const params = new URLSearchParams(location.search);
const eventId = params.get('e') || '';
const manageToken = params.get('t') || '';

const $ = (s) => document.querySelector(s);

let event = null;
let lastRuleError = '';
let lastDrawError = '';
let lastPeopleError = '';

const dueDateField = createDateField($('#dueDate'), {
  onChange: () => queueMetaSave(),
});

const raSelect = createSelect($('#ra'), {
  placeholder: t('manage.pickPerson'),
  onChange: () => syncReceiverOptions(),
});
const rbSelect = createSelect($('#rb'), {
  placeholder: t('manage.pickPerson'),
});
const bothCheck = createCheck($('#both'), { checked: true });

mountLangSwitcher(() => {
  dueDateField?.refreshLabels();
  raSelect?.setPlaceholder(t('manage.pickPerson'));
  rbSelect?.setPlaceholder(t('manage.pickPerson'));
  if (event) render({ keepErrors: true });
});

function manageUrl() {
  return withLang(
    `${location.origin}/manage/?e=${encodeURIComponent(eventId)}&t=${encodeURIComponent(manageToken)}`,
    getLang()
  );
}

function revealUrl(personId) {
  const token = event?.reveals?.[personId];
  return token
    ? withLang(`${location.origin}/reveal/?t=${encodeURIComponent(token)}`, getLang())
    : '';
}

function msgFor(person) {
  return t('manage.shareMsg', {
    name: person.name,
    title: event.title,
    url: revealUrl(person.id),
  });
}

function mailtoHref(person) {
  const subject = t('manage.mailSubject', { title: event.title });
  const body = msgFor(person).replace(/\n/g, '\r\n');
  const to = person.email ? encodeURIComponent(person.email) : '';
  return (
    `mailto:${to}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

function showDrawModal(show) {
  const modal = $('#drawModal');
  if (!modal) return;
  if (show) {
    $('#drawModalTitle').textContent = t('manage.drawing');
    modal.hidden = false;
  } else {
    modal.hidden = true;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiErrorMessage(e) {
  return formatApiError(e);
}

async function load() {
  if (!eventId || !manageToken) {
    $('#bootErr').hidden = false;
    $('#app').hidden = true;
    applyI18n();
    return;
  }
  try {
    const data = await api(`/api/events/${eventId}`, { token: manageToken });
    event = data.event;
    render();
    $('#app').hidden = false;
  } catch (e) {
    $('#bootErr').hidden = false;
    $('#bootErrText').textContent = e.message || t('manage.bootText');
    $('#app').hidden = true;
    applyI18n();
  }
}

async function savePatch(body, { silent = false, keepErrors = false } = {}) {
  const data = await api(`/api/events/${eventId}`, {
    method: 'PATCH',
    token: manageToken,
    body,
  });
  event = data.event;
  if (!silent) render({ keepErrors });
  return event;
}

function render(opts = {}) {
  applyI18n();
  $('#ev').value = event.title || '';
  $('#bud').value = event.budget || '';
  $('#note').value = event.note || '';
  dueDateField?.set(event.dueDate || '');
  dueDateField?.refreshLabels();
  $('#manageLink').textContent = manageUrl();

  if (!opts.keepErrors) {
    lastRuleError = '';
    lastDrawError = '';
    lastPeopleError = '';
    say($('#rmsg'), '');
    say($('#dmsg'), '');
    say($('#pmsg'), '');
  } else {
    if (lastRuleError) say($('#rmsg'), lastRuleError, 'err');
    if (lastDrawError) say($('#dmsg'), lastDrawError, 'err');
    if (lastPeopleError) say($('#pmsg'), lastPeopleError, 'err');
  }

  const locked = Boolean(event.drawn);
  $('#addP').disabled = locked;
  $('#pname').disabled = locked;
  $('#pemail').disabled = locked;
  $('#addR').disabled = locked;
  raSelect?.setDisabled(locked);
  rbSelect?.setDisabled(locked);
  bothCheck?.setDisabled(locked);
  $('#drawBtn').disabled = locked;
  $('#drawBtn').textContent = locked ? t('manage.alreadyDrawn') : t('manage.drawBtn');
  $('#copyManage').textContent = t('manage.copyLink');
  raSelect?.setPlaceholder(t('manage.pickPerson'));
  rbSelect?.setPlaceholder(t('manage.pickPerson'));

  renderPeople();
  renderRules();
  renderResults();
}

function renderPeople() {
  const box = $('#people');
  if (!event.people.length) {
    box.innerHTML = `<span class="hint" style="color:var(--mute)">${esc(t('manage.nobody'))}</span>`;
  } else {
    box.innerHTML = event.people
      .map(
        (p) => `<span class="chip">${esc(p.name)}${
          event.drawn
            ? ''
            : `<button type="button" data-rm="${esc(p.id)}" aria-label="${esc(t('manage.remove'))} ${esc(p.name)}">×</button>`
        }</span>`
      )
      .join('');
  }
  fillRuleSelects();
}

function personOptions(excludeId) {
  return event.people
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ value: p.id, label: p.name }));
}

function fillRuleSelects() {
  if (!raSelect || !rbSelect) return;
  const prevA = raSelect.get();
  const prevB = rbSelect.get();
  const opts = personOptions();
  raSelect.setOptions(opts);
  if (prevA && opts.some((o) => o.value === prevA)) raSelect.set(prevA);
  else if (opts.length) raSelect.set(opts[0].value);
  else raSelect.set('');
  syncReceiverOptions(prevB);
}

function syncReceiverOptions(preferredB) {
  if (!raSelect || !rbSelect) return;
  const giver = raSelect.get();
  const keep = preferredB && preferredB !== giver ? preferredB : rbSelect.get();
  const opts = personOptions(giver);
  rbSelect.setOptions(opts);
  if (keep && opts.some((o) => o.value === keep)) rbSelect.set(keep);
  else if (opts.length) rbSelect.set(opts[0].value);
  else rbSelect.set('');
}

function renderRules() {
  const byId = Object.fromEntries(event.people.map((p) => [p.id, p.name]));
  const list = $('#rules');
  if (!event.rules.length) {
    list.innerHTML = `<li style="border:0;color:var(--mute)">${esc(t('manage.noRules'))}</li>`;
    return;
  }
  list.innerHTML = event.rules
    .map(([a, b], i) => {
      const label = `${esc(byId[a] || a)} ${esc(t('manage.cantGive'))} ${esc(byId[b] || b)}`;
      const rm = event.drawn
        ? ''
        : `<button type="button" class="ghost" data-rr="${i}">${esc(t('manage.remove'))}</button>`;
      return `<li><span>${label}</span>${rm}</li>`;
    })
    .join('');
}

function renderResults() {
  const sec = $('#resultsSec');
  const list = $('#results');
  if (!event.drawn) {
    sec.hidden = true;
    list.innerHTML = '';
    return;
  }
  sec.hidden = false;
  list.innerHTML = event.people
    .map(
      (p) => `<li>
        <span><strong>${esc(p.name)}</strong></span>
        <span class="act">
          <button type="button" data-copy="${esc(p.id)}">${esc(t('manage.copyReveal'))}</button>
          <button type="button" class="ghost" data-wa="${esc(p.id)}">${esc(t('manage.whatsapp'))}</button>
          <button type="button" class="ghost" data-mail="${esc(p.id)}">${esc(t('manage.email'))}</button>
        </span>
      </li>`
    )
    .join('');
}

let saveTimer;
function queueMetaSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await savePatch(
        {
          title: $('#ev').value,
          budget: $('#bud').value,
          note: $('#note').value,
          dueDate: dueDateField?.get() || '',
        },
        { silent: true }
      );
      event.dueDate = dueDateField?.get() || '';
      $('#manageLink').textContent = manageUrl();
      say($('#metaMsg'), t('manage.saved'), 'ok');
      setTimeout(() => say($('#metaMsg'), ''), 1200);
    } catch (e) {
      say($('#metaMsg'), apiErrorMessage(e), 'err');
    }
  }, 400);
}
['#ev', '#bud', '#note'].forEach((sel) => {
  $(sel)?.addEventListener('input', queueMetaSave);
});

$('#copyManage')?.addEventListener('click', async () => {
  const ok = await copyText(manageUrl());
  const btn = $('#copyManage');
  if (ok) {
    btn.textContent = t('manage.copied');
    setTimeout(() => (btn.textContent = t('manage.copyLink')), 1500);
  }
});

async function addPerson() {
  const name = $('#pname').value.trim();
  const email = $('#pemail').value.trim();
  if (!name) return;
  lastPeopleError = '';
  say($('#pmsg'), '');
  try {
    const people = event.people.concat([{ name, email }]);
    await savePatch({ people });
    $('#pname').value = '';
    $('#pemail').value = '';
    $('#pname').focus();
  } catch (e) {
    lastPeopleError = apiErrorMessage(e);
    say($('#pmsg'), lastPeopleError, 'err');
  }
}
$('#addP')?.addEventListener('click', addPerson);
$('#pname')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addPerson();
});

$('#people')?.addEventListener('click', async (e) => {
  const id = e.target.dataset?.rm;
  if (!id) return;
  try {
    const people = event.people.filter((p) => p.id !== id);
    const rules = event.rules.filter(([a, b]) => a !== id && b !== id);
    await savePatch({ people, rules });
  } catch (err) {
    lastPeopleError = apiErrorMessage(err);
    say($('#pmsg'), lastPeopleError, 'err');
  }
});

$('#addR')?.addEventListener('click', async () => {
  const a = raSelect?.get() || '';
  const b = rbSelect?.get() || '';
  lastRuleError = '';
  say($('#rmsg'), '');
  if (!a || !b) {
    lastRuleError = t('manage.pickTwo');
    say($('#rmsg'), lastRuleError, 'err');
    return;
  }
  if (a === b) {
    lastRuleError = t('manage.noSelf');
    say($('#rmsg'), lastRuleError, 'err');
    return;
  }
  const rules = event.rules.slice();
  const add = (x, y) => {
    if (!rules.some((r) => r[0] === x && r[1] === y)) rules.push([x, y]);
  };
  add(a, b);
  if (bothCheck?.get()) add(b, a);
  try {
    await savePatch({ rules });
    lastRuleError = '';
    say($('#rmsg'), t('manage.ruleAdded'), 'ok');
    setTimeout(() => say($('#rmsg'), ''), 1200);
  } catch (e) {
    lastRuleError = apiErrorMessage(e);
    say($('#rmsg'), lastRuleError, 'err');
  }
});

$('#rules')?.addEventListener('click', async (e) => {
  const i = e.target.dataset?.rr;
  if (i === undefined) return;
  say($('#rmsg'), '');
  lastRuleError = '';
  lastDrawError = '';
  const rules = event.rules.slice();
  rules.splice(+i, 1);
  try {
    await savePatch({ rules });
    say($('#rmsg'), '');
    say($('#dmsg'), '');
  } catch (err) {
    lastRuleError = apiErrorMessage(err);
    say($('#rmsg'), lastRuleError, 'err');
  }
});

$('#drawBtn')?.addEventListener('click', async () => {
  lastDrawError = '';
  say($('#dmsg'), '');
  $('#drawBtn').disabled = true;
  showDrawModal(true);
  const started = Date.now();
  try {
    const data = await api(`/api/events/${eventId}/draw`, {
      method: 'POST',
      token: manageToken,
    });
    const elapsed = Date.now() - started;
    if (elapsed < 3200) await wait(3200 - elapsed);
    event = data.event;
    showDrawModal(false);
    render();
    say($('#dmsg'), t('manage.drawDone'), 'ok');
  } catch (e) {
    showDrawModal(false);
    lastDrawError = apiErrorMessage(e);
    say($('#dmsg'), lastDrawError, 'err');
    $('#drawBtn').disabled = Boolean(event?.drawn);
  }
});

$('#results')?.addEventListener('click', async (e) => {
  const tset = e.target.dataset || {};
  const person = event.people.find((p) => p.id === tset.copy || p.id === tset.wa || p.id === tset.mail);
  if (!person) return;

  if (tset.copy) {
    const url = revealUrl(person.id);
    const ok = await copyText(url);
    if (ok) {
      e.target.textContent = t('manage.copied');
      setTimeout(() => (e.target.textContent = t('manage.copyReveal')), 1500);
    }
  }
  if (tset.wa) {
    window.open('https://wa.me/?text=' + encodeURIComponent(msgFor(person)), '_blank');
  }
  if (tset.mail) {
    location.href = mailtoHref(person);
  }
});

load();
