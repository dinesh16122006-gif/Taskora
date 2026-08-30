import React, { useEffect, useState } from 'react'
import { CheckCircle2, ClipboardList, KeyRound, User as UserIcon, Mail } from 'lucide-react'
import { updateUser, changePassword, getTasks } from '../services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { PageLoader } from '../components/Spinner'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/Badge'
import StatCard from '../components/StatCard'
import Alert from '../components/Alert'
import { formatDate, isOverdue } from '../utils/format'

function Profile() {
  const { user, updateUser: updateContextUser } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)
  const [profileError, setProfileError] = useState(null)

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg, setPassMsg] = useState(null)
  const [passError, setPassError] = useState(null)

  const [assignedTasks, setAssignedTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email })
    }
  }, [user])

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return
      setTasksLoading(true)
      try {
        const res = await getTasks({ assignedTo: user._id })
        setAssignedTasks(res.data.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load your tasks')
      } finally {
        setTasksLoading(false)
      }
    }
    loadTasks()
  }, [user, toast])

  if (!user) {
    return <PageLoader />
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg(null)
    setProfileError(null)
    try {
      const res = await updateUser(user._id, { name: profile.name, email: profile.email })
      updateContextUser(res.data.data)
      setProfileMsg('Profile updated successfully!')
      toast.success('Profile updated!')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPassLoading(true)
    setPassMsg(null)
    setPassError(null)
    if (passwords.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      setPassLoading(false)
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError('Confirm password does not match.')
      setPassLoading(false)
      return
    }
    try {
      await changePassword(user._id, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      setPassMsg('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed!')
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  const overdue = assignedTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'Completed').length
  const completed = assignedTasks.filter((t) => t.status === 'Completed').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account information and security.</p>
      </div>

      {/* Overview */}
      <div className="card flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar user={user} size="xl" />
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
            <Mail className="h-4 w-4" /> {user.email}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-primary-50 px-3 py-0.5 text-xs font-semibold text-primary-700">
            {user.role === 'admin' ? 'Administrator' : 'Team Member'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Assigned Tasks" value={assignedTasks.length} accent="indigo" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} accent="emerald" />
        <div className="col-span-2 sm:col-span-1">
          <StatCard icon={ClipboardList} label="Overdue" value={overdue} accent="rose" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit profile */}
        <div className="card p-6">
          <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
            <UserIcon className="h-5 w-5 text-primary-600" /> Edit Profile
          </h3>
          {profileMsg && <div className="mb-4"><Alert type="info" message={profileMsg} onClose={() => setProfileMsg(null)} /></div>}
          {profileError && <div className="mb-4"><Alert type="error" message={profileError} onClose={() => setProfileError(null)} /></div>}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
            <KeyRound className="h-5 w-5 text-primary-600" /> Change Password
          </h3>
          {passMsg && <div className="mb-4"><Alert type="info" message={passMsg} onClose={() => setPassMsg(null)} /></div>}
          {passError && <div className="mb-4"><Alert type="error" message={passError} onClose={() => setPassError(null)} /></div>}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                className="input"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={passLoading}>
              {passLoading ? 'Changing...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Assigned tasks */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">My Assigned Tasks</h3>
          <span className="text-sm text-slate-400">{assignedTasks.length} total</span>
        </div>
        {tasksLoading ? (
          <PageLoader message="Loading your tasks..." />
        ) : assignedTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">You have no assigned tasks yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 pr-4 font-semibold">Task</th>
                  <th className="pb-3 pr-4 font-semibold">Project</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 pr-4 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {assignedTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed'
                  return (
                    <tr key={task._id} className="border-b border-slate-50">
                      <td className="py-3 pr-4 font-medium text-slate-800">{task.title}</td>
                      <td className="py-3 pr-4 text-sm text-slate-600">{task.project?.name}</td>
                      <td className="py-3 pr-4"><StatusBadge type="task" value={task.status} /></td>
                      <td className="py-3 pr-4"><StatusBadge type="priority" value={task.priority} dot /></td>
                      <td className={`py-3 text-sm ${overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}>
                        {formatDate(task.dueDate)}
                        {overdue && <span className="ml-1 text-xs text-red-500">(overdue)</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
