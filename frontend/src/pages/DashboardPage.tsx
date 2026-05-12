import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, Plus, ArrowRight, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useOrders, { Order } from '../hooks/useOrders'
import { Header, Footer, StatusBadge } from '../components'
import { formatDate } from '../utils/helpers'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
  bg: string
  darkBg: string
  darkColor: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, bg, darkBg, darkColor }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${bg} ${darkBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className={`${color} ${darkColor}`}>{icon}</span>
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  </div>
)

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { orders, isLoading, error, fetchOrders } = useOrders()

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    inTransit: orders.filter(o => o.status === 'in_transit' || o.status === 'picked_up').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  const recent = [...orders].slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Good day, <span className="text-brand-600 dark:text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm capitalize">
              {user?.role} dashboard · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus size={16} /> New Order
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Orders"  value={stats.total}     icon={<Package size={22} />}    color="text-navy-600"    bg="bg-navy-100"    darkBg="dark:bg-navy-900/40"    darkColor="dark:text-navy-300" />
          <StatCard label="Pending"       value={stats.pending}   icon={<Clock size={22} />}       color="text-amber-600"   bg="bg-amber-50"    darkBg="dark:bg-amber-900/30"   darkColor="dark:text-amber-400" />
          <StatCard label="In Transit"    value={stats.inTransit} icon={<Truck size={22} />}       color="text-indigo-600"  bg="bg-indigo-50"   darkBg="dark:bg-indigo-900/30"  darkColor="dark:text-indigo-400" />
          <StatCard label="Delivered"     value={stats.delivered} icon={<CheckCircle size={22} />} color="text-emerald-600" bg="bg-emerald-50"  darkBg="dark:bg-emerald-900/30" darkColor="dark:text-emerald-400" />
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500 text-sm py-4">
              <AlertCircle size={16} /> {error}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet</p>
              <Link to="/orders" className="text-brand-600 dark:text-brand-400 text-sm font-medium mt-2 inline-block hover:underline">
                Place your first order →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((order: Order) => (
                <div key={order._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group">
                  <div className="w-9 h-9 bg-navy-50 dark:bg-navy-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-navy-600 dark:text-navy-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.customerName}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      <MapPin size={11} />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400 dark:text-gray-500">{formatDate(order.createdAt)}</div>
                    <Link
                      to={`/tracking?orderId=${order._id}`}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline mt-0.5 block opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Track →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions for admin */}
        {user?.role === 'admin' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/orders" className="card hover:shadow-card-hover transition-shadow group flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                <Package size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Manage Orders</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Assign drivers, update statuses</div>
              </div>
              <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 ml-auto group-hover:text-brand-500 transition-colors" />
            </Link>
            <Link to="/tracking" className="card hover:shadow-card-hover transition-shadow group flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                <MapPin size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Live Tracking</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Monitor driver locations</div>
              </div>
              <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 ml-auto group-hover:text-indigo-500 transition-colors" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default DashboardPage
