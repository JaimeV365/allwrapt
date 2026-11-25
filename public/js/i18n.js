const STORAGE_KEY = 'allwrapt-lang';

export const LANGS = [
  { code: 'en', label: 'English', flag: '/img/flags/en.svg' },
  { code: 'es', label: 'Español', flag: '/img/flags/es.svg' },
  { code: 'fr', label: 'Français', flag: '/img/flags/fr.svg' },
];

const dict = {
  en: {
    'meta.homeTitle': 'AllWrapt — Secret Santa',
    'meta.manageTitle': 'Manage draw — AllWrapt',
    'meta.revealTitle': 'Your reveal — AllWrapt',
    'home.headline': 'Secret Santa, all wrapt up.',
    'home.lede': 'Add your people, set a few rules, draw once, then send each person a private link.',
    'home.start': 'Start a draw',
    'home.createError': 'Could not create an event.',
    'manage.bootTitle': 'Can’t open this draw',
    'manage.bootText': 'This manage link looks incomplete. Check you copied the whole URL from when the draw was created.',
    'manage.newDraw': 'Start a new draw',
    'manage.statusDraft': 'Draft · not drawn yet',
    'manage.statusDrawn': 'Drawn · links ready',
    'manage.title': 'Your draw',
    'manage.sub': 'There is no login. If you lose this page’s link, you can’t come back to edit this draw.',
    'manage.saveTitle': 'Save your secret manage link',
    'manage.saveBody': 'Bookmark this page, copy the link into your notes, or email it to yourself. It’s the only way to reopen this draw later. Anyone with the link can manage the event — keep it private.',
    'manage.copyLink': 'Copy manage link',
    'manage.copied': 'Copied',
    'manage.event': 'The event',
    'manage.name': 'Name',
    'manage.budget': 'Budget (optional)',
    'manage.budgetPh': 'e.g. £20',
    'manage.note': 'Message shown with the reveal (optional)',
    'manage.notePh': 'e.g. Gifts exchanged on 20 Dec',
    'manage.saved': 'Saved.',
    'manage.people': 'Participants',
    'manage.peopleHint': 'At least three people.',
    'manage.namePh': 'Name',
    'manage.addPerson': 'Add person',
    'manage.nobody': 'No one added yet.',
    'manage.rules': 'Rules',
    'manage.rulesHint': 'Stop certain pairings — for example partners. You can’t pick the same person twice, and AllWrapt blocks rules that would make a draw impossible.',
    'manage.cantGive': 'can’t give to',
    'manage.bothWays': 'Apply both ways',
    'manage.addRule': 'Add rule',
    'manage.noRules': 'No rules yet.',
    'manage.pickTwo': 'Pick two different people.',
    'manage.noSelf': 'Someone can’t be blocked from giving to themselves — pick another person.',
    'manage.ruleAdded': 'Rule added.',
    'manage.draw': 'Draw',
    'manage.drawHint': 'Results stay hidden here. You only see who each link belongs to — not who they drew.',
    'manage.drawBtn': 'Draw names',
    'manage.alreadyDrawn': 'Already drawn',
    'manage.drawing': 'Drawing…',
    'manage.drawDone': 'Done. Send each person their own link below.',
    'manage.links': 'Private links',
    'manage.linksHint': 'Copy, WhatsApp, or email each person their own link.',
    'manage.copyReveal': 'Copy link',
    'manage.whatsapp': 'WhatsApp',
    'manage.email': 'Email',
    'manage.remove': 'Remove',
    'manage.shareMsg': 'Hi {name}!\n\nHere is your private {title} link.\nOpen it to find out who you’re buying for — keep it secret.\n\n{url}\n\n— AllWrapt',
    'manage.mailSubject': 'Your {title} link',
    'reveal.brokenTitle': 'This link looks incomplete',
    'reveal.brokenHint': 'Ask the organiser to send it again, and make sure the whole link was copied.',
    'reveal.for': 'You are Secret Santa for…',
    'reveal.tap': 'Tap to reveal',
    'reveal.hide': 'Hide again',
    'reveal.budget': 'Budget: {budget}',
    'reveal.docTitle': '{title} — your reveal',
    'lang.label': 'Language',
    'diag.stuckGiverOne': '{name} has nobody left they are allowed to give to.',
    'diag.stuckGiverMany': 'These people have nobody left they can give to: {names}.',
    'diag.stuckRecvOne': 'Nobody is allowed to give to {name}.',
    'diag.stuckRecvMany': 'Nobody is allowed to give to: {names}.',
    'diag.culpritOne': 'The rule blocking the draw is: “{rule}”.',
    'diag.culpritMany': 'Any one of these rules is enough to block a valid draw — remove one of them: {rules}.',
    'diag.together': 'No single rule is the sole problem — these rules together make a draw impossible: {rules}. Try removing more than one, or add another person.',
    'diag.rule': '{a} can’t give to {b}',
    'diag.needThree': 'Add at least three people first.',
    'diag.fallback': 'No valid draw exists with these rules. Remove a rule or add more people.',
  },
  es: {
    'meta.homeTitle': 'AllWrapt — Amigo Invisible',
    'meta.manageTitle': 'Gestionar sorteo — AllWrapt',
    'meta.revealTitle': 'Tu revelación — AllWrapt',
    'home.headline': 'Amigo Invisible, todo resuelto.',
    'home.lede': 'Añade a tu gente, pon unas reglas, sortea una vez y envía a cada persona su enlace privado.',
    'home.start': 'Empezar un sorteo',
    'home.createError': 'No se pudo crear el evento.',
    'manage.bootTitle': 'No se puede abrir este sorteo',
    'manage.bootText': 'Este enlace de gestión parece incompleto. Comprueba que copiaste la URL entera de cuando se creó el sorteo.',
    'manage.newDraw': 'Empezar un sorteo nuevo',
    'manage.statusDraft': 'Borrador · aún sin sortear',
    'manage.statusDrawn': 'Sorteado · enlaces listos',
    'manage.title': 'Tu sorteo',
    'manage.sub': 'No hay inicio de sesión. Si pierdes el enlace de esta página, no podrás volver a editar este sorteo.',
    'manage.saveTitle': 'Guarda tu enlace secreto de gestión',
    'manage.saveBody': 'Marca esta página, copia el enlace en tus notas o envíatelo por correo. Es la única forma de reabrir este sorteo más tarde. Quien tenga el enlace puede gestionarlo — mantenlo en privado.',
    'manage.copyLink': 'Copiar enlace de gestión',
    'manage.copied': 'Copiado',
    'manage.event': 'El evento',
    'manage.name': 'Nombre',
    'manage.budget': 'Presupuesto (opcional)',
    'manage.budgetPh': 'p. ej. 20 €',
    'manage.note': 'Mensaje que se muestra con la revelación (opcional)',
    'manage.notePh': 'p. ej. Intercambio el 20 de dic',
    'manage.saved': 'Guardado.',
    'manage.people': 'Participantes',
    'manage.peopleHint': 'Al menos tres personas.',
    'manage.namePh': 'Nombre',
    'manage.addPerson': 'Añadir persona',
    'manage.nobody': 'Todavía no hay nadie.',
    'manage.rules': 'Reglas',
    'manage.rulesHint': 'Evita ciertos emparejamientos — por ejemplo parejas. No puedes elegir a la misma persona dos veces, y AllWrapt bloquea reglas que harían imposible el sorteo.',
    'manage.cantGive': 'no puede regalar a',
    'manage.bothWays': 'Aplicar en ambos sentidos',
    'manage.addRule': 'Añadir regla',
    'manage.noRules': 'Todavía no hay reglas.',
    'manage.pickTwo': 'Elige dos personas distintas.',
    'manage.noSelf': 'Nadie puede bloquearse a sí mismo — elige a otra persona.',
    'manage.ruleAdded': 'Regla añadida.',
    'manage.draw': 'Sorteo',
    'manage.drawHint': 'Los resultados no se muestran aquí. Solo ves a quién pertenece cada enlace — no a quién le tocó.',
    'manage.drawBtn': 'Sortear nombres',
    'manage.alreadyDrawn': 'Ya sorteado',
    'manage.drawing': 'Sorteando…',
    'manage.drawDone': 'Listo. Envía a cada persona su propio enlace abajo.',
    'manage.links': 'Enlaces privados',
    'manage.linksHint': 'Copia, WhatsApp o correo para cada persona con su propio enlace.',
    'manage.copyReveal': 'Copiar enlace',
    'manage.whatsapp': 'WhatsApp',
    'manage.email': 'Email',
    'manage.remove': 'Quitar',
    'manage.shareMsg': '¡Hola {name}!\n\nAquí tienes tu enlace privado de {title}.\nÁbrelo para saber a quién regalas — manténlo en secreto.\n\n{url}\n\n— AllWrapt',
    'manage.mailSubject': 'Tu enlace de {title}',
    'reveal.brokenTitle': 'Este enlace parece incompleto',
    'reveal.brokenHint': 'Pide al organizador que te lo envíe otra vez y asegúrate de copiar el enlace entero.',
    'reveal.for': 'Te toca regalar a…',
    'reveal.tap': 'Toca para revelar',
    'reveal.hide': 'Ocultar otra vez',
    'reveal.budget': 'Presupuesto: {budget}',
    'reveal.docTitle': '{title} — tu revelación',
    'lang.label': 'Idioma',
    'diag.stuckGiverOne': '{name} no tiene a nadie a quien pueda regalar.',
    'diag.stuckGiverMany': 'Estas personas no tienen a nadie a quien regalar: {names}.',
    'diag.stuckRecvOne': 'Nadie puede regalar a {name}.',
    'diag.stuckRecvMany': 'Nadie puede regalar a: {names}.',
    'diag.culpritOne': 'La regla que bloquea el sorteo es: “{rule}”.',
    'diag.culpritMany': 'Cualquiera de estas reglas basta para bloquear el sorteo — quita una: {rules}.',
    'diag.together': 'No es una sola regla: juntas hacen imposible el sorteo: {rules}. Prueba a quitar más de una, o añade a otra persona.',
    'diag.rule': '{a} no puede regalar a {b}',
    'diag.needThree': 'Añade al menos tres personas primero.',
    'diag.fallback': 'No hay un sorteo válido con estas reglas. Quita una regla o añade más gente.',
  },
  fr: {
    'meta.homeTitle': 'AllWrapt — Père Noël secret',
    'meta.manageTitle': 'Gérer le tirage — AllWrapt',
    'meta.revealTitle': 'Votre révélation — AllWrapt',
    'home.headline': 'Père Noël secret, tout est prêt.',
    'home.lede': 'Ajoutez vos proches, posez quelques règles, tirez une fois, puis envoyez à chacun un lien privé.',
    'home.start': 'Commencer un tirage',
    'home.createError': 'Impossible de créer l’événement.',
    'manage.bootTitle': 'Impossible d’ouvrir ce tirage',
    'manage.bootText': 'Ce lien d’organisation semble incomplet. Vérifiez que vous avez copié l’URL entière créée au départ.',
    'manage.newDraw': 'Commencer un nouveau tirage',
    'manage.statusDraft': 'Brouillon · pas encore tiré',
    'manage.statusDrawn': 'Tirage fait · liens prêts',
    'manage.title': 'Votre tirage',
    'manage.sub': 'Il n’y a pas de connexion. Si vous perdez le lien de cette page, vous ne pourrez plus modifier ce tirage.',
    'manage.saveTitle': 'Enregistrez votre lien secret d’organisation',
    'manage.saveBody': 'Ajoutez cette page aux favoris, copiez le lien dans vos notes, ou envoyez-le vous par e-mail. C’est le seul moyen de rouvrir ce tirage plus tard. Quiconque a le lien peut le gérer — gardez-le privé.',
    'manage.copyLink': 'Copier le lien d’organisation',
    'manage.copied': 'Copié',
    'manage.event': 'L’événement',
    'manage.name': 'Nom',
    'manage.budget': 'Budget (facultatif)',
    'manage.budgetPh': 'ex. 20 €',
    'manage.note': 'Message affiché avec la révélation (facultatif)',
    'manage.notePh': 'ex. Échange le 20 déc.',
    'manage.saved': 'Enregistré.',
    'manage.people': 'Participants',
    'manage.peopleHint': 'Au moins trois personnes.',
    'manage.namePh': 'Nom',
    'manage.addPerson': 'Ajouter',
    'manage.nobody': 'Personne n’a encore été ajouté.',
    'manage.rules': 'Règles',
    'manage.rulesHint': 'Bloquez certains appariements — par exemple les couples. Vous ne pouvez pas choisir la même personne deux fois, et AllWrapt refuse les règles qui rendraient le tirage impossible.',
    'manage.cantGive': 'ne peut pas offrir à',
    'manage.bothWays': 'Appliquer dans les deux sens',
    'manage.addRule': 'Ajouter une règle',
    'manage.noRules': 'Pas encore de règles.',
    'manage.pickTwo': 'Choisissez deux personnes différentes.',
    'manage.noSelf': 'On ne peut pas se bloquer soi-même — choisissez quelqu’un d’autre.',
    'manage.ruleAdded': 'Règle ajoutée.',
    'manage.draw': 'Tirage',
    'manage.drawHint': 'Les résultats restent cachés ici. Vous voyez seulement à qui appartient chaque lien — pas qui a tiré qui.',
    'manage.drawBtn': 'Tirer au sort',
    'manage.alreadyDrawn': 'Déjà tiré',
    'manage.drawing': 'Tirage…',
    'manage.drawDone': 'C’est fait. Envoyez à chacun son propre lien ci-dessous.',
    'manage.links': 'Liens privés',
    'manage.linksHint': 'Copiez, WhatsApp ou e-mail pour envoyer à chacun son propre lien.',
    'manage.copyReveal': 'Copier le lien',
    'manage.whatsapp': 'WhatsApp',
    'manage.email': 'Email',
    'manage.remove': 'Retirer',
    'manage.shareMsg': 'Salut {name} !\n\nVoici ton lien privé pour {title}.\nOuvre-le pour savoir pour qui tu offres — garde le secret.\n\n{url}\n\n— AllWrapt',
    'manage.mailSubject': 'Ton lien {title}',
    'reveal.brokenTitle': 'Ce lien semble incomplet',
    'reveal.brokenHint': 'Demandez à l’organisateur de le renvoyer, et vérifiez que le lien entier a été copié.',
    'reveal.for': 'Tu es le Père Noël secret de…',
    'reveal.tap': 'Appuyer pour révéler',
    'reveal.hide': 'Cacher à nouveau',
    'reveal.budget': 'Budget : {budget}',
    'reveal.docTitle': '{title} — votre révélation',
    'lang.label': 'Langue',
    'diag.stuckGiverOne': '{name} n’a plus personne à qui offrir un cadeau.',
    'diag.stuckGiverMany': 'Ces personnes n’ont plus personne à qui offrir : {names}.',
    'diag.stuckRecvOne': 'Personne n’est autorisé à offrir à {name}.',
    'diag.stuckRecvMany': 'Personne n’est autorisé à offrir à : {names}.',
    'diag.culpritOne': 'La règle qui bloque le tirage est : « {rule} ».',
    'diag.culpritMany': 'Chacune de ces règles suffit à bloquer le tirage — retirez-en une : {rules}.',
    'diag.together': 'Ce n’est pas une seule règle — ensemble elles rendent le tirage impossible : {rules}. Essayez d’en retirer plusieurs, ou ajoutez quelqu’un.',
    'diag.rule': '{a} ne peut pas offrir à {b}',
    'diag.needThree': 'Ajoutez d’abord au moins trois personnes.',
    'diag.fallback': 'Aucun tirage valide n’existe avec ces règles. Retirez une règle ou ajoutez des personnes.',
  },
};

/** Localise API diagnosis payload when present. */
export function formatDiagnosis(diagnosis, fallback) {
  if (!diagnosis) return fallback || t('diag.fallback');
  const parts = [];
  const stuckG = diagnosis.stuckGivers || [];
  const stuckR = diagnosis.stuckReceivers || [];
  const pairs = diagnosis.culpritPairs || [];
  const allPairs = diagnosis.rulePairs || [];
  const ruleText = ([a, b]) => t('diag.rule', { a, b });

  if (stuckG.length === 1) parts.push(t('diag.stuckGiverOne', { name: stuckG[0] }));
  else if (stuckG.length > 1) parts.push(t('diag.stuckGiverMany', { names: stuckG.join(', ') }));

  if (stuckR.length === 1) parts.push(t('diag.stuckRecvOne', { name: stuckR[0] }));
  else if (stuckR.length > 1) parts.push(t('diag.stuckRecvMany', { names: stuckR.join(', ') }));

  if (pairs.length === 1) parts.push(t('diag.culpritOne', { rule: ruleText(pairs[0]) }));
  else if (pairs.length > 1) {
    parts.push(t('diag.culpritMany', { rules: pairs.map(ruleText).join('; ') }));
  } else if (allPairs.length > 1) {
    parts.push(t('diag.together', { rules: allPairs.map(ruleText).join('; ') }));
  } else if (allPairs.length === 1) {
    parts.push(t('diag.culpritOne', { rule: ruleText(allPairs[0]) }));
  }

  if (parts.length) return parts.join(' ');
  return fallback || diagnosis.message || t('diag.fallback');
}

export function normalizeLang(code) {
  const c = String(code || '')
    .trim()
    .toLowerCase()
    .slice(0, 2);
  return dict[c] ? c : null;
}

/** Read ?lang=es or ?lan=es from the current URL. */
export function langFromUrl(search = location.search) {
  const q = new URLSearchParams(search);
  return normalizeLang(q.get('lang') || q.get('lan'));
}

/**
 * Keep ?lang= in the address bar (shareable) without reloading.
 * Preserves other query params (e.g. manage e/t, reveal t).
 */
export function syncLangToUrl(code = getLang()) {
  const lang = normalizeLang(code) || 'en';
  const url = new URL(location.href);
  url.searchParams.delete('lan');
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}

/** Append current language to any absolute or relative URL. */
export function withLang(href, code = getLang()) {
  const lang = normalizeLang(code) || 'en';
  try {
    const url = new URL(href, location.origin);
    url.searchParams.delete('lan');
    url.searchParams.set('lang', lang);
    if (href.startsWith('http')) return url.toString();
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}

export function getLang() {
  const fromUrl = langFromUrl();
  if (fromUrl) return fromUrl;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && dict[saved]) return saved;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (dict[nav]) return nav;
  return 'en';
}

export function setLang(code, { syncUrl = true } = {}) {
  const lang = normalizeLang(code) || getLang();
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  if (syncUrl) syncLangToUrl(lang);
  return lang;
}

export function t(key, vars = {}) {
  const lang = getLang();
  let s = dict[lang]?.[key] ?? dict.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v ?? ''));
  }
  return s;
}

/** Apply data-i18n / data-i18n-placeholder / data-i18n-aria on the page. */
export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key) el.innerHTML = t(key);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.setAttribute('placeholder', t(key));
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  });
  const titleKey = document.body?.dataset?.titleKey;
  if (titleKey) document.title = t(titleKey);
}
