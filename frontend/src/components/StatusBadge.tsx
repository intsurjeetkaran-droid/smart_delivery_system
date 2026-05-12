import React from 'react'

const config: Record<string, { label: string; classes: string; dot: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',     dot: 'bg-amber-400' },
  assigned:   { label: 'Assigned',   classes: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',           dot: 'bg-blue-400' },
  picked_up:  { label: 'Picked Up',  classes: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800', dot: 'bg-purple-400' },
  in_transit: { label: 'In Transit', classes: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-400' },
  delivered:  { label: 'Delivered',  classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-400' },
  cancelled:  { label: 'Cancelled',  classes: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',                 dot: 'bg-red-400' },
}

interface Props { status: string }

const StatusBadge: React.FC<Props> = ({ status }) => {
  const c = config[status] || {
    label: status,
    classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
  }
  return (
    <span className={`status-badge ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse-dot`} />
      {c.label}
    </span>
  )
}

export default StatusBadge
