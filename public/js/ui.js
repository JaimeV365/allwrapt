import { t } from './i18n.js';

/** Close any open custom menus when clicking outside. */
document.addEventListener('click', (e) => {
  if (e.target.closest('.c-select')) return;
  document.querySelectorAll('.c-select.is-open').forEach((el) => closeSelect(el));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.c-select.is-open').forEach((el) => closeSelect(el));
  }
});

function closeSelect(root) {
  root.classList.remove('is-open');
  const menu = root.querySelector('.c-select-menu');
  if (menu) menu.hidden = true;
  const trigger = root.querySelector('.c-select-trigger');
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

/**
 * Custom date field: day / month / year selects (no native calendar).
 * Value: YYYY-MM-DD or ''.
 */
export function createDateField(root, { onChange } = {}) {
  if (!root) return null;
  root.classList.add('c-date');
  root.innerHTML = `
    <div class="c-date-row">
      <div class="c-select" data-part="day"></div>
      <div class="c-select" data-part="month"></div>
      <div class="c-select" data-part="year"></div>
      <button type="button" class="ghost c-date-clear" data-i18n="manage.dateClear">Clear</button>
    </div>
  `;
  const dayRoot = root.querySelector('[data-part="day"]');
  const monthRoot = root.querySelector('[data-part="month"]');
  const yearRoot = root.querySelector('[data-part="year"]');
  const clearBtn = root.querySelector('.c-date-clear');

  let day = '';
  let month = '';
  let year = '';

  const emit = () => {
    if (typeof onChange === 'function') onChange(getValue());
  };

  const daySel = createSelect(dayRoot, {
    placeholder: t('manage.day'),
    onChange: (v) => {
      day = v;
      emit();
    },
  });
  const monthSel = createSelect(monthRoot, {
    placeholder: t('manage.month'),
    onChange: (v) => {
      month = v;
      clampDay();
      emit();
    },
  });
  const yearSel = createSelect(yearRoot, {
    placeholder: t('manage.year'),
    onChange: (v) => {
      year = v;
      clampDay();
      emit();
    },
  });

  function monthOptions() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
      value: String(m).padStart(2, '0'),
      label: t(`manage.month.${m}`),
    }));
  }

  function yearOptions() {
    const now = new Date().getFullYear();
    const years = [];
    for (let y = now - 1; y <= now + 3; y++) years.push({ value: String(y), label: String(y) });
    return years;
  }

  function daysInMonth(y, m) {
    if (!y || !m) return 31;
    return new Date(Number(y), Number(m), 0).getDate();
  }

  function dayOptions() {
    const max = daysInMonth(year, month);
    const opts = [];
    for (let d = 1; d <= max; d++) {
      opts.push({ value: String(d).padStart(2, '0'), label: String(d) });
    }
    return opts;
  }

  function clampDay() {
    daySel.setOptions(dayOptions());
    const max = daysInMonth(year, month);
    if (day && Number(day) > max) {
      day = String(max).padStart(2, '0');
      daySel.set(day);
    } else {
      daySel.set(day);
    }
  }

  function refreshLabels() {
    monthSel.setPlaceholder(t('manage.month'));
    daySel.setPlaceholder(t('manage.day'));
    yearSel.setPlaceholder(t('manage.year'));
    monthSel.setOptions(monthOptions());
    yearSel.setOptions(yearOptions());
    daySel.setOptions(dayOptions());
    monthSel.set(month);
    yearSel.set(year);
    daySel.set(day);
    clearBtn.textContent = t('manage.dateClear');
  }

  function getValue() {
    if (!year || !month || !day) return '';
    return `${year}-${month}-${day}`;
  }

  function setValue(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      year = month = day = '';
    } else {
      const [y, m, d] = iso.split('-');
      year = y;
      month = m;
      day = d;
    }
    refreshLabels();
  }

  clearBtn.addEventListener('click', () => {
    year = month = day = '';
    refreshLabels();
    emit();
  });

  refreshLabels();

  return {
    el: root,
    get: getValue,
    set: setValue,
    refreshLabels,
    setDisabled(d) {
      daySel.setDisabled(d);
      monthSel.setDisabled(d);
      yearSel.setDisabled(d);
      clearBtn.disabled = Boolean(d);
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
