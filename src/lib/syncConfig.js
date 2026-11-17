// 花費雲端同步設定
// Google Apps Script Web App（綁定試算表「2027 大阪行 - 花費」）
// 部署後把 Web App 網址填進 CLOUD_URL；使用者也可以在花費頁直接貼上網址（存在手機本地，會覆蓋這裡的設定）

export const EXPENSE_SYNC = {
  // Google Apps Script Web App（2026-11-17 部署，執行身分 jyl2590@gmail.com）
  url: 'https://script.google.com/macros/s/AKfycbxsM37fJrIIVC-2FyClM-Pz4xNtpflSnLpF03rwMzj2Hi7joIHxy9MXO-_pZZ4siOA8/exec',
  // 須與 Apps Script（sync/Code.gs）裡的 TOKEN 相同
  token: '7jSTMZMy_99CxlKElpMG2hYvT-oP-Xui',
}

export const SYNC_CONFIG_KEY = 'osaka-expense-sync-url-v1'
