/** Fisher–Yates shuffle (copy). */
export function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Backtracking Secret Santa solver.
 * @param {string[]} givers person ids
 * @param {string[]} targets person ids (usually same list)
 * @param {Array<[string, string]>} rules [giverId, receiverId] exclusions
 * @param {{ random?: boolean, maxSteps?: number }} [opts]
 * @returns {Record<string, string> | null} map giverId → receiverId
 */
export function solve(givers, targets, rules, opts = {}) {
  const random = opts.random !== false;
  const maxSteps = opts.maxSteps || 200000;
  const blocked = new Set(rules.map(([a, b]) => `${a}>${b}`));
  const n = givers.length;
  const order = random ? shuffle([...givers.keys()]) : [...givers.keys()];
  const used = Array(n).fill(false);
  const res = {};
  let steps = 0;

  const allowed = (g, t) => g !== t && !blocked.has(`${g}>${t}`);

  const pickTargets = () => (random ? shuffle([...targets.keys()]) : [...targets.keys()]);

  const go = (k) => {
    if (k === n) return true;
    if (++steps > maxSteps) return false;
    const g = givers[order[k]];
    for (const j of pickTargets()) {
      if (used[j] || !allowed(g, targets[j])) continue;
      used[j] = true;
      res[g] = targets[j];
      if (go(k + 1)) return true;
      used[j] = false;
    }
    return false;
  };

  return go(0) ? res : null;
}

/** True if at least one valid assignment exists. */
export function canSolve(ids, rules, attempts = 40) {
  if (ids.length < 2) return false;
  // Deterministic pass first (stable for small groups)
  if (solve(ids, ids, rules, { random: false, maxSteps: 500000 })) return true;
  for (let i = 0; i < attempts; i++) {
    if (solve(ids, ids, rules, { random: true })) return true;
  }
  return false;
}

function labelRule(rule, nameOf) {
  return `${nameOf(rule[0])} can’t give to ${nameOf(rule[1])}`;
}

/**
 * Explain why a draw is impossible with these rules.
 * @param {{ id: string, name: string }[]} people
 * @param {Array<[string, string]>} rules
 */
export function diagnoseRules(people, rules) {
  const ids = people.map((p) => p.id);
  const nameOf = (id) => people.find((p) => p.id === id)?.name || id;

  if (ids.length < 3) {
    return { ok: false, message: 'Add at least three people first.' };
  }

  if (canSolve(ids, rules)) {
    return { ok: true };
  }

  const blocked = new Set(rules.map(([a, b]) => `${a}>${b}`));
  const stuckGivers = ids.filter(
    (g) => ids.filter((t) => t !== g && !blocked.has(`${g}>${t}`)).length === 0
  );
  const stuckReceivers = ids.filter(
    (t) => ids.filter((g) => g !== t && !blocked.has(`${g}>${t}`)).length === 0
  );

  const parts = [];

  if (stuckGivers.length) {
    parts.push(
      stuckGivers.length === 1
        ? `${nameOf(stuckGivers[0])} has nobody left they are allowed to give to.`
        : `These people have nobody left they can give to: ${stuckGivers.map(nameOf).join(', ')}.`
    );
  }
  if (stuckReceivers.length) {
    parts.push(
      stuckReceivers.length === 1
        ? `Nobody is allowed to give to ${nameOf(stuckReceivers[0])}.`
        : `Nobody is allowed to give to: ${stuckReceivers.map(nameOf).join(', ')}.`
    );
  }

  // Leave-one-out: which single rules, if removed, make a draw possible again
  const culprits = [];
  for (let i = 0; i < rules.length; i++) {
    const without = rules.filter((_, j) => j !== i);
    if (canSolve(ids, without)) culprits.push(rules[i]);
  }

  if (culprits.length === 1) {
    parts.push(`The rule blocking the draw is: “${labelRule(culprits[0], nameOf)}”.`);
  } else if (culprits.length > 1) {
    parts.push(
      `Any one of these rules is enough to block a valid draw — remove one of them: ${culprits
        .map((r) => `“${labelRule(r, nameOf)}”`)
        .join('; ')}.`
    );
  } else if (rules.length > 1) {
    parts.push(
      `No single rule is the sole problem — these rules together make a draw impossible: ${rules
        .map((r) => `“${labelRule(r, nameOf)}”`)
        .join('; ')}. Try removing more than one, or add another person.`
    );
  } else if (rules.length === 1) {
    parts.push(`The rule blocking the draw is: “${labelRule(rules[0], nameOf)}”.`);
  } else {
    parts.push('No valid draw exists with this group. Add more people.');
  }

  return {
    ok: false,
    message: parts.join(' '),
    stuckGivers: stuckGivers.map(nameOf),
    stuckReceivers: stuckReceivers.map(nameOf),
    culprits: culprits.map((r) => labelRule(r, nameOf)),
    // Structured for client i18n
    culpritPairs: culprits.map(([a, b]) => [nameOf(a), nameOf(b)]),
    rulePairs: rules.map(([a, b]) => [nameOf(a), nameOf(b)]),
  };
}
