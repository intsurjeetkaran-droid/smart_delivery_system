import api from '../utils/api'

export interface Stop {
  id: string
  lat: number
  lon: number
  address: string
}

export interface OptimizeResult {
  start: { lat: number; lon: number }
  orderedStops: Stop[]
  segments: { from: { lat: number; lon: number }; to: { lat: number; lon: number; address: string }; distanceKm: number }[]
  totalDistanceKm: number
  estimatedMinutes: number
  estimatedTimeFormatted: string
  totalStops: number
}

class RouteService {
  async optimizeRoute(start: { lat: number; lon: number }, stops: Stop[]) {
    const res = await api.post('/routes/optimize', { start, stops })
    return res.data as { success: boolean; result: OptimizeResult }
  }

  async calculateDistance(from: { lat: number; lon: number }, to: { lat: number; lon: number }) {
    const res = await api.post('/routes/distance', { from, to })
    return res.data
  }
}

export default new RouteService()
