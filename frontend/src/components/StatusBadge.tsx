import React from 'react'

const config: Record<string, { label: string; classes: string; dot: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400' },
  assigned:   { label: 'Assigned',   classes: 'bg-blue-50 text-blue-700 border border-blue-200',      dot: 'bg-blue-400' },
  picked_up:  { label: 'Picked Up',  classes: 'bg-purple-50 text-purple-700 border border-purple-200', dot: 'bg-purple-400' },
  in_transit: { label: 'In Transit', classes: 'bg-indigo-50 text-indigo-700 border border-indigo-200', dot: 'bg-indigo-400' },
  delivered:  { label: 'Delivered',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  cancelled:  { label: 'Cancelled',  classes: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-400' },
}

interface Props { status: string }

const StatusBadge: React.FC<Props> = ({ status }) => {
  const c = config[status] || { label: status, classes: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' }
  return (
    <span className={`status-badge ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse-dot`} />
      {c.label}
    </span>
  )
}

export default StatusBadge
