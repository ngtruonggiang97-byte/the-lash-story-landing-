// Meta Pixel + dataLayer cho GTM (snippet GTM nam trong template). ID o src/config/tracking.js.
import { TRACKING } from "./config/tracking.js";

const lang = () => document.documentElement.lang || "vi";
const GOOGLE_EVENT = { Lead: "generate_lead", Contact: "contact" };

function loadMeta(id) {
  if (window.fbq) return;
  const f = (window.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); });
  if (!window._fbq) window._fbq = f;
  f.push = f; f.loaded = true; f.version = "2.0"; f.queue = [];
  const s = document.createElement("script");
  s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", id);
  window.fbq("track", "PageView");
}

export function initTracking() {
  if (TRACKING.metaPixelId) loadMeta(TRACKING.metaPixelId);
}

// track("Lead") khi gui form thanh cong; track("Contact", { method }) khi bam Zalo / WhatsApp / Hotline.
// Luon kem lang (vi / en). Pixel chi chay khi co ID; dataLayer luon duoc day (GTM quyet dinh tag nao bat).
export function track(name, params = {}) {
  const p = { lang: lang(), ...params };
  try {
    if (typeof window.fbq === "function") window.fbq("track", name, p);
    (window.dataLayer = window.dataLayer || []).push({ event: GOOGLE_EVENT[name] || name, ...p });
  } catch { /* tracking khong duoc lam hong trang */ }
}

export function initContactTracking() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-contact]");
    if (a) track("Contact", { method: a.dataset.contact });
  });
}
