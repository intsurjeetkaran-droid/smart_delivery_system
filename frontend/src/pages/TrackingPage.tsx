import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Search, Wifi, WifiOff, Navigation, Clock, Package, AlertCircle, Route } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Header, Footer, Button, Input } from '../components'
import useTracking from '../hooks/useTracking'
import routeService, { Stop } from '../services/routeService'
import { formatDate } from '../utils/helpers'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const MapPanner: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap()
  useEffect(() => { map.setView([lat, lon], map.getZoom()) }, [lat, lon, map])
  return null
}

// ── Route Optimizer Panel ─────────────────────────────────────────────────────
const RouteOptimizer: React.FC = () => {
  const [startLat, setStartLat] = useState('28.6139')
  const [startLon, setStartLon] = useState('77.2090')
  const [stopsText, setStopsText] = useState(
    '28.7041,77.1025,Connaught Place Delhi\n28.5355,77.3910,Noida Sector 18\n28.4595,77.0266,Gurgaon Cyber City'
  )
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOptimize = async () => {
    setError(''); setLoading(true)
    try {
      const stops: Stop[] = stopsText.trim().split('\n').map((line, i) => {
        const parts = line.split(',')
        return { id: `stop_${i}`, lat: parseFloat(parts[0]), lon: parseFloat(parts[1]), address: parts.slice(2).join(',').trim() || `Stop ${i + 1}` }
      })
      const data = await routeService.optimizeRoute({ lat: parseFloat(startLat), lon: parseFloat(startLon) }, stops)
      setResult(data.result)
    } catch (err: any) { setError(err.response?.data?.message || 'Optimization failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
          <Route size={16} className="text-brand-600 dark:text-brand-400" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Route Optimizer</h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Input label="Start Lat" value={startLat} onChange={e => setStartLat(e.target.value)} placeholder="28.6139" />
          <Input label="Start Lon" value={startLon} onChange={e => setStartLon(e.target.value)} placeholder="77.2090" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Stops <span className="text-gray-400 dark:text-gray-500 font-normal">(lat,lon,address — one per line)</span>
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none transition-colors"
            rows={4}
            value={stopsText}
            onChange={e => setStopsText(e.target.value)}
          />
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
        <Button onClick={handleOptimize} loading={loading} className="w-full">
          <Route size={15} /> Optimize Route
        </Button>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-50 dark:bg-brand-900/30 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-brand-700 dark:text-brand-400">{result.totalDistanceKm} km</div>
              <div className="text-xs text-brand-600 dark:text-brand-500">Total Distance</div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{result.estimatedTimeFormatted}</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-500">Estimated ETA</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Optimized Order</div>
            <div className="space-y-1.5">
              {result.orderedStops.map((stop: Stop, i: number) => (
                <div key={stop.id} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-gray-700 dark:text-gray-300 truncate">{stop.address}</span>
                  {i < result.segments.length && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">{result.segments[i].distanceKm}km</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '')
  const [activeOrderId, setActiveOrderId] = useState(searchParams.get('orderId') || '')
  const { history, latest, isLoading, isConnected } = useTracking(activeOrderId || undefined)

  const handleTrack = () => { setActiveOrderId(orderId) }
  const polylinePoints: [number, number][] = history.map(p => [p.latitude, p.longitude])
  const defaultCenter: [number, number] = latest ? [latest.latitude, latest.longitude] : [28.6139, 77.2090]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Tracking</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Real-time driver location and route history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="space-y-5">
            {/* Search */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">Track an Order</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter Order ID" value={orderId}
                  onChange={e => setOrderId(e.target.value)} icon={<Package size={15} />} />
                <Button onClick={handleTrack} size="md"><Search size={15} /></Button>
              </div>
            </div>

            {/* Status */}
            {activeOrderId && (
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Tracking Status</h3>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
                    {isConnected ? 'Live' : 'Offline'}
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                  </div>
                ) : latest ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 flex items-center gap-3">
                      <Navigation size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Current Position</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {latest.latitude.toFixed(4)}, {latest.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                        <div className="text-gray-400 dark:text-gray-500">Driver</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300 truncate">{latest.driverId}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                        <div className="text-gray-400 dark:text-gray-500">Points</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{history.length}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Clock size={11} /> Last update: {formatDate(latest.createdAt)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">No tracking data yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Route history */}
            {history.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
                  Route History <span className="text-gray-400 dark:text-gray-500 font-normal">({history.length} points)</span>
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {[...history].reverse().slice(0, 20).map((p) => (
                    <div key={p._id} className="flex items-center gap-2 text-xs py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <div className="w-4 h-4 bg-brand-100 dark:bg-brand-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">{p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}</span>
                      <span className="text-gray-300 dark:text-gray-600 ml-auto">{new Date(p.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <RouteOptimizer />
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden h-[500px] lg:h-[600px]">
              <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polylinePoints.length > 1 && (
                  <Polyline positions={polylinePoints} color="#f97316" weight={3} opacity={0.8} dashArray="6,4" />
                )}
                {latest && (
                  <Marker position={[latest.latitude, latest.longitude]} icon={driverIcon}>
                    <Popup>
                      <div className="text-sm">
                        <strong>Driver: {latest.driverId}</strong><br />
                        Lat: {latest.latitude.toFixed(5)}<br />
                        Lon: {latest.longitude.toFixed(5)}<br />
                        <span className="text-gray-500">{formatDate(latest.createdAt)}</span>
                      </div>
                    </Popup>
                  </Marker>
                )}
                {history.slice(0, -1).map((p, i) => (
                  <Marker key={p._id} position={[p.latitude, p.longitude]}>
                    <Popup><div className="text-xs">Point {i + 1}<br />{p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}</div></Popup>
                  </Marker>
                ))}
                {latest && <MapPanner lat={latest.latitude} lon={latest.longitude} />}
              </MapContainer>
            </div>

            {!activeOrderId && (
              <div className="mt-4 card bg-navy-50 dark:bg-navy-900/30 border border-navy-100 dark:border-navy-800">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-navy-600 dark:text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-navy-800 dark:text-navy-300">Enter an Order ID to start tracking</div>
                    <div className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                      Find order IDs on the Orders page. The map updates in real-time as the driver moves.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TrackingPage
