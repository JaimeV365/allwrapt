import { json, err, readJson, withCors, corsHeaders } from '../../_shared/http.js';
import { publicEvent, randomId } from '../../_shared/tokens.js';
import { requireManage, saveEvent } from '../../_shared/auth.js';
import { canSolve, diagnoseRules } from '../../_shared/draw.js';

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

/** GET /api/events/:id */
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const { event, error } = await requireManage(env, params.id, request);
  if (error) return withCors(error, request);
  return withCors(json({ event: publicEvent(event) }), request);
}

/** PATCH /api/events/:id — update draft (people/rules locked after draw; note/budget/title always editable) */
export async function onRequestPatch(context) {
  const { request, env, params } = context;
  const { event, error } = await requireManage(env, params.id, request);
  if (error) return withCors(error, request);

  const body = await readJson(request);
  if (!body) return withCors(err('Invalid JSON body.'), request);

  if (typeof body.title === 'string') event.title = body.title.trim().slice(0, 120) || 'Secret Santa';
  if (typeof body.budget === 'string') event.budget = body.budget.trim().slice(0, 80);
  if (typeof body.note === 'string') event.note = body.note.trim().slice(0, 500);

  if (event.draw) {
    if (body.people !== undefined || body.rules !== undefined) {
      return withCors(
        err('People and rules are locked after the draw. You can still edit the title, budget, and note.'),
        request
      );
    }
  } else {
    if (Array.isArray(body.people)) {
      const people = [];
      const seen = new Set();
      for (const p of body.people) {
        const name = String(p?.name || '').trim().slice(0, 80);
        if (!name) continue;
        const key = name.toLowerCase();
        if (seen.has(key)) {
          return withCors(err(`Duplicate name: ${name}. Add a surname or initial.`), request);
        }
        seen.add(key);
        const email = String(p?.email || '').trim().slice(0, 120);
        people.push({
          id: String(p?.id || randomId(10)),
          name,
          email: email && email.includes('@') ? email : '',
        });
      }
      event.people = people;
      const ids = new Set(people.map((p) => p.id));
      event.rules = (event.rules || []).filter(([a, b]) => ids.has(a) && ids.has(b));
    }

    if (Array.isArray(body.rules)) {
      const ids = new Set(event.people.map((p) => p.id));
      const rules = [];
      const seen = new Set();
      for (const r of body.rules) {
        const a = String(r?.[0] || '');
        const b = String(r?.[1] || '');
        if (!ids.has(a) || !ids.has(b) || a === b) continue;
        const k = `${a}>${b}`;
        if (seen.has(k)) continue;
        seen.add(k);
        rules.push([a, b]);
      }

      // Guard rail: reject rule sets that make a draw impossible (once we have 3+ people)
      if (event.people.length >= 3 && !canSolve(event.people.map((p) => p.id), rules)) {
        const diagnosis = diagnoseRules(event.people, rules);
        return withCors(
          err(diagnosis.message || 'These rules make a draw impossible.', 400, {
            diagnosis,
          }),
          request
        );
      }

      event.rules = rules;
    }

    // Also re-check after people changes (existing rules may become impossible)
    if (
      Array.isArray(body.people) &&
      event.people.length >= 3 &&
      !canSolve(
        event.people.map((p) => p.id),
        event.rules || []
      )
    ) {
      const diagnosis = diagnoseRules(event.people, event.rules || []);
      return withCors(
        err(
          diagnosis.message ||
            'With this group, the current rules make a draw impossible. Remove a rule or add someone.',
          400,
          { diagnosis }
        ),
        request
      );
    }
  }

  await saveEvent(env, event);
  return withCors(json({ event: publicEvent(event) }), request);
}
