/**
 * Ruang Karya — Pitch Deck submission endpoint
 * 1) Run setupRuangKarya() once as the teacher.
 * 2) Deploy as Web App: Execute as Me, access Anyone.
 * 3) Copy the /exec URL into data/submission-config.json.
 */
function setupRuangKarya() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty("RUANG_KARYA_SPREADSHEET_ID");
  var folderId = props.getProperty("RUANG_KARYA_FOLDER_ID");
  var spreadsheet;
  var folder;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create("Ruang Karya — Pengumpulan Pitch Deck");
    props.setProperty("RUANG_KARYA_SPREADSHEET_ID", spreadsheet.getId());
  }
  if (folderId) {
    folder = DriveApp.getFolderById(folderId);
  } else {
    folder = DriveApp.createFolder("Ruang Karya — Karya Pitch Deck Siswa");
    props.setProperty("RUANG_KARYA_FOLDER_ID", folder.getId());
  }
  var sheet = spreadsheet.getSheets()[0];
  sheet.setName("Pengumpulan");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Waktu kirim", "Nama siswa", "Kelas", "Judul game", "Problem", "Target pemain", "Solution", "Gameplay", "Fitur", "Pesan positif", "Tema", "Link PNG"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 12).setFontWeight("bold");
    sheet.autoResizeColumns(1, 12);
  }
  Logger.log("Spreadsheet: " + spreadsheet.getUrl());
  Logger.log("Folder PNG: " + folder.getUrl());
  Logger.log("Simpan URL Web App /exec pada data/submission-config.json setelah deployment.");
}

function doPost(e) {
  try {
    if (!e || !e.parameter || !e.parameter.payload) {
      return response_("error", "Data pengumpulan tidak ditemukan.");
    }
    var raw = e.parameter.payload;
    if (raw.length > 6500000) {
      return response_("error", "Ukuran tugas terlalu besar. Coba unduh PNG dan minta bantuan guru.");
    }
    var data = JSON.parse(raw);
    var required = ["student", "title", "problem", "target", "solution", "message", "png"];
    required.forEach(function (key) {
      if (!data[key] || String(data[key]).trim() === "") throw new Error("Bagian wajib belum lengkap: " + key);
    });
    if (!/^data:image\/png;base64,/.test(data.png)) throw new Error("File karya harus berupa PNG.");
    var props = PropertiesService.getScriptProperties();
    var spreadsheet = SpreadsheetApp.openById(props.getProperty("RUANG_KARYA_SPREADSHEET_ID"));
    var folder = DriveApp.getFolderById(props.getProperty("RUANG_KARYA_FOLDER_ID"));
    var base64 = data.png.substring(data.png.indexOf(",") + 1);
    var bytes = Utilities.base64Decode(base64);
    if (bytes.length > 4500000) throw new Error("PNG lebih dari 4,5 MB. Kurangi isi karya lalu coba lagi.");
    var safeName = String(data.student).replace(/[^\p{L}\p{N} _-]/gu, "").trim().substring(0, 40) || "Siswa";
    var safeTitle = String(data.title).replace(/[^\p{L}\p{N} _-]/gu, "").trim().substring(0, 50) || "Pitch Deck";
    var fileName = safeName + " - " + safeTitle + " - " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + ".png";
    var blob = Utilities.newBlob(bytes, "image/png", fileName);
    var file = folder.createFile(blob);
    var sheet = spreadsheet.getSheetByName("Pengumpulan") || spreadsheet.getSheets()[0];
    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      sheet.appendRow([
        new Date(), safeCell_(data.student, 100), safeCell_(data.className || "", 40),
        safeCell_(data.title, 150), safeCell_(data.problem, 1000),
        safeCell_(data.target, 500), safeCell_(data.solution, 1000),
        safeCell_((data.steps || []).join("\n"), 1500), safeCell_((data.features || []).join("\n"), 1000),
        safeCell_(data.message, 1000), safeCell_(data.theme || "", 40), file.getUrl()
      ]);
    } finally {
      lock.releaseLock();
    }
    return response_("success", "Yeay! Tugas berhasil dikirim. Guru sudah menerima karya kamu.");
  } catch (err) {
    return response_("error", "Tugas belum berhasil disimpan: " + String(err.message || err));
  }
}

function safeCell_(value, maxLength) {
  var text = String(value == null ? "" : value).substring(0, maxLength);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function response_(status, message) {
  var safeMessage = JSON.stringify(message).replace(/</g, "\\u003c");
  var html = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>' +
    'window.parent.postMessage({type:"ruangkarya-submission",status:' + JSON.stringify(status) +
    ',message:' + safeMessage + '},"*");' +
    '</script><p>Pengumpulan selesai. Kamu boleh kembali ke halaman Ruang Karya.</p></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}