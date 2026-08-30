// Format a date to readable short format
export const formatDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return d.toLocaleDateString('en-US', options)
}

// Format to short date (e.g., Jan 5)
export const formatShortDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'
  const options = { month: 'short', day: 'numeric' }
  return d.toLocaleDateString('en-US', options)
}

// Relative time (e.g., "2 days ago")
export const timeAgo = (date) => {
  if (!date) return '—'
  const now = new Date()
  const past = new Date(date)
  const seconds = Math.floor((now - past) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

// Days until a date (negative if past)
export const daysUntil = (date) => {
  if (!date) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - now) / (1000 * 60 * 60 * 24))
}

// Check if a date is overdue (before today)
export const isOverdue = (date) => {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(date) < today
}

// Get initials from a name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Color for user avatars based on name
export const avatarColor = (name = '') => {
  const colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-rose-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Status badge colors
export const taskStatusColors = {
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  'Review': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
}

// Project status colors
export const projectStatusColors = {
  Planning: 'bg-indigo-50 text-indigo-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  'On Hold': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
}

// Priority colors
export const priorityColors = {
  Low: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-rose-50 text-rose-700',
}

// Priority dot color (solid)
export const priorityDotColors = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-rose-500',
}

// Task status to Tailwind column accent
export const taskStatusColumnColors = {
  'To Do': 'border-slate-200',
  'In Progress': 'border-blue-200',
  'Review': 'border-amber-200',
  Completed: 'border-emerald-200',
}
