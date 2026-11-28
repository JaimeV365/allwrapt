import { json, err, withCors, corsHeaders } from '../../_shared/http.js';
import { loadEvent } from '../../_shared/auth.js';
import { revealKey } from '../../_shared/tokens.js';

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

/** GET /api/reveal/:token — public; returns only this person's assignment */
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const token = params.token;
  if (!token) {
    return withCors(err('This link looks incomplete.', 400, { code: 'REVEAL_BAD' }), request);
  }

  const raw = await env.EVENTS.get(revealKey(token));
  if (!raw) {
    return withCors(
      err('This link looks incomplete or out of date. Ask the organiser for a new one.', 404, {
        code: 'REVEAL_BAD',
      }),
      request
    );
  }

  let ref;
  try {
    ref = JSON.parse(raw);
  } catch {
    return withCors(err('This link looks incomplete.', 400, { code: 'REVEAL_BAD' }), request);
  }

  const event = await loadEvent(env, ref.eventId);
  if (!event?.draw) {
    return withCors(
      err('This draw is no longer available.', 404, { code: 'REVEAL_GONE' }),
      request
    );
  }

  const person = event.people.find((p) => p.id === ref.personId);
  const targetId = event.draw.assignments[ref.personId];
  const target = event.people.find((p) => p.id === targetId);

  if (!person || !target || event.draw.reveals[person.id] !== token) {
    return withCors(
      err('This link looks incomplete or out of date.', 404, { code: 'REVEAL_BAD' }),
      request
    );
  }

  return withCors(
    json({
      hello: person.name,
      title: event.title,
      target: target.name,
      budget: event.budget || '',
      note: event.note || '',
      dueDate: event.dueDate || '',
    }),
    request
  );
}
