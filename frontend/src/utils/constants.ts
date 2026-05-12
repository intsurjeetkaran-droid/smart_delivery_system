// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: '/orders',
    DELETE: '/orders',
  },
  TRACKING: {
    GET: '/tracking',
    UPDATE: '/tracking',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
  },
}

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  ADMIN: 'admin',
}

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [40.7128, -74.0060], // New York coordinates as default
  DEFAULT_ZOOM: 13,
}