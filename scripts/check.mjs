// Kiem tra hanh vi: reveal khi cuon, vuot collection, form. Can dev server dang chay.
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:5173";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(BASE + "/", { waitUntil: "networkidle" });
const ok = (cond, msg) => console.log((cond ? "PASS " : "FAIL ") + msg);

// 1. truoc khi cuon: collection chua hien
ok(!(await page.$eval("#collection", (e) => e.classList.contains("is-in"))), "collection chua reveal truoc khi cuon");
// chup giua chung luc reveal
await page.evaluate(() => document.querySelector("#collection").scrollIntoView());
await page.waitForTimeout(350);
await page.screenshot({ path: "shots/check-reveal-mid.png" });
// cuon het trang tung buoc
for (let y = 0; y < 20000; y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(60); }
await page.waitForTimeout(1500);
const hidden = await page.$$eval("[data-reveal-group]", (gs) => gs.filter((g) => !g.classList.contains("is-in")).length);
ok(hidden === 0, `tat ca section da reveal (con ${hidden})`);

// 2. vuot collection
await page.evaluate(() => document.querySelector("#collection").scrollIntoView());
await page.waitForTimeout(300);
const before = await page.textContent("[data-name]");
await page.waitForTimeout(3000); // cho luot xoe dau tien xong
await page.click("[data-next]");
await page.waitForTimeout(1500);
const after = await page.textContent("[data-name]");
ok(before !== after, `next: ${before} -> ${after}`);
await page.click("[data-prev]");
await page.waitForTimeout(1500);
ok((await page.textContent("[data-name]")) === before, "prev quay ve mau cu");
// keo bang chuot
const box = await (await page.$(".slide.is-top")).boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 160, box.y + box.height / 2, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(1500);
ok((await page.textContent("[data-name]")) !== before, "keo sang trai doi mau");
// keo ngan roi tha: card ve cho cu, khong doi mau
const cur = await page.textContent("[data-name]");
const b2 = await (await page.$(".slide.is-top")).boundingBox();
await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
await page.mouse.down();
await page.mouse.move(b2.x + b2.width / 2 - 40, b2.y + b2.height / 2, { steps: 4 });
const rot = await page.$eval(".slide.is-top", (e) => e.style.transform);
await page.mouse.up();
await page.waitForTimeout(1200);
ok((await page.textContent("[data-name]")) === cur && /rotate\(-0\.8deg\)/.test(rot), `keo ngan tra ve cho cu, goc xoay ${rot}`);

// 3. form
await page.evaluate(() => document.querySelector("#dat-lich").scrollIntoView());
await page.click(".form__submit");
const errs = await page.$$eval(".field__err", (es) => es.filter((e) => e.textContent).length);
ok(errs === 4, `submit trong: ${errs} loi hien (ten, sdt, ngay, gio)`);
ok(!(await page.$("#f-service")) && !(await page.$("#f-design")), "da bo truong Dich vu va Mau");
await page.fill("#f-name", "Lan");
await page.fill("#f-phone", "086 656 681");
await page.click(".form__submit");
ok(/086 656 6819/.test(await page.textContent("#e-phone")), "SĐT thieu so bi bao loi, vi du dung dinh dang 086 656 6819");
await page.fill("#f-phone", "086 656 6819");
const t = new Date(Date.now() + 86400000);
const ymd = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
// gan gia tri truc tiep: page.fill mo date picker native cua Chromium va nuot click tiep theo
await page.$eval("#f-date", (e, v) => { e.value = v; e.dispatchEvent(new Event("change", { bubbles: true })); }, ymd);
await page.fill("#f-note", "Mẫu: Ivory Edge");
await page.click(".slot >> nth=2");
await page.click(".form__submit");
await page.waitForTimeout(300);
const done = await page.textContent("[data-done]");
ok(/Cảm ơn Lan/.test(done || ""), "submit hop le hien thong bao: " + (done || "").trim().replace(/\s+/g, " "));
await page.screenshot({ path: "shots/check-form-done.png" });

// 4. so dien thoai thong nhat
const body = await page.textContent("body");
ok(!/0866 566 819/.test(body) && (body.match(/086 656 6819/g) || []).length >= 2, "so hien thi thong nhat 086 656 6819");

// 5. xuat chu dung font Libre (Baskerville / Caslon) de kiem tra dau tieng Viet bang fontTools
const serifText = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll("body *").forEach((el) => {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    if (!own) return;
    const fam = getComputedStyle(el).fontFamily.split(",")[0].replace(/"/g, "").trim();
    if (/^Libre/.test(fam)) out[fam] = (out[fam] || "") + own;
  });
  return out;
});
(await import("node:fs")).writeFileSync("shots/serif-text.json", JSON.stringify(serifText, null, 1));

ok(errors.length === 0, "khong loi JS " + errors.join(" | "));
await browser.close();
