// Dung cho canonical, hreflang, og:url. Doi khi gan ten mien rieng (hoac dat bien moi truong SITE_URL luc build).
export const SITE_URL = (process.env.SITE_URL || "https://the-lash-story-landing.vercel.app").replace(/\/$/, "");
export const PATHS = { vi: "/", en: "/en/" };
export const OG_IMAGE = "/images/og-share.jpg";
// TODO Ryan: tai khoan that cua The Lash Story (hien la placeholder).
export const SOCIAL = {
  instagram: "https://www.instagram.com/thelashstory.studio/",
  threads: "https://www.threads.com/@thelashstory.studio",
  facebook: "https://www.facebook.com/thelashstory2018",
  tiktok: "https://www.tiktok.com/@thelashstory",
};
// TODO Ryan: link Nail landing (nut "Kham pha" o Our Services) va Google Maps chinh thuc cua tiem
export const NAIL_URL = "#";
