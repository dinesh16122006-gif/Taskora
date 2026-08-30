import React, { useState } from 'react'
import { Plus, Inbox } from 'lucide-react'
import TaskCard from './TaskCard'
import { updateTaskStatus, deleteTask } from '../services'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from './ConfirmDialog'

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Completed']

const columnConfig = {
  'To Do': { dot: 'bg-slate-400', header: 'text-slate-600', badge: 'bg-slate-100 text-slate-600' },
  'In Progress': { dot: 'bg-blue-500', header: 'text-blue-700', badge: 'bg-blue-50 text-blue-700' },
  Review: { dot: 'bg-amber-500', header: 'text-amber-700', badge: 'bg-amber-50 text-amber-700' },
  Completed: { dot: 'bg-emerald-500', header: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700' },
}

const KanbanBoard = ({ tasks, onEditTask, onAddTask, onTasksChange, canManage = true }) => {
  const toast = useToast()
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col)
    return acc
  }, {})

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task._id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = async (e, column) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData('text/plain')
    if (!taskId) return
    const task = tasks.find((t) => t._id === taskId)
    if (!task || task.status === column) return

    if (!canManage) {
      toast.info('You do not have permission to move tasks')
      return
    }

    try {
      const prevStatus = task.status
      // optimistic update
      const updatedTasks = tasks.map((t) =>
        t._id === taskId ? { ...t, status: column } : t
      )
      onTasksChange && onTasksChange(updatedTasks)
      await updateTaskStatus(taskId, column)
      toast.success(`Task moved to ${column}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move task')
      onTasksChange && onTasksChange(tasks)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTask(deleteTarget._id)
      toast.success('Task deleted')
      onTasksChange && onTasksChange(tasks.filter((t) => t._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[860px] gap-4">
        {COLUMNS.map((column) => {
          const config = columnConfig[column]
          const columnTasks = tasksByColumn[column]
          const colOver = dragOverColumn === column

          return (
            <div
              key={column}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverColumn(column)
              }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, column)}
              className={`flex h-full max-h-[70vh] min-w-[200px] flex-1 flex-col rounded-xl border-2 border-dashed p-3 transition-colors ${
                colOver ? 'border-primary-400 bg-primary-50/50' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                  <h3 className={`text-sm font-semibold ${config.header}`}>{column}</h3>
                  <span className={`badge ${config.badge}`}>{columnTasks.length}</span>
                </div>
                {canManage && onAddTask && column === 'To Do' && (
                  <button
                    onClick={() => onAddTask('To Do')}
                    className="rounded p-1 text-slate-400 hover:bg-white hover:text-primary-600"
                    title="Add task"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-slate-100 bg-white/50 py-8">
                    <Inbox className="mb-1 h-5 w-5 text-slate-300" />
                    <p className="text-xs text-slate-400">No tasks</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={canManage ? setDeleteTarget : null}
                      onDragStart={canManage ? handleDragStart : null}
                      onDrop={handleDrop}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  )
}

export default KanbanBoard
