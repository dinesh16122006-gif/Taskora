import React from 'react'
import {
  taskStatusColors,
  projectStatusColors,
  priorityColors,
  priorityDotColors,
} from '../utils/format'

export const StatusBadge = ({ type = 'task', value, dot = false }) => {
  let colors = 'bg-slate-100 text-slate-700'
  let dotColor = null

  if (type === 'task') {
    colors = taskStatusColors[value] || colors
  } else if (type === 'project') {
    colors = projectStatusColors[value] || colors
  } else if (type === 'priority') {
    colors = priorityColors[value] || colors
    dotColor = priorityDotColors[value]
  }

  return (
    <span className={`badge ${colors}`}>
      {dot && dotColor && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {value}
    </span>
  )
}

export default StatusBadge
