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

  initQuickNav(nav);
}

// Menu cuon nhanh: panel mobile (< 1100px) + scroll-spy. Link sinh san luc build (build/render.js, NAV_ITEMS).
function initQuickNav(nav) {
  const toggle = nav && nav.querySelector("[data-nav-toggle]");
  const panel = nav && nav.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;
  const html = document.documentElement;
  const desktop = matchMedia("(min-width: 1100px)");
  // Phan con lai cua trang: inert khi panel mo de focus / doc man hinh khong lot ra sau
  const behind = [document.querySelector("main"), document.querySelector("footer"), document.querySelector("[data-sticky]")].filter(Boolean);

  const setOpen = (open, restoreFocus) => {
    nav.classList.toggle("is-open", open);
    html.classList.toggle("nav-open", open);   // khoa cuon html
    behind.forEach((el) => { el.inert = open; });
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    if (open) panel.querySelector("a").focus();
    else if (restoreFocus) toggle.focus();
  };
  const isOpen = () => nav.classList.contains("is-open");

  toggle.addEventListener("click", () => setOpen(!isOpen(), true));
  // Dong NGAY trong click (truoc khi trinh duyet nhay toi #hash) de khoa cuon khong chan viec cuon toi section
  panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false, false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) setOpen(false, true); });
  desktop.addEventListener("change", (e) => { if (e.matches && isOpen()) setOpen(false, false); });

  // Scroll-spy: section cat dai mong giua man hinh (40% tren, 55% duoi) thi link cua no sang. Dung IntersectionObserver, khong scroll listener.
  if (!("IntersectionObserver" in window)) return;
  const links = [...nav.querySelectorAll("[data-nav-link]")];
  const ids = [...new Set(links.map((a) => a.getAttribute("href").slice(1)))];
  const watch = [...ids, "dat-lich"].map((id) => document.getElementById(id)).filter(Boolean);   // form dat lich: toi do khong link nao sang
  const hit = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? hit.add(e.target.id) : hit.delete(e.target.id)));
    const cur = ids.find((id) => hit.has(id));
    links.forEach((a) => {
      if (cur && a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  watch.forEach((el) => spy.observe(el));
}
