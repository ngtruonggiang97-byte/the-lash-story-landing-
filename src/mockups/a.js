import { COLLECTION, fmtPrice, extLabel, img } from "../data/collection.js";

if (new URLSearchParams(location.search).has("freeze")) document.documentElement.classList.add("freeze");

const track = document.querySelector("[data-track]");
const elCurrent = document.querySelector("[data-current]");
const elProgress = document.querySelector("[data-progress]");
const elPicked = document.querySelector("[data-picked]");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = matchMedia("(min-width: 1024px)");

track.innerHTML = COLLECTION.map((c, i) => `
  <article class="card" data-i="${i}">
    <div class="card__oval">
      <img src="${img(c.slug)}" alt="Mẫu ${c.name}" width="640" height="640" loading="${i < 3 ? "eager" : "lazy"}" decoding="async" />
    </div>
    <div class="card__info">
      <h3 class="card__name">${c.name}</h3>
      <p class="card__price">${fmtPrice(c.price)}</p>
      <p class="card__meta">${c.base} · ${extLabel(c.ext)}</p>
      <button class="pick" type="button" aria-pressed="false" data-pick="${c.name}">Chọn mẫu này</button>
    </div>
  </article>`).join("");

const cards = [...track.querySelectorAll(".card")];

/* --- Tinh do gan "diem nhin" cho tung card + xoay vien xa cu theo van toc --- */
let angle = 0, lastX = track.scrollLeft, vel = 0, raf = 0, idle = 0;

function focusX() {
  const r = track.getBoundingClientRect();
  if (desktop.matches) {
    const pad = parseFloat(getComputedStyle(track).paddingLeft);
    return r.left + pad + cards[0].offsetWidth / 2;
  }
  return r.left + r.width / 2;
}

function frame() {
  const fx = focusX();
  const step = cards[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 18);
  let best = 0, bestD = Infinity;
  cards.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    const d = Math.min(Math.abs(r.left + r.width / 2 - fx) / step, 1);
    card.style.setProperty("--d", d.toFixed(3));
    if (d < bestD) { bestD = d; best = i; }
  });
  const x = track.scrollLeft;
  vel = vel * 0.85 + (x - lastX) * 0.15;
  lastX = x;
  if (!reduce) {
    angle = (angle + vel * 0.9) % 360;
    track.style.setProperty("--a", angle.toFixed(1) + "deg");
  }
  elCurrent.textContent = String(best + 1).padStart(2, "0");
  elProgress.style.width = ((best + 1) / cards.length) * 100 + "%";

  if (Math.abs(vel) > 0.05) { idle = 0; raf = requestAnimationFrame(frame); }
  else if (++idle < 6) raf = requestAnimationFrame(frame);
  else raf = 0;
}
const kick = () => { idle = 0; if (!raf) raf = requestAnimationFrame(frame); };
track.addEventListener("scroll", kick, { passive: true });
addEventListener("resize", kick);
frame();

/* --- Keo bang chuot tren desktop --- */
let down = null, moved = false;
track.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse") return;
  down = { x: e.clientX, left: track.scrollLeft }; moved = false;
});
addEventListener("pointermove", (e) => {
  if (!down) return;
  const dx = e.clientX - down.x;
  if (Math.abs(dx) > 4) { moved = true; track.classList.add("is-dragging"); }
  track.scrollLeft = down.left - dx;
});
addEventListener("pointerup", () => {
  if (!down) return;
  down = null;
  if (moved) {
    // tha ra: snap ve card gan nhat
    const fx = focusX();
    const target = cards.reduce((a, c) => Math.abs(c.getBoundingClientRect().left + c.offsetWidth / 2 - fx) < Math.abs(a.getBoundingClientRect().left + a.offsetWidth / 2 - fx) ? c : a);
    const delta = target.getBoundingClientRect().left + target.offsetWidth / 2 - fx;
    track.classList.remove("is-dragging");
    track.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
  }
});
track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

/* --- Mui ten + phim --- */
const stepBy = (dir) => track.scrollBy({ left: dir * (cards[0].offsetWidth + 40), behavior: reduce ? "auto" : "smooth" });
document.querySelector("[data-prev]").addEventListener("click", () => stepBy(-1));
document.querySelector("[data-next]").addEventListener("click", () => stepBy(1));
track.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
});

/* --- Chon mau -> dua xuong form --- */
track.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pick]");
  if (!btn) return;
  track.querySelectorAll("[data-pick]").forEach((b) => { b.setAttribute("aria-pressed", "false"); b.textContent = "Chọn mẫu này"; });
  btn.setAttribute("aria-pressed", "true");
  btn.textContent = "Đã chọn";
  elPicked.textContent = btn.dataset.pick;
});
