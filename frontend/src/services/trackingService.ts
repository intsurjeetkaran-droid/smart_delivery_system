import api from '../utils/api'
import { API_ENDPOINTS } from '../utils/constants'

// TODO: Implement TrackingService class with tracking methods
class TrackingService {
  async getTracking(orderId: string) {
    // TODO: Implement get tracking API call
  }

  async updateLocation(orderId: string, location: { lat: number; lng: number }) {
    // TODO: Implement update location API call
  }

  async getRoute(orderId: string) {
    // TODO: Implement get route API call
  }

  async updateDeliveryStatus(orderId: string, status: string) {
    // TODO: Implement update delivery status API call
  }
}

export default new TrackingService()