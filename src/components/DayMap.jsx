import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { geocode } from '../lib/geocode.js'

function numberedIcon(label, color) {
  return L.divIcon({
    html: `<div style="background:${color};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4)">${label}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })
}

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15)
      return
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [32, 32] })
  }, [points, map])
  return null
}

export default function DayMap({ items, hotel }) {
  const [points, setPoints] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function run() {
      setStatus('loading')
      const results = []

      if (hotel) {
        const query = hotel.mapQuery || hotel.name
        const pos = await geocode(query)
        if (pos) results.push({ ...pos, label: '🏨', color: '#2f59b3', title: hotel.name })
      }

      let stopIndex = 0
      for (const item of items) {
        const query = item.mapQuery || item.location
        if (!query) continue
        stopIndex += 1
        const pos = await geocode(query)
        if (pos) {
          results.push({
            ...pos,
            label: String(stopIndex),
            color: '#e0793c',
            title: item.title,
            time: item.time,
          })
        }
      }

      if (!cancelled) {
        setPoints(results)
        setStatus(results.length > 0 ? 'ready' : 'empty')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [items, hotel])

  if (status === 'loading' && points.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-paper-border bg-paper-card text-sm text-ink-muted">
        地圖載入中…
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-paper-border bg-paper-card text-sm text-ink-muted">
        今日行程沒有可定位的地點
      </div>
    )
  }

  return (
    <div className="h-full min-h-[240px] overflow-hidden rounded-2xl border border-paper-border shadow-sm">
      <MapContainer
        center={points[0] ? [points[0].lat, points[0].lng] : [0, 0]}
        zoom={13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', minHeight: 240 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={numberedIcon(p.label, p.color)}>
            <Popup>
              {p.time && <div className="text-xs text-ink-muted">{p.time}</div>}
              <div className="font-medium">{p.title}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
