// 2027 大阪行 - 花費同步
// 綁定試算表「2027 大阪行 - 花費」，工作表「花費」
// 欄位：A=ID, B=日期, C=分類, D=項目, E=金額, F=幣別, G=備註
//
// 網站（Vercel 靜態站）透過此 Web App 讀寫花費：
//   GET  ?token=xxx            -> 回傳全部花費 JSON
//   POST {token, expenses:[...]} -> 整表重寫為給定的花費清單
// POST 請用 Content-Type: text/plain 送 JSON（避開瀏覽器 preflight）

var SHEET_NAME = '花費';
var SPREADSHEET_ID = '1RhtbV-c-8gnGB_Hm5GTeiKjvc8QvKh2YdSXGeQhMjgA';
var TOKEN = '7jSTMZMy_99CxlKElpMG2hYvT-oP-Xui';

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate_(v) {
  // 試算表會把 "2026-11-16" 解析成 Date；跨 context 的 Date 讓 instanceof 失效，改用 getTime 判斷
  if (v && typeof v.getTime === 'function') {
    try {
      return Utilities.formatDate(new Date(v.getTime()), 'Asia/Taipei', 'yyyy-MM-dd');
    } catch (err) {
      return String(v);
    }
  }
  return String(v || '');
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.token !== TOKEN) {
    return jsonOut({ ok: false, error: 'unauthorized' });
  }
  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var expenses = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue;
    expenses.push({
      id: String(row[0]),
      date: formatDate_(row[1]),
      category: String(row[2] || ''),
      item: String(row[3] || ''),
      amount: Number(row[4] || 0),
      currency: String(row[5] || 'JPY'),
      note: String(row[6] || '')
    });
  }
  return jsonOut({ ok: true, expenses: expenses });
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'bad json' });
  }
  if (body.token !== TOKEN) {
    return jsonOut({ ok: false, error: 'unauthorized' });
  }
  var expenses = body.expenses || [];
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  }
  if (expenses.length > 0) {
    var rows = expenses.map(function (x) {
      return [String(x.id), String(x.date), String(x.category), String(x.item), Number(x.amount) || 0, String(x.currency), String(x.note || '')];
    });
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
  }
  return jsonOut({ ok: true, count: expenses.length });
}
