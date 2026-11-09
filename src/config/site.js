// Dung cho canonical, hreflang, og:url. Doi khi gan ten mien rieng (hoac dat bien moi truong SITE_URL luc build).
export const SITE_URL = (process.env.SITE_URL || "https://the-lash-story-landing.vercel.app").replace(/\/$/, "");
export const PATHS = { vi: "/", en: "/en/" };
export const OG_IMAGE = "/images/og-share.jpg";
// TODO Ryan: tai khoan that cua The Lash Story (hien la placeholder).
export const SOCIAL = {
  instagram: "https://www.instagram.com/thelashstory.studio/",
  threads: "https://www.threads.com/@thelashstory.studio",
  facebook: "https://www.facebook.com/thelashstorybythestory/",
  tiktok: "https://www.tiktok.com/@thelashstory.hn",
};
export const MAPS_URL = "https://www.google.com/maps/place/The+Lash+Story/@21.0421253,105.8410176,1061m/data=!3m1!1e3!4m16!1m9!3m8!1s0x3135ab8494635483:0x4f6a9c64056e072f!2sThe+Lash+Story!8m2!3d21.0421203!4d105.8435925!9m1!1b1!16s%2Fg%2F11hdr1b8vc!3m5!1s0x3135ab8494635483:0x4f6a9c64056e072f!8m2!3d21.0421203!4d105.8435925!16s%2Fg%2F11hdr1b8vc";
// TODO Ryan: link Nail landing (nut "Kham pha" o Our Services)
export const NAIL_URL = "#";
