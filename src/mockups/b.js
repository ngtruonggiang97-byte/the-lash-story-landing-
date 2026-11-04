import { COLLECTION, fmtPrice, extLabel, img } from "../data/collection.js";

if (new URLSearchParams(location.search).has("freeze")) document.documentElement.classList.add("freeze");

const deck = document.querySelector("[data-deck]");
const info = document.querySelector(".info");
const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

deck.innerHTML = COLLECTION.map((c, i) => `
  <figure class="slide" data-i="${i}" aria-label="${c.name}">
    <img src="${img(c.slug)}" alt="Mẫu ${c.name}" width="640" height="640" loading="${i < 3 ? "eager" : "lazy"}" decoding="async" />
  </figure>`).join("");

const slides = [...deck.querySelectorAll(".slide")];
let order = slides.map((_, i) => i);   // order[0] = the tren cung
let picked = null;

function layout() {
  order.forEach((idx, k) => {
    const s = slides[idx];
    s.style.setProperty("--k", Math.min(k, 3));
    s.style.zIndex = String(slides.length - k);
    s.classList.toggle("is-hidden", k > 2);
    s.classList.toggle("is-top", k === 0);
  });
  renderInfo();
}

function renderInfo() {
  const c = COLLECTION[order[0]];
  info.classList.add("is-swap");
  setTimeout(() => {
    $("[data-idx]").textContent = String(order[0] + 1).padStart(2, "0");
    $("[data-name]").textContent = c.name;
    $("[data-base]").textContent = c.base;
    $("[data-ext]").textContent = extLabel(c.ext);
    $("[data-price]").textContent = fmtPrice(c.price);
    const on = picked === c.name;
    const btn = $("[data-pick]");
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "Đã chọn" : "Chọn mẫu này";
    info.classList.remove("is-swap");
  }, reduce ? 0 : 180);
}

/* Lat the tren cung ra ngoai roi dua ve cuoi chong */
function next(dir = -1) {
  const top = slides[order[0]];
  top.style.transition = "";
  top.style.transform = `translate(${dir * 130}%, -4%) rotate(${dir * 14}deg)`;
  top.style.opacity = "0";
  setTimeout(() => {
    top.style.transform = ""; top.style.opacity = "";
    order.push(order.shift());
    layout();
  }, reduce ? 0 : 320);
}
function prev() {
  const idx = order.pop();
  order.unshift(idx);
  const s = slides[idx];
  s.classList.add("is-drag");
  s.style.transform = "translate(-130%, -4%) rotate(-14deg)";
  s.style.zIndex = String(slides.length + 1);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    s.classList.remove("is-drag");
    s.style.transform = "";
    layout();
  }));
}

/* Keo / vuot the tren cung */
let drag = null;
deck.addEventListener("pointerdown", (e) => {
  const top = slides[order[0]];
  if (!top.contains(e.target) && e.target !== top) return;
  drag = { x: e.clientX, y: e.clientY, el: top, dx: 0, locked: null };
  top.setPointerCapture(e.pointerId);
});
deck.addEventListener("pointermove", (e) => {
  const top = slides[order[0]];
  const r = top.getBoundingClientRect();
  // foil xa cu theo vi tri ngon tay / con tro
  top.style.setProperty("--mx", ((e.clientX - r.left) / r.width).toFixed(3));
  top.style.setProperty("--my", ((e.clientY - r.top) / r.height).toFixed(3));
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (drag.locked === null && Math.hypot(dx, dy) > 6) drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  if (drag.locked !== "x") return;
  drag.dx = dx;
  drag.el.classList.add("is-drag");
  drag.el.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
});
const end = () => {
  if (!drag) return;
  const { el, dx } = drag; drag = null;
  el.classList.remove("is-drag");
  if (Math.abs(dx) > 70) next(Math.sign(dx));
  else el.style.transform = "";
};
deck.addEventListener("pointerup", end);
deck.addEventListener("pointercancel", end);

$("[data-next]").addEventListener("click", () => next(-1));
$("[data-prev]").addEventListener("click", prev);
deck.tabIndex = 0;
deck.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next(-1);
  if (e.key === "ArrowLeft") prev();
});

$("[data-pick]").addEventListener("click", () => {
  const c = COLLECTION[order[0]];
  picked = picked === c.name ? null : c.name;
  $("[data-picked]").textContent = picked ?? "chưa chọn";
  renderInfo();
});

layout();
