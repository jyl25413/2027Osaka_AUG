import { Link } from 'react-router-dom'
import { getDayTheme } from '../lib/theme.js'
import { ICONS } from '../lib/icons.js'
import PhotoBackdrop from './PhotoBackdrop.jsx'

export default function DayCard({ day, index, isToday = false, isPast = false }) {
  const theme = getDayTheme(day.city)
  const dayNum = String(index + 1).padStart(2, '0')
  const typeIcons = [...new Set(day.schedule.map((s) => s.type))].map(
    (t) => ICONS[t] || '•'
  )

  return (
    <Link
      to={`/day/${day.id}`}
      className={`group mb-4 block overflow-hidden rounded-2xl border bg-paper-card shadow-sm transition-transform active:scale-[0.99] ${
        isToday ? 'border-brand-600 ring-2 ring-brand-600/40' : 'border-paper-border'
      } ${isPast ? 'opacity-60' : ''}`}
    >
      <div
        className="relative flex items-center gap-3 overflow-hidden px-4 py-3"
        style={{ backgroundImage: `linear-gradient(120deg, ${theme.from}, ${theme.to})` }}
      >
        <PhotoBackdrop src={theme.photo} from={theme.from} to={theme.to} />
        <span className="relative font-serif text-2xl font-bold leading-none text-white">
          {dayNum}
        </span>
        <div className="relative min-w-0 flex-1 text-white">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-white/80">
            {day.date}（{day.weekday}）
            {isToday && (
              <span className="rounded-full bg-paper-card px-2 py-0.5 text-[10px] font-bold text-brand-600">
                今天
              </span>
            )}
            {isPast && (
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold text-white">
                已結束
              </span>
            )}
          </div>
          <div className="truncate text-base font-bold">{day.city}</div>
        </div>
        <span className="relative shrink-0 text-white/80 transition-transform group-active:translate-x-0.5">
          →
        </span>
      </div>

      <div className="px-4 py-3">
        <p className="text-sm text-ink-muted">{day.summary}</p>
        {typeIcons.length > 0 && (
          <div className="mt-2 flex gap-1.5 text-base">
            {typeIcons.map((ic, i) => (
              <span key={i}>{ic}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
