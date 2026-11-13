// Form dat lich: validate, truong an cho ads (lang, page_url, utm_*, gclid / gbraid / wbraid), gui di (neu da co endpoint), su kien Lead.
// Moi chu hien thi lay tu <script id="i18n-data"> (cung nguon voi HTML tinh, xem src/i18n).
import { FORM_ENDPOINT, FORM_BRAND } from "./config/form.js";
import { track } from "./tracking.js";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const STORE_KEY = "ns_utm";

/* ---------- UTM: doc tu URL, luu sessionStorage de khong mat khi cuon / reload / doi ngon ngu ---------- */
function readStore() { try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}"); } catch { return {}; } }
export function captureUtm() {
  const params = new URLSearchParams(location.search);
  const fromUrl = {};
  UTM_KEYS.forEach((k) => { if (params.get(k)) fromUrl[k] = params.get(k); });
  if (Object.keys(fromUrl).length) {            // co UTM moi tren URL = chien dich moi, thay toan bo bo cu
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(fromUrl)); } catch { /* private mode */ }
    return fromUrl;
  }
  return readStore();
}

/* ---------- Click ID quang cao (gclid / gbraid / wbraid): key rieng, tach khoi utm de doi utm khong mat ---------- */
const CLICK_KEYS = ["gclid", "gbraid", "wbraid"];
const CLICK_STORE_KEY = "ns_clickids";
export function captureClickIds() {
  const params = new URLSearchParams(location.search);
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(CLICK_STORE_KEY) || "{}"); } catch { /* private mode */ }
  const fromUrl = {};
  CLICK_KEYS.forEach((k) => { if (params.get(k)) fromUrl[k] = params.get(k); });
  if (!Object.keys(fromUrl).length) return saved;
  // Co click ID moi tren URL = lan click quang cao moi, thay bo cu (3 ma khong di chung nhau)
  try { sessionStorage.setItem(CLICK_STORE_KEY, JSON.stringify(fromUrl)); } catch { /* private mode */ }
  return fromUrl;
}

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

export function initForm() {
  const I = JSON.parse(document.getElementById("i18n-data").textContent);
  const form = document.querySelector("[data-form]");
  const dateInput = form.elements.date;
  const submitBtn = form.querySelector(".form__submit");
  const errBox = form.querySelector("[data-form-error]");

  const pad = (n) => String(n).padStart(2, "0");
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.min = todayStr;

  const fillHidden = () => {
    const utm = captureUtm();
    form.elements.lang.value = I.lang;
    form.elements.page_url.value = location.origin + location.pathname + location.search;
    UTM_KEYS.forEach((k) => { form.elements[k].value = utm[k] || ""; });
    const ids = captureClickIds();
    CLICK_KEYS.forEach((k) => { form.elements[k].value = ids[k] || ""; });
  };
  fillHidden();

  // Thoai mai cho khach: chi can 7-15 chu so, co the co dau +, khoang trang, dau cham, gach, ngoac (so quoc te khong co so 0 dau)
  const phoneOk = (v) => /^\+?\d{7,15}$/.test(v.replace(/[\s.\-()]/g, ""));

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : I.err.name),
    phone: (v) => (phoneOk(v) ? "" : I.err.phone),
    date: (v) => (!v ? I.err.date : v < todayStr ? I.err.dateGone : ""),
    time: (v) => {
      if (!v) return I.err.time;
      const now = new Date();
      const [h, m] = v.split(":").map(Number);
      return form.elements.date.value === todayStr && h * 60 + m <= now.getHours() * 60 + now.getMinutes() ? I.err.timeGone : "";
    },
  };
  const errIds = { name: "e-name", phone: "e-phone", date: "e-date", time: "e-time" };

  function check(name) {
    const v = name === "time" ? (form.querySelector('input[name="time"]:checked')?.value || "") : form.elements[name].value;
    const msg = rules[name](v);
    const err = document.getElementById(errIds[name]);
    err.textContent = msg;
    err.closest(".field").classList.toggle("is-invalid", !!msg);
    if (name !== "time") form.elements[name].setAttribute("aria-invalid", String(!!msg));
    return !msg;
  }
  ["name", "phone", "date"].forEach((n) => {
    form.elements[n].addEventListener("blur", () => form.elements[n].value && check(n));
    // Dang bao loi thi kiem tra lai ngay khi khach go / chon. Loi mat luc dang go (khong phai luc blur) de trang
    // khong dich len giua luc khach nhan - tha vao o ke tiep (vd khung gio), lam mat cu cham.
    form.elements[n].addEventListener("input", () => { if (form.elements[n].closest(".field").classList.contains("is-invalid")) check(n); });
  });
  form.addEventListener("change", (e) => { if (e.target.name === "time") check("time"); });

  const fmtDate = (ymd) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return I.dateStyle === "dmy"
      ? `${pad(d)}/${pad(m)}/${y}`
      : new Date(y, m - 1, d).toLocaleDateString(I.dateLocale, { day: "numeric", month: "long", year: "numeric" });
  };

  async function send(payload) {
    if (!FORM_ENDPOINT) return true;            // chua noi Google Sheets: chi validate + cam on
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },   // request "don gian", Apps Script khong can preflight
      body: JSON.stringify(payload),
    });
    return res.ok || res.type === "opaque";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) {
      (bad[0] === "time" ? form.querySelector('input[name="time"]') : form.elements[bad[0]]).focus();
      return;
    }
    fillHidden();
    const f = new FormData(form);
    const slot = form.querySelector('input[name="time"]:checked');
    const payload = {
      brand: FORM_BRAND,
      name: f.get("name").trim(),
      phone: f.get("phone").replace(/[\s.\-()]/g, ""),
      date: f.get("date"),
      time: f.get("time"),
      note: (f.get("note") || "").trim(),
      lang: f.get("lang"),
      page_url: f.get("page_url"),
      ...Object.fromEntries(UTM_KEYS.map((k) => [k, f.get(k) || ""])),
      ...Object.fromEntries(CLICK_KEYS.map((k) => [k, f.get(k) || ""])),
      createdAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = I.sending;
    let ok = false;
    try { ok = await send(payload); } catch { ok = false; }
    submitBtn.disabled = false;
    submitBtn.textContent = I.submit;
    if (!ok) { errBox.textContent = I.sendError; errBox.hidden = false; return; }   // loi: khong ban Lead

    const done = document.querySelector("[data-done]");
    const vars = { name: escapeHtml(payload.name), date: escapeHtml(fmtDate(payload.date)), time: escapeHtml(slot?.dataset.label || payload.time), phone: escapeHtml(f.get("phone").trim()) };
    done.innerHTML = `<h3>${fill(I.done.title, vars)}</h3><p>${fill(I.done.body, vars)}</p>`;
    form.classList.add("is-sent");
    done.hidden = false;
    done.focus();

    // Lead chi ban khi form that su gui di (co FORM_ENDPOINT) hoac khi chay dev, de khong bao Lead gia len ads.
    if (FORM_ENDPOINT || import.meta.env.DEV) track("Lead");
  });
}
