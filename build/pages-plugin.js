// Vite plugin: 1 template (src/template.html) -> 2 trang HTML tinh: dist/index.html (vi) va dist/en/index.html (en).
// Dev: "/" va "/en/" duoc render truc tiep. Build: 2 entry HTML ao, Vite van bundle JS/CSS dung chung nhu thuong.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const PAGES = [
  { lang: "vi", file: "index.html", urls: ["/", "/index.html"] },
  { lang: "en", file: "en/index.html", urls: ["/en/", "/en/index.html"] },
];
const norm = (p) => p.replace(/\\/g, "/");

export default function pagesPlugin() {
  let root = process.cwd();
  let server = null;
  const idOf = (file) => norm(resolve(root, file));

  async function render(lang) {
    // dev: ssrLoadModule de sua i18n / data / template la thay ngay; build: import thang
    const mod = server ? await server.ssrLoadModule("/build/render.js") : await import(pathToFileURL(resolve(root, "build/render.js")).href);
    return mod.renderPage(lang);
  }

  return {
    name: "nail-story-pages",
    enforce: "pre",

    config(cfg) {
      const r = cfg.root ? resolve(cfg.root) : process.cwd();
      return { build: { rollupOptions: { input: Object.fromEntries(PAGES.map((p) => [p.lang, norm(resolve(r, p.file))])) } } };
    },
    configResolved(c) { root = c.root; },

    resolveId(id) {
      return PAGES.some((p) => idOf(p.file) === norm(id)) ? norm(id) : null;
    },
    async load(id) {
      const page = PAGES.find((p) => idOf(p.file) === norm(id));
      return page ? render(page.lang) : null;
    },

    configureServer(s) {
      server = s;
      s.middlewares.use(async (req, res, next) => {
        try {
          const u = new URL(req.url, "http://localhost");
          if (u.pathname === "/en") { res.statusCode = 301; res.setHeader("Location", "/en/" + u.search); return res.end(); }
          const page = PAGES.find((p) => p.urls.includes(u.pathname));
          if (!page || req.method !== "GET") return next();
          const html = await s.transformIndexHtml(req.url, await render(page.lang), req.originalUrl);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (e) {
          s.ssrFixStacktrace?.(e);
          next(e);
        }
      });
    },

    // template / i18n / data / build doi -> tai lai trang (khong nam trong module graph cua trinh duyet)
    handleHotUpdate({ file, server: s }) {
      if (/[\\/](src[\\/](template\.html|i18n|data)|build)[\\/]?/.test(file)) {
        s.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}
