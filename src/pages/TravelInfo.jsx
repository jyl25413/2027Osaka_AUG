import { useState } from 'react'
import { Link } from 'react-router-dom'
import travelInfo from '../data/travelInfo.json'
import MapLink from '../components/MapLink.jsx'

// travelInfo.local.json is gitignored (see .gitignore) — it holds sensitive
// records (passport no., etc.) that should only ever appear when running the
// site locally, never in the public deployment. import.meta.glob only picks
// up files that actually exist at build time, so when the file is absent
// this simply resolves to no extra records, no build error.
const localModules = import.meta.glob('../data/travelInfo.local.json', { eager: true })
const localRecords = Object.values(localModules)[0]?.default?.records || Object.values(localModules)[0]?.records || []

function copyText(text, onDone) {
  const done = () => onDone(true)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done))
  } else {
    fallbackCopy(text, done)
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch (e) { /* ignore */ }
  document.body.removeChild(ta)
  done()
}

function RecordCard({ record }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyText(record.value, () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="rounded-2xl border border-paper-border bg-paper-card p-4 shadow-sm">
      <p className="text-xs font-semibold text-brand-600">{record.category}</p>
      <h2 className="mt-1 text-sm font-medium text-ink">{record.title}</h2>
      <div className="mt-2 flex items-center gap-2">
        <p className="flex-1 select-all break-all text-2xl font-bold tracking-wide text-ink">
          {record.value}
        </p>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-[#1b1b1d] active:bg-brand-700"
        >
          {copied ? '已複製 ✓' : '複製'}
        </button>
      </div>
      {record.note && (
        <p className="mt-2 text-sm text-ink-muted">{record.note}</p>
      )}
      {record.amapQuery && (
        <div className="mt-2 text-sm">
          <MapLink query={record.mapQuery || record.amapQuery} amapQuery={record.amapQuery}>
            飯店位置
          </MapLink>
        </div>
      )}
      {record.image && (
        <img
          src={record.image}
          alt={record.title}
          className="mt-3 w-full rounded-xl border border-paper-border"
        />
      )}
    </div>
  )
}

export default function TravelInfo() {
  const records = [...localRecords, ...travelInfo.records]

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10">
      <header className="sticky top-0 z-10 -mx-4 mb-6 bg-paper-card/90 px-4 pb-4 pt-6 backdrop-blur">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600"
        >
          ← 返回主頁
        </Link>
        <h1 className="mt-2 text-xl font-bold text-ink">重要資訊</h1>
        <p className="mt-1 text-sm text-ink-muted">會員號碼、訂位代號等旅行常用資訊</p>
      </header>

      <main className="space-y-3">
        {records.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}

        <Link
          to="/"
          className="mt-2 flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-[#1b1b1d] active:bg-brand-700"
        >
          ← 返回主頁
        </Link>
      </main>
    </div>
  )
}
