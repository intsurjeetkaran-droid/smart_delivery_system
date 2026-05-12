import { useState, useCallback } from 'react'
import orderService from '../services/orderService'

export interface Order {
  _id: string
  customerName: string
  customerPhone: string
  pickupAddress: string
  deliveryAddress: string
  assignedDriver: string | null
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
  estimatedDeliveryTime: string
  createdAt: string
  updatedAt: string
}

const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (status?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await orderService.getOrders(status)
      setOrders(data.orders)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (orderData: {
    customerName: string
    customerPhone: string
    pickupAddress: string
    deliveryAddress: string
  }) => {
    const data = await orderService.createOrder(orderData)
    setOrders(prev => [data.order, ...prev])
    return data.order
  }, [])

  const updateStatus = useCallback(async (id: string, status: string) => {
    const data = await orderService.updateOrderStatus(id, status)
    setOrders(prev => prev.map(o => o._id === id ? data.order : o))
    return data.order
  }, [])

  const assignDriver = useCallback(async (id: string, driverId: string) => {
    const data = await orderService.assignDriver(id, driverId)
    setOrders(prev => prev.map(o => o._id === id ? data.order : o))
    return data.order
  }, [])

  return { orders, isLoading, error, fetchOrders, createOrder, updateStatus, assignDriver }
}

export default useOrders
