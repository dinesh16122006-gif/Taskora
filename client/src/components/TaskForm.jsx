import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { Loader2 } from 'lucide-react'

const TASK_STATUSES = ['To Do', 'In Progress', 'Review', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

const initialForm = {
  title: '',
  description: '',
  assignedTo: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: '',
}

const TaskForm = ({ isOpen, onClose, onSubmit, task, project, members = [], title = 'Create Task', loading, defaultStatus = 'To Do' }) => {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title: task.title || '',
          description: task.description || '',
          assignedTo: task.assignedTo?._id || '',
          status: task.status || 'To Do',
          priority: task.priority || 'Medium',
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        })
      } else {
        setForm({ ...initialForm, status: defaultStatus || project?.defaultStatus || 'To Do' })
      }
      setError(null)
    }
  }, [isOpen, task, project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Task title is required.')
      return
    }
    onSubmit({
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (task ? 'Save Changes' : 'Create Task')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label">Task Title *</label>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="e.g. Implement login screen"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="input min-h-[90px] resize-y"
            placeholder="Add more details about this task..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">Assigned To</label>
          <select name="assignedTo" className="input" value={form.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Status</label>
            <select name="status" className="input" value={form.status} onChange={handleChange}>
              {TASK_STATUSES.map((s) => (
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

        <div>
          <label className="label">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="input"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  )
}

export default TaskForm
