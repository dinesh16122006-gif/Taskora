import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { Loader2, UserPlus, X } from 'lucide-react'
import { getUsers } from '../services'
import Avatar from './Avatar'

const STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

const initialForm = {
  name: '',
  description: '',
  startDate: '',
  deadline: '',
  status: 'Planning',
  priority: 'Medium',
  members: [],
}

const ProjectForm = ({ isOpen, onClose, onSubmit, project, title = 'Create Project', loading }) => {
  const [form, setForm] = useState(initialForm)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [selectedMembers, setSelectedMembers] = useState([])

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setForm({
          name: project.name || '',
          description: project.description || '',
          startDate: project.startDate ? project.startDate.slice(0, 10) : '',
          deadline: project.deadline ? project.deadline.slice(0, 10) : '',
          status: project.status || 'Planning',
          priority: project.priority || 'Medium',
          members: project.members?.map((m) => m._id) || [],
        })
        setSelectedMembers(project.members?.map((m) => m) || [])
      } else {
        setForm(initialForm)
        setSelectedMembers([])
      }
      setError(null)
      loadUsers()
    }
  }, [isOpen, project])

  const loadUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data.data)
    } catch (e) {
      setUsers([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError(null)
  }

  const toggleMember = (user) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m._id === user._id)) {
        return prev.filter((m) => m._id !== user._id)
      }
      return [...prev, user]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Project name is required.')
      return
    }
    if (form.startDate && form.deadline && new Date(form.startDate) > new Date(form.deadline)) {
      setError('Start date cannot be after the deadline.')
      return
    }
    onSubmit({
      name: form.name,
      description: form.description,
      startDate: form.startDate || undefined,
      deadline: form.deadline || undefined,
      status: form.status,
      priority: form.priority,
      members: selectedMembers.map((m) => m._id),
    })
  }

  const availableUsers = users.filter(
    (u) => !selectedMembers.some((m) => m._id === u._id)
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (project ? 'Save Changes' : 'Create Project')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label">Project Name *</label>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="e.g. Mobile App Development"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="input min-h-[100px] resize-y"
            placeholder="Describe the project goals and scope..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="input"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              name="deadline"
              className="input"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Status</label>
            <select name="status" className="input" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select name="priority" className="input" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team members */}
        <div>
          <label className="label flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-slate-400" />
            Team Members
          </label>
          {selectedMembers.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedMembers.map((m) => (
                <span
                  key={m._id}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 py-1 pl-1 pr-2 text-sm"
                >
                  <Avatar user={m} size="sm" />
                  <span className="font-medium text-slate-700">{m.name}</span>
                  <button type="button" onClick={() => toggleMember(m)} className="text-slate-400 hover:text-red-500">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200">
            {availableUsers.length === 0 && users.length === 0 ? (
              <p className="p-3 text-sm text-slate-400">No users available</p>
            ) : availableUsers.length === 0 ? (
              <p className="p-3 text-sm text-slate-400">All users added</p>
            ) : (
              availableUsers.map((u) => (
                <button
                  type="button"
                  key={u._id}
                  onClick={() => toggleMember(u)}
                  className="flex w-full items-center gap-3 border-b border-slate-50 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50"
                >
                  <Avatar user={u} size="sm" />
                  <span className="font-medium text-slate-700">{u.name}</span>
                  <span className="text-xs text-slate-400">{u.email}</span>
                  <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 hover:bg-primary-50 hover:text-primary-600">
                    Add
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ProjectForm
