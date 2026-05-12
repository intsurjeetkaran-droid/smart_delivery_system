import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Truck, CheckCircle, Clock, Plus, ArrowRight,
  MapPin, AlertCircle, Shield, Users, Route, Navigation,
  ListChecks,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useOrders, { Order } from '../hooks/useOrders'
import { Header, Footer, StatusBadge } from '../components'
import { formatDate } from '../utils/helpers'

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: number | string
  icon: React.ReactNode; colorClass: string; bgClass: string
}
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass, bgClass }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className={colorClass}>{icon}</span>
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</div>
    </div>
  </div>
)

// ── Quick Action Card ─────────────────────────────────────────────────────────
interface ActionCardProps { to: string; icon: React.ReactNode; title: string; desc: string; iconBg: string; iconColor: string; hoverColor: string }
const ActionCard: React.FC<ActionCardProps> = ({ to, icon, title, desc, iconBg, iconColor, hoverColor }) => (
  <Link to={to} className="card hover:shadow-card-hover transition-all duration-200 group flex items-center gap-4">
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div className="min-w-0 flex-1">
      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{desc}</div>
    </div>
    <ArrowRight size={16} className={`text-gray-300 dark:text-gray-600 flex-shrink-0 group-hover:${hoverColor} transition-colors`} />
  </Link>
)

// ── Recent Orders List ────────────────────────────────────────────────────────
const RecentOrders: React.FC<{ orders: Order[]; isLoading: boolean; error: string | null }> = ({ orders, isLoading, error }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h2>
      <Link to="/orders" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium flex items-center gap-1 whitespace-nowrap">
        View all <ArrowRight size={14} />
      </Link>
    </div>
    {isLoading ? (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
      </div>
    ) : error ? (
      <div className="flex items-center gap-2 text-red-500 text-sm py-4">
        <AlertCircle size={16} /> {error}
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center py-10">
        <Package size={36} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet</p>
        <Link to="/orders" className="text-brand-600 dark:text-brand-400 text-sm font-medium mt-2 inline-block hover:underline">
          Place your first order →
        </Link>
      </div>
    ) : (
      <div className="space-y-1">
        {orders.map((order: Order) => (
          <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group">
            <div className="w-8 h-8 bg-navy-50 dark:bg-navy-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={14} className="text-navy-600 dark:text-navy-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">{order.customerName}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{order.deliveryAddress}</div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{formatDate(order.createdAt)}</div>
              <Link to={`/tracking?orderId=${order._id}`}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                Track →
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

// ── Role Dashboards ───────────────────────────────────────────────────────────

const AdminDashboard: React.FC<{ orders: Order[]; isLoading: boolean; error: string | null; name: string }> = ({ orders, isLoading, error, name }) => {
  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    inTransit: orders.filter(o => ['in_transit', 'picked_up', 'assigned'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">Admin Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome, <span className="text-brand-600 dark:text-brand-400">{name}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Full platform control</p>
        </div>
        <Link to="/orders" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap">
          <Plus size={15} /> New Order
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Orders"  value={stats.total}     icon={<Package size={20} />}    colorClass="text-navy-600 dark:text-navy-300"    bgClass="bg-navy-100 dark:bg-navy-900/40" />
        <StatCard label="Pending"       value={stats.pending}   icon={<Clock size={20} />}       colorClass="text-amber-600 dark:text-amber-400"   bgClass="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard label="Active"        value={stats.inTransit} icon={<Truck size={20} />}       colorClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard label="Delivered"     value={stats.delivered} icon={<CheckCircle size={20} />} colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-900/30" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ActionCard to="/orders"   icon={<ListChecks size={18} />} title="Manage Orders"   desc="Assign drivers, update statuses" iconBg="bg-brand-50 dark:bg-brand-900/30"   iconColor="text-brand-600 dark:text-brand-400"   hoverColor="text-brand-500" />
        <ActionCard to="/tracking" icon={<Navigation size={18} />} title="Live Tracking"   desc="Monitor all driver locations"   iconBg="bg-indigo-50 dark:bg-indigo-900/30" iconColor="text-indigo-600 dark:text-indigo-400" hoverColor="text-indigo-500" />
        <ActionCard to="/tracking" icon={<Route size={18} />}      title="Route Optimizer" desc="Plan efficient delivery routes"  iconBg="bg-emerald-50 dark:bg-emerald-900/30" iconColor="text-emerald-600 dark:text-emerald-400" hoverColor="text-emerald-500" />
        <ActionCard to="/orders"   icon={<Users size={18} />}      title="Driver Assignment" desc="Assign pending orders to drivers" iconBg="bg-purple-50 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" hoverColor="text-purple-500" />
      </div>

      <RecentOrders orders={orders.slice(0, 5)} isLoading={isLoading} error={error} />
    </>
  )
}

const DriverDashboard: React.FC<{ orders: Order[]; isLoading: boolean; error: string | null; name: string }> = ({ orders, isLoading, error, name }) => {
  const myOrders = orders.filter(o => ['assigned', 'picked_up', 'in_transit'].includes(o.status))
  const delivered = orders.filter(o => o.status === 'delivered').length
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Truck size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Driver Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hey, <span className="text-indigo-600 dark:text-indigo-400">{name}</span> 🚚
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Your active deliveries</p>
        </div>
        <Link to="/tracking" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap">
          <MapPin size={15} /> Open Map
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Active Orders"  value={myOrders.length} icon={<Truck size={20} />}       colorClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard label="Delivered Today" value={delivered}       icon={<CheckCircle size={20} />} colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-900/30" />
        <StatCard label="Total Assigned"  value={orders.length}   icon={<Package size={20} />}    colorClass="text-navy-600 dark:text-navy-300"    bgClass="bg-navy-100 dark:bg-navy-900/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ActionCard to="/orders"   icon={<ListChecks size={18} />} title="My Orders"     desc="View and update delivery status" iconBg="bg-indigo-50 dark:bg-indigo-900/30" iconColor="text-indigo-600 dark:text-indigo-400" hoverColor="text-indigo-500" />
        <ActionCard to="/tracking" icon={<Navigation size={18} />} title="Live Map"      desc="See your route and location"     iconBg="bg-brand-50 dark:bg-brand-900/30"   iconColor="text-brand-600 dark:text-brand-400"   hoverColor="text-brand-500" />
      </div>

      {/* Active orders highlight */}
      {myOrders.length > 0 && (
        <div className="card mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Active Deliveries
          </h2>
          <div className="space-y-2">
            {myOrders.map(order => (
              <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40">
                <Truck size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.customerName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{order.deliveryAddress}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <Link to="/orders" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap">Update →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RecentOrders orders={orders.slice(0, 5)} isLoading={isLoading} error={error} />
    </>
  )
}

const CustomerDashboard: React.FC<{ orders: Order[]; isLoading: boolean; error: string | null; name: string }> = ({ orders, isLoading, error, name }) => {
  const active = orders.filter(o => ['assigned', 'picked_up', 'in_transit'].includes(o.status))
  const delivered = orders.filter(o => o.status === 'delivered').length
  const pending = orders.filter(o => o.status === 'pending').length
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Package size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">My Deliveries</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hi, <span className="text-emerald-600 dark:text-emerald-400">{name}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Track your orders in real time</p>
        </div>
        <Link to="/orders" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap">
          <Plus size={15} /> New Order
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Active"    value={active.length} icon={<Truck size={20} />}       colorClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard label="Pending"   value={pending}       icon={<Clock size={20} />}        colorClass="text-amber-600 dark:text-amber-400"   bgClass="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard label="Delivered" value={delivered}     icon={<CheckCircle size={20} />}  colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-900/30" />
      </div>

      {/* Active order highlight */}
      {active.length > 0 && (
        <div className="card mb-4 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">On the way</h2>
          </div>
          <div className="space-y-2">
            {active.slice(0, 2).map(order => (
              <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20">
                <MapPin size={16} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.deliveryAddress}</div>
                  <StatusBadge status={order.status} />
                </div>
                <Link to={`/tracking?orderId=${order._id}`}
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex-shrink-0 whitespace-nowrap">
                  Track Live →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ActionCard to="/orders"   icon={<Package size={18} />}   title="My Orders"    desc="View all your delivery orders"   iconBg="bg-brand-50 dark:bg-brand-900/30"   iconColor="text-brand-600 dark:text-brand-400"   hoverColor="text-brand-500" />
        <ActionCard to="/tracking" icon={<Navigation size={18} />} title="Track Order"  desc="See your driver on the live map" iconBg="bg-indigo-50 dark:bg-indigo-900/30" iconColor="text-indigo-600 dark:text-indigo-400" hoverColor="text-indigo-500" />
      </div>

      <RecentOrders orders={orders.slice(0, 5)} isLoading={isLoading} error={error} />
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { orders, isLoading, error, fetchOrders } = useOrders()

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {user?.role === 'admin' && (
          <AdminDashboard orders={orders} isLoading={isLoading} error={error} name={firstName} />
        )}
        {user?.role === 'driver' && (
          <DriverDashboard orders={orders} isLoading={isLoading} error={error} name={firstName} />
        )}
        {(user?.role === 'customer' || !user?.role) && (
          <CustomerDashboard orders={orders} isLoading={isLoading} error={error} name={firstName} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage
