// Render trang HTML tinh cho tung ngon ngu tu MOT template (src/template.html) + src/i18n/<lang>.js.
// Chay luc build (Node) va trong dev server; chu nam san trong HTML, khong render bang JS o trinh duyet.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vi from "../src/i18n/vi.js";
import en from "../src/i18n/en.js";
import { COLLECTION, INSTA_POSTS, img } from "../src/data/collection.js";
import { PRICES, TIME_SLOTS } from "../src/data/prices.js";
import { SITE_URL, PATHS, OG_IMAGE } from "../src/config/site.js";
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
  const price = (n) => thousands(n, t.fmt.thousands) + t.fmt.currency;
  const meta = (c) => `${t.collection.base[c.base]} · ${t.collection.ext[c.ext ? "yes" : "no"]}`;

  const menu = PRICES.map((g, gi) => {
    const grp = t.menu.groups[g.id];
    const rows = g.items.map((it) => {
      const n = t.menu.items[it.id];
      return `<li class="mrow"><span class="mrow__name">${esc(n.name)}</span>${n.sub ? `<span class="mrow__sub">${esc(n.sub)}</span>` : ""}<span class="mrow__price">${esc(it.price)}</span></li>`;
    }).join("");
    return `<div class="mgroup mgroup--${g.id}" data-reveal="fade" style="--delay: calc(var(--stagger) * ${gi + 1})">
          <h3 class="mgroup__name"><span class="mask mask--star" aria-hidden="true"></span>${esc(grp.name)}</h3>
          <ul class="mgroup__list">${rows}</ul>
          ${grp.note ? `<p class="mgroup__note">${esc(grp.note)}</p>` : ""}
        </div>`;
  }).join("\n        ");

  // Trang thai ban dau cua chong the (khong cho JS): the 1 o tren cung, the 2-3 lo ra, con lai an
  const slides = COLLECTION.map((c, i) => {
    const cls = ["slide", i === 0 ? "is-top" : "", i > 2 ? "is-hidden" : ""].filter(Boolean).join(" ");
    const pos = c.pos ? ` style="object-position:${c.pos}"` : "";
    return `<figure class="${cls}" style="--k:${Math.min(i, 3)};z-index:${COLLECTION.length - i}" data-i="${i}" data-c-name="${esc(c.name)}" data-c-meta="${esc(meta(c))}" data-c-price="${esc(price(c.price))}" aria-label="${esc(c.name)}"><img src="${img(c.slug)}" alt="${esc(fill(t.collection.slideAlt, { name: c.name }))}" width="${c.w}" height="${c.h}"${pos} loading="${i < 3 ? "eager" : "lazy"}" decoding="async" /></figure>`;
  }).join("\n          ");

  const first = COLLECTION[0];
  const insta = INSTA_POSTS.map((code, i) => `<a class="itile" style="--i:${i}" href="https://www.instagram.com/p/${code}/" target="_blank" rel="noopener" aria-label="${esc(fill(t.insta.tile, { n: i + 1 }))}"><img src="/images/insta/insta-${i + 1}.webp" alt="" width="640" height="640" loading="lazy" decoding="async" /><span class="itile__ic">${ICONS.instagram}</span></a>`).join("\n        ");

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
    menu,
    slides,
    currencyNote: t.menu.currencyNote ? `<p class="menu__note" data-reveal="fade">${esc(t.menu.currencyNote)}</p>` : "",
    phoneHelp: t.form.phoneHelp ? `<p class="field__help" id="h-phone">${esc(t.form.phoneHelp)}</p>` : "",
    phoneDesc: t.form.phoneHelp ? "e-phone h-phone" : "e-phone",
    insta,
    slots,
    infoIdx: "01",
    infoName: esc(first.name),
    infoMeta: esc(meta(first)),
    infoPrice: esc(price(first.price)),
    total: String(COLLECTION.length),
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
  };
  const b = blocks(t);

  return readFileSync(templatePath, "utf8")
    .replace(/\{\{\{([\w.]+)\}\}\}/g, (_, k) => { const v = get(ctx, k); if (v == null) throw new Error(`[${lang}] missing raw key: ${k}`); return v; })
    .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => { if (!ICONS[n]) throw new Error(`missing icon: ${n}`); return ICONS[n]; })
    .replace(/\{\{@(\w+)\}\}/g, (_, k) => { if (!(k in b)) throw new Error(`missing block: ${k}`); return b[k]; })
    .replace(/\{\{([\w.]+)\}\}/g, (_, k) => { const v = get(ctx, k); if (v == null) throw new Error(`[${lang}] missing key: ${k}`); return esc(v); });
}
