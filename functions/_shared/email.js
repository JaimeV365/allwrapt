export function revealEmail({ toName, eventTitle, revealUrl, budget, note, dueDate }) {
  const safeTitle = eventTitle || 'Secret Santa';
  const subject = `Your ${safeTitle} link`;
  const text = [
    `Hi ${toName}!`,
    '',
    `Here is your private AllWrapt link for ${safeTitle}.`,
    'Open it to find out who you’re buying for — keep it secret.',
    '',
    revealUrl,
    budget ? `\nBudget: ${budget}` : '',
    dueDate ? `\nBring / ready by: ${dueDate}` : '',
    note ? `\n${note}` : '',
    '',
    '— AllWrapt',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0f2a22;color:#f4efe6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f2a22;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#17352c;border:1px solid #6b7970;border-radius:14px;padding:28px 24px;">
        <tr><td style="font-size:28px;font-weight:700;color:#f4efe6;">AllWrapt<span style="color:#ff8d8d;">.</span></td></tr>
        <tr><td style="padding-top:16px;font-size:16px;line-height:1.5;font-family:Arial,sans-serif;color:#f4efe6;">
          Hi ${escapeHtml(toName)}!<br><br>
          Open your private link for <strong>${escapeHtml(safeTitle)}</strong> to find out who you’re buying for. Keep it secret.
        </td></tr>
        <tr><td style="padding-top:24px;" align="center">
          <a href="${escapeAttr(revealUrl)}" style="display:inline-block;background:#c43c3c;color:#f4efe6;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;padding:12px 22px;border-radius:8px;">Open your reveal</a>
        </td></tr>
        <tr><td style="padding-top:20px;font-size:14px;line-height:1.5;font-family:Arial,sans-serif;color:#a8b5ad;">
          ${budget ? `Budget: ${escapeHtml(budget)}<br>` : ''}
          ${dueDate ? `Bring / ready by: ${escapeHtml(dueDate)}<br>` : ''}
          ${note ? escapeHtml(note) : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

/**
 * @returns {Promise<{ ok: boolean, id?: string, error?: string }>}
 */
export async function sendWithResend(env, { to, subject, text, html }) {
  if (!env.RESEND_API_KEY) {
    return { ok: false, error: 'Email is not configured yet (missing RESEND_API_KEY).' };
  }
  if (!env.RESEND_FROM) {
    return { ok: false, error: 'Email is not configured yet (missing RESEND_FROM).' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: body?.message || `Resend error (${res.status})`,
    };
  }
  return { ok: true, id: body.id };
}
