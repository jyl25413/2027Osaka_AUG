import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import spotsData from '../data/spots.json'
import { useAdmin } from '../lib/admin.js'

const STORAGE_KEY = 'osaka-spots-custom-v1'

function mapsUrl(query) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query)
}

function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { added: [], edited: {}, deleted: [] }
  } catch {
    return { added: [], edited: {}, deleted: [] }
  }
}

function emptyForm() {
  return { name: '', category: '景點', area: '昆明', tags: '', note: '', mapsQuery: '' }
}

export default function Spots() {
  const admin = useAdmin()
  const [custom, setCustom] = useState(loadCustom)
  const [catFilter, setCatFilter] = useState('全部')
  const [areaFilter, setAreaFilter] = useState('全部')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
  }, [custom])

  const spots = [
    ...spotsData.spots
      .filter((s) => !custom.deleted.includes(s.id))
      .map((s) => (custom.edited[s.id] ? { ...s, ...custom.edited[s.id] } : s)),
    ...custom.added,
  ]

  const filtered = spots.filter(
    (s) =>
      (catFilter === '全部' || s.category === catFilter) &&
      (areaFilter === '全部' || s.area === areaFilter)
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEdit(s) {
    setEditingId(s.id)
    setForm({
      name: s.name,
      category: s.category,
      area: s.area,
      tags: (s.tags || []).join('、'),
      note: s.note || '',
      mapsQuery: s.mapsQuery || '',
    })
    setShowForm(true)
  }

  function saveForm() {
    if (!form.name.trim()) return
    const data = {
      name: form.name.trim(),
      category: form.category,
      area: form.area,
      tags: form.tags.split('、').map((t) => t.trim()).filter(Boolean),
      note: form.note.trim(),
      mapsQuery: form.mapsQuery.trim() || form.name.trim(),
    }
    if (editingId) {
      if (String(editingId).startsWith('custom-')) {
        setCustom((prev) => ({
          ...prev,
          added: prev.added.map((a) => (a.id === editingId ? { ...a, ...data } : a)),
        }))
      } else {
        setCustom((prev) => ({
          ...prev,
          edited: { ...prev.edited, [editingId]: data },
        }))
      }
    } else {
      setCustom((prev) => ({
        ...prev,
        added: [...prev.added, { ...data, id: 'custom-' + Date.now() }],
      }))
    }
    setShowForm(false)
  }

  function removeSpot(id) {
    if (!window.confirm('確定刪除這個景點嗎？')) return
    if (String(id).startsWith('custom-')) {
      setCustom((prev) => ({ ...prev, added: prev.added.filter((a) => a.id !== id) }))
    } else {
      setCustom((prev) => ({
        ...prev,
        edited: Object.fromEntries(Object.entries(prev.edited).filter(([k]) => k !== id)),
        deleted: [...prev.deleted, id],
      }))
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10">
      <header className="sticky top-0 z-10 -mx-4 mb-6 bg-paper-card/90 px-4 pb-4 pt-6 backdrop-blur">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
          ← 返回主頁
        </Link>
        <h1 className="mt-2 text-xl font-bold text-ink">收藏景點</h1>
        <p className="mt-1 text-sm text-ink-muted">SAVED SPOTS・分類整理・點開地圖</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {['全部', ...spotsData.categories].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={
                catFilter === c
                  ? 'rounded-full bg-seal px-3 py-1.5 text-xs font-bold text-[#1b1b1d]'
                  : 'rounded-full border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-bold text-ink-muted'
              }
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {['全部', ...spotsData.areas].map((a) => (
            <button
              key={a}
              onClick={() => setAreaFilter(a)}
              className={
                areaFilter === a
                  ? 'rounded-full bg-seal px-3 py-1.5 text-xs font-bold text-[#1b1b1d]'
                  : 'rounded-full border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-bold text-ink-muted'
              }
            >
              {a}
            </button>
          ))}
        </div>
      </header>

      <main className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-muted">
            這個分類還沒有收藏{admin ? '，點下方＋新增一個吧' : '。'}
          </p>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="rounded-2xl border border-paper-border bg-paper-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{s.name}</h3>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-ink-muted">
                    {s.category}
                  </span>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-ink-muted">
                    {s.area}
                  </span>
                </div>
                {(s.tags || []).length > 0 && (
                  <p className="mt-1 text-xs text-brand-600">
                    {(s.tags || []).map((t) => '#' + t).join(' ')}
                  </p>
                )}
              </div>
              {admin && (
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="rounded-lg border border-paper-border px-2 py-1 text-xs font-bold text-ink-muted"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => removeSpot(s.id)}
                    className="rounded-lg border border-paper-border px-2 py-1 text-xs font-bold text-red-500"
                  >
                    刪除
                  </button>
                </div>
              )}
            </div>
            {s.note && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.note}</p>}
            <a
              href={mapsUrl(s.mapsQuery || s.name)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-brand-600"
            >
              📍 在 Google Maps 開啟
            </a>
          </div>
        ))}

        {admin && (
          <button
            onClick={openAdd}
            className="w-full rounded-xl border border-dashed border-paper-border bg-paper-card py-3 text-sm font-bold text-ink-muted"
          >
            ＋ 新增景點
          </button>
        )}

        <Link
          to="/"
          className="flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-[#1b1b1d] active:bg-brand-700"
        >
          ← 返回主頁
        </Link>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-paper-card p-5">
            <h2 className="text-base font-bold text-ink">{editingId ? '編輯景點' : '新增景點'}</h2>
            <div className="mt-4 space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="名稱（必填）"
                className="w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
              />
              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex-1 rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
                >
                  {spotsData.categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="flex-1 rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
                >
                  {spotsData.areas.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="標籤（用、分隔，如：必吃、雲南名菜）"
                className="w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
              />
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="備註"
                rows={3}
                className="w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
              />
              <input
                value={form.mapsQuery}
                onChange={(e) => setForm({ ...form, mapsQuery: e.target.value })}
                placeholder="地圖搜尋關鍵字（預設用名稱）"
                className="w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-paper-border py-2.5 text-sm font-bold text-ink-muted"
              >
                取消
              </button>
              <button
                onClick={saveForm}
                className="flex-1 rounded-xl bg-seal py-2.5 text-sm font-bold text-ink"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
