// Dai review Google: HTML da dung san luc build. JS chi lo nut truoc/tiep, phim mui ten, dau cham va trang thai disabled.
export function initReviews() {
  const root = document.querySelector("[data-rvs]");
  if (!root) return;
  const track = root.querySelector("[data-rvs-track]");
  const prev = root.querySelector("[data-rvs-prev]");
  const next = root.querySelector("[data-rvs-next]");
  const cards = [...track.children];
  const dots = [...root.querySelectorAll(".rvs__dot")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  const step = () => cards[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
  const index = () => Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step())));
  function sync() {
    const i = index();
    dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    prev.disabled = i === 0;
    next.disabled = i === cards.length - 1;
  }
  function go(i) {
    const to = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: to * step(), behavior: reduce.matches ? "auto" : "smooth" });
  }
  track.addEventListener("scroll", sync, { passive: true });
  addEventListener("resize", sync);
  prev.addEventListener("click", () => go(index() - 1));
  next.addEventListener("click", () => go(index() + 1));
  track.addEventListener("keydown", (e) => {
    if (e.target !== track) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index() - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index() + 1); }
  });
  sync();
}
