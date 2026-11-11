// 2027 大阪之旅：每天按城市配色（雜誌風色帶＋大 DAY 數字）
// 版面走簡單清楚的旅行手冊風，不放照片背板。
const CITY_THEMES = [
  { key: '台北', from: '#3a6ea5', to: '#7fb0dd', solid: '#2f5c8a', soft: '#e9f2fb', photo: null },
  { key: '大阪', from: '#c25e3a', to: '#e09a7a', solid: '#a34a2c', soft: '#fdf0e9', photo: null },
]

const FALLBACK = { key: '', from: '#5b6470', to: '#8b95a1', solid: '#4e5761', soft: '#eef1f4', photo: null }

export function getDayTheme(cityStr = '') {
  const found = CITY_THEMES.find((c) => cityStr.includes(c.key))
  return found || FALLBACK
}
