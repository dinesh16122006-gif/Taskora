import React from 'react'
import { Calendar, GripVertical, Trash2, Pencil } from 'lucide-react'
import { formatShortDate, isOverdue, getInitials, avatarColor, priorityDotColors, taskStatusColumnColors, taskStatusColors } from '../utils/format'
import Avatar from './Avatar'

const TaskCard = ({ task, onEdit, onDelete, onDragStart, onDragOver, onDrop, draggable = true }) => {
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed'
  const priorityColor = priorityDotColors[task.priority] || 'bg-slate-400'
  const statusColor = taskStatusColors[task.status] || 'bg-slate-100 text-slate-700'

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onDragOver={(e) => onDragOver && onDragOver(e, task)}
      onDrop={(e) => onDrop && onDrop(e, task)}
      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-all duration-150 hover:border-primary-300 hover:shadow-card-hover active:cursor-grabbing"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`badge ${statusColor}`}>{task.status}</span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task) }}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task) }}
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <h4 className="mb-1 text-sm font-semibold text-slate-800">{task.title}</h4>
      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <span className={`h-2 w-2 rounded-full ${priorityColor}`} />
            {task.priority}
            <GripVertical className="ml-1 h-3.5 w-3.5 text-slate-300" />
          </span>
        </div>
        {task.assignedTo && <Avatar user={task.assignedTo} size="sm" />}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`flex items-center gap-1 text-xs ${
            overdue ? 'font-medium text-red-600' : 'text-slate-500'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          {formatShortDate(task.dueDate)}
        </span>
      </div>
    </div>
  )
}

export default TaskCard
