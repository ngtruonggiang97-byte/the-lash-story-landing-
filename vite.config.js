import { defineConfig } from "vite";
import pagesPlugin from "./build/pages-plugin.js";

// Mot codebase, 2 ngon ngu: "/" (vi) va "/en/" (en). Xem build/pages-plugin.js.
export default defineConfig({
  plugins: [pagesPlugin()],
});
