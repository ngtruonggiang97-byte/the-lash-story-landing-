// Render trang HTML tinh cho tung ngon ngu tu MOT template (src/template.html) + src/i18n/<lang>.js.
// Chay luc build (Node) va trong dev server; chu nam san trong HTML, khong render bang JS o trinh duyet.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vi from "../src/i18n/vi.js";
import en from "../src/i18n/en.js";
import { REVIEWS } from "../src/data/reviews.js";
import { INSTA_POSTS } from "../src/data/insta.js";
import { EXTENSION, SURCHARGE, LASH_LIFT, BROW_LIFT, TIME_SLOTS } from "../src/data/prices.js";
import { SITE_URL, PATHS, OG_IMAGE, SOCIAL, NAIL_URL, MAPS_URL } from "../src/config/site.js";
import { ICONS } from "./icons.js";

export const DICTS = { vi, en };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const thousands = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const fmtTime = (t, style) => {
  if (style !== "12h") return t;
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/* ---------- Cac khoi HTML tinh (danh sach lap) ---------- */
function blocks(t) {
  // Danh sach co 2 dong chu: ten (tieu de tieng Anh) + ten phu (tieng Viet, font co dau) + gia
  const plist = (items, dict) => `<ul class="plist">${items.map((it) => {
    const n = dict[it.id];
    return `<li class="prow"><span class="prow__name">${esc(n.name)}</span>${n.sub ? `<span class="prow__sub">${esc(n.sub)}</span>` : ""}<span class="prow__price">${esc(it.price)}</span></li>`;
  }).join("")}</ul>`;
  const partTitle = (id, text) => `<h3 id="${id}" class="mpart__title">${esc(text)}</h3>`;

  /* 1. Lash Extension: danh sach (tablist) + khung anh. Mot DOM duy nhat:
     desktop = danh sach cot 1-5, cac panel chong len nhau o cot 6-12; mobile = panel mo ngay duoi hang (accordion).
     --o la thu tu hien thi tren mobile (nhan nhom, nut, panel cua nut do). */
  const E = t.menu.ext;
  let o = 0, idx = 0;
  const tabs = [], panels = [];
  EXTENSION.forEach((g) => {
    tabs.push(`<p class="lx__group" role="presentation" style="--o:${++o}">${esc(E.groups[g.id])}</p>`);
    g.looks.forEach((l) => {
      const n = E.looks[l.id];
      const on = idx === 0;
      tabs.push(`<button class="lx__row${on ? " is-on" : ""}" type="button" role="tab" id="lx-tab-${l.img}" aria-selected="${on}" aria-controls="lx-panel-${l.img}" tabindex="${on ? 0 : -1}" style="--o:${++o}"><span class="lx__name">${esc(n.name)}</span><span class="lx__price">${esc(l.price)}</span></button>`);
      panels.push(`<div class="lx__panel${on ? " is-on" : ""}" role="tabpanel" id="lx-panel-${l.img}" aria-labelledby="lx-tab-${l.img}" style="--o:${++o}"><div class="lx__clip"><figure class="lx__frame"><img src="/img/lash-looks/${l.img}.webp" alt="${esc(fill(E.photoAlt, { name: n.name }))}" width="1000" height="1000" loading="${on ? "eager" : "lazy"}" decoding="async" /></figure></div></div>`);
      idx++;
    });
  });
  const extra = `<div class="lx__extra" style="--o:${++o}"><p class="lx__extra-title">${esc(E.surchargeTitle)}</p><ul class="lx__extra-list">${SURCHARGE.map((it) => {
    const n = E.surcharge[it.id];
    return `<li><span class="lx__extra-name">${esc(n.name)}</span>${n.sub ? `<span class="lx__extra-sub">${esc(n.sub)}</span>` : ""}<span class="lx__extra-price">${esc(it.price)}</span></li>`;
  }).join("")}</ul></div>`;
  const menuExt = `<section class="mpart mpart--ext" aria-labelledby="mp-ext" data-reveal="fade">
          ${partTitle("mp-ext", E.title)}
          <div class="lx" data-lx>
            <div class="lx__tabs" role="tablist" aria-orientation="vertical" aria-label="${esc(E.tabsLabel)}">${tabs.join("")}</div>
            <div class="lx__panels">${panels.join("")}</div>
            ${extra}
          </div>
        </section>`;

  /* 2. Lash Lift: cap anh lech (trai) + danh sach (phai) */
  const L = t.menu.lift;
  const menuLift = `<section class="mpart mpart--lift" aria-labelledby="mp-lift" data-reveal="fade">
          <div class="ll">
            <div class="ll__imgs">
              <figure class="ll__ph ll__ph--1"><img src="/img/lash-lift/lash-lift-1.webp" alt="${esc(L.alt1)}" width="800" height="800" loading="lazy" decoding="async" /></figure>
              <figure class="ll__ph ll__ph--2"><img src="/img/lash-lift/lash-lift-2.webp" alt="${esc(L.alt2)}" width="800" height="800" loading="lazy" decoding="async" /></figure>
            </div>
            <div class="ll__body">
              ${partTitle("mp-lift", L.title)}
              ${plist(LASH_LIFT, L.items)}
            </div>
          </div>
        </section>`;

  /* 3. Brow Lift: dai anh ngang + danh sach 2 cot */
  const B = t.menu.brow;
  const menuBrow = `<section class="mpart mpart--brow" aria-labelledby="mp-brow" data-reveal="fade">
          ${partTitle("mp-brow", B.title)}
          <figure class="bl__strip"><img src="/img/lash-lift/brow-lift.webp" alt="${esc(B.alt)}" width="1600" height="352" loading="lazy" decoding="async" /></figure>
          ${plist(BROW_LIFT, B.items).replace('class="plist"', 'class="plist plist--2"')}
        </section>`;

  const instaHref = (code) => (code ? `https://www.instagram.com/p/${code}/` : SOCIAL.instagram);
  const insta = INSTA_POSTS.map((code, i) => `<a class="itile" style="--i:${i}" href="${instaHref(code)}" target="_blank" rel="noopener" aria-label="${esc(fill(t.insta.tile, { n: i + 1 }))}"><img src="/images/insta/insta-${i + 1}.webp" alt="" width="640" height="640" loading="lazy" decoding="async" /><span class="itile__ic">${ICONS.instagram}</span></a>`).join("\n        ");

  const R = t.book.reviews;
  const reviews = (REVIEWS[t.lang] || []).map((r, i) => `<a class="rv" id="rv-${i}" href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="${esc(r.name)} - ${esc(R.view)}"><span class="rv__ph rv__ph--${r.photos.length}">${r.photos.map((p) => `<img src="${p.src}" alt="" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" />`).join("")}</span><span class="rv__body"><span class="rv__stars" aria-hidden="true"><i>${ICONS.star}</i><i>${ICONS.star}</i><i>${ICONS.star}</i><i>${ICONS.star}</i><i>${ICONS.star}</i></span><span class="rv__text">${esc(r.text)}</span><span class="rv__foot"><span class="rv__name">${esc(r.name)}</span><span class="rv__src"><i class="rv__g">${ICONS.google}</i><i class="rv__go">${ICONS["arrow-up-right"]}</i></span></span></span></a>`).join("");
  const reviewDots = (REVIEWS[t.lang] || []).map((_, i) => `<span class="rvs__dot${i === 0 ? " is-on" : ""}"></span>`).join("");

  const slots = TIME_SLOTS.map((s) => `<label class="slot"><input type="radio" name="time" value="${s}" data-label="${esc(fmtTime(s, t.fmt.timeStyle))}" /><span>${esc(fmtTime(s, t.fmt.timeStyle))}</span></label>`).join("");

  const client = {
    lang: t.lang,
    dateLocale: t.fmt.dateLocale,
    dateStyle: t.fmt.dateStyle,
    phoneRule: t.form.phoneRule,
    sending: t.form.sending,
    sendError: t.form.sendError,
    submit: t.form.submit,
    err: t.form.err,
    done: t.form.done,
  };

  return {
    menuExt,
    menuLift,
    menuBrow,
    currencyNote: t.menu.currencyNote ? `<p class="menu__note" data-reveal="fade">${esc(t.menu.currencyNote)}</p>` : "",
    phoneHelp: t.form.phoneHelp ? `<p class="field__help" id="h-phone">${esc(t.form.phoneHelp)}</p>` : "",
    phoneDesc: t.form.phoneHelp ? "e-phone h-phone" : "e-phone",
    insta,
    reviews,
    reviewDots,
    slots,
    clientJson: JSON.stringify(client).replace(/</g, "\\u003c"),
  };
}

/* ---------- Template ---------- */
const templatePath = fileURLToPath(new URL("../src/template.html", import.meta.url));

export function renderPage(lang) {
  const t = DICTS[lang];
  if (!t) throw new Error(`Unknown lang: ${lang}`);
  const other = lang === "vi" ? "en" : "vi";
  const abs = (l) => SITE_URL + PATHS[l];
  const ctx = {
    ...t,
    url: { self: abs(lang), vi: abs("vi"), en: abs("en"), og: SITE_URL + OG_IMAGE },
    path: { vi: PATHS.vi, en: PATHS.en },
    cur: { vi: lang === "vi" ? ' aria-current="true"' : "", en: lang === "en" ? ' aria-current="true"' : "" },
    ogLocaleAlt: DICTS[other].ogLocale,
    social: SOCIAL,
    nailUrl: NAIL_URL,
    mapsUrl: MAPS_URL,
  };
  const b = blocks(t);

  return readFileSync(templatePath, "utf8")
    .replace(/\{\{\{([\w.]+)\}\}\}/g, (_, k) => { const v = get(ctx, k); if (v == null) throw new Error(`[${lang}] missing raw key: ${k}`); return v; })
    .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => { if (!ICONS[n]) throw new Error(`missing icon: ${n}`); return ICONS[n]; })
    .replace(/\{\{@(\w+)\}\}/g, (_, k) => { if (!(k in b)) throw new Error(`missing block: ${k}`); return b[k]; })
    .replace(/\{\{([\w.]+)\}\}/g, (_, k) => { const v = get(ctx, k); if (v == null) throw new Error(`[${lang}] missing key: ${k}`); return esc(v); });
}
