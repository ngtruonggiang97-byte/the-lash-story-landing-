// Google Apps Script: nhan form dat lich tu landing page, ghi vao Google Sheet.
// Cach dung: mo Sheet > Extensions > Apps Script > dan file nay > Deploy > New deployment > Web app
// (Execute as: Me, Who has access: Anyone). Copy URL /exec vao src/config/form.js (FORM_ENDPOINT).

// Mot script phuc vu ca 2 landing. Form gui kem truong "brand": "lash" -> tab The Lash Story (theo gid),
// khong co brand (landing Nail cu) -> tab "The nail story". Sua code thi Deploy > Manage deployments > New version (giu URL).
const NAIL_SHEET_NAME = "The nail story";
const LASH_SHEET_GID = 357999824;

function pickSheet(brand) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (brand === "lash") {
    const s = ss.getSheets().filter((x) => x.getSheetId() === LASH_SHEET_GID)[0];
    if (!s) throw new Error("Khong tim thay tab Lash (gid " + LASH_SHEET_GID + ")");
    return s;
  }
  return ss.getSheetByName(NAIL_SHEET_NAME);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = pickSheet(d.brand);
    const row = sheet.getLastRow() + 1;
    const text = (v) => (v == null ? "" : String(v));
    const vals = [
      Utilities.formatDate(new Date(d.createdAt || Date.now()), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss"),
      text(d.name), text(d.phone), text(d.date), text(d.time), text(d.note),
      text(d.lang), text(d.page_url),
      text(d.utm_source), text(d.utm_medium), text(d.utm_campaign), text(d.utm_content), text(d.utm_term),
      "Mới",
    ];
    const range = sheet.getRange(row, 1, 1, vals.length);
    range.setNumberFormat("@");            // giu so 0 dau cua SDT, khong bi doi ngay/gio
    range.setValues([vals]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Nail + Lash Story form endpoint OK");
}
