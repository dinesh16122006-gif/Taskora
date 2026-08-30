import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  FolderCheck,
  PlayCircle,
  CheckCircle2,
  ListTodo,
  CalendarX2,
  CalendarClock,
  ArrowRight,
  AlertTriangle,
  Users,
} from 'lucide-react'
import { getDashboard } from '../services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StatCard from '../components/StatCard'
import { StatusPieChart, PriorityPieChart, ProjectCompletionBar } from '../components/charts'
import ProgressBar from '../components/ProgressBar'
import Avatar from '../components/Avatar'
import { PageLoader } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/Badge'
import { formatDate, formatShortDate, isOverdue, timeAgo } from '../utils/format'

function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getDashboard()
      setData(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) {
    return <PageLoader message="Loading your dashboard..." />
  }

  if (!data) {
    return <EmptyState title="No data available" description="Something went wrong loading your dashboard." />
  }

  const { stats, tasksByStatus, tasksByPriority, recentProjects, recentTasks, upcomingDeadlines } = data

  const projectCompletionData = recentProjects.map((p) => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    progress: p.progress || 0,
  }))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {greeting}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening across your projects today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7 lg:gap-5">
        <div className="col-span-1">
          <StatCard icon={FolderKanban} label="Projects" value={stats.totalProjects} accent="blue" />
        </div>
        <div className="col-span-1">
          <StatCard icon={PlayCircle} label="Active" value={stats.activeProjects} accent="indigo" />
        </div>
        <div className="col-span-1">
          <StatCard icon={FolderCheck} label="Completed" value={stats.completedProjects} accent="emerald" />
        </div>
        <div className="col-span-1">
          <StatCard icon={ListTodo} label="Tasks" value={stats.totalTasks} accent="rose" />
        </div>
        <div className="col-span-1">
          <StatCard icon={AlertTriangle} label="Pending" value={stats.pendingTasks} accent="amber" />
        </div>
        <div className="col-span-1">
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completedTasks} accent="emerald" />
        </div>
        <div className="col-span-1">
          <StatCard icon={CalendarX2} label="Overdue" value={stats.overdueTasks} accent="rose" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-800">Tasks by Status</h3>
          <StatusPieChart data={tasksByStatus} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-800">Tasks by Priority</h3>
          <PriorityPieChart data={tasksByPriority} />
        </div>
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">Project Completion</h3>
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
              {stats.taskCompletion}% overall
            </span>
          </div>
          <ProjectCompletionBar data={projectCompletionData} />
        </div>
      </div>

      {/* Recent projects + upcoming deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent projects */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">Recent Projects</h3>
            <Link to="/projects" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to get started."
              action={
                <Link to="/projects" className="btn-primary">Create Project</Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-indigo-100">
                      <FolderKanban className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{project.name}</p>
                      <p className="text-xs text-slate-400">{timeAgo(project.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden w-24 sm:block">
                      <ProgressBar progress={project.progress} size="sm" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{project.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              Upcoming Deadlines
            </h3>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="All caught up!"
              description="No upcoming or overdue tasks."
            />
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => {
                const overdue = isOverdue(task.dueDate)
                const days = Math.round((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <div
                    key={task._id}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                      overdue ? 'border-red-200 bg-red-50/50' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-2 w-2 shrink-0 rounded-full ${overdue ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-semibold ${overdue ? 'text-red-700' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {task.project?.name} • {task.assignedTo?.name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xs font-semibold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {overdue ? `${Math.abs(days)}d overdue` : formatShortDate(task.dueDate)}
                      </p>
                      <StatusBadge type="task" value={task.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent tasks */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
          <span className="text-sm text-slate-400">Latest {recentTasks.length} tasks</span>
        </div>
        {recentTasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="Create tasks within your projects to see activity here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 pr-4 font-semibold">Task</th>
                  <th className="pb-3 pr-4 font-semibold">Project</th>
                  <th className="pb-3 pr-4 font-semibold">Assignee</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 pr-4 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-medium text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-400">{timeAgo(task.createdAt)}</p>
                    </td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{task.project?.name}</td>
                    <td className="py-3 pr-4">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar user={task.assignedTo} size="sm" />
                          <span className="text-sm text-slate-600">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 pr-4"><StatusBadge type="task" value={task.status} /></td>
                    <td className="py-3 pr-4"><StatusBadge type="priority" value={task.priority} dot /></td>
                    <td className="py-3 text-sm text-slate-600">{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
