import React from 'react'
import { Truck } from 'lucide-react'

const Footer: React.FC = () => (
  <footer className="bg-navy-900 text-white/60 py-6 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
          <Truck size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white">Smart<span className="text-brand-400">Delivery</span></span>
      </div>
      <p className="text-xs text-center">© 2026 Smart Delivery & Route Optimization System. All rights reserved.</p>
    </div>
  </footer>
)

export default Footer
