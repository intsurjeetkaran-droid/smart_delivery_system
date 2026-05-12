import { useState, useEffect, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import trackingService from '../services/trackingService'

export interface TrackingPoint {
  _id: string
  orderId: string
  driverId: string
  latitude: number
  longitude: number
  status: string
  createdAt: string
}

const TRACKING_URL = 'http://localhost:5003'

const useTracking = (orderId?: string) => {
  const [history, setHistory] = useState<TrackingPoint[]>([])
  const [latest, setLatest] = useState<TrackingPoint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const fetchHistory = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const data = await trackingService.getTrackingHistory(id)
      setHistory(data.history)
      if (data.history.length > 0) {
        setLatest(data.history[data.history.length - 1])
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchLatest = useCallback(async (id: string) => {
    try {
      const data = await trackingService.getLatestLocation(id)
      setLatest(data.tracking)
    } catch {
      // no tracking yet
    }
  }, [])

  // Connect to Socket.IO for live updates
  useEffect(() => {
    if (!orderId) return

    fetchHistory(orderId)
    fetchLatest(orderId)

    const socket = io(TRACKING_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('receive-location', (data: any) => {
      if (data.orderId === orderId) {
        const point: TrackingPoint = {
          _id: Date.now().toString(),
          orderId: data.orderId,
          driverId: data.driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status || 'moving',
          createdAt: new Date().toISOString(),
        }
        setLatest(point)
        setHistory(prev => [...prev, point])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [orderId, fetchHistory, fetchLatest])

  return { history, latest, isLoading, isConnected, fetchHistory, fetchLatest }
}

export default useTracking
