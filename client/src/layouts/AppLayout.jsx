import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  User,
  Menu,
  X,
  CheckSquare,
  Bell,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getNotifications, markAllNotificationsRead } from '../services'
import Avatar from '../components/Avatar'
import { timeAgo } from '../utils/format'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
]

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500 shadow-sm">
        <CheckSquare className="h-5 w-5 text-white" />
      </div>
      {!compact && (
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Task<span className="text-primary-600">Flow</span>
        </span>
      )}
    </div>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        <p className="px-3 pt-6 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <User className="h-5 w-5" />
          My Profile
        </NavLink>
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

function NotificationsBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const res = await getNotifications()
          setNotifications(res.data.data)
          setUnread(res.data.unread)
        } catch {
          // ignore
        }
      }
    }
    fetchNotifications()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead()
      setUnread(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {
      // ignore
    }
  }

  const typeIcon = {
    deadline: 'bg-amber-100 text-amber-600',
    overdue: 'bg-red-100 text-red-600',
    assignment: 'bg-indigo-100 text-indigo-600',
    update: 'bg-blue-100 text-blue-600',
    system: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-xs font-medium text-primary-600 hover:text-primary-700">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 ${
                    n.read ? 'opacity-60' : ''
                  }`}
                >
                  <span
                    className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${
                      n.read ? 'bg-slate-200' : (typeIcon[n.type] || typeIcon.system).split(' ')[1]
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{n.message}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TopBar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold text-slate-900">
          Task<span className="text-primary-600">Flow</span>
        </span>
      </div>
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-slate-800">Workspace</h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsBell />
        <div className="ml-1 hidden items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 sm:flex">
          <Avatar user={user} size="sm" />
          <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0]}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  )
}

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 animate-slide-up">
            <div className="relative h-full bg-white">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-h-screen w-full flex-col md:pl-64">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export { AppLayout as default, Logo }
