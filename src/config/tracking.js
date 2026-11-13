// Google di qua Google Tag Manager (GTM_ID), khong goi gtag truc tiep. Tag GA4 / Google Ads cau hinh trong GTM.
// Su kien:
//   Lead    - ban khi gui form THANH CONG (kem lang). Meta: "Lead", dataLayer: event "generate_lead".
//   Contact - ban khi bam Zalo / WhatsApp / Hotline (kem lang, method). Meta: "Contact", dataLayer: event "contact".
// LUU Y: Lead chi ban khi form that su gui duoc (src/config/form.js co FORM_ENDPOINT) hoac khi chay dev.
// Neu chua noi form ma dat Pixel ID, trang van khong ban Lead gia len Meta/Google.
export const TRACKING = {
  metaPixelId: "",   // vd "123456789012345"
};
export const GTM_ID = "GTM-PWKFLDJX";
