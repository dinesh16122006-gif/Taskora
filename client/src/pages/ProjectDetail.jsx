import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Users,
  FolderKanban,
  ClipboardList,
  Activity as ActivityIcon,
  UserPlus,
} from 'lucide-react'
import { getProject, createTask, updateTask, deleteTask, updateProject, deleteProject } from '../services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { PageLoader } from '../components/Spinner'
import StatusBadge from '../components/Badge'
import ProgressBar from '../components/ProgressBar'
import Avatar from '../components/Avatar'
import KanbanBoard from '../components/KanbanBoard'
import TaskForm from '../components/TaskForm'
import ProjectForm from '../components/ProjectForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { formatDate, timeAgo, isOverdue } from '../utils/format'

function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskLoading, setTaskLoading] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState('To Do')

  const [showEditProject, setShowEditProject] = useState(false)
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(false)
  const [projectLoading, setProjectLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadProject = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProject(id)
      setProject(res.data.data)
      setTasks(res.data.data.tasks || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load project')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }, [id, toast, navigate])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  if (loading) {
    return <PageLoader message="Loading project..." />
  }

  if (!project) {
    return null
  }

  const isOwner = project.owner?._id === user?._id || project.owner === user?._id
  const canManage = isOwner || user?.role === 'admin'

  const members = [...(project.members || [])]
  if (project.owner && !members.some((m) => m._id === project.owner._id || (m._id && m._id === project.owner))) {
    members.unshift(project.owner)
  }

  const progress = project.progress || 0
  const year = new Date(project.createdAt || new Date()).getFullYear()

  const handleTaskSubmit = async (formData) => {
    setTaskLoading(true)
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, formData)
        setTasks((prev) => prev.map((t) => (t._id === res.data.data._id ? res.data.data : t)))
        toast.success('Task updated successfully!')
      } else {
        const res = await createTask({ ...formData, project: project._id })
        setTasks((prev) => [res.data.data, ...prev])
        toast.success('Task created successfully!')
      }
      setShowTaskForm(false)
      setEditingTask(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task')
    } finally {
      setTaskLoading(false)
    }
  }

  const handleEditProject = async (formData) => {
    setProjectLoading(true)
    try {
      const res = await updateProject(project._id, formData)
      setProject(res.data.data)
      toast.success('Project updated successfully!')
      setShowEditProject(false)
      loadProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project')
    } finally {
      setProjectLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    setDeleteLoading(true)
    try {
      await deleteProject(project._id)
      toast.success('Project deleted')
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project')
    } finally {
      setDeleteLoading(false)
    }
  }

  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'Completed')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/projects" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{project.name}</h1>
              <StatusBadge type="project" value={project.status} />
              <StatusBadge type="priority" value={project.priority} dot />
            </div>
            {project.description && (
              <p className="max-w-2xl text-sm text-slate-500">{project.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Start: {formatDate(project.startDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Deadline: {formatDate(project.deadline)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {members.length} members
              </span>
            </div>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setShowEditProject(true)}>
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button className="btn-danger" onClick={() => setDeleteProjectTarget(true)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress + overview */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Progress card */}
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Overall Progress</h3>
            <span className="text-2xl font-bold text-primary-600">{progress}%</span>
          </div>
          <ProgressBar progress={progress} size="lg" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">{project.taskStats?.completed || 0} completed</span>
            <span className="text-slate-500">{project.taskStats?.total || 0} total tasks</span>
          </div>
        </div>

        {/* Task stats */}
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Task Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">To Do</p>
              <p className="text-lg font-bold text-slate-800">{project.taskStats?.todo || 0}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-600">In Progress</p>
              <p className="text-lg font-bold text-blue-700">{project.taskStats?.inProgress || 0}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-600">Review</p>
              <p className="text-lg font-bold text-amber-700">{project.taskStats?.review || 0}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-600">Completed</p>
              <p className="text-lg font-bold text-emerald-700">{project.taskStats?.completed || 0}</p>
            </div>
          </div>
        </div>

        {/* Team members */}
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Team Members</h3>
            {canManage && (
              <button onClick={() => setShowEditProject(true)} className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                <UserPlus className="h-3.5 w-3.5" /> Manage
              </button>
            )}
          </div>
          {members.length === 0 ? (
            <p className="text-sm text-slate-400">No members yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {members.map((m) => (
                <div key={m._id} className="flex items-center gap-3">
                  <Avatar user={m} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">
                      {m.email}
                      {m._id === project.owner?._id || m._id === project.owner ? ' • Owner' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <ClipboardList className="h-4 w-4" />
            {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} on this project
          </p>
        </div>
      )}

      {/* Kanban board */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Task Board</h2>
          </div>
          {canManage && (
            <button
              onClick={() => { setEditingTask(null); setDefaultStatus('To Do'); setShowTaskForm(true) }}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" /> Add Task
            </button>
          )}
        </div>
        {tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No tasks yet"
            description="Add tasks to this project to start tracking progress."
            action={canManage ? (
              <button
                onClick={() => { setEditingTask(null); setDefaultStatus('To Do'); setShowTaskForm(true) }}
                className="btn-primary"
              >
                <Plus className="h-4 w-4" /> Add First Task
              </button>
            ) : null}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onTasksChange={setTasks}
            onEditTask={(task) => { setEditingTask(task); setShowTaskForm(true) }}
            onAddTask={(status) => { setEditingTask(null); setDefaultStatus(status); setShowTaskForm(true) }}
            canManage={canManage}
          />
        )}
      </div>

      {/* Activity log */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        </div>
        {(project.activities || []).length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">No activity yet</p>
        ) : (
          <div className="space-y-0">
            {(project.activities || []).map((activity, idx) => (
              <div key={activity._id} className="relative flex gap-4 pb-6">
                {idx < (project.activities.length - 1) && (
                  <span className="absolute left-[15px] top-8 h-full w-px bg-slate-200" />
                )}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{activity.user?.name}</span>{' '}
                    <span className="text-slate-500">· {activity.action}</span>
                  </p>
                  <p className="text-sm text-slate-500">{activity.description}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{timeAgo(activity.createdAt)} · {formatDate(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task form modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => { setShowTaskForm(false); setEditingTask(null) }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        project={project}
        members={members}
        title={editingTask ? 'Edit Task' : `Add Task to ${project.name}`}
        loading={taskLoading}
        defaultStatus={defaultStatus}
      />

      {/* Edit project modal */}
      {project && (
        <ProjectForm
          isOpen={showEditProject}
          onClose={() => setShowEditProject(false)}
          onSubmit={handleEditProject}
          project={project}
          title="Edit Project"
          loading={projectLoading}
        />
      )}

      {/* Delete project confirm */}
      <ConfirmDialog
        isOpen={deleteProjectTarget}
        onClose={() => setDeleteProjectTarget(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? All tasks and activity will be permanently removed.`}
        loading={deleteLoading}
      />
    </div>
  )
}

export default ProjectDetail
