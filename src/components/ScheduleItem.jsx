import MapLink from './MapLink.jsx'
import { ICONS } from '../lib/icons.js'

// Speak Korean with Web Speech API. rate 1 = normal, 0.55 = slow.
function speak(text, rate = 1) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = rate
  const voices = window.speechSynthesis.getVoices()
  const ko = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ko'))
  if (ko) u.voice = ko
  window.speechSynthesis.speak(u)
}

export default function ScheduleItem({ item, isLast = false, mapNumber }) {
  const icon = ICONS[item.type] || '•'
  const peopleGroups =
    item.peopleGroups ||
    (item.people ? [{ title: item.peopleTitle, people: item.people, note: item.peopleNote }] : [])

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efe8d8] text-lg">
            {icon}
          </div>
          {mapNumber != null && (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-seal text-[10px] font-bold text-ink">
              {mapNumber}
            </div>
          )}
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-paper-border" />}
      </div>

      <div className="flex-1 pb-6">
        <div className="text-sm font-bold text-seal">{item.time}</div>
        <div className="mt-0.5 text-base font-bold text-ink">
          {item.mapQuery ? (
            <MapLink query={item.mapQuery} amapQuery={item.amapQuery}>
              {item.title}
            </MapLink>
          ) : (
            item.title
          )}
        </div>
        {item.location && (
          <div className="mt-1 text-sm text-ink-muted">{item.location}</div>
        )}
        {(item.departTime || item.arriveTime || item.transport) && (
          <div className="mt-1 text-sm font-medium text-ink">
            {item.departTime ? `${item.departTime} 出發` : ''}
            {item.departTime && item.arriveTime ? ' → ' : ''}
            {item.arriveTime ? `${item.arriveTime} 抵達` : ''}
            {item.transport ? ` · ${item.transport}` : ''}
          </div>
        )}
        {item.seat && (
          <div className="mt-1 text-base font-bold text-ink">座位/車廂：{item.seat}</div>
        )}
        {item.pnr && (
          <div className="mt-1 text-base font-bold text-ink">訂位代碼：{item.pnr}</div>
        )}
        {item.ticketNo && (
          <div className="mt-1 text-base font-bold text-ink">車票號碼：{item.ticketNo}</div>
        )}
        {item.note && (
          <div className="mt-1 text-sm leading-relaxed text-ink-muted">{item.note}</div>
        )}
        {item.warning && (
          <div className="mt-2 rounded-xl border-2 border-amber-400 bg-amber-50 p-3">
            <div className="mb-1 text-sm font-bold text-amber-800">⚠️ 注意事項</div>
            <div className="text-sm font-semibold leading-relaxed text-amber-900" style={{ whiteSpace: 'pre-line' }}>{item.warning}</div>
          </div>
        )}
        {peopleGroups.map((group, i) => (
          <div key={i} className="mt-2 rounded-xl bg-paper p-3">
            {group.title && (
              <div className="mb-1 text-xs font-bold text-ink">{group.title}</div>
            )}
            <ul className="space-y-1 text-sm text-ink">
              {group.people.map((p) => (
                <li key={p.nameKo} className="flex flex-wrap items-center gap-x-2">
                  <span className="font-medium">{p.nameKo}</span>
                  <button
                    onClick={() => speak(p.nameKo, 1)}
                    className="rounded-full bg-seal/10 px-2 py-0.5 text-xs font-medium text-seal active:bg-seal/20"
                    aria-label={`唸出 ${p.nameKo}`}
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => speak(p.nameKo, 0.55)}
                    className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink-muted active:bg-ink/10"
                    aria-label={`慢速唸出 ${p.nameKo}`}
                  >
                    🐢
                  </button>
                  {p.zhuyin && <span className="text-xs text-seal">{p.zhuyin}</span>}
                  {p.roman && <span className="text-xs text-ink-muted">{p.roman}</span>}
                  <span className="text-ink-muted">{p.name}</span>
                  {p.role && <span className="text-xs text-amber-600">{p.role}</span>}
                  {p.ig && (
                    <a
                      href={`https://www.instagram.com/${p.ig}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-seal underline"
                    >
                      @{p.ig}
                    </a>
                  )}
                  {p.igNote && <span className="text-xs text-ink-muted">{p.igNote}</span>}
                </li>
              ))}
            </ul>
            {group.note && <div className="mt-1 text-xs text-ink-muted">{group.note}</div>}
          </div>
        ))}
        {item.image && (
          <a href={item.image} target="_blank" rel="noopener noreferrer">
            <img
              src={item.image}
              alt={item.imageAlt || ''}
              className="mt-2 w-40 rounded-lg border border-paper-border"
            />
          </a>
        )}
        {item.qr && (
          <div className="mt-2 block w-full max-w-xs rounded-xl border border-paper-border bg-paper-card p-2">
            <img src={item.qr} alt="車票 QR 碼" className="w-full [image-rendering:pixelated]" />
            <div className="mt-1 text-center text-xs text-ink-muted">車票 QR 碼（剪票時出示）</div>
          </div>
        )}
      </div>
    </div>
  )
}
