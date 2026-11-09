import { initNav } from "./nav.js";
import { initForm } from "./form.js";
import { initReviews } from "./reviews.js";
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

/* ================= Lash Extension: tablist + khung anh ================= */
// HTML (tab, panel, anh) da dung san trong build/render.js. JS chi doi trang thai chon + vet nacre.
const lx = $("[data-lx]");
if (lx) {
  const tabs = $$('[role="tab"]', lx);
  const panels = $$('[role="tabpanel"]', lx);
  const desk = matchMedia("(min-width: 1024px)");
  const dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dur-reveal")) * 1000 || 1100;
  let cur = 0;

  // Desktop: dat anh canh hang dang chon (can giua theo hang, khong tran ra ngoai khung)
  function place(i) {
    if (!desk.matches) return;
    const row = tabs[i], p = panels[i];
    const h = p.offsetHeight || (p.offsetWidth * 3) / 4;
    const max = Math.max(0, lx.clientHeight - h);
    const y = row.offsetTop + row.offsetHeight / 2 - h / 2;
    const top = Math.min(max, Math.max(0, y));
    p.style.setProperty("--y", top + "px");
    // Gach chan hang dang chon keo dai (them --ext) toi dung mep trai cua anh
    row.style.setProperty("--ext", Math.max(0, p.offsetLeft - (row.offsetLeft + row.offsetWidth)) + "px");
  }
  function select(i) {
    if (i === cur) return false;
    cur = i;
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle("is-on", on);
      panels[k].classList.toggle("is-on", on);
      panels[k].classList.remove("is-sheen");
    });
    place(i);
    if (!reduce) {
      const p = panels[i];
      void p.offsetWidth;                       // chay lai animation moi lan doi anh
      p.classList.add("is-sheen");
    }
    return true;
  }
  // Mobile: hang khac dong lai o phia tren se day trang len; giu hang vua bam dung yen trong luc mo / dong
  function anchor(el) {
    const top0 = el.getBoundingClientRect().top, t0 = performance.now();
    const step = () => {
      const d = el.getBoundingClientRect().top - top0;
      if (Math.abs(d) > 0.5) scrollBy(0, d);
      if (performance.now() - t0 < (reduce ? 50 : dur + 100)) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  place(0);
  addEventListener("resize", () => place(cur));
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => { if (!desk.matches && i !== cur) { select(i); anchor(t); } else select(i); });
    t.addEventListener("focus", () => { if (desk.matches || t.matches(":focus-visible")) select(i); });
    t.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && desk.matches) select(i); });
    t.addEventListener("keydown", (e) => {
      const n = tabs.length;
      const to = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i + n - 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
      if (to == null) return;
      e.preventDefault();
      select(to);
      tabs[to].focus();
    });
  });
}

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
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
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
initReviews();
initTracking();
initContactTracking();
