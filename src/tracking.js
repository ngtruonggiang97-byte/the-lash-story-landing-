// Meta Pixel + Google tag. ID o src/config/tracking.js; de trong thi khong tai gi ca.
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

function loadGoogle(id) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const s = document.createElement("script");
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.gtag("js", new Date());
  window.gtag("config", id);
}

export function initTracking() {
  if (TRACKING.metaPixelId) loadMeta(TRACKING.metaPixelId);
  if (TRACKING.googleTagId) loadGoogle(TRACKING.googleTagId);
}

// track("Lead") khi gui form thanh cong; track("Contact", { method }) khi bam Zalo / WhatsApp / Hotline.
// Luon kem lang (vi / en). Khong lam gi neu chua gan Pixel / Google tag.
export function track(name, params = {}) {
  const p = { lang: lang(), ...params };
  try {
    if (typeof window.fbq === "function") window.fbq("track", name, p);
    if (typeof window.gtag === "function") window.gtag("event", GOOGLE_EVENT[name] || name, p);
  } catch { /* tracking khong duoc lam hong trang */ }
}

export function initContactTracking() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-contact]");
    if (a) track("Contact", { method: a.dataset.contact });
  });
}
