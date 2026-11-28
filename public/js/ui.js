import { t } from './i18n.js?v=4';

/** Close any open custom menus when clicking outside. */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.c-select')) {
    document.querySelectorAll('.c-select.is-open').forEach((el) => closeSelect(el));
  }
  if (!e.target.closest('.c-date')) {
    document.querySelectorAll('.c-date.is-open').forEach((el) => closeDate(el));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.c-select.is-open').forEach((el) => closeSelect(el));
    document.querySelectorAll('.c-date.is-open').forEach((el) => closeDate(el));
  }
});

function closeSelect(root) {
  root.classList.remove('is-open');
  const menu = root.querySelector('.c-select-menu');
  if (menu) menu.hidden = true;
  const trigger = root.querySelector('.c-select-trigger');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function closeDate(root) {
  root.classList.remove('is-open');
  const pop = root.querySelector('.c-cal');
  if (pop) pop.hidden = true;
  const trigger = root.querySelector('.c-date-trigger');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

/**
 * Custom select (no native <select>).
 * @returns {{ get: () => string, set: (v: string) => void, setOptions: (opts) => void, setDisabled: (d: boolean) => void, el: HTMLElement }}
 */
export function createSelect(root, { placeholder = '', onChange } = {}) {
  if (!root) return null;
  root.classList.add('c-select');
  root.innerHTML = `
    <button type="button" class="c-select-trigger" aria-haspopup="listbox" aria-expanded="false">
      <span class="c-select-label">${placeholder}</span>
      <span class="c-select-caret" aria-hidden="true"></span>
    </button>
    <ul class="c-select-menu" role="listbox" hidden></ul>
  `;
  const trigger = root.querySelector('.c-select-trigger');
  const label = root.querySelector('.c-select-label');
  const menu = root.querySelector('.c-select-menu');
  let value = '';
  let options = [];
  let disabled = false;

  function paint() {
    const opt = options.find((o) => o.value === value);
    label.textContent = opt ? opt.label : placeholder || '—';
    label.classList.toggle('is-placeholder', !opt);
    menu.innerHTML = options
      .map(
        (o) =>
          `<li role="option" data-value="${escapeAttr(o.value)}" aria-selected="${
            o.value === value
          }" class="c-select-option${o.value === value ? ' is-selected' : ''}">${escapeHtml(
            o.label
          )}</li>`
      )
      .join('');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (disabled) return;
    const open = !root.classList.contains('is-open');
    document.querySelectorAll('.c-select.is-open').forEach((el) => {
      if (el !== root) closeSelect(el);
    });
    document.querySelectorAll('.c-date.is-open').forEach((el) => closeDate(el));
    if (open) {
      root.classList.add('is-open');
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      closeSelect(root);
    }
  });

  menu.addEventListener('click', (e) => {
    const li = e.target.closest('[data-value]');
    if (!li) return;
    value = li.getAttribute('data-value') || '';
    paint();
    closeSelect(root);
    if (typeof onChange === 'function') onChange(value);
  });

  return {
    el: root,
    get: () => value,
    set(v) {
      value = v || '';
      paint();
    },
    setOptions(opts) {
      options = opts || [];
      if (value && !options.some((o) => o.value === value)) value = options[0]?.value || '';
      paint();
    },
    setDisabled(d) {
      disabled = Boolean(d);
      trigger.disabled = disabled;
      root.classList.toggle('is-disabled', disabled);
    },
    setPlaceholder(p) {
      placeholder = p;
      paint();
    },
  };
}

/** Custom checkbox (button role=checkbox). */
export function createCheck(root, { checked = false, onChange } = {}) {
  if (!root) return null;
  root.classList.add('c-check');
  root.setAttribute('role', 'checkbox');
  root.setAttribute('type', 'button');
  if (!root.querySelector('.c-check-box')) {
    const box = document.createElement('span');
    box.className = 'c-check-box';
    box.setAttribute('aria-hidden', 'true');
    root.prepend(box);
  }
  let on = Boolean(checked);
  function paint() {
    root.setAttribute('aria-checked', on ? 'true' : 'false');
    root.classList.toggle('is-checked', on);
  }
  paint();
  root.addEventListener('click', () => {
    if (root.disabled) return;
    on = !on;
    paint();
    if (typeof onChange === 'function') onChange(on);
  });
  return {
    el: root,
    get: () => on,
    set(v) {
      on = Boolean(v);
      paint();
    },
    setDisabled(d) {
      root.disabled = Boolean(d);
      root.classList.toggle('is-disabled', Boolean(d));
    },
  };
}

function todayIso() {
  const n = new Date();
  return toIso(n.getFullYear(), n.getMonth() + 1, n.getDate());
}

function toIso(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseIso(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function weekdayLabels() {
  const lang = document.documentElement.lang || 'en';
  // Monday-first week (EN/ES/FR)
  const labels = [];
  for (let i = 0; i < 7; i++) {
    // 2024-01-01 was a Monday
    const date = new Date(2024, 0, 1 + i);
    try {
      labels.push(new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(date));
    } catch {
      labels.push(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]);
    }
  }
  return labels;
}

/**
 * Custom calendar date field (no native date input).
 * Value: YYYY-MM-DD or ''. Opens on today when empty.
 */
export function createDateField(root, { onChange } = {}) {
  if (!root) return null;
  root.classList.add('c-date');
  root.innerHTML = `
    <div class="c-date-row">
      <button type="button" class="c-date-trigger" aria-haspopup="dialog" aria-expanded="false">
        <span class="c-date-label"></span>
        <span class="c-date-icon" aria-hidden="true"></span>
      </button>
      <button type="button" class="ghost c-date-clear" hidden></button>
    </div>
    <div class="c-cal" role="dialog" hidden></div>
  `;

  const trigger = root.querySelector('.c-date-trigger');
  const label = root.querySelector('.c-date-label');
  const clearBtn = root.querySelector('.c-date-clear');
  const cal = root.querySelector('.c-cal');

  let value = '';
  let viewY;
  let viewM;
  let disabled = false;

  function emit() {
    if (typeof onChange === 'function') onChange(value);
  }

  function syncViewToValueOrToday() {
    const parsed = parseIso(value);
    if (parsed) {
      viewY = parsed.y;
      viewM = parsed.m;
    } else {
      const n = new Date();
      viewY = n.getFullYear();
      viewM = n.getMonth() + 1;
    }
  }

  function paintTrigger() {
    if (value) {
      label.textContent = formatDueDate(value);
      label.classList.remove('is-placeholder');
      clearBtn.hidden = false;
    } else {
      label.textContent = t('manage.datePick');
      label.classList.add('is-placeholder');
      clearBtn.hidden = true;
    }
    clearBtn.textContent = t('manage.dateClear');
  }

  function paintCal() {
    if (viewY == null) syncViewToValueOrToday();
    const monthName = t(`manage.month.${viewM}`);
    const title = `${monthName} ${viewY}`;
    const dow = weekdayLabels();
    const first = new Date(viewY, viewM - 1, 1);
    // Monday = 0 … Sunday = 6
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewY, viewM, 0).getDate();
    const today = todayIso();
    const cells = [];

    for (let i = 0; i < startPad; i++) {
      cells.push('<span class="c-cal-day is-empty"></span>');
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toIso(viewY, viewM, d);
      const classes = ['c-cal-day'];
      if (iso === today) classes.push('is-today');
      if (iso === value) classes.push('is-selected');
      cells.push(
        `<button type="button" class="${classes.join(' ')}" data-iso="${iso}">${d}</button>`
      );
    }

    cal.innerHTML = `
      <div class="c-cal-head">
        <button type="button" class="ghost c-cal-nav" data-nav="-1" aria-label="${escapeAttr(
          t('manage.datePrev')
        )}">‹</button>
        <span class="c-cal-title">${escapeHtml(title)}</span>
        <button type="button" class="ghost c-cal-nav" data-nav="1" aria-label="${escapeAttr(
          t('manage.dateNext')
        )}">›</button>
      </div>
      <div class="c-cal-dow">${dow.map((d) => `<span>${escapeHtml(d)}</span>`).join('')}</div>
      <div class="c-cal-grid">${cells.join('')}</div>
      <div class="c-cal-foot">
        <button type="button" class="ghost c-cal-today">${escapeHtml(t('manage.dateToday'))}</button>
      </div>
    `;
  }

  function open() {
    if (disabled) return;
    document.querySelectorAll('.c-select.is-open').forEach((el) => closeSelect(el));
    document.querySelectorAll('.c-date.is-open').forEach((el) => {
      if (el !== root) closeDate(el);
    });
    // First open with no date: start on today and select today
    if (!value) {
      value = todayIso();
      paintTrigger();
      emit();
    }
    syncViewToValueOrToday();
    paintCal();
    root.classList.add('is-open');
    cal.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    closeDate(root);
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (root.classList.contains('is-open')) close();
    else open();
  });

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    value = '';
    paintTrigger();
    close();
    emit();
  });

  cal.addEventListener('click', (e) => {
    e.stopPropagation();
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      const delta = Number(nav.getAttribute('data-nav'));
      viewM += delta;
      if (viewM < 1) {
        viewM = 12;
        viewY -= 1;
      } else if (viewM > 12) {
        viewM = 1;
        viewY += 1;
      }
      paintCal();
      return;
    }
    if (e.target.closest('.c-cal-today')) {
      value = todayIso();
      syncViewToValueOrToday();
      paintTrigger();
      paintCal();
      emit();
      close();
      return;
    }
    const dayBtn = e.target.closest('[data-iso]');
    if (dayBtn) {
      value = dayBtn.getAttribute('data-iso') || '';
      paintTrigger();
      paintCal();
      emit();
      close();
    }
  });

  paintTrigger();

  return {
    el: root,
    get: () => value,
    set(iso) {
      value = parseIso(iso) ? iso : '';
      paintTrigger();
      if (root.classList.contains('is-open')) {
        syncViewToValueOrToday();
        paintCal();
      }
    },
    refreshLabels() {
      paintTrigger();
      if (root.classList.contains('is-open')) paintCal();
    },
    setDisabled(d) {
      disabled = Boolean(d);
      trigger.disabled = disabled;
      clearBtn.disabled = disabled;
      root.classList.toggle('is-disabled', disabled);
      if (disabled) close();
    },
  };
}

/** Format YYYY-MM-DD for display in the active language. */
export function formatDueDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const lang = document.documentElement.lang || 'en';
  try {
    return new Intl.DateTimeFormat(lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return iso;
  }
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
