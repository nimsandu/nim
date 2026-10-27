/* Run before styles: choose a theme without a wrong-theme flash. */
(() => {
  'use strict';
  const root = document.documentElement;
  const modes = ['auto', 'light', 'dark'];
  const storageKey = 'mission-theme';
  function resolve(mode, date = new Date()) {
    if (mode === 'light' || mode === 'dark') return mode;
    const hour = Number(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo', hour: '2-digit', hourCycle: 'h23'
    }).format(date));
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  }
  let mode = 'auto';
  try { const saved = localStorage.getItem(storageKey); if (modes.includes(saved)) mode = saved; } catch {}
  function apply(next = mode, persist = false) {
    mode = modes.includes(next) ? next : 'auto';
    const theme = resolve(mode);
    root.dataset.theme = theme;
    root.dataset.themeMode = mode;
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-select]').forEach(select => { select.value = mode; });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f1f1ec' : '#0b0c0e');
    if (persist) { try { localStorage.setItem(storageKey, mode); } catch {} }
    document.dispatchEvent(new CustomEvent('mission:theme', { detail: { theme, mode } }));
  }
  window.MissionTheme = Object.freeze({ resolve, apply, get mode() { return mode; } });
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('[data-theme-select]').forEach(select => {
      select.addEventListener('change', () => apply(select.value, true));
    });
  });
  setInterval(() => { if (mode === 'auto') apply(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); });
})();
