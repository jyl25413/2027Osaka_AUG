import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// iOS home-screen apps are resumed rather than reloaded, so the service worker
// rarely checks for a new version on its own. Check whenever the app comes back
// to the foreground; autoUpdate then reloads the page with the new version.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') registration.update()
    })
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
