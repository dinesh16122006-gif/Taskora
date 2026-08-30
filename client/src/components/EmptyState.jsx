import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
        <Icon className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="mb-5 max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}

export default EmptyState
