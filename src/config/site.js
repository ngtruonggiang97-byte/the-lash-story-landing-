// Dung cho canonical, hreflang, og:url. Doi khi gan ten mien rieng (hoac dat bien moi truong SITE_URL luc build).
export const SITE_URL = (process.env.SITE_URL || "https://the-nail-story-landing.vercel.app").replace(/\/$/, "");
export const PATHS = { vi: "/", en: "/en/" };
export const OG_IMAGE = "/images/og-share.jpg";
