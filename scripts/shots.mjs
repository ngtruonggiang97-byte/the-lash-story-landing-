// Chup screenshot 390px va 1440px. Can dev server dang chay (npm run dev).
// Dung: node scripts/shots.mjs [page ...]   vd: node scripts/shots.mjs index mockups/b
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:5173";
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ["index"];
const sizes = [
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch();
for (const p of pages) {
  for (const s of sizes) {
    const ctx = await browser.newContext({
      viewport: { width: s.width, height: s.height },
      deviceScaleFactor: s.mobile ? 2 : 1,
      isMobile: s.mobile, hasTouch: s.mobile,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(`${BASE}/${p === "index" ? "" : p + ".html"}?freeze`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(4000); // cho transition reveal (1.6s + stagger) chay xong
    const slug = p.replace(/\W+/g, "-");
    await page.screenshot({ path: `shots/${slug}-${s.name}-hero.png` });
    await page.evaluate(() => {
      const top = document.querySelector(".slide.is-top");
      if (top) { top.style.setProperty("--mx", ".35"); top.style.setProperty("--my", ".3"); }
    });
    // chup tung man hinh theo section (fullPage cua Chromium loi voi clip-path + will-change)
    const secs = ["section.story", "section.studios", "#collection", "#bang-gia", "#dat-lich", ".insta", ".foot__base"];
    for (const [k, sel] of secs.entries()) {
      if (!(await page.$(sel))) continue;
      await page.evaluate((q) => document.querySelector(q).scrollIntoView({ block: "start" }), sel);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `shots/${slug}-${s.name}-s${k + 1}.png` });
      // section cao hon 1 man hinh (Our Story, form): chup ca section
      if (["section.story", "#dat-lich"].includes(sel)) await page.locator(sel).screenshot({ path: `shots/${slug}-${s.name}-s${k + 1}-full.png` });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${slug} @${s.name}: overflowX=${overflow}px errors=${errors.length ? errors.join(" | ") : 0}`);
    await ctx.close();
  }
}
await browser.close();
