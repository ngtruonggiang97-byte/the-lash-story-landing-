// Gan ID khi chay ads. De trong = khong tai script nao, khong bat su kien nao len server.
// Su kien:
//   Lead    - ban khi gui form THANH CONG (kem lang). Meta: "Lead", Google: "generate_lead".
//   Contact - ban khi bam Zalo / WhatsApp / Hotline (kem lang, method). Meta: "Contact", Google: "contact".
// LUU Y: Lead chi ban khi form that su gui duoc (src/config/form.js co FORM_ENDPOINT) hoac khi chay dev.
// Neu chua noi form ma dat Pixel ID, trang van khong ban Lead gia len Meta/Google.
export const TRACKING = {
  metaPixelId: "",   // vd "123456789012345"
  googleTagId: "",   // vd "G-XXXXXXXXXX" (GA4) hoac "AW-XXXXXXXXX" (Google Ads)
};
