import React from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Calendar, ArrowRight, Users } from 'lucide-react'
import ProgressBar from './ProgressBar'
import StatusBadge from './Badge'
import Avatar from './Avatar'
import { formatShortDate, isOverdue } from '../utils/format'

const ProjectCard = ({ project, onEdit, onDelete, canManage }) => {
  const overdue = isOverdue(project.deadline) && project.status !== 'Completed'
  const memberCount = (project.members?.length || 0) + (project.owner ? 1 : 0)

  return (
    <div className="card group flex flex-col p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100">
          <FolderKanban className="h-6 w-6 text-primary-600" />
        </div>
        <div className="flex items-center gap-1">
          {canManage && (
            <button
              onClick={() => onEdit && onEdit(project)}
              className="rounded p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
              title="Edit project"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
          )}
          {canManage && (
            <button
              onClick={() => onDelete && onDelete(project)}
              className="rounded p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
              title="Delete project"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          )}
        </div>
      </div>

      <Link to={`/projects/${project._id}`}>
        <h3 className="mb-1 text-lg font-semibold text-slate-900 hover:text-primary-700">{project.name}</h3>
      </Link>
      <p className="mb-4 line-clamp-2 text-sm text-slate-500">
        {project.description || 'No description provided.'}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge type="project" value={project.status} />
        <StatusBadge type="priority" value={project.priority} dot />
        {overdue && <StatusBadge type="task" value="Overdue" />}
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{project.progress}%</span>
        </div>
        <ProgressBar progress={project.progress} size="sm" />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-4 w-4" />
          <span className={overdue ? 'font-medium text-red-600' : ''}>{formatShortDate(project.deadline)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-4 w-4" />
            {memberCount > 0 && <span>{memberCount}</span>}
          </div>
          <Link
            to={`/projects/${project._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            View <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
