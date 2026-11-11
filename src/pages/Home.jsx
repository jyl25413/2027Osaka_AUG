import { useState } from 'react'
import { Link } from 'react-router-dom'
import itinerary from '../data/itinerary.js'
import DayCard from '../components/DayCard.jsx'
import {
  hasPassword,
  setPassword,
  verifyPassword,
  useAdmin,
  setAdminSession,
} from '../lib/admin.js'

const CHAPTER_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八']

const APPENDIX = [
  { to: '/packing', icon: '🧳', title: '行李打包', desc: '隨身行李勾選表' },
  { to: '/transport', icon: '🚇', title: '地鐵', desc: '路線圖上傳・放大查看' },
  { to: '/spots', icon: '⭐', title: '收藏景點', desc: '分類整理・地圖直達' },
  { to: '/food', icon: '🍲', title: '美食', desc: '大阪必吃・參考店家' },
  { to: '/expenses', icon: '💰', title: '目前花費', desc: '旅費記帳' },
  { to: '/info', icon: '📇', title: '重要資訊', desc: '航班・證件・行李' },
  { to: '/phrases', icon: '📱', title: '日本旅遊小抄', desc: '支付・網路・交通・緊急電話' },
]

// Trip dates are Japan local time; en-CA formats as YYYY-MM-DD so it compares
// directly against day.date strings.
function todayInJapan() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date())
}

export default function Home() {
  const { trip, days } = itinerary
  const today = todayInJapan()
  const admin = useAdmin()
  const [showAdminBox, setShowAdminBox] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const needSetPw = !hasPassword()

  function handleAdminSubmit() {
    if (needSetPw) {
      if (pwInput.length < 4) {
        setAdminMsg('密碼至少 4 碼')
        return
      }
      if (pwInput !== pwConfirm) {
        setAdminMsg('兩次輸入不一致')
        return
      }
      setPassword(pwInput)
      setAdminSession(true)
      setShowAdminBox(false)
      setPwInput('')
      setPwConfirm('')
      setAdminMsg('')
    } else {
      if (verifyPassword(pwInput)) {
        setAdminSession(true)
        setShowAdminBox(false)
        setPwInput('')
        setAdminMsg('')
      } else {
        setAdminMsg('密碼錯誤')
      }
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md pb-12">
      {/* ── 封面 ── */}
      <header className="px-6 pb-8 pt-10">
        <div className="border-2 border-ink p-1.5">
          <div className="border border-ink/30 px-6 py-10 text-center">
            <p className="text-xs font-bold tracking-[0.6em] text-seal">旅行手冊</p>
            <p className="mt-1 text-[10px] tracking-[0.3em] text-ink-muted">
              TRAVEL HANDBOOK
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-snug">{trip.title}</h1>
            {trip.subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {trip.subtitle}
              </p>
            )}
            <div className="mx-auto mt-6 h-px w-16 bg-seal" />
            <p className="mt-4 text-sm font-medium">
              {trip.startDate} — {trip.endDate}
            </p>
            <p className="mt-1 text-xs text-ink-muted">共 {days.length} 天</p>
          </div>
        </div>
      </header>

      {/* ── 目錄 ── */}
      <main className="px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">每日行程</h2>
          <span className="text-[10px] tracking-[0.3em] text-ink-muted">ITINERARY</span>
        </div>

        <nav>
          {days.map((day, index) => {
            const isToday = day.date === today
            const isPast = day.date < today
            return (
              <DayCard
                key={day.id}
                day={day}
                index={index}
                isToday={isToday}
                isPast={isPast}
              />
            )
          })}
        </nav>

        <div className="mb-3 mt-8 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">附錄</h2>
          <span className="text-[10px] tracking-[0.3em] text-ink-muted">APPENDIX</span>
        </div>

        <nav className="grid grid-cols-2 gap-3">
          {APPENDIX.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="rounded-xl border border-paper-border bg-paper-card px-4 py-4 active:bg-paper"
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="mt-2 text-sm font-bold">{a.title}</div>
              <div className="mt-0.5 text-xs text-ink-muted">{a.desc}</div>
            </Link>
          ))}
        </nav>

        <p className="mt-10 text-center text-xs text-ink-muted">
          ― 祝旅途愉快 ―
        </p>

        {/* ── 管理員 ── */}
        <div className="mt-6 text-center">
          {admin ? (
            <button
              onClick={() => setAdminSession(false)}
              className="rounded-full border border-paper-border px-4 py-1.5 text-xs font-bold text-ink-muted"
            >
              🔓 管理員已登入・點此登出
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAdminBox((v) => !v)
                setAdminMsg('')
              }}
              className="text-xs text-ink-muted underline underline-offset-2"
            >
              🔒 管理員登入
            </button>
          )}
          {showAdminBox && !admin && (
            <div className="mx-auto mt-3 max-w-xs rounded-xl border border-paper-border bg-paper-card p-4 text-left">
              <p className="text-xs font-bold text-ink">
                {needSetPw ? '第一次使用，請設定管理員密碼' : '請輸入管理員密碼'}
              </p>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                placeholder="密碼"
                className="mt-2 w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
              />
              {needSetPw && (
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  placeholder="再輸入一次"
                  className="mt-2 w-full rounded-lg border border-paper-border bg-paper px-3 py-2 text-sm text-ink"
                />
              )}
              {adminMsg && <p className="mt-1 text-xs text-red-500">{adminMsg}</p>}
              <button
                onClick={handleAdminSubmit}
                className="mt-2 w-full rounded-lg bg-seal py-2 text-sm font-bold text-[#1b1b1d]"
              >
                {needSetPw ? '設定並登入' : '登入'}
              </button>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-muted">
                管理員可編輯行程、新增花費與景點、上傳路線圖；旅伴為檢視模式，只能看行程與勾選自己的打包清單。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
