import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Search, Package, MapPin, Phone, User,
  AlertCircle, RefreshCw, Truck, CheckCircle, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useOrders, { Order } from '../hooks/useOrders'
import { Header, Footer, Button, Input, Modal, StatusBadge } from '../components'
import { formatDate } from '../utils/helpers'

const STATUS_FILTERS = ['all', 'pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled']

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending:    ['assigned', 'cancelled'],
  assigned:   ['picked_up', 'cancelled'],
  picked_up:  ['in_transit'],
  in_transit: ['delivered'],
  delivered:  [],
  cancelled:  [],
}

// ── Create Order Modal ────────────────────────────────────────────────────────
interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => Promise<void>
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState({ customerName: '', customerPhone: '', pickupAddress: '', deliveryAddress: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onCreate(form)
      setForm({ customerName: '', customerPhone: '', pickupAddress: '', deliveryAddress: '' })
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Delivery Order" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Customer Name" placeholder="Rahul Sharma" value={form.customerName}
            onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))}
            icon={<User size={15} />} required />
          <Input label="Phone Number" placeholder="9876543210" value={form.customerPhone}
            onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))}
            icon={<Phone size={15} />} required />
        </div>
        <Input label="Pickup Address" placeholder="12 MG Road, Bangalore"
          value={form.pickupAddress}
          onChange={e => setForm(p => ({ ...p, pickupAddress: e.target.value }))}
          icon={<MapPin size={15} />} required />
        <Input label="Delivery Address" placeholder="45 Anna Salai, Chennai"
          value={form.deliveryAddress}
          onChange={e => setForm(p => ({ ...p, deliveryAddress: e.target.value }))}
          icon={<MapPin size={15} />} required />
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={loading}>Create Order</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Assign Driver Modal ───────────────────────────────────────────────────────
interface AssignDriverModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onAssign: (orderId: string, driverId: string) => Promise<void>
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, order, onAssign }) => {
  const [driverId, setDriverId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setError('')
    setLoading(true)
    try {
      await onAssign(order._id, driverId)
      setDriverId('')
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign driver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Driver" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500">
          Assigning driver to order for <strong>{order?.customerName}</strong>
        </p>
        <Input label="Driver ID" placeholder="driver_ravi_001" value={driverId}
          onChange={e => setDriverId(e.target.value)}
          icon={<Truck size={15} />} required />
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={loading}>Assign</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Order Card ────────────────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order
  role: string
  onStatusUpdate: (id: string, status: string) => void
  onAssignDriver: (order: Order) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, role, onStatusUpdate, onAssignDriver }) => {
  const transitions = STATUS_TRANSITIONS[order.status] || []
  const canAssign = role === 'admin' && order.status === 'pending'
  const canUpdateStatus = (role === 'admin' || role === 'driver') && transitions.length > 0

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-navy-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{order.customerName}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Phone size={11} /> {order.customerPhone}
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm">
          <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">PICKUP</div>
            <div className="text-gray-700">{order.pickupAddress}</div>
          </div>
        </div>
        <div className="ml-2.5 w-px h-4 bg-gray-200" />
        <div className="flex items-start gap-2 text-sm">
          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin size={11} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">DELIVERY</div>
            <div className="text-gray-700">{order.deliveryAddress}</div>
          </div>
        </div>
      </div>

      {order.assignedDriver && (
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 mb-4">
          <Truck size={14} className="text-blue-600" />
          <span className="text-xs text-blue-700 font-medium">Driver: {order.assignedDriver}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
        <div className="flex items-center gap-2">
          <Link
            to={`/tracking?orderId=${order._id}`}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <MapPin size={12} /> Track
          </Link>
          {canAssign && (
            <Button size="sm" variant="outline" onClick={() => onAssignDriver(order)}>
              <Truck size={13} /> Assign Driver
            </Button>
          )}
          {canUpdateStatus && transitions.map(s => (
            <Button key={s} size="sm" variant={s === 'cancelled' ? 'danger' : 'primary'}
              onClick={() => onStatusUpdate(order._id, s)}>
              {s === 'cancelled' ? <X size={13} /> : <CheckCircle size={13} />}
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const OrdersPage: React.FC = () => {
  const { user } = useAuth()
  const { orders, isLoading, error, fetchOrders, createOrder, updateStatus, assignDriver } = useOrders()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q || o.customerName.toLowerCase().includes(q) ||
      o.pickupAddress.toLowerCase().includes(q) || o.deliveryAddress.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await updateStatus(id, status) } catch { /* handled in hook */ }
  }

  const handleAssignDriver = async (orderId: string, driverId: string) => {
    await assignDriver(orderId, driverId)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => fetchOrders()}>
              <RefreshCw size={15} /> Refresh
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> New Order
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-navy-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="card flex items-center gap-3 text-red-500">
            <AlertCircle size={20} /> <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Package size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first order to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                role={user?.role || 'customer'}
                onStatusUpdate={handleStatusUpdate}
                onAssignDriver={o => { setSelectedOrder(o); setAssignOpen(true) }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <CreateOrderModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={createOrder} />
      <AssignDriverModal isOpen={assignOpen} onClose={() => setAssignOpen(false)}
        order={selectedOrder} onAssign={handleAssignDriver} />
    </div>
  )
}

export default OrdersPage
