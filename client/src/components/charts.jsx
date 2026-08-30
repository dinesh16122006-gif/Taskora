import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

export const statusColors = {
  'To Do': '#94a3b8',
  'In Progress': '#3b64f6',
  Review: '#f59e0b',
  Completed: '#10b981',
}

export const priorityColors = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f43f5e',
}

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 13,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

// Donut chart for tasks by status
export const StatusPieChart = ({ data, height = 220 }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={statusColors[entry.name] || '#cbd5e1'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Donut chart for tasks by priority
export const PriorityPieChart = ({ data, height = 220 }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={priorityColors[entry.name] || '#cbd5e1'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Progress bar chart (reusable)
export const ProjectCompletionBar = ({ data, height = 260 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="progress" name="Progress (%)" radius={[4, 4, 0, 0]} fill="#3b64f6" maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Simple horizontal bar for bridging bars in cards
export const MiniBar = ({ color = 'bg-primary-500', width = '100%' }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <div className={`h-full rounded-full ${color}`} style={{ width }} />
  </div>
)
