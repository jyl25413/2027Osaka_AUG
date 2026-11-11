import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../lib/admin.js'

const STORAGE_KEY = 'shanghai-expenses-v1'

const CATEGORIES = ['餐飲', '交通', '住宿', '門票', '購物', '其他']
const CURRENCIES = ['CNY', 'TWD']

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
}

const EXPORT_HEADER = ['日期', '分類', '項目', '金額', '幣別', '備註']

function sortedForExport(expenses) {
  return [...expenses].sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id))
}

function exportRows(expenses) {
  return sortedForExport(expenses).map((e) => [
    e.date,
    e.category,
    e.item,
    String(e.amount ?? ''),
    e.currency,
    e.note || '',
  ])
}

function toTsv(expenses) {
  const clean = (v) => String(v).replace(/[\t\r\n]+/g, ' ')
  return [EXPORT_HEADER, ...exportRows(expenses)]
    .map((row) => row.map(clean).join('\t'))
    .join('\n')
}

function toCsv(expenses) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  return (
    '\uFEFF' +
    [EXPORT_HEADER, ...exportRows(expenses)]
      .map((row) => row.map(esc).join(','))
      .join('\r\n')
  )
}

function copyText(text, onDone) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone).catch(() => fallbackCopy(text, onDone))
  } else {
    fallbackCopy(text, onDone)
  }
}

function fallbackCopy(text, onDone) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch (err) { /* ignore */ }
  document.body.removeChild(ta)
  onDone()
}

const inputCls =
  'w-full rounded-lg border border-paper-border bg-paper-card px-3 py-2 text-sm text-ink'
const labelCls = 'mb-1 block text-xs font-bold text-ink-muted'

export default function Expenses() {
  const admin = useAdmin()
  const [expenses, setExpenses] = useState(loadExpenses)
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    date: todayStr(),
    category: '餐飲',
    item: '',
    amount: '',
    currency: 'CNY',
    note: '',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const totals = useMemo(() => {
    const t = { CNY: 0, TWD: 0 }
    expenses.forEach((e) => {
      t[e.currency] = (t[e.currency] || 0) + Number(e.amount || 0)
    })
    return t
  }, [expenses])

  const byDate = useMemo(() => {
    const groups = {}
    ;[...expenses]
      .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id))
      .forEach((e) => {
        if (!groups[e.date]) groups[e.date] = []
        groups[e.date].push(e)
      })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [expenses])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function resetForm() {
    setForm({
      date: todayStr(),
      category: '餐飲',
      item: '',
      amount: '',
      currency: 'CNY',
      note: '',
    })
    setEditingId(null)
  }

  function handleSave() {
    if (!form.item.trim() || !form.amount || Number(form.amount) <= 0) return
    const data = {
      date: form.date,
      category: form.category,
      item: form.item.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      note: form.note.trim(),
    }
    if (editingId) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...data } : e))
      )
    } else {
      setExpenses((prev) => [...prev, { id: `${Date.now()}`, ...data }])
    }
    resetForm()
    setShowForm(false)
  }

  function startEdit(e) {
    setForm({
      date: e.date,
      category: e.category,
      item: e.item,
      amount: String(e.amount),
      currency: e.currency,
      note: e.note || '',
    })
    setEditingId(e.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    if (id === editingId) {
      resetForm()
      setShowForm(false)
    }
  }

  function toggleForm() {
    if (showForm) {
      resetForm()
      setShowForm(false)
    } else {
      setShowForm(true)
    }
  }

  function handleCopyAll() {
    copyText(toTsv(expenses), () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownloadCsv() {
    const blob = new Blob([toCsv(expenses)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-${todayStr()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-12">
      <header className="pt-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-seal">
          ← 目錄
        </Link>
        <h1 className="mt-2 text-xl font-bold">花費記錄</h1>
        <p className="mt-0.5 text-xs tracking-[0.3em] text-ink-muted">EXPENSES</p>
      </header>

      {/* 總計 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {CURRENCIES.map((c) => (
          <div key={c} className="rounded-xl border border-paper-border bg-paper-card p-4 text-center">
            <div className="text-xs font-bold text-ink-muted">{c} 總計</div>
            <div className="mt-1 text-xl font-bold text-seal">
              {totals[c].toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {admin && (
      <button
        onClick={toggleForm}
        className="mt-4 w-full rounded-xl bg-seal py-3 text-sm font-bold text-ink active:bg-seal-dark"
      >
        {showForm ? '收起' : '＋ 新增一筆花費'}
      </button>
      )}

      {expenses.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyAll}
            className="rounded-xl border border-paper-border bg-paper-card py-2.5 text-sm font-bold text-ink active:bg-paper"
          >
            {copied ? '已複製 ✓' : '📋 複製全部'}
          </button>
          <button
            onClick={handleDownloadCsv}
            className="rounded-xl border border-paper-border bg-paper-card py-2.5 text-sm font-bold text-ink active:bg-paper"
          >
            ⬇️ 下載 CSV
          </button>
          <p className="col-span-2 text-center text-xs text-ink-muted">
            「複製全部」貼到 Google Sheet 的 A1 格，欄位會自動分好
          </p>
        </div>
      )}

      {showForm && (
        <div className="mt-3 rounded-xl border border-paper-border bg-paper-card p-4">
          {editingId && (
            <p className="mb-3 text-xs font-bold text-seal">編輯中（改完按「更新」）</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>日期</label>
              <input type="date" className={inputCls} value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className={labelCls}>類別</label>
              <select className={inputCls} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>項目</label>
              <input className={inputCls} value={form.item} onChange={set('item')} placeholder="例：橋村炸雞" />
            </div>
            <div>
              <label className={labelCls}>金額</label>
              <input
                type="number"
                inputMode="numeric"
                className={inputCls}
                value={form.amount}
                onChange={set('amount')}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelCls}>幣別</label>
              <select className={inputCls} value={form.currency} onChange={set('currency')}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>備註（選填）</label>
              <input className={inputCls} value={form.note} onChange={set('note')} />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="mt-3 w-full rounded-lg bg-seal py-2.5 text-sm font-bold text-ink active:bg-seal-dark"
          >
            {editingId ? '更新' : '儲存'}
          </button>
        </div>
      )}

      {/* 明細 */}
      <main className="mt-6 space-y-5">
        {byDate.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-muted">
            還沒有記錄，點上面按鈕新增第一筆吧
          </p>
        )}
        {byDate.map(([date, list]) => (
          <div key={date}>
            <h2 className="mb-2 text-sm font-bold">{date}</h2>
            <ul className="overflow-hidden rounded-xl border border-paper-border bg-paper-card">
              {list.map((e) => (
                <li
                  key={e.id}
                  className={`flex items-center gap-3 border-b border-paper-border px-4 py-3 last:border-b-0 ${
                    e.id === editingId ? 'bg-paper' : ''
                  }`}
                >
                  <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                    {e.category}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{e.item}</span>
                    {e.note && (
                      <span className="block truncate text-xs text-ink-muted">{e.note}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-sm font-bold">
                    {e.amount.toLocaleString()} <span className="text-xs font-normal text-ink-muted">{e.currency}</span>
                  </span>
                  {admin && (
                  <button
                    onClick={() => startEdit(e)}
                    className="shrink-0 text-xs font-bold text-seal active:text-seal-dark"
                  >
                    編輯
                  </button>
                  )}
                  {admin && (
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="shrink-0 text-xs font-bold text-red-500 active:text-red-700"
                  >
                    刪除
                  </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      <p className="mt-8 text-center text-xs text-ink-muted">記錄存在這支手機上，不會上傳</p>
    </div>
  )
}
