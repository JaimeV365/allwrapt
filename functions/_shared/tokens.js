const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** URL-safe random id (default 16 chars). */
export function randomId(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

/** Long manage / reveal secret. */
export function randomSecret(length = 32) {
  return randomId(length);
}

export function eventKey(id) {
  return `event:${id}`;
}

export function revealKey(token) {
  return `reveal:${token}`;
}

/** Public view of an event for the organizer (includes manage fields, never raw secrets of others). */
export function publicEvent(event) {
  return {
    id: event.id,
    title: event.title,
    budget: event.budget,
    note: event.note,
    dueDate: event.dueDate || '',
    people: event.people,
    rules: event.rules,
    drawn: Boolean(event.draw),
    drawnAt: event.draw?.drawnAt || null,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    reveals: event.draw
      ? Object.fromEntries(
          event.people.map((p) => [p.id, event.draw.reveals[p.id] || null])
        )
      : null,
  };
}
