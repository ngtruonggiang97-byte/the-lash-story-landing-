// Kiem tra ban song ngu. Can dev server (npm run dev) hoac BASE tro toi ban `vite preview`.
//   node scripts/check-i18n.mjs
import { chromium } from "playwright";
import vi from "../src/i18n/vi.js";
import en from "../src/i18n/en.js";

const BASE = process.env.BASE || "http://localhost:5173";
// PROD=1 (chay tren `vite preview` = ban build): chua co FORM_ENDPOINT nen Lead KHONG duoc ban (tranh Lead gia len ads)
const PROD = process.env.PROD === "1";
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? "PASS " : "FAIL ") + m); };

const browser = await chromium.launch();
const newPage = async (opts = {}, init) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  return { ctx, page };
};
const rel = (p) => { const u = new URL(p.url()); return u.pathname + u.search + u.hash; };

/* ============ 1. Switch ngon ngu ============ */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/?utm_source=test&utm_medium=cpc#dat-lich`, { waitUntil: "networkidle" });
  const attrs = await page.$$eval("[data-lang-link]", (as) => as.map((a) => ({ text: a.textContent.trim(), lang: a.lang, label: a.getAttribute("aria-label"), cur: a.getAttribute("aria-current"), target: a.getAttribute("target"), rel: a.getAttribute("rel"), href: a.getAttribute("href"), tag: a.tagName })));
  ok(attrs.length === 2 && attrs.every((a) => a.tag === "A" && !a.target && !a.rel), "switch la 2 the <a>, khong target / rel");
  ok(attrs[0].text === "VI" && attrs[0].label === "Tiếng Việt" && attrs[0].lang === "vi" && attrs[0].cur === "true", "nua VI: aria-label, lang, aria-current=true tren trang VI");
  ok(attrs[1].text === "EN" && attrs[1].label === "English" && attrs[1].lang === "en" && attrs[1].cur === null, "nua EN: aria-label, lang, khong current tren trang VI");
  ok(attrs[1].href.startsWith("/en/?utm_source=test&utm_medium=cpc"), `href EN giu query: ${attrs[1].href}`);
  const before = ctx.pages().length;
  await Promise.all([page.waitForURL(/\/en\//), page.click('[data-lang-link][lang="en"]')]);
  ok(rel(page) === "/en/?utm_source=test&utm_medium=cpc#dat-lich", `VI -> EN cung tab, giu query + hash: ${rel(page)}`);
  ok(ctx.pages().length === before, "khong mo tab moi");
  ok((await page.getAttribute("html", "lang")) === "en" && (await page.getAttribute('[data-lang-link][lang="en"]', "aria-current")) === "true", "trang EN: lang=en, nua EN current");
  await Promise.all([page.waitForURL((u) => u.pathname === "/"), page.click('[data-lang-link][lang="vi"]')]);
  ok(rel(page) === "/?utm_source=test&utm_medium=cpc#dat-lich", `EN -> VI giu query + hash: ${rel(page)}`);
  await page.close(); await ctx.close();
}
{ // JS tat: link van chay (chi mat UTM)
  const { ctx, page } = await newPage({ javaScriptEnabled: false });
  await page.goto(`${BASE}/?utm_source=x`);
  await Promise.all([page.waitForURL(/\/en\//), page.click('[data-lang-link][lang="en"]')]);
  ok(new URL(page.url()).pathname === "/en/", "tat JS: link van sang /en/");
  await ctx.close();
}

/* ============ 2. Mobile 390: logo trai, switch phai, cung hang, vung bam >= 44px ============ */
for (const [path, tag] of [["/", "vi"], ["/en/", "en"]]) {
  const { ctx, page } = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}${path}?freeze`, { waitUntil: "networkidle" });
  const g = await page.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect().toJSON();
    const half = document.querySelector('[data-lang-link][lang="en"]').getBoundingClientRect();
    const hit = (dy) => document.elementFromPoint(half.x + half.width / 2, half.y + half.height / 2 + dy)?.closest("a")?.lang;
    return { logo: r(".nav__logo"), lang: r(".lang"), hitTop: hit(-21), hitBottom: hit(21), w: innerWidth, sw: document.documentElement.scrollWidth };
  });
  ok(g.logo.right <= g.lang.left - 8 && g.logo.left < 40 && g.lang.right > g.w - 40, `[${tag}] 390px: logo trai, switch phai, khong de nhau (logo.right ${g.logo.right | 0} < lang.left ${g.lang.left | 0})`);
  ok(Math.abs((g.logo.top + g.logo.bottom) / 2 - (g.lang.top + g.lang.bottom) / 2) < 3, `[${tag}] 390px: cung 1 hang`);
  ok(g.hitTop === "en" && g.hitBottom === "en", `[${tag}] vung bam nua EN cao >= 44px (cham +-21px van trung)`);
  ok(g.sw <= g.w, `[${tag}] 390px khong tran ngang`);
  await ctx.close();
}

/* ============ 3. Nav doi mau khi cuon qua hero ============ */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/?freeze`, { waitUntil: "networkidle" });
  const st = () => page.evaluate(() => ({ light: document.querySelector(".nav").classList.contains("is-light"), fg: getComputedStyle(document.querySelector(".lang a:not([aria-current])")).color, logoLight: +getComputedStyle(document.querySelector(".nav__logo-light")).opacity, logoDark: +getComputedStyle(document.querySelector(".nav__logo-dark")).opacity }));
  const a = await st();
  await page.evaluate(() => document.querySelector(".story").scrollIntoView());
  await page.waitForTimeout(900);
  const b = await st();
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(900);
  const c = await st();
  ok(!a.light && a.logoLight === 1 && a.logoDark === 0, "tren hero: logo sang, nav khong .is-light");
  ok(b.light && b.logoLight === 0 && b.logoDark === 1 && b.fg === "rgb(95, 88, 70)", `qua hero: logo toi + chu switch --moss (${b.fg})`);
  ok(!c.light, "cuon len lai hero: tro ve trang thai sang");
  await ctx.close();
}

/* ============ 3b. Our Services: Lash (trang hien tai, khong nut) trai, Nail (nut Kham pha) phai ============ */
for (const [path, d, tag] of [["/", vi, "vi"], ["/en/", en, "en"]]) {
  for (const [size, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
    const { ctx, page } = await newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
    await page.goto(`${BASE}${path}?freeze`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelector(".studios").scrollIntoView());
    await page.waitForTimeout(600);
    const g = await page.evaluate(() => {
      const q = (s) => document.querySelector(s), r = (el) => el.getBoundingClientRect();
      const lines = (el) => Math.round(r(el).height / parseFloat(getComputedStyle(el).lineHeight));
      return {
        lash: q(".studio--lash .studio__desc").textContent.trim(), nail: q(".studio--nail .studio__desc").textContent.trim(),
        line: q(".studio__line").textContent.trim(),
        lashLeft: r(q(".studio--lash")).left < r(q(".studio--nail")).left, lashAbove: r(q(".studio--lash")).top < r(q(".studio--nail")).top,
        lashBtn: !!q(".studio--lash .btn"), nailBtn: q(".studio--nail .btn")?.textContent.trim(), nailHref: q(".studio--nail .btn")?.getAttribute("href"),
        lines: [lines(q(".studio--lash .studio__desc")), lines(q(".studio--nail .studio__desc"))],
      };
    });
    ok(g.lash === d.services.lashDesc && g.nail === d.services.nailDesc && g.line === d.services.lashLine, `[${tag} ${size}] mo ta 2 dich vu + tagline Lash giu nguyen dung chu`);
    ok(!g.lashBtn && g.nailBtn === d.services.nailCta && g.nailHref === "#", `[${tag} ${size}] Lash khong co nut, Nail co nut "${g.nailBtn}" -> ${g.nailHref}`);
    ok(mobile ? g.lashAbove : g.lashLeft, `[${tag} ${size}] Lash o ${mobile ? "tren" : "ben trai"}`);
    ok(g.lines.every((n) => n <= 4), `[${tag} ${size}] mo ta toi da 4 dong (${g.lines})`);
    await ctx.close();
  }
}

/* ============ 4. UTM + truong an ============ */
{
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}/en/?utm_source=facebook&utm_medium=paid&utm_campaign=autumn&utm_content=v1&utm_term=lash`, { waitUntil: "networkidle" });
  const read = () => page.$$eval('input[type="hidden"]', (is) => Object.fromEntries(is.map((i) => [i.name, i.value])));
  let h = await read();
  ok(h.lang === "en" && h.utm_source === "facebook" && h.utm_medium === "paid" && h.utm_campaign === "autumn" && h.utm_content === "v1" && h.utm_term === "lash", "truong an: lang + 5 utm dien dung");
  ok(h.page_url.endsWith("/en/?utm_source=facebook&utm_medium=paid&utm_campaign=autumn&utm_content=v1&utm_term=lash"), "truong an: page_url");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });  // sang trang VI, khong con query
  h = await read();
  ok(h.lang === "vi" && h.utm_source === "facebook" && h.utm_term === "lash", "UTM con sau khi doi trang (sessionStorage), lang doi sang vi");
  await page.reload({ waitUntil: "networkidle" });
  ok((await read()).utm_campaign === "autumn", "UTM con sau khi reload");
  await page.goto(`${BASE}/?utm_source=google`, { waitUntil: "networkidle" });
  h = await read();
  ok(h.utm_source === "google" && h.utm_medium === "", "UTM moi thay the bo cu (khong tron)");
  await ctx.close();
}

/* ============ 5. Form + su kien ads ============ */
const stubs = () => { window.__ev = []; window.fbq = (...a) => window.__ev.push(["fbq", ...a]); window.gtag = (...a) => window.__ev.push(["gtag", ...a]); document.addEventListener("click", (e) => { if (e.target.closest("a")) e.preventDefault(); }, true); };
const fillForm = async (page, { phone, date }) => {
  await page.fill("#f-name", "Emma");
  await page.fill("#f-phone", phone);
  await page.$eval("#f-date", (e, v) => { e.value = v; e.dispatchEvent(new Event("change", { bubbles: true })); }, date);
  await page.click(".slot >> nth=2");
};
const tomorrow = (() => { const d = new Date(Date.now() + 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })();
{ // EN
  const { ctx, page } = await newPage({}, stubs);
  await page.goto(`${BASE}/en/?utm_source=ig`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector("#dat-lich").scrollIntoView());
  await page.click(".form__submit");
  const errs = await page.$$eval(".field__err", (es) => es.map((e) => e.textContent).filter(Boolean));
  ok(errs.length === 4 && errs[0] === en.form.err.name && errs[1] === en.form.err.phone && errs[2] === en.form.err.date && errs[3] === en.form.err.time, "EN: 4 loi bang tieng Anh");
  ok((await page.evaluate(() => window.__ev.length)) === 0, "EN: form loi KHONG ban su kien nao");
  await page.fill("#f-name", "Emma");
  await page.fill("#f-phone", "0866");
  await page.click(".form__submit");
  ok((await page.textContent("#e-phone")) === en.form.err.phone, "EN: SDT qua ngan bi tu choi");
  await fillForm(page, { phone: "+1 415 555 2671", date: tomorrow });
  await page.click(".form__submit");
  await page.waitForSelector("[data-done]:not([hidden])");
  const done = (await page.textContent("[data-done]")).replace(/\s+/g, " ");
  ok(/^Thank you, Emma/.test(done) && /\d{1,2} [A-Z][a-z]+ \d{4} at 1:00 PM/.test(done) && done.includes("+1 415 555 2671"), `EN: thong bao thanh cong: ${done}`);
  const ev = await page.evaluate(() => window.__ev);
  const lead = ev.filter((e) => e[0] === "fbq" && e[2] === "Lead");
  if (PROD) ok(lead.length === 0 && !ev.some((e) => e[2] === "generate_lead"), "BUILD: chua co FORM_ENDPOINT thi KHONG ban Lead (khong Lead gia)");
  else {
    ok(lead.length === 1 && lead[0][3].lang === "en", `EN: Lead ban dung 1 lan, kem lang=en: ${JSON.stringify(lead)}`);
    ok(ev.some((e) => e[0] === "gtag" && e[2] === "generate_lead" && e[3].lang === "en"), "EN: Google generate_lead kem lang");
  }
  await page.evaluate(() => { document.querySelector('[data-contact="whatsapp"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })); document.querySelector('[data-contact="hotline"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })); });
  const ct = (await page.evaluate(() => window.__ev)).filter((e) => e[0] === "fbq" && e[2] === "Contact").map((e) => e[3]);
  ok(ct.length === 2 && ct[0].method === "whatsapp" && ct[1].method === "hotline" && ct.every((c) => c.lang === "en"), `EN: Contact cho WhatsApp + hotline, kem lang: ${JSON.stringify(ct)}`);
  const wa = await page.$eval('[data-contact="whatsapp"]', (a) => [a.href, a.textContent.trim()]);
  ok(wa[0] === "https://wa.me/84866566819" && wa[1] === "WhatsApp: +84 86 656 6819", `EN: nut WhatsApp: ${wa.join(" | ")}`);
  ok(page.errors.length === 0, "EN: khong loi JS " + page.errors.join("|"));
  await ctx.close();
}
{ // VI
  const { ctx, page } = await newPage({}, stubs);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector("#dat-lich").scrollIntoView());
  await page.click(".form__submit");
  ok((await page.$$eval(".field__err", (es) => es.map((e) => e.textContent).filter(Boolean))).join("|") === Object.values({ a: vi.form.err.name, b: vi.form.err.phone, c: vi.form.err.date, d: vi.form.err.time }).join("|"), "VI: 4 loi bang tieng Viet");
  await fillForm(page, { phone: "086 656 6819", date: tomorrow });
  await page.click(".form__submit");
  await page.waitForSelector("[data-done]:not([hidden])");
  const done = (await page.textContent("[data-done]")).replace(/\s+/g, " ");
  ok(/^Cảm ơn Emma/.test(done) && /ngày \d{2}\/\d{2}\/\d{4} lúc 13:00/.test(done), `VI: thong bao thanh cong: ${done}`);
  const ev = await page.evaluate(() => window.__ev);
  if (!PROD) ok(ev.filter((e) => e[2] === "Lead" && e[0] === "fbq")[0]?.[3].lang === "vi", "VI: Lead kem lang=vi");
  await page.evaluate(() => document.querySelector('[data-contact="zalo"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
  ok((await page.evaluate(() => window.__ev)).some((e) => e[2] === "Contact" && e[3].method === "zalo" && e[3].lang === "vi"), "VI: Contact cho Zalo");
  await ctx.close();
}

/* ============ 6. HTML tinh (khong can JS) + SEO ============ */
for (const [path, d, loc, other] of [["/", vi, "vi_VN", "en_US"], ["/en/", en, "en_US", "vi_VN"]]) {
  const raw = await (await fetch(`${BASE}${path}`)).text();   // HTML tho, chua chay JS
  const must = [d.hero.sub, d.book.title, d.menu.ext.looks.classic.name, d.menu.ext.title, "350K", "650K", d.story.body, d.form.name, d.contact.chatLabel];
  ok(must.every((s) => raw.includes(s.replace(/&/g, "&amp;"))), `[${path}] chu nam san trong HTML tho (hero, form, menu, story, lien he)`);
  ok(raw.includes(`<html lang="${d.lang}"`) && raw.includes(`<title>${d.meta.title}</title>`) && raw.includes(`content="${d.meta.description}"`), `[${path}] html lang, title, meta description`);
  ok(raw.includes(`og:locale" content="${loc}"`) && raw.includes(`og:locale:alternate" content="${other}"`) && raw.includes(`og:title" content="${d.meta.title}"`) && /og:url" content="https:\/\/[^"]+"/.test(raw) && /rel="canonical" href="https:\/\/[^"]+"/.test(raw), `[${path}] og:title/locale/url + canonical`);
  ok(/hreflang="vi" href="[^"]+\/"/.test(raw) && /hreflang="en" href="[^"]+\/en\/"/.test(raw) && /hreflang="x-default" href="[^"]+\/"/.test(raw), `[${path}] hreflang vi / en / x-default`);
  const noScripts = raw.replace(/<script[\s\S]*?<\/script>/g, "");
  ok(!/\{\{|\}\}/.test(noScripts) && !/\{(name|n|date|time|phone)\}/.test(noScripts), `[${path}] khong con placeholder chua dien`);
}

/* ============ 7. Quet lan ngon ngu ============ */
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, p + k + ".") : [[p + k, v]]));
const VI = Object.fromEntries(flat(vi)), EN = Object.fromEntries(flat(en));
const collect = () => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) { const p = n.parentElement; if (p && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(p.tagName) && n.textContent.trim()) out.push(n.textContent.trim()); }
  document.querySelectorAll("[alt],[aria-label],[title],[placeholder]").forEach((e) => ["alt", "aria-label", "title", "placeholder"].forEach((a) => e.getAttribute(a) && out.push(e.getAttribute(a))));
  out.push(document.title, document.querySelector('meta[name="description"]').content);
  return out;
};
const VN_CHARS = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
for (const [path, lang] of [["/", "vi"], ["/en/", "en"]]) {
  const { ctx, page } = await newPage();
  await page.goto(`${BASE}${path}?freeze`, { waitUntil: "networkidle" });
  const texts = await page.evaluate(collect);
  const all = texts.join("\n");
  if (lang === "en") {
    // Cho phep: ten ngon ngu "Tiếng Việt" tren switch, tieu de Anh giu nguyen "Quán Thánh" (Ryan chot), ten rieng
    const allowed = [EN["story.sub"], "Tiếng Việt"];
    const bad = texts.filter((t) => VN_CHARS.test(t) && !allowed.includes(t));
    ok(bad.length === 0, `ban /en/: khong con chu tieng Viet (${bad.length === 0 ? texts.length + " doan text da quet" : "SOT: " + JSON.stringify(bad.slice(0, 5))})`);
  }
  // Moi chuoi chi co o ngon ngu KIA (dai >= 10 ky tu) khong duoc xuat hien o trang nay
  const otherDict = lang === "vi" ? EN : VI, thisDict = lang === "vi" ? VI : EN;
  // (bo qua chu ma ban nay cung dung co chu y, vd nhan "Apex Manicure" o bang gia ban Viet)
  const thisValues = new Set(Object.values(thisDict));
  const leaks = Object.entries(otherDict).filter(([k, v]) => typeof v === "string" && v.length >= 10 && v !== thisDict[k] && !thisValues.has(v) && !/\{/.test(v) && all.includes(v)).map(([k]) => k);
  ok(leaks.length === 0, `ban ${path}: khong lot chu cua ngon ngu kia ${leaks.length ? "SOT: " + leaks.join(", ") : ""}`);
  await ctx.close();
}

await browser.close();
console.log(fails ? `\n${fails} FAIL` : "\nTat ca PASS");
process.exit(fails ? 1 : 0);
