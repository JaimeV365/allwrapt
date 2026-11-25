import { json, err, withCors, corsHeaders } from '../../../_shared/http.js';
import { publicEvent, randomSecret, revealKey } from '../../../_shared/tokens.js';
import { requireManage, saveEvent } from '../../../_shared/auth.js';
import { solve, diagnoseRules } from '../../../_shared/draw.js';

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

/** POST /api/events/:id/draw */
export async function onRequestPost(context) {
  const { request, env, params } = context;
  const { event, error } = await requireManage(env, params.id, request);
  if (error) return withCors(error, request);

  if (event.people.length < 3) {
    return withCors(err('Add at least three people first.'), request);
  }

  if (event.draw) {
    return withCors(
      err('Already drawn. Starting over is not supported in this version — create a new event if you need a fresh draw.'),
      request
    );
  }

  const ids = event.people.map((p) => p.id);
  const rules = event.rules || [];
  const map = solve(ids, ids, rules);
  if (!map) {
    const diagnosis = diagnoseRules(event.people, rules);
    return withCors(
      err(diagnosis.message || 'No valid draw exists with these rules.', 400, { diagnosis }),
      request
    );
  }

  const reveals = {};
  const now = new Date().toISOString();

  for (const person of event.people) {
    const token = randomSecret(28);
    reveals[person.id] = token;
    await env.EVENTS.put(
      revealKey(token),
      JSON.stringify({ eventId: event.id, personId: person.id, createdAt: now })
    );
  }

  event.draw = {
    drawnAt: now,
    assignments: map,
    reveals,
  };

  await saveEvent(env, event);
  return withCors(
    json({
      event: publicEvent(event),
      message: 'Done. Send each person their own link below.',
    }),
    request
  );
}
