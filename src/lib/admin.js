import { useEffect, useState } from 'react'

// 管理員編輯模式（本機版）：
// - 預設為旅伴檢視模式，編輯按鈕隱藏
// - 管理員用密碼解鎖（session 有效，關分頁即失效）
// - 密碼雜湊存 localStorage（僅防君子不防小人；真正的跨裝置同步待 Cloudflare 後端）
const PW_KEY = 'shanghai-admin-pw'
const SESSION_KEY = 'shanghai-admin'

function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return 'h' + h.toString(36)
}

export function hasPassword() {
  try {
    return !!localStorage.getItem(PW_KEY)
  } catch {
    return false
  }
}

export function setPassword(pw) {
  try {
    localStorage.setItem(PW_KEY, hash(pw))
  } catch {
    /* ignore */
  }
}

export function verifyPassword(pw) {
  try {
    return localStorage.getItem(PW_KEY) === hash(pw)
  } catch {
    return false
  }
}

export function isAdmin() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function setAdminSession(on) {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, '1')
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('yunnan-admin-change'))
}

export function useAdmin() {
  const [admin, setAdminState] = useState(isAdmin)
  useEffect(() => {
    const handler = () => setAdminState(isAdmin())
    window.addEventListener('yunnan-admin-change', handler)
    return () => window.removeEventListener('yunnan-admin-change', handler)
  }, [])
  return admin
}
