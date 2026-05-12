import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, MapPin, BarChart3, Users, Zap, Bell, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: <MapPin size={22} />,
    title: 'Route Optimization',
    desc: 'Nearest-neighbour TSP algorithm calculates the most efficient multi-stop delivery routes with real ETA.',
    color: 'text-brand-600', bg: 'bg-brand-50',
  },
  {
    icon: <Truck size={22} />,
    title: 'Real-Time Tracking',
    desc: 'Live GPS updates via Socket.IO. Customers see their driver move on the map as it happens.',
    color: 'text-indigo-600', bg: 'bg-indigo-50',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Order Dashboard',
    desc: 'Full order lifecycle management — from placement to delivery with status tracking at every step.',
    color: 'text-emerald-600', bg: 'bg-emerald-50',
  },
  {
    icon: <Users size={22} />,
    title: 'Role-Based Access',
    desc: 'Separate flows for customers, drivers, and admins. Each role sees exactly what they need.',
    color: 'text-purple-600', bg: 'bg-purple-50',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Assignment',
    desc: 'Admins assign drivers to orders in one click. Status auto-updates across the platform.',
    color: 'text-amber-600', bg: 'bg-amber-50',
  },
  {
    icon: <Bell size={22} />,
    title: 'Notifications',
    desc: 'Email alerts for order updates, delivery confirmations, and important status changes.',
    color: 'text-rose-600', bg: 'bg-rose-50',
  },
]

const stats = [
  { value: '6', label: 'Microservices', sub: 'Independent & scalable' },
  { value: '48', label: 'Tests Passing', sub: 'Full integration coverage' },
  { value: '3', label: 'User Roles', sub: 'Customer · Driver · Admin' },
  { value: '100%', label: 'Real-Time', sub: 'Socket.IO powered' },
]

const steps = [
  { n: '01', title: 'Register & Login', desc: 'Create an account as a customer, driver, or admin and get your JWT token.' },
  { n: '02', title: 'Place an Order', desc: 'Submit pickup and delivery addresses. Order is created instantly in the system.' },
  { n: '03', title: 'Optimize Route', desc: 'Admin runs the TSP algorithm to find the most efficient delivery sequence.' },
  { n: '04', title: 'Assign & Track', desc: 'Driver is assigned, picks up the order, and streams live GPS to the customer.' },
]

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-white">
    {/* Nav */}
    <nav className="bg-navy-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Truck size={18} />
          </div>
          <span className="font-bold text-lg">Smart<span className="text-brand-400">Delivery</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
            Login
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-brand-500 hover:bg-brand-400 px-4 py-2 rounded-xl transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8">
          <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          Microservices · Real-Time · Route Optimization
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
          Smart Delivery &<br />
          <span className="text-brand-400">Route Optimization</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          A full-stack microservices platform for intelligent delivery management —
          real-time GPS tracking, TSP route optimization, and role-based order control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg text-base">
            Start for Free <ArrowRight size={18} />
          </Link>
          <Link to="/login"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
            Sign In
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-navy-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-extrabold text-brand-400 mb-1">{s.value}</div>
            <div className="text-sm font-semibold text-white">{s.label}</div>
            <div className="text-xs text-white/50 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Built on a microservices architecture with 6 independent services, each handling a specific domain.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow">
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                <span className={f.color}>{f.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          <p className="text-gray-500">From order placement to delivery in four steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-200 z-0" style={{ width: 'calc(100% - 3rem)', left: '3rem' }} />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-500 text-white rounded-2xl flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                  {s.n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-gradient-to-br from-brand-500 to-brand-700">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-brand-100 mb-8 text-lg">
          Create your account and start managing deliveries in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-base">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 text-brand-100 text-sm">
          {['No credit card required', 'All roles included', 'Real-time tracking'].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle size={14} /> {t}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-navy-900 text-white/50 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
            <Truck size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Smart<span className="text-brand-400">Delivery</span></span>
        </div>
        <p className="text-xs text-center">© 2026 Smart Delivery & Route Optimization System. All rights reserved.</p>
      </div>
    </footer>
  </div>
)

export default HomePage
