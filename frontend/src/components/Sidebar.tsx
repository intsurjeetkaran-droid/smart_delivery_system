import React from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// TODO: Implement Sidebar component with navigation menu
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div>
      {/* Sidebar placeholder */}
    </div>
  )
}

export default Sidebar