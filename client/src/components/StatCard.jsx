import React from 'react'

const accentStyles = {
  blue: { iconBg: 'bg-blue-50', icon: 'text-blue-600', bar: 'bg-blue-500' },
  indigo: { iconBg: 'bg-indigo-50', icon: 'text-indigo-600', bar: 'bg-indigo-500' },
  emerald: { iconBg: 'bg-emerald-50', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  amber: { iconBg: 'bg-amber-50', icon: 'text-amber-600', bar: 'bg-amber-500' },
  rose: { iconBg: 'bg-rose-50', icon: 'text-rose-600', bar: 'bg-rose-500' },
}

const StatCard = ({ icon: Icon, label, value, accent = 'blue', sub }) => {
  const style = accentStyles[accent] || accentStyles.blue
  return (
    <div className="card group relative overflow-hidden p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.iconBg}`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${style.bar}`} />
    </div>
  )
}

export default StatCard
