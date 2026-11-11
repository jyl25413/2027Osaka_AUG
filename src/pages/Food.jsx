import { Link } from 'react-router-dom'
import MapLink from '../components/MapLink.jsx'
import food from '../data/food.json'

function RestaurantCard({ r }) {
  return (
    <div className="rounded-2xl border border-paper-border bg-paper-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-ink">{r.name}</h3>
        <span className="shrink-0 text-xs font-medium text-brand-600">{r.nameZh}</span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">📍 {r.area}</p>
      {r.address && <p className="mt-0.5 text-xs text-ink-muted">{r.address}</p>}
      {r.phone && <p className="mt-0.5 text-xs text-ink-muted">📞 {r.phone}</p>}
      {r.hours && <p className="mt-0.5 text-xs text-ink-muted">🕐 {r.hours}</p>}
      {r.note && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{r.note}</p>}
      {r.dishes && (
        <ul className="mt-2 space-y-1 border-t border-paper-border pt-2">
          {r.dishes.map((d) => (
            <li key={d} className="text-sm leading-relaxed text-ink-muted">
              • {d}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2">
        <MapLink query={r.mapQuery} amapQuery={r.amapQuery}>
          在地圖開啟
        </MapLink>
      </div>
    </div>
  )
}

export default function Food() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10">
      <header className="sticky top-0 z-10 -mx-4 mb-6 bg-paper-card/90 px-4 pb-4 pt-6 backdrop-blur">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600"
        >
          ← 返回主頁
        </Link>
        <h1 className="mt-2 text-xl font-bold text-ink">大阪美食</h1>
        <p className="mt-1 text-sm text-ink-muted">OSAKA FOOD・大阪必吃參考店家</p>
      </header>

      <main className="space-y-8">
        {food.sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-1 text-base font-bold text-ink">{section.title}</h2>
            {section.source && (
              <p className="mb-3 text-xs text-ink-muted">{section.source}</p>
            )}
            <div className="space-y-3">
              {section.restaurants.map((r) => (
                <RestaurantCard key={r.name} r={r} />
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-base font-bold text-ink">💡 吃飯小提醒</h2>
          <div className="rounded-2xl border border-paper-border bg-paper-card p-4 shadow-sm">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
              {food.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>

        <Link
          to="/"
          className="flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-[#1b1b1d] active:bg-brand-700"
        >
          ← 返回主頁
        </Link>
      </main>
    </div>
  )
}
