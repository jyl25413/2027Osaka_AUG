const CACHE_KEY = 'geocode-cache-v1'
const QUEUE_DELAY_MS = 1100

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // storage full or unavailable, ignore
  }
}

let queue = Promise.resolve()

function queueFetch(query) {
  const run = () =>
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((results) => {
        if (results && results[0]) {
          return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
        }
        return null
      })
      .catch(() => null)
      .then((result) => new Promise((resolve) => setTimeout(() => resolve(result), QUEUE_DELAY_MS)))

  queue = queue.then(run, run)
  return queue
}

export async function geocode(query) {
  if (!query) return null
  const cache = loadCache()
  if (query in cache) return cache[query]

  const result = await queueFetch(query)
  cache[query] = result
  saveCache(cache)
  return result
}
