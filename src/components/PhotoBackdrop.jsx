import { useState } from 'react'

export default function PhotoBackdrop({ src, from, to }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <>
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 400ms' }}
      />
      {loaded && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(135deg, ${from}e6, ${to}b3)` }}
        />
      )}
    </>
  )
}
