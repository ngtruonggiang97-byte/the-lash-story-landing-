import { initNav } from "./nav.js";
import { initForm } from "./form.js";
import { initTracking, initContactTracking } from "./tracking.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (new URLSearchParams(location.search).has("freeze")) document.documentElement.classList.add("freeze");

/* ================= Hero intro 2 nhip ================= */
// Chuyen dong nam het trong CSS. JS lo 2 viec:
// 1. .is-done = trang thai cuoi tinh: reduced motion, ?freeze (chup man hinh), vao trang da o giua trang,
//    hoac intro da chay het.
// 2. Khach cuon / vuot / bam phim khi intro chua xong: KHONG nhay cong, ma tua nhanh phan con lai
//    cua moi animation (Web Animations API) de tat ca cung ket thuc sau --intro-skip (.7s).
{
  const hero = $(".hero");
  const tok = (v) => { const s = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000; };
  const done = () => hero.classList.add("is-done");
  if (reduce || document.documentElement.classList.contains("freeze") || scrollY > 0) done();
  else {
    let skipped = false;
    const fastForward = () => {
      if (skipped || hero.classList.contains("is-done")) return;
      skipped = true;
      off();
      const anims = hero.getAnimations ? hero.getAnimations({ subtree: true }) : [];
      if (!anims.length) return done();
      const target = tok("--intro-skip");
      anims.forEach((a) => {
        const remain = a.effect.getComputedTiming().endTime - (a.currentTime || 0);
        if (remain > target) a.playbackRate = remain / target;   // ngan hon thi cu de chay tiep
      });
      Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(done);
    };
    const evs = ["wheel", "touchmove", "keydown", "scroll"];
    const off = () => evs.forEach((e) => removeEventListener(e, fastForward));
    evs.forEach((e) => addEventListener(e, fastForward, { passive: true }));
    // intro tu ket thuc khi anh sang dong 2 luot xong
    setTimeout(() => { off(); done(); }, tok("--intro-p2") + tok("--intro-line2") + tok("--intro-sheen") + 100);
  }
}

/* ================= Collection: chong the ================= */
const deck = $("[data-deck]");
const info = $(".info");
// Slide va thong tin mau da nam san trong HTML tinh (build/render.js); JS chi lo chuyen dong.
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
  const c = slides[order[0]].dataset;   // data-c-name / data-c-meta / data-c-price tren tung slide
  const write = () => {
    $("[data-idx]", info).textContent = String(order[0] + 1).padStart(2, "0");
    $("[data-name]", info).textContent = c.cName;
    $("[data-meta]", info).textContent = c.cMeta;
    $("[data-price]", info).textContent = c.cPrice;
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

/* ================= Nav (switch ngon ngu, doi mau), form, tracking ================= */
initNav();
initForm();
initTracking();
initContactTracking();
