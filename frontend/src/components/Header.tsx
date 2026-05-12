import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Package, LogOut, User, Menu, X, Truck, LayoutDashboard, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/orders', label: 'Orders', icon: <Package size={16} /> },
    { to: '/tracking', label: 'Tracking', icon: <MapPin size={16} /> },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-navy-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Smart<span className="text-brand-400">Delivery</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold leading-none">{user?.name}</div>
                    <div className="text-white/60 capitalize mt-0.5">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-400 rounded-xl transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isAuthenticated && mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-800 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
