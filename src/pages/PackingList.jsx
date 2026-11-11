import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import packingList from '../data/packingList.json'

const STORAGE_KEY = 'shanghai-packing-checked-v2'
// 格式：{ 人名: { 'g0-c0-i0': true } }，每人的勾選各自獨立、互不影響
const DEFAULT_PERSON = '我'

function loadAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    // 相容舊版單人格式 packing-checked
    if (Object.keys(raw).length === 0) {
      try {
        const legacy = JSON.parse(localStorage.getItem('shanghai-packing-checked')) || {}
        if (Object.keys(legacy).length > 0) return { [DEFAULT_PERSON]: legacy }
      } catch {
        /* ignore */
      }
    }
    return raw
  } catch {
    return {}
  }
}

export default function PackingList() {
  const [all, setAll] = useState(loadAll)
  const [person, setPerson] = useState(DEFAULT_PERSON)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  }, [all])

  const checked = all[person] || {}

  const { totalItems, checkedCount } = useMemo(() => {
    let total = 0
    packingList.groups.forEach((g) => {
      g.categories.forEach((cat) => {
        total += cat.items.length
      })
    })
    const done = Object.values(checked).filter(Boolean).length
    return { totalItems: total, checkedCount: done }
  }, [checked])

  function toggle(id) {
    setAll((prev) => ({
      ...prev,
      [person]: { ...(prev[person] || {}), [id]: !(prev[person] || {})[id] },
    }))
  }

  function handleReset() {
    setAll((prev) => ({ ...prev, [person]: {} }))
  }

  function addPerson() {
    const name = newName.trim()
    if (!name) return
    setAll((prev) => (prev[name] ? prev : { ...prev, [name]: {} }))
    setPerson(name)
    setNewName('')
  }

  const people = Object.keys(all)
  if (!people.includes(person)) people.unshift(person)

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-12">
      <header className="sticky top-0 z-10 -mx-5 mb-6 border-b border-paper-border bg-paper/95 px-5 pb-4 pt-6 backdrop-blur">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-seal"
        >
          ← 目錄
        </Link>
        <h1 className="mt-2 text-xl font-bold">物品清單</h1>
        <p className="mt-0.5 text-xs tracking-[0.3em] text-ink-muted">PACKING LIST</p>

        {/* 旅伴各自勾選 */}
        <div className="mt-3">
          <p className="text-xs text-ink-muted">我是…（每人的勾選各自獨立）</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {people.map((p) => (
              <button
                key={p}
                onClick={() => setPerson(p)}
                className={
                  p === person
                    ? 'rounded-full bg-seal px-3 py-1.5 text-xs font-bold text-[#1b1b1d]'
                    : 'rounded-full border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-bold text-ink-muted'
                }
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="新增旅伴名字"
              className="min-w-0 flex-1 rounded-lg border border-paper-border bg-paper-card px-3 py-1.5 text-sm text-ink"
            />
            <button
              onClick={addPerson}
              className="shrink-0 rounded-lg border border-paper-border bg-paper-card px-3 py-1.5 text-sm font-bold text-ink"
            >
              加入
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            {person}：已勾選 {checkedCount} / {totalItems}
          </p>
          <button
            onClick={handleReset}
            className="rounded-lg border border-paper-border bg-paper-card px-3 py-1 text-xs font-bold text-ink-muted active:bg-paper"
          >
            重新檢查
          </button>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-border">
          <div
            className="h-full bg-seal transition-all"
            style={{
              width: totalItems ? `${(checkedCount / totalItems) * 100}%` : '0%',
            }}
          />
        </div>
      </header>

      <main className="space-y-6">
        {packingList.groups.map((group, gi) => (
          <section key={group.name}>
            <h2 className="mb-2 text-base font-bold text-ink">
              {gi === 0 ? '🎒' : gi === 1 ? '🧳' : '✅'} {group.name}
            </h2>
            <div className="space-y-4">
              {group.categories.map((category, ci) => (
                <div
                  key={category.name}
                  className="rounded-xl border border-paper-border bg-paper-card p-4"
                >
                  <h3 className="mb-2 text-sm font-bold text-seal">
                    {category.name}
                  </h3>
                  <ul className="divide-y divide-paper-border">
                    {category.items.map((item, ii) => {
                      const id = `g${gi}-c${ci}-i${ii}`
                      const isChecked = !!checked[id]
                      return (
                        <li key={id}>
                          <label className="flex cursor-pointer items-center gap-3 py-2.5 active:bg-paper">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggle(id)}
                              className="h-5 w-5 shrink-0 accent-[#d8d8d8]"
                            />
                            <span
                              className={
                                isChecked
                                  ? 'text-base text-ink-muted line-through'
                                  : 'text-base text-ink'
                              }
                            >
                              {item}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        <Link
          to="/"
          className="mt-2 flex items-center justify-center rounded-xl border border-paper-border bg-paper-card py-3 text-sm font-bold active:bg-paper"
        >
          ← 回目錄
        </Link>
      </main>
    </div>
  )
}
