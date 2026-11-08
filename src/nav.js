// Nav: (1) switch ngon ngu giu nguyen ?query (utm_*) va #hash, (2) doi mau nav khi cuon qua hero.

export function initNav() {
  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector(".hero");

  // Link VI | EN la <a> that (cung tab). JS chi cong them ?query + #hash vao href; neu JS loi thi link van chay, chi mat UTM.
  const links = [...document.querySelectorAll("[data-lang-link]")];
  const sync = () => links.forEach((a) => { a.href = a.dataset.base + location.search + location.hash; });
  sync();
  addEventListener("hashchange", sync);

  // Tren hero (toi) = chu sang. Qua hero sang nen be = .is-light (chu toi, nen pearl).
  if (nav && hero && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([e]) => nav.classList.toggle("is-light", !e.isIntersecting), {
      rootMargin: `-${nav.offsetHeight}px 0px 0px 0px`,
    });
    io.observe(hero);
  }
}
