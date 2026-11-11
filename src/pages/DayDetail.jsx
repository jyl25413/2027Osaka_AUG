import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import itinerary from '../data/itinerary.js'
import ScheduleItem from '../components/ScheduleItem.jsx'
import MapLink from '../components/MapLink.jsx'
import DayMap from '../components/DayMap.jsx'
import {
  getDaySchedule,
  setDaySchedule,
  resetDaySchedule,
  hasOverride,
  newScheduleItem,
} from '../lib/itineraryStore.js'
import { getDayTheme } from '../lib/theme.js'
import { useAdmin } from '../lib/admin.js'
import PhotoBackdrop from '../components/PhotoBackdrop.jsx'

const CHAPTER_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八']

const TYPE_OPTIONS = [
  { value: 'transport', label: '交通' },
  { value: 'food', label: '餐飲' },
  { value: 'hotel', label: '住宿' },
  { value: 'game', label: '比賽' },
  { value: 'shopping', label: '購物' },
  { value: 'sight', label: '景點' },
  { value: 'other', label: '其他' },
]

const EMPTY_FORM = newScheduleItem()

function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const inputCls =
    'w-full rounded-lg border border-paper-border bg-paper-card px-3 py-2 text-sm text-ink'
  const labelCls = 'mb-1 block text-xs font-bold text-ink-muted'

  return (
    <div className="rounded-xl border-2 border-seal/40 bg-paper-card p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>時間</label>
          <input className={inputCls} value={form.time} onChange={set('time')} placeholder="22:02" />
        </div>
        <div>
          <label className={labelCls}>類型</label>
          <select className={inputCls} value={form.type} onChange={set('type')}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>標題</label>
          <input className={inputCls} value={form.title} onChange={set('title')} placeholder="回程：水原 → 富平" />
        </div>
        <div>
          <label className={labelCls}>出發時間</label>
          <input className={inputCls} value={form.departTime} onChange={set('departTime')} placeholder="22:02" />
        </div>
        <div>
          <label className={labelCls}>抵達時間</label>
          <input className={inputCls} value={form.arriveTime} onChange={set('arriveTime')} placeholder="23:46" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>交通工具</label>
          <input className={inputCls} value={form.transport} onChange={set('transport')} placeholder="1號線・公車13-4" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>地點</label>
          <input className={inputCls} value={form.location} onChange={set('location')} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>備註</label>
          <textarea className={inputCls} rows={2} value={form.note} onChange={set('note')} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSave(form)}
          className="flex-1 rounded-lg bg-seal py-2 text-sm font-bold text-ink active:bg-seal-dark"
        >
          儲存
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-paper-border bg-paper-card py-2 text-sm font-bold active:bg-paper"
        >
          取消
        </button>
      </div>
    </div>
  )
}

export default function DayDetail() {
  const { dayId } = useParams()
  const days = itinerary.days
  const dayIndex = days.findIndex((d) => d.id === dayId)
  const day = days[dayIndex]

  const [editMode, setEditMode] = useState(false)
  const admin = useAdmin()
  const [editingIndex, setEditingIndex] = useState(null) // null | number | 'new'
  const [version, setVersion] = useState(0) // bump to re-read overrides

  if (!day) return <Navigate to="/" replace />

  const schedule = getDaySchedule(day.id, day.schedule)
  const overridden = hasOverride(day.id)
  void version

  const prevDay = dayIndex > 0 ? days[dayIndex - 1] : null
  const nextDay = dayIndex < days.length - 1 ? days[dayIndex + 1] : null
  const chapterLabel = `第${CHAPTER_NUMS[dayIndex] || dayIndex + 1}章`
  const theme = getDayTheme(day.city)

  function persist(next) {
    setDaySchedule(day.id, next)
    setVersion((v) => v + 1)
  }

  function handleSave(form) {
    const clean = { ...form }
    if (editingIndex === 'new') {
      persist([...schedule, clean])
    } else {
      const next = schedule.map((it, i) => (i === editingIndex ? clean : it))
      persist(next)
    }
    setEditingIndex(null)
  }

  function handleDelete(index) {
    persist(schedule.filter((_, i) => i !== index))
  }

  function handleMove(index, dir) {
    const next = [...schedule]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    persist(next)
  }

  function handleReset() {
    resetDaySchedule(day.id)
    setVersion((v) => v + 1)
    setEditingIndex(null)
  }

  let mapStopIndex = 0
  const mapStopNumbers = schedule.map((item) => {
    const query = item.mapQuery || item.location
    if (!query) return null
    mapStopIndex += 1
    return mapStopIndex
  })

  return (
    <div className="mx-auto min-h-screen max-w-md pb-12 md:max-w-5xl">
      {/* ── 章節切換籤 ── */}
      <nav className="sticky top-0 z-10 border-b border-paper-border bg-paper/95 backdrop-blur">
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2">
          <Link
            to="/"
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink-muted active:bg-paper-border/50"
          >
            目錄
          </Link>
          {days.map((d, i) => (
            <Link
              key={d.id}
              to={`/day/${d.id}`}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${
                i === dayIndex
                  ? 'bg-seal text-ink'
                  : 'text-ink-muted active:bg-paper-border/50'
              }`}
            >
              {CHAPTER_NUMS[i] || i + 1}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── 章節標題（城市照片橫幅） ── */}
      <header
        className="relative overflow-hidden px-6 pb-8 pt-10 text-center"
        style={{ backgroundImage: `linear-gradient(120deg, ${theme.from}, ${theme.to})` }}
      >
        <PhotoBackdrop src={theme.photo} from={theme.from} to={theme.to} />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.5em] text-white/90">{chapterLabel}</p>
          <h1 className="mt-3 text-2xl font-bold text-white">{day.city}</h1>
          <p className="mt-2 text-sm text-white/85">
            {day.date}（{day.weekday}）
            {overridden && <span className="ml-2 text-xs font-bold">・已自訂</span>}
          </p>
          {admin && (
          <button
            onClick={() => { setEditMode((m) => !m); setEditingIndex(null) }}
            className={`mt-4 rounded-full px-5 py-1.5 text-xs font-bold ${
              editMode ? 'bg-paper-card text-ink' : 'border border-white/60 bg-paper-card/15 text-white'
            }`}
          >
            {editMode ? '完成編輯' : '✏️ 編輯行程'}
          </button>
          )}
        </div>
      </header>

      <main className="px-4 md:flex md:items-start md:gap-6 md:px-8">
        <div className="md:max-w-md md:flex-1">
          {day.hotel && (
            <div className="mb-5 rounded-xl border border-paper-border bg-paper-card p-4">
              <div className="text-xs font-bold text-seal">🏨 今晚住宿</div>
              <div className="mt-1 text-base font-bold">
                <MapLink query={day.hotel.mapQuery || day.hotel.name} amapQuery={day.hotel.amapQuery}>
                  {day.hotel.name}
                </MapLink>
              </div>
              {day.hotel.checkIn && (
                <div className="mt-1 text-sm text-ink-muted">
                  預計 Check-in：{day.hotel.checkIn}
                </div>
              )}
              {day.hotel.note && (
                <div className="mt-1 text-sm text-ink-muted">{day.hotel.note}</div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-paper-border bg-paper-card p-4">
            {schedule.map((item, index) => (
              <div key={index}>
                {editingIndex === index ? (
                  <div className="pb-6">
                    <ItemForm
                      initial={item}
                      onSave={handleSave}
                      onCancel={() => setEditingIndex(null)}
                    />
                  </div>
                ) : (
                  <>
                    <ScheduleItem
                      item={item}
                      isLast={index === schedule.length - 1 && editingIndex !== 'new'}
                      mapNumber={mapStopNumbers[index]}
                    />
                    {editMode && (
                      <div className="flex gap-2 pb-6 pl-12">
                        <button
                          onClick={() => handleMove(index, -1)}
                          disabled={index === 0}
                          className="rounded-lg border border-paper-border px-2.5 py-1 text-xs font-bold disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(index, 1)}
                          disabled={index === schedule.length - 1}
                          className="rounded-lg border border-paper-border px-2.5 py-1 text-xs font-bold disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="rounded-lg border border-paper-border px-2.5 py-1 text-xs font-bold"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600"
                        >
                          刪除
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {editingIndex === 'new' ? (
              <div className="pb-2">
                <ItemForm
                  initial={EMPTY_FORM}
                  onSave={handleSave}
                  onCancel={() => setEditingIndex(null)}
                />
              </div>
            ) : (
              editMode && (
                <button
                  onClick={() => setEditingIndex('new')}
                  className="mt-2 w-full rounded-xl border-2 border-dashed border-paper-border py-3 text-sm font-bold text-ink-muted active:bg-paper"
                >
                  ＋ 新增項目
                </button>
              )
            )}
          </div>

          {editMode && overridden && (
            <button
              onClick={handleReset}
              className="mt-3 w-full rounded-xl border border-paper-border bg-paper-card py-2.5 text-xs font-bold text-ink-muted active:bg-paper"
            >
              恢復為原始行程（清除自訂）
            </button>
          )}

          {/* ── 翻頁 ── */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {prevDay ? (
              <Link
                to={`/day/${prevDay.id}`}
                className="flex-1 rounded-xl border border-paper-border bg-paper-card px-4 py-3 text-center text-sm font-bold active:bg-paper"
              >
                ← 上一章
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            <Link
              to="/"
              className="flex-1 rounded-xl border border-paper-border bg-paper-card px-4 py-3 text-center text-sm font-bold active:bg-paper"
            >
              目錄
            </Link>
            {nextDay ? (
              <Link
                to={`/day/${nextDay.id}`}
                className="flex-1 rounded-xl bg-seal px-4 py-3 text-center text-sm font-bold text-ink active:bg-seal-dark"
              >
                下一章 →
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-0 md:flex-1">
          <p className="mb-2 hidden text-xs font-bold tracking-wide text-ink-muted md:block">
            🗺️ 今日地圖
          </p>
          <div className="h-[320px] md:sticky md:top-16 md:h-[calc(100vh-8rem)]">
            <DayMap items={schedule} hotel={day.hotel} />
          </div>
        </div>
      </main>
    </div>
  )
}
