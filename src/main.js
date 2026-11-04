import { COLLECTION, fmtPrice, extLabel, img } from "./data/collection.js";
import { PRICES, PRICE_DATE, TIME_SLOTS } from "./data/prices.js";
import { mountIcons, ICONS } from "./icons.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (new URLSearchParams(location.search).has("freeze")) document.documentElement.classList.add("freeze");

/* ================= Bang gia ================= */
$("[data-price-date]").textContent = PRICE_DATE;
$("[data-menu]").innerHTML = PRICES.map((g, gi) => `
  <div class="mgroup mgroup--${g.group.toLowerCase()}" data-reveal="fade" style="--delay: calc(var(--stagger) * ${gi + 1})">
    <h3 class="mgroup__name"><span class="mask mask--star" aria-hidden="true"></span>${g.group}</h3>
    <ul class="mgroup__list">
      ${g.items.map((i) => `
        <li class="mrow">
          <span class="mrow__vi">${i.vi}</span>
          ${i.en ? `<span class="mrow__en">${i.en}</span>` : ""}
          <span class="mrow__price">${i.price}</span>
        </li>`).join("")}
    </ul>
    ${g.note ? `<p class="mgroup__note">${g.note}</p>` : ""}
  </div>`).join("");

/* ================= Inspiration (anh tam) ================= */
const INSTA = ["mighty-mirror", "milky-french-tip", "sepia-victorian", "leopard-luxe-french", "bow-tiful", "teal-marble-gem"];
$("[data-insta]").innerHTML = INSTA.map((s, i) => `
  <a class="itile" style="--i:${i}" href="https://www.instagram.com/thenailstory.studio/" target="_blank" rel="noopener" aria-label="Xem trên Instagram">
    <img src="${img(s)}" alt="" width="640" height="640" loading="lazy" decoding="async" />
    <span class="itile__ic">${ICONS.instagram}</span>
  </a>`).join("");

/* ================= Form: khung gio ================= */
$("[data-slots]").innerHTML = TIME_SLOTS.map((t) => `
  <label class="slot"><input type="radio" name="time" value="${t}" /><span>${t}</span></label>`).join("");

mountIcons();

/* ================= Collection: chong the ================= */
const deck = $("[data-deck]");
const info = $(".info");
deck.innerHTML = COLLECTION.map((c, i) => `
  <figure class="slide" data-i="${i}" aria-label="${c.name}">
    <img src="${img(c.slug)}" alt="Mẫu ${c.name}" width="640" height="640" loading="${i < 3 ? "eager" : "lazy"}" decoding="async" />
  </figure>`).join("");
const slides = $$(".slide", deck);
let order = slides.map((_, i) => i);

function layout(swap = true) {
  order.forEach((idx, k) => {
    const s = slides[idx];
    s.style.setProperty("--k", Math.min(k, 3));
    s.style.zIndex = String(slides.length - k);
    s.classList.toggle("is-hidden", k > 2);
    s.classList.toggle("is-top", k === 0);
  });
  renderInfo(swap);
}
function renderInfo(swap) {
  const c = COLLECTION[order[0]];
  const write = () => {
    $("[data-idx]").textContent = String(order[0] + 1).padStart(2, "0");
    $("[data-name]").textContent = c.name;
    $("[data-base]").textContent = c.base;
    $("[data-ext]").textContent = extLabel(c.ext);
    $("[data-price]").textContent = fmtPrice(c.price);
    info.classList.remove("is-swap");
  };
  if (!swap || reduce) return write();
  info.classList.add("is-swap");
  setTimeout(write, ms("--dur-hover"));
}
// doc thoi luong tu token CSS (vd "1.1s" / "600ms") -> ms
function ms(token) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
}
// Card tren cung bay di, cung luc card sau tien len (ca hai trong --dur-card)
function next(dir = -1) {
  const top = slides[order[0]];
  order.push(order.shift());
  layout();
  top.style.zIndex = String(slides.length + 1);
  top.style.transform = `translate(${dir * 120}%, -3%) rotate(${dir * 7}deg)`;
  top.style.opacity = "0";
  setTimeout(() => {
    top.classList.add("is-drag");          // tat transition, dua ve cuoi chong khong bi thay
    top.style.transform = ""; top.style.opacity = ""; top.style.zIndex = String(slides.length - order.indexOf(+top.dataset.i));
    void top.offsetWidth;
    top.classList.remove("is-drag");
  }, reduce ? 0 : ms("--dur-card"));
}
function prev() {
  const idx = order.pop();
  order.unshift(idx);
  const s = slides[idx];
  s.classList.add("is-drag");
  s.style.transform = "translate(-120%, -3%) rotate(-7deg)";
  s.style.opacity = "0";
  s.style.zIndex = String(slides.length + 1);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    s.classList.remove("is-drag");
    s.style.transform = ""; s.style.opacity = "";
    layout();
  }));
}

let drag = null;
deck.addEventListener("pointerdown", (e) => {
  const top = slides[order[0]];
  if (!top.contains(e.target)) return;
  drag = { x: e.clientX, y: e.clientY, el: top, dx: 0, axis: null, id: e.pointerId };
});
deck.addEventListener("pointermove", (e) => {
  const top = slides[order[0]];
  const r = top.getBoundingClientRect();
  top.style.setProperty("--mx", ((e.clientX - r.left) / r.width).toFixed(3));
  top.style.setProperty("--my", ((e.clientY - r.top) / r.height).toFixed(3));
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (!drag.axis && Math.hypot(dx, dy) > 6) {
    drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (drag.axis === "x") drag.el.setPointerCapture(drag.id);
  }
  if (drag.axis !== "x") return;
  drag.dx = dx;
  drag.el.classList.add("is-drag");
  drag.el.style.transform = `translateX(${dx}px) rotate(${dx * 0.02}deg)`;
});
const endDrag = () => {
  if (!drag) return;
  const { el, dx } = drag; drag = null;
  el.classList.remove("is-drag");
  if (Math.abs(dx) > 70) return next(Math.sign(dx));
  // tha ra chua du xa: card tu tu ve cho cu trong --dur-card-back
  el.classList.add("is-return");
  el.style.transform = "";
  setTimeout(() => el.classList.remove("is-return"), ms("--dur-card-back"));
};
deck.addEventListener("pointerup", endDrag);
deck.addEventListener("pointercancel", endDrag);
$("[data-next]").addEventListener("click", () => next(-1));
$("[data-prev]").addEventListener("click", prev);
deck.tabIndex = 0;
deck.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { e.preventDefault(); next(-1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
});
layout(false);

/* ================= Reveal khi cuon ================= */
function split(el, mode) {
  const text = el.textContent.trim();
  let i = 0;
  el.setAttribute("aria-label", text);
  el.innerHTML = text.split(/\s+/).map((word) => {
    const inner = mode === "chars"
      ? [...word].map((ch) => `<span class="rv-i" style="--i:${i++}">${ch}</span>`).join("")
      : `<span class="rv-i" style="--i:${i++}">${word}</span>`;
    return `<span class="rv-w" aria-hidden="true">${inner}</span>`;
  }).join(" ");
  // stagger lay tu token --stagger (140ms); tung ky tu thi nhanh hon chut (~120ms) de chu dai khong qua lau
  el.style.setProperty("--step", mode === "chars" ? "calc(var(--stagger) * .86)" : "var(--stagger)");
}
$$('[data-reveal="words"], [data-reveal="chars"]').forEach((el) => split(el, el.dataset.reveal));

const groups = $$("[data-reveal-group]");
if (reduce || !("IntersectionObserver" in window) || document.documentElement.classList.contains("freeze")) {
  groups.forEach((g) => g.classList.add("is-in"));
  deck.classList.add("is-in");
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      const d = en.target.querySelector(".deck");
      if (d) {
        d.classList.add("is-in");
        // het luot xoe lan dau thi bo do tre, de vuot card khong bi cham them
        setTimeout(() => d.classList.add("is-ready"), ms("--dur-slow") + 4 * ms("--stagger"));
      }
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.05 });
  groups.forEach((g) => io.observe(g));
}

/* ================= Sticky CTA mobile ================= */
const sticky = $("[data-sticky]");
const seen = new Map();
const io2 = new IntersectionObserver((entries) => {
  entries.forEach((en) => seen.set(en.target, en.isIntersecting));
  const show = ![...seen.values()].some(Boolean);
  sticky.classList.toggle("is-on", show);
  sticky.setAttribute("aria-hidden", String(!show));
  sticky.tabIndex = show ? 0 : -1;
});
[$(".hero"), $("#dat-lich"), $(".foot")].forEach((el) => io2.observe(el));

/* ================= Form ================= */
const form = $("[data-form]");
const dateInput = $("#f-date");
const pad = (n) => String(n).padStart(2, "0");
const today = new Date();
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
dateInput.min = todayStr;

const rules = {
  name: (v) => (v.trim().length >= 2 ? "" : "Bạn cho studio xin tên nhé."),
  phone: (v) => (/^(0|\+?84)(3|5|7|8|9)\d{8}$/.test(v.replace(/[\s.\-]/g, "")) ? "" : "Số điện thoại chưa đúng, ví dụ 086 656 6819."),
  date: (v) => (!v ? "Chọn ngày bạn muốn đến." : v < todayStr ? "Ngày này đã qua." : ""),
  time: (v) => {
    if (!v) return "Chọn một khung giờ.";
    const now = new Date();
    const isToday = form.elements.date.value === todayStr;
    const [h, m] = v.split(":").map(Number);
    return isToday && h * 60 + m <= now.getHours() * 60 + now.getMinutes() ? "Khung giờ này hôm nay đã qua." : "";
  },
};
const errIds = { name: "e-name", phone: "e-phone", date: "e-date", time: "e-time" };

function check(name) {
  const v = name === "time" ? (form.querySelector('input[name="time"]:checked')?.value || "") : form.elements[name].value;
  const msg = rules[name](v);
  const err = document.getElementById(errIds[name]);
  err.textContent = msg;
  const field = err.closest(".field");
  field.classList.toggle("is-invalid", !!msg);
  if (name !== "time") form.elements[name].setAttribute("aria-invalid", String(!!msg));
  return !msg;
}
["name", "phone", "date"].forEach((n) => form.elements[n].addEventListener("blur", () => form.elements[n].value && check(n)));
form.addEventListener("change", (e) => { if (e.target.name === "time") check("time"); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const bad = Object.keys(rules).filter((n) => !check(n));
  if (bad.length) {
    const first = bad[0] === "time" ? form.querySelector('input[name="time"]') : form.elements[bad[0]];
    first.focus();
    return;
  }
  const f = new FormData(form);
  // Du lieu gui di (giai doan 2: POST toi Google Apps Script -> Google Sheets)
  const payload = {
    name: f.get("name").trim(),
    phone: f.get("phone").replace(/[\s.\-]/g, ""),
    date: f.get("date"),
    time: f.get("time"),
    note: (f.get("note") || "").trim(),
    createdAt: new Date().toISOString(),
  };
  const [y, m, d] = payload.date.split("-");
  const done = $("[data-done]");
  done.innerHTML = `
    <h3>Cảm ơn ${escapeHtml(payload.name)}</h3>
    <p>Studio đã nhận lịch ngày ${d}/${m}/${y} lúc ${payload.time}.
    Studio sẽ nhắn số ${escapeHtml(f.get("phone").trim())} để xác nhận giờ và cùng bạn chọn mẫu.</p>`;
  form.classList.add("is-sent");
  done.hidden = false;
  done.focus();
});
function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
