import { json, readJson, withCors, corsHeaders } from '../../_shared/http.js';
import { randomId, randomSecret, publicEvent } from '../../_shared/tokens.js';
import { saveEvent } from '../../_shared/auth.js';

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

/** POST /api/events — create a new draft event */
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = (await readJson(request)) || {};

  const id = randomId(12);
  const manageToken = randomSecret(40);
  const now = new Date().toISOString();

  const event = {
    id,
    manageToken,
    createdAt: now,
    updatedAt: now,
    title: String(body.title || 'Secret Santa').slice(0, 120),
    budget: String(body.budget || '').slice(0, 80),
    note: String(body.note || '').slice(0, 500),
    dueDate: '',
    people: [],
    rules: [],
    draw: null,
  };

  await saveEvent(env, event);

  const origin = new URL(request.url).origin;
  const managePath = `/manage/?e=${encodeURIComponent(id)}&t=${encodeURIComponent(manageToken)}`;

  return withCors(
    json({
      id,
      manageToken,
      manageUrl: origin + managePath,
      managePath,
      event: publicEvent(event),
    }),
    request
  );
}
