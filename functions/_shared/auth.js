import { err } from './http.js';
import { eventKey } from './tokens.js';

export function getManageToken(request) {
  const header = request.headers.get('x-manage-token');
  if (header) return header.trim();
  const url = new URL(request.url);
  const q = url.searchParams.get('t');
  return q ? q.trim() : '';
}

export async function loadEvent(env, id) {
  const raw = await env.EVENTS.get(eventKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function requireManage(env, id, request) {
  const event = await loadEvent(env, id);
  if (!event) return { error: err('Event not found.', 404) };
  const token = getManageToken(request);
  if (!token || token !== event.manageToken) {
    return { error: err('Invalid or missing manage link. Check you copied the full URL.', 401) };
  }
  return { event };
}

export async function saveEvent(env, event) {
  event.updatedAt = new Date().toISOString();
  await env.EVENTS.put(eventKey(event.id), JSON.stringify(event));
}
