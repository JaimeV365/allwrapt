/**
 * Cloudflare Web Analytics (privacy-friendly, no cookies).
 * Set your beacon token in /js/analytics-config.js after enabling
 * Web Analytics in the Cloudflare dashboard.
 */
import { CF_WEB_ANALYTICS_TOKEN } from './analytics-config.js?v=3';

(function loadCloudflareAnalytics() {
  const token = String(CF_WEB_ANALYTICS_TOKEN || '').trim();
  if (!token || token === 'PASTE_TOKEN_HERE') return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(s);
})();
