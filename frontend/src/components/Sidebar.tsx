import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, LayoutDashboard, Package, MapPin } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/orders',    label: 'Orders',    icon: <Package size={18} /> },
  { to: '/tracking',  label: 'Tracking',  icon: <MapPin size={18} /> },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-64 bg-navy-800 text-white h-full p-4 flex flex-col gap-2 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"><X size={18} /></button>
        </div>
        {links.map(l => (
          <Link key={l.to} to={l.to} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === l.to ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}>
            {l.icon}{l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
