import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Search, FolderKanban, ChevronDown, Check } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject } from '../services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { PageLoader } from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const STATUSES = ['', 'Planning', 'In Progress', 'On Hold', 'Completed']
const PRIORITIES = ['', 'Low', 'Medium', 'High']

const FilterSelect = ({ value, onChange, options, placeholder, optionLabels }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input cursor-pointer appearance-none pr-8"
    >
      <option value={options[0]}>{placeholder}</option>
      {options.slice(1).map((opt) => (
        <option key={opt} value={opt}>{optionLabels?.[opt] || opt}</option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  </div>
)

function Projects() {
  const { user } = useAuth()
  const toast = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (priorityFilter) params.priority = priorityFilter
      const res = await getProjects(params)
      setProjects(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, priorityFilter, toast])

  useEffect(() => {
    const timer = setTimeout(() => loadProjects(), 300)
    return () => clearTimeout(timer)
  }, [loadProjects])

  const handleCreate = async (formData) => {
    setSubmitLoading(true)
    try {
      const res = await createProject(formData)
      setProjects((prev) => [res.data.data, ...prev])
      toast.success('Project created successfully!')
      setShowCreate(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEdit = async (formData) => {
    setSubmitLoading(true)
    try {
      const res = await updateProject(editingProject._id, formData)
      setProjects((prev) => prev.map((p) => (p._id === res.data.data._id ? res.data.data : p)))
      toast.success('Project updated successfully!')
      setEditingProject(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return
    setDeleteLoading(true)
    try {
      await deleteProject(deletingProject._id)
      setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id))
      toast.success('Project deleted')
      setDeletingProject(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project')
    } finally {
      setDeleteLoading(false)
    }
  }

  const canManage = (project) => project.owner?._id === user?._id || project.owner === user?._id || user?.role === 'admin'

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPriorityFilter('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all your projects in one place.</p>
        </div>
        <button onClick={() => { setEditingProject(null); setShowCreate(true) }} className="btn-primary">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUSES}
            placeholder="All Statuses"
          />
          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITIES}
            placeholder="All Priorities"
          />
          {(search || statusFilter || priorityFilter) && (
            <button onClick={resetFilters} className="btn-ghost px-3 text-sm">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <PageLoader message="Loading projects..." />
      ) : projects.length === 0 ? (
        (search || statusFilter || priorityFilter) ? (
          <EmptyState
            icon={Search}
            title="No projects match your filters"
            description="Try adjusting your search or filter criteria."
            action={<button onClick={resetFilters} className="btn-secondary">Clear Filters</button>}
          />
        ) : (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start organizing your work."
            action={
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                <Plus className="h-4 w-4" /> Create Project
              </button>
            }
          />
        )
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              canManage={canManage(project)}
              onEdit={() => { setEditingProject(project); setShowCreate(true) }}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectForm
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setEditingProject(null) }}
        onSubmit={editingProject ? handleEdit : handleCreate}
        project={editingProject}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        loading={submitLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All associated tasks and activity will also be removed. This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Projects
