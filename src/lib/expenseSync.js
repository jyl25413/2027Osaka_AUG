// 花費雲端同步：與 Google Apps Script Web App 溝通
// GET  ?token=xxx            -> { ok, expenses: [...] }
// POST {token, expenses}     -> { ok, count }（整表重寫）
// POST 用 text/plain 送 JSON，避開瀏覽器 CORS preflight
import { EXPENSE_SYNC, SYNC_CONFIG_KEY } from './syncConfig.js'

export function getSyncUrl() {
  try {
    const saved = localStorage.getItem(SYNC_CONFIG_KEY)
    if (saved && saved.trim()) return saved.trim()
  } catch {
    // ignore
  }
  return EXPENSE_SYNC.url || ''
}

export function saveSyncUrl(url) {
  try {
    localStorage.setItem(SYNC_CONFIG_KEY, url.trim())
  } catch {
    // ignore
  }
}

export function isSyncConfigured() {
  return Boolean(getSyncUrl())
}

function normalizeExpense(e) {
  return {
    id: String(e.id ?? ''),
    date: String(e.date ?? ''),
    category: String(e.category ?? ''),
    item: String(e.item ?? ''),
    amount: Number(e.amount) || 0,
    currency: String(e.currency ?? 'CNY'),
    note: String(e.note ?? ''),
  }
}

export function mergeExpenses(local, cloud) {
  // 用 ID 合併兩邊資料（雲端優先），首次設定兩邊都有資料時用
  const map = new Map()
  ;(local || []).forEach((e) => {
    if (e && e.id) map.set(String(e.id), normalizeExpense(e))
  })
  ;(cloud || []).forEach((e) => {
    if (e && e.id) map.set(String(e.id), normalizeExpense(e))
  })
  return [...map.values()]
}

export async function fetchCloudExpenses() {
  const url = getSyncUrl()
  if (!url) throw new Error('not configured')
  const res = await fetch(`${url}?token=${encodeURIComponent(EXPENSE_SYNC.token)}`)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'fetch failed')
  return (data.expenses || []).map(normalizeExpense).filter((e) => e.id)
}

export async function pushCloudExpenses(expenses) {
  const url = getSyncUrl()
  if (!url) throw new Error('not configured')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ token: EXPENSE_SYNC.token, expenses: expenses.map(normalizeExpense) }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'push failed')
  return data.count
}
