import { t } from './i18n.js';

export async function api(path, { method = 'GET', token, body } = {}) {
  const headers = { accept: 'application/json' };
  if (token) headers['x-manage-token'] = token;
  if (body !== undefined) headers['content-type'] = 'application/json';

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function say(el, text, kind) {
  if (!el) return;
  if (!text) {
    el.textContent = '';
    el.className = 'msg';
    el.replaceChildren();
    return;
  }
  el.className = 'msg ' + (kind || '');
  el.replaceChildren();
  if (kind === 'ok' || kind === 'err') {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.dataset.i18nBadge = kind;
    badge.textContent = kind === 'ok' ? t('msg.ok') : t('msg.err');
    el.appendChild(badge);
  }
  const span = document.createElement('span');
  span.textContent = text;
  el.appendChild(span);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    window.prompt('Copy this:', text);
    return false;
  }
}
