// Icon giao dien: Phosphor (weight light, star dung fill). Logo thuong hieu: Simple Icons.
import arrowLeft from "@phosphor-icons/core/assets/light/arrow-left-light.svg?raw";
import arrowRight from "@phosphor-icons/core/assets/light/arrow-right-light.svg?raw";
import arrowUpRight from "@phosphor-icons/core/assets/light/arrow-up-right-light.svg?raw";
import mapPin from "@phosphor-icons/core/assets/light/map-pin-light.svg?raw";
import phone from "@phosphor-icons/core/assets/light/phone-light.svg?raw";
import check from "@phosphor-icons/core/assets/light/check-light.svg?raw";
import star from "@phosphor-icons/core/assets/fill/star-fill.svg?raw";
import { siZalo, siGoogle, siInstagram, siThreads, siFacebook, siTiktok } from "simple-icons";

const brand = (si) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${si.path}"/></svg>`;
const ui = (raw) => raw.replace("<svg", '<svg aria-hidden="true" fill="currentColor"');

export const ICONS = {
  "arrow-left": ui(arrowLeft),
  "arrow-right": ui(arrowRight),
  "arrow-up-right": ui(arrowUpRight),
  "map-pin": ui(mapPin),
  phone: ui(phone),
  check: ui(check),
  star: ui(star),
  zalo: brand(siZalo),
  google: brand(siGoogle),
  instagram: brand(siInstagram),
  threads: brand(siThreads),
  facebook: brand(siFacebook),
  tiktok: brand(siTiktok),
};

// <i data-icon="star"></i> -> svg inline
export function mountIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const svg = ICONS[el.dataset.icon];
    if (svg) el.innerHTML = svg;
  });
}
