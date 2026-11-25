export function startSnow(count = 28) {
  const root = document.getElementById('snow');
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = 8 + Math.random() * 12 + 's';
    s.style.animationDelay = Math.random() * 8 + 's';
    s.style.opacity = String(0.15 + Math.random() * 0.35);
    const size = 2 + Math.random() * 3;
    s.style.width = s.style.height = size + 'px';
    root.appendChild(s);
  }
}
