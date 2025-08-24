function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function debounce(fn, delay = 200) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeJSONParse(text, fallback) {
  try { return JSON.parse(text); } catch { return fallback; }
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function on(eventName, selectorOrElement, handler) {
  if (typeof selectorOrElement === 'string') {
    document.addEventListener(eventName, (e) => {
      const target = e.target.closest(selectorOrElement);
      if (target) handler(e, target);
    });
  } else {
    selectorOrElement.addEventListener(eventName, handler);
  }
}

function ensureDialogPolyfill(dialog) {
  if (!dialog.showModal) {
    dialog.setAttribute('open', '');
  }
}

window.NetfluxUtils = {
  $, $all, debounce, clamp, safeJSONParse, uid, formatDuration, on, ensureDialogPolyfill
};

