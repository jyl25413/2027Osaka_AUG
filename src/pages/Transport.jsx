import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../lib/admin.js'

const STORAGE_KEY = 'osaka-transport-images-v1'

function loadImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function Lightbox({ image, onClose }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)

  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [image])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function onPointerDown(e) {
    dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
  }
  function onPointerMove(e) {
    if (!dragRef.current) return
    setOffset({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y })
  }
  function onPointerUp() {
    dragRef.current = null
  }

  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="truncate text-sm font-bold text-white">{image.name}</span>
        <button
          onClick={onClose}
          className="rounded-full bg-paper-card/20 px-3 py-1 text-sm font-bold text-white"
        >
          ✕ 關閉
        </button>
      </div>
      <div
        className="flex flex-1 touch-none items-center justify-center overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.dataUrl}
          alt={image.name}
          draggable={false}
          className="max-h-full max-w-full select-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        />
      </div>
      <div
        className="flex items-center justify-center gap-3 px-4 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setScale((s) => Math.max(1, +(s - 0.5).toFixed(1)))}
          className="rounded-full bg-paper-card/20 px-4 py-2 text-lg font-bold text-white"
        >
          −
        </button>
        <button
          onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }) }}
          className="rounded-full bg-paper-card/20 px-4 py-2 text-sm font-bold text-white"
        >
          重置
        </button>
        <button
          onClick={() => setScale((s) => Math.min(5, +(s + 0.5).toFixed(1)))}
          className="rounded-full bg-paper-card/20 px-4 py-2 text-lg font-bold text-white"
        >
          ＋
        </button>
      </div>
      <p className="pb-4 text-center text-xs text-white/60">拖曳移動・按＋−放大縮小</p>
    </div>
  )
}

export default function Transport() {
  const admin = useAdmin()
  const [images, setImages] = useState(loadImages)
  const [viewing, setViewing] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
    } catch {
      // storage full: keep in-memory only
    }
  }, [images])

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, dataUrl: reader.result },
        ])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function handleDelete(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-12">
      <header className="pt-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-seal">
          ← 目錄
        </Link>
        <h1 className="mt-2 text-xl font-bold">地鐵</h1>
        <p className="mt-0.5 text-xs tracking-[0.3em] text-ink-muted">TRANSPORT MAPS</p>
      </header>

      <a
        href="https://maps.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-between rounded-xl border border-paper-border bg-paper-card px-4 py-3.5 active:bg-paper"
      >
        <span>
          <span className="block text-sm font-bold">Google Maps（網頁版）</span>
          <span className="mt-0.5 block text-xs text-ink-muted">maps.google.com（開新視窗）・日本導航、地鐵路線查詢用這個</span>
        </span>
        <span className="text-ink-muted">→</span>
      </a>

      {admin && (
      <button
        onClick={() => fileRef.current?.click()}
        className="mt-3 w-full rounded-xl bg-seal py-3 text-sm font-bold text-ink active:bg-seal-dark"
      >
        ＋ 上傳路線圖圖片
      </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <p className="mt-2 text-xs text-ink-muted">
        可上傳地鐵路線圖截圖，點圖片可放大查看（存在這支手機上）
      </p>

      <main className="mt-5 grid grid-cols-2 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-xl border border-paper-border bg-paper-card"
          >
            <button onClick={() => setViewing(img)} className="block w-full">
              <img src={img.dataUrl} alt={img.name} className="aspect-square w-full object-cover" />
            </button>
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="truncate text-[11px] text-ink-muted">{img.name}</span>
              {admin && (
              <button
                onClick={() => handleDelete(img.id)}
                className="shrink-0 px-1 text-[11px] font-bold text-red-500"
              >
                刪除
              </button>
              )}
            </div>
          </div>
        ))}
      </main>

      {images.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          還沒有上傳任何路線圖
        </p>
      )}

      <Lightbox image={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}
