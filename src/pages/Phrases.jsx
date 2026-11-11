import { useState } from 'react'
import { Link } from 'react-router-dom'
import phrases from '../data/phrases.json'

export default function Phrases() {
  // The card currently shown full-screen (e.g. to show an address to a driver).
  const [shown, setShown] = useState(null)

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10">
      <header className="sticky top-0 z-10 -mx-4 mb-6 bg-paper-card/90 px-4 pb-4 pt-6 backdrop-blur">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600"
        >
          ← 返回主頁
        </Link>
        <h1 className="mt-2 text-xl font-bold text-ink">日本旅遊小抄</h1>
        <p className="mt-1 text-sm text-ink-muted">點一下卡片放大給對方看（例如地址拿給司機）</p>
      </header>

      <main className="space-y-6">
        {phrases.categories.map((cat) => (
          <section key={cat.name}>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">{cat.name}</h2>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <button
                  key={item.title}
                  onClick={() => setShown(item)}
                  className="block w-full rounded-2xl border border-paper-border bg-paper-card p-4 text-left shadow-sm active:bg-paper-card"
                >
                  <p className="text-base font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>
        ))}

        <Link
          to="/"
          className="mt-2 flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-[#1b1b1d] active:bg-brand-700"
        >
          ← 返回主頁
        </Link>
      </main>

      {shown && (
        <button
          onClick={() => setShown(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper-card px-6 text-center"
        >
          <p className="whitespace-pre-line text-3xl font-bold leading-snug text-ink">
            {shown.title}
          </p>
          <p className="mt-6 text-xl leading-relaxed text-ink-muted">{shown.desc}</p>
          <p className="mt-10 text-xs text-ink-muted">點一下關閉</p>
        </button>
      )}
    </div>
  )
}
