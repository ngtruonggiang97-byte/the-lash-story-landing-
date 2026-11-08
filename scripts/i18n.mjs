// node scripts/i18n.mjs check   -> vi.js va en.js phai CUNG bo key (khong thieu, khong thua, khong rong ngoai le cho phep)
// node scripts/i18n.mjs table   -> ghi I18N-REVIEW.md: bang key | VI | EN de Ryan duyet
import { writeFileSync } from "node:fs";
import vi from "../src/i18n/vi.js";
import en from "../src/i18n/en.js";

const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, p + k + ".") : [[p + k, v]]));
const V = Object.fromEntries(flat(vi));
const E = Object.fromEntries(flat(en));
const keys = [...new Set([...Object.keys(V), ...Object.keys(E)])];

// Key duoc phep de trong o MOT ben (chi 1 ngon ngu can dung)
const OPTIONAL_EMPTY = /(^menu\.groups\..+\.note$|^menu\.items\..+\.sub$|^menu\.currencyNote$|^form\.phoneHelp$)/;

const cmd = process.argv[2] || "check";

if (cmd === "check") {
  const problems = [];
  for (const k of keys) {
    if (!(k in V)) problems.push(`thieu o vi.js: ${k}`);
    else if (!(k in E)) problems.push(`thieu o en.js: ${k}`);
    else if (typeof V[k] !== typeof E[k]) problems.push(`khac kieu: ${k}`);
    else if ((V[k] === "" || E[k] === "") && !OPTIONAL_EMPTY.test(k)) problems.push(`rong: ${k}`);
    // placeholder {name} phai khop nhau
    const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join();
    if (k in V && k in E && ph(V[k]) !== ph(E[k])) problems.push(`placeholder khong khop: ${k} (${ph(V[k])} vs ${ph(E[k])})`);
    // khong dung gach dai
    for (const [lg, d] of [["vi", V], ["en", E]]) if (/[—–]/.test(String(d[k] ?? ""))) problems.push(`gach dai trong ${lg}.js: ${k}`);
  }
  if (problems.length) { console.log("LOI i18n:\n- " + problems.join("\n- ")); process.exit(1); }
  console.log(`i18n OK: ${keys.length} key, vi.js va en.js khop nhau.`);
}

if (cmd === "table") {
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ") || "(trống)";
  const rows = keys.filter((k) => !["lang", "ogLocale"].includes(k)).map((k) => `| \`${k}\` | ${cell(V[k])} | ${V[k] === E[k] ? "= giữ nguyên" : cell(E[k])} |`);
  const md = `# Duyệt chữ tiếng Anh (key | VI | EN)\n\nTạo tự động bằng \`npm run i18n:table\` từ \`src/i18n/vi.js\` và \`en.js\`. Sửa chữ ở 2 file đó rồi chạy lại.\n\n| key | VI | EN |\n|---|---|---|\n${rows.join("\n")}\n`;
  writeFileSync("I18N-REVIEW.md", md);
  console.log(`Da ghi I18N-REVIEW.md (${rows.length} dong)`);
}
