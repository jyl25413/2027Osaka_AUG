// Local overrides for day schedules, stored on-device (no GitHub sync).
// Keyed by day id: { [dayId]: [scheduleItem, ...] }
const KEY = 'osaka-itinerary-overrides-v1'

export function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(KEY, JSON.stringify(overrides))
}

export function hasOverride(dayId) {
  return !!loadOverrides()[dayId]
}

export function getDaySchedule(dayId, defaultSchedule) {
  return loadOverrides()[dayId] || defaultSchedule
}

export function setDaySchedule(dayId, schedule) {
  const overrides = loadOverrides()
  overrides[dayId] = schedule
  saveOverrides(overrides)
}

export function resetDaySchedule(dayId) {
  const overrides = loadOverrides()
  delete overrides[dayId]
  saveOverrides(overrides)
}

export function newScheduleItem() {
  return {
    time: '',
    type: 'transport',
    title: '',
    location: '',
    departTime: '',
    arriveTime: '',
    transport: '',
    note: '',
  }
}
