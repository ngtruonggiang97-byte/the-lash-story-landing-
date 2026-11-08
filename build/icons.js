// Icon dung luc build (Node): chen thang SVG vao HTML tinh, khong can JS o trinh duyet.
// Icon giao dien: Phosphor (light, star dung fill). Logo mang xa hoi: Simple Icons.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { siGoogle, siInstagram, siThreads, siFacebook, siTiktok } from "simple-icons";

const phosphor = (weight, name) => {
  const file = fileURLToPath(new URL(`../node_modules/@phosphor-icons/core/assets/${weight}/${name}.svg`, import.meta.url));
  return readFileSync(file, "utf8").trim().replace("<svg", '<svg aria-hidden="true" focusable="false"');
};
const brand = (si) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${si.path}"/></svg>`;

export const ICONS = {
  "arrow-left": phosphor("light", "arrow-left-light"),
  "arrow-right": phosphor("light", "arrow-right-light"),
  "map-pin": phosphor("light", "map-pin-light"),
  phone: phosphor("light", "phone-light"),
  star: phosphor("fill", "star-fill"),
  google: brand(siGoogle),
  instagram: brand(siInstagram),
  threads: brand(siThreads),
  facebook: brand(siFacebook),
  tiktok: brand(siTiktok),
};
