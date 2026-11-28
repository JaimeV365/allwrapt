import { json, err, readJson, withCors, corsHeaders } from '../../../_shared/http.js';
import { requireManage } from '../../../_shared/auth.js';
import { revealEmail, sendWithResend } from '../../../_shared/email.js';

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

/** POST /api/events/:id/send — body: { personIds?: string[] } */
export async function onRequestPost(context) {
  const { request, env, params } = context;
  const { event, error } = await requireManage(env, params.id, request);
  if (error) return withCors(error, request);

  if (!event.draw) {
    return withCors(err('Draw names before sending links.'), request);
  }

  const body = (await readJson(request)) || {};
  const filter = Array.isArray(body.personIds) ? new Set(body.personIds) : null;
  const origin = new URL(request.url).origin;

  const results = [];
  for (const person of event.people) {
    if (filter && !filter.has(person.id)) continue;
    const token = event.draw.reveals[person.id];
    if (!token) {
      results.push({ personId: person.id, name: person.name, ok: false, error: 'Missing reveal token.' });
      continue;
    }
    if (!person.email) {
      results.push({
        personId: person.id,
        name: person.name,
        ok: false,
        skipped: true,
        error: 'No email on file — use Copy link or WhatsApp instead.',
      });
      continue;
    }

    // Language can be passed by the client later; default English share link
    const revealUrl = `${origin}/reveal/?t=${encodeURIComponent(token)}`;
    const payload = revealEmail({
      toName: person.name,
      eventTitle: event.title,
      revealUrl,
      budget: event.budget,
      note: event.note,
      dueDate: event.dueDate || '',
    });
    const sent = await sendWithResend(env, {
      to: person.email,
      ...payload,
    });
    results.push({
      personId: person.id,
      name: person.name,
      email: person.email,
      ok: sent.ok,
      error: sent.error || null,
      id: sent.id || null,
    });
  }

  const sentCount = results.filter((r) => r.ok).length;
  return withCors(
    json({
      results,
      sentCount,
      message:
        sentCount > 0
          ? `Sent ${sentCount} email${sentCount === 1 ? '' : 's'}.`
          : 'No emails sent. Add addresses or configure Resend.',
    }),
    request
  );
}
