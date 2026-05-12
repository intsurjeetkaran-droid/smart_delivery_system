/**
 * Smart Delivery System — Database Seeder
 *
 * Seeds realistic Indian delivery data via the live API.
 * Run: node backend/scripts/seed.js
 *
 * Creates:
 *   - 1 admin, 3 drivers, 4 customers
 *   - 12 orders across all statuses
 *   - Tracking history for in-transit orders
 */

const BASE = 'http://localhost:5000'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m', GREEN = '\x1b[32m', RED = '\x1b[31m', CYAN = '\x1b[36m', YELLOW = '\x1b[33m', BOLD = '\x1b[1m'
const ok  = (msg) => console.log(`  ${GREEN}✔${RESET}  ${msg}`)
const err = (msg) => console.log(`  ${RED}✘${RESET}  ${msg}`)
const log = (msg) => console.log(msg)
const sec = (t)   => log(`\n${BOLD}${CYAN}── ${t} ──${RESET}`)

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  return res.json()
}

async function patch(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'PATCH', headers, body: JSON.stringify(body) })
  return res.json()
}

async function register(user) {
  const data = await post('/api/auth/register', user)
  if (data.success) {
    ok(`Registered ${user.role}: ${user.email}`)
    return { token: data.token, user: data.user }
  }
  // Already exists — login instead
  const login = await post('/api/auth/login', { email: user.email, password: user.password })
  if (login.success) {
    ok(`Logged in existing ${user.role}: ${user.email}`)
    return { token: login.token, user: login.user }
  }
  err(`Failed to register/login ${user.email}: ${data.message}`)
  return null
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const USERS = [
  // Admin
  { name: 'Arjun Mehta',    email: 'admin@smartdelivery.com',   password: 'Admin@123',    role: 'admin'    },
  // Drivers
  { name: 'Ravi Kumar',     email: 'ravi.driver@gmail.com',     password: 'Driver@123',   role: 'driver'   },
  { name: 'Priya Singh',    email: 'priya.driver@gmail.com',    password: 'Driver@123',   role: 'driver'   },
  { name: 'Suresh Nair',    email: 'suresh.driver@gmail.com',   password: 'Driver@123',   role: 'driver'   },
  // Customers
  { name: 'Rahul Sharma',   email: 'rahul@gmail.com',           password: 'Customer@123', role: 'customer' },
  { name: 'Ananya Patel',   email: 'ananya@gmail.com',          password: 'Customer@123', role: 'customer' },
  { name: 'Vikram Reddy',   email: 'vikram@gmail.com',          password: 'Customer@123', role: 'customer' },
  { name: 'Sneha Joshi',    email: 'sneha@gmail.com',           password: 'Customer@123', role: 'customer' },
]

const ORDERS_TEMPLATE = [
  // Delivered orders
  {
    customerName: 'Rahul Sharma', customerPhone: '9876543210',
    pickupAddress: '12 MG Road, Bangalore 560001',
    deliveryAddress: '45 Koramangala 5th Block, Bangalore 560095',
    targetStatus: 'delivered', driverKey: 'ravi',
  },
  {
    customerName: 'Ananya Patel', customerPhone: '9845012345',
    pickupAddress: 'Phoenix Marketcity, Whitefield, Bangalore',
    deliveryAddress: '22 Indiranagar 100ft Road, Bangalore 560038',
    targetStatus: 'delivered', driverKey: 'priya',
  },
  {
    customerName: 'Vikram Reddy', customerPhone: '9731234567',
    pickupAddress: 'Amazon Fulfillment Centre, Hosur Road, Bangalore',
    deliveryAddress: '7 Jayanagar 4th Block, Bangalore 560041',
    targetStatus: 'delivered', driverKey: 'suresh',
  },
  // In-transit orders (will get tracking data)
  {
    customerName: 'Sneha Joshi', customerPhone: '9900112233',
    pickupAddress: 'Flipkart Warehouse, Rajajinagar, Bangalore',
    deliveryAddress: '33 HSR Layout Sector 2, Bangalore 560102',
    targetStatus: 'in_transit', driverKey: 'ravi',
  },
  {
    customerName: 'Rahul Sharma', customerPhone: '9876543210',
    pickupAddress: 'Meesho Hub, Electronic City, Bangalore',
    deliveryAddress: '18 BTM Layout 2nd Stage, Bangalore 560076',
    targetStatus: 'in_transit', driverKey: 'priya',
  },
  // Picked up
  {
    customerName: 'Ananya Patel', customerPhone: '9845012345',
    pickupAddress: 'Myntra Warehouse, Bommasandra, Bangalore',
    deliveryAddress: '9 Sadashivanagar, Bangalore 560080',
    targetStatus: 'picked_up', driverKey: 'suresh',
  },
  // Assigned
  {
    customerName: 'Vikram Reddy', customerPhone: '9731234567',
    pickupAddress: 'Nykaa Distribution Centre, Peenya, Bangalore',
    deliveryAddress: '56 Malleshwaram 8th Cross, Bangalore 560003',
    targetStatus: 'assigned', driverKey: 'ravi',
  },
  {
    customerName: 'Sneha Joshi', customerPhone: '9900112233',
    pickupAddress: 'Decathlon Store, Sarjapur Road, Bangalore',
    deliveryAddress: '14 Whitefield Main Road, Bangalore 560066',
    targetStatus: 'assigned', driverKey: 'priya',
  },
  // Pending orders
  {
    customerName: 'Rahul Sharma', customerPhone: '9876543210',
    pickupAddress: 'IKEA Bangalore, Nagasandra, Bangalore 560073',
    deliveryAddress: '3 Yelahanka New Town, Bangalore 560064',
    targetStatus: 'pending', driverKey: null,
  },
  {
    customerName: 'Ananya Patel', customerPhone: '9845012345',
    pickupAddress: 'Reliance Digital, Forum Mall, Koramangala',
    deliveryAddress: '27 JP Nagar 7th Phase, Bangalore 560078',
    targetStatus: 'pending', driverKey: null,
  },
  {
    customerName: 'Vikram Reddy', customerPhone: '9731234567',
    pickupAddress: 'Croma Store, Orion Mall, Rajajinagar',
    deliveryAddress: '11 Vijayanagar 4th Stage, Bangalore 560040',
    targetStatus: 'pending', driverKey: null,
  },
  // Cancelled
  {
    customerName: 'Sneha Joshi', customerPhone: '9900112233',
    pickupAddress: 'Zomato Dark Kitchen, Bellandur, Bangalore',
    deliveryAddress: '88 Outer Ring Road, Marathahalli, Bangalore 560037',
    targetStatus: 'cancelled', driverKey: null,
  },
]

// Realistic GPS trail around Bangalore for in-transit orders
const TRACKING_TRAILS = {
  order_intransit_1: [
    { lat: 12.9352, lon: 77.6245 }, // Hosur Road (pickup area)
    { lat: 12.9380, lon: 77.6210 },
    { lat: 12.9410, lon: 77.6180 },
    { lat: 12.9445, lon: 77.6155 },
    { lat: 12.9478, lon: 77.6130 },
    { lat: 12.9510, lon: 77.6100 }, // Moving north
    { lat: 12.9540, lon: 77.6075 },
    { lat: 12.9572, lon: 77.6050 }, // Near HSR Layout
  ],
  order_intransit_2: [
    { lat: 12.8456, lon: 77.6603 }, // Electronic City (pickup)
    { lat: 12.8510, lon: 77.6580 },
    { lat: 12.8570, lon: 77.6550 },
    { lat: 12.8640, lon: 77.6510 },
    { lat: 12.8720, lon: 77.6470 },
    { lat: 12.8800, lon: 77.6430 }, // Moving towards BTM
    { lat: 12.8870, lon: 77.6390 },
    { lat: 12.8940, lon: 77.6350 }, // Near BTM Layout
  ],
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗`)
  log(`║   Smart Delivery System — Database Seeder    ║`)
  log(`╚══════════════════════════════════════════════╝${RESET}`)

  // ── 1. Register users ──────────────────────────────────────────────────────
  sec('1. Registering Users')
  const accounts = {}
  for (const u of USERS) {
    const result = await register(u)
    if (result) {
      const key = u.role === 'admin' ? 'admin'
        : u.role === 'driver' ? u.name.split(' ')[0].toLowerCase()
        : u.name.split(' ')[0].toLowerCase()
      accounts[key] = { ...result, email: u.email, password: u.password, role: u.role }
    }
  }

  const adminToken  = accounts['admin']?.token
  const raviToken   = accounts['ravi']?.token
  const priyaToken  = accounts['priya']?.token
  const sureshToken = accounts['suresh']?.token

  if (!adminToken) { err('Admin token missing — aborting'); process.exit(1) }

  // ── 2. Create orders ───────────────────────────────────────────────────────
  sec('2. Creating Orders')
  const createdOrders = []

  for (const tmpl of ORDERS_TEMPLATE) {
    const data = await post('/api/orders', {
      customerName:    tmpl.customerName,
      customerPhone:   tmpl.customerPhone,
      pickupAddress:   tmpl.pickupAddress,
      deliveryAddress: tmpl.deliveryAddress,
    })

    if (!data.success) { err(`Failed to create order: ${data.message}`); continue }
    const order = data.order
    createdOrders.push({ order, tmpl })
    ok(`Created order for ${tmpl.customerName} → ${tmpl.targetStatus}`)

    // Assign driver if needed
    if (tmpl.driverKey && tmpl.targetStatus !== 'pending' && tmpl.targetStatus !== 'cancelled') {
      const driverMap = { ravi: 'driver_ravi_001', priya: 'driver_priya_002', suresh: 'driver_suresh_003' }
      const driverId = driverMap[tmpl.driverKey]
      const assignData = await patch(`/api/orders/${order._id}/assign`, { driverId }, adminToken)
      if (assignData.success) ok(`  Assigned ${driverId} to order`)
      else err(`  Assign failed: ${assignData.message}`)
    }

    // Progress status
    const statusFlow = {
      assigned:   ['assigned'],
      picked_up:  ['assigned', 'picked_up'],
      in_transit: ['assigned', 'picked_up', 'in_transit'],
      delivered:  ['assigned', 'picked_up', 'in_transit', 'delivered'],
      cancelled:  ['cancelled'],
    }

    const driverTokenMap = { ravi: raviToken, priya: priyaToken, suresh: sureshToken }
    const actorToken = tmpl.driverKey ? driverTokenMap[tmpl.driverKey] : adminToken

    const steps = statusFlow[tmpl.targetStatus] || []
    for (const s of steps) {
      const statusData = await patch(`/api/orders/${order._id}/status`, { status: s }, actorToken || adminToken)
      if (statusData.success) ok(`  Status → ${s}`)
      else err(`  Status update failed: ${statusData.message}`)
    }
  }

  // ── 3. Seed tracking data ──────────────────────────────────────────────────
  sec('3. Seeding Tracking Data')

  const inTransitOrders = createdOrders.filter(({ tmpl }) => tmpl.targetStatus === 'in_transit')

  for (let i = 0; i < inTransitOrders.length; i++) {
    const { order, tmpl } = inTransitOrders[i]
    const trailKey = `order_intransit_${i + 1}`
    const trail = TRACKING_TRAILS[trailKey]
    if (!trail) continue

    const driverTokenMap = { ravi: raviToken, priya: priyaToken, suresh: sureshToken }
    const driverIdMap    = { ravi: 'driver_ravi_001', priya: 'driver_priya_002', suresh: 'driver_suresh_003' }
    const token    = driverTokenMap[tmpl.driverKey] || adminToken
    const driverId = driverIdMap[tmpl.driverKey] || 'driver_unknown'

    for (const point of trail) {
      const trackData = await post('/api/tracking', {
        orderId: order._id, driverId,
        latitude: point.lat, longitude: point.lon,
        status: 'moving',
      }, token)
      if (!trackData.success) { err(`Tracking point failed: ${trackData.message}`); break }
    }
    ok(`Seeded ${trail.length} tracking points for order ${order._id} (driver: ${driverId})`)
  }

  // ── 4. Summary ─────────────────────────────────────────────────────────────
  sec('4. Summary')

  const ordersByStatus = {}
  for (const { tmpl } of createdOrders) {
    ordersByStatus[tmpl.targetStatus] = (ordersByStatus[tmpl.targetStatus] || 0) + 1
  }

  log(`\n  Users created:`)
  log(`    Admin:    1`)
  log(`    Drivers:  3`)
  log(`    Customers: 4`)
  log(`\n  Orders created: ${createdOrders.length}`)
  for (const [status, count] of Object.entries(ordersByStatus)) {
    log(`    ${status.padEnd(12)} ${count}`)
  }
  log(`\n  Tracking points: ${inTransitOrders.length * 8} (${inTransitOrders.length} active orders)`)

  // Print order IDs for in-transit orders (useful for tracking page)
  log(`\n  ${YELLOW}In-transit order IDs (use on Tracking page):${RESET}`)
  for (const { order, tmpl } of inTransitOrders) {
    log(`    ${order._id}  ← ${tmpl.customerName}`)
  }

  log(`\n${GREEN}${BOLD}  Seeding complete! ✔${RESET}\n`)

  // Return data for credentials file
  return { accounts, inTransitOrders: inTransitOrders.map(({ order }) => order._id) }
}

seed().catch(e => { console.error('\nFatal:', e.message); process.exit(1) })
