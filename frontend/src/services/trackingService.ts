import api from '../utils/api'

class TrackingService {
  async getTrackingHistory(orderId: string) {
    const res = await api.get(`/tracking/${orderId}`)
    return res.data
  }

  async getLatestLocation(orderId: string) {
    const res = await api.get(`/tracking/${orderId}/latest`)
    return res.data
  }

  async saveLocation(data: {
    orderId: string
    driverId: string
    latitude: number
    longitude: number
    status?: string
  }) {
    const res = await api.post('/tracking', data)
    return res.data
  }
}

export default new TrackingService()
