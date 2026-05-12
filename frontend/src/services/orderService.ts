import api from '../utils/api'

class OrderService {
  async getOrders(status?: string) {
    const params = status ? { status } : {}
    const res = await api.get('/orders', { params })
    return res.data
  }

  async getOrderById(id: string) {
    const res = await api.get(`/orders/${id}`)
    return res.data
  }

  async createOrder(orderData: {
    customerName: string
    customerPhone: string
    pickupAddress: string
    deliveryAddress: string
  }) {
    const res = await api.post('/orders', orderData)
    return res.data
  }

  async updateOrderStatus(id: string, status: string) {
    const res = await api.patch(`/orders/${id}/status`, { status })
    return res.data
  }

  async assignDriver(id: string, driverId: string) {
    const res = await api.patch(`/orders/${id}/assign`, { driverId })
    return res.data
  }
}

export default new OrderService()
