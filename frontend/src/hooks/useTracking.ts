import { useState, useEffect } from 'react'

interface Location {
  lat: number
  lng: number
}

interface TrackingData {
  orderId: string
  driverId: string
  currentLocation: Location
  status: string
  estimatedArrival: string
}

// TODO: Implement useTracking hook for delivery tracking
const useTracking = (orderId?: string) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // TODO: Implement fetchTracking function

  return {
    trackingData,
    isLoading,
    fetchTracking: () => {}
  }
}

export default useTracking