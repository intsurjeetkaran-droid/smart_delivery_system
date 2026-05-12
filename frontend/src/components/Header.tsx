import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Package, LogOut, User, Menu, X, Truck, LayoutDashboard, MapPin, Sun, Moon, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  // Role-based nav links
  const allLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, roles: ['customer', 'driver', 'admin'] },
    { to: '/orders',    label: 'Orders',    icon: <Package size={16} />,         roles: ['customer', 'driver', 'admin'] },
    { to: '/tracking',  label: 'Tracking',  icon: <MapPin size={16} />,          roles: ['customer', 'driver', 'admin'] },
  ]

  const navLinks = allLinks.filter(l => !user?.role || l.roles.includes(user.role))
  const isActive = (path: string) => location.pathname === path

  // Role badge color
  const roleBadge: Record<string, string> = {
    admin:    'bg-brand-500',
    driver:   'bg-indigo-500',
    customer: 'bg-emerald-500',
  }

  return (
    <header className="bg-navy-800 dark:bg-gray-950 text-white sticky top-0 z-40 shadow-lg border-b border-white/5 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">

          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">
              Smart<span className="text-brand-400">Delivery</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(link.to)
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  {link.icon}{link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* User badge — desktop */}
                <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-2.5 py-1.5 max-w-[160px]">
                  <div className={`w-6 h-6 ${roleBadge[user?.role || 'customer'] || 'bg-brand-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {user?.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                  </div>
                  <div className="text-xs min-w-0">
                    <div className="font-semibold leading-none truncate">{user?.name?.split(' ')[0]}</div>
                    <div className="text-white/60 capitalize mt-0.5">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline text-sm">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-400 rounded-xl transition-colors whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isAuthenticated && mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-800 dark:bg-gray-950 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}>
              {link.icon}{link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-3 py-2 mt-1 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 ${roleBadge[user?.role || 'customer'] || 'bg-brand-500'} rounded-full flex items-center justify-center`}>
                {user?.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
              </div>
              <span className="text-xs text-white/70 capitalize">{user?.name} · {user?.role}</span>
            </div>
            <button onClick={() => { handleLogout(); setMobileOpen(false) }}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
