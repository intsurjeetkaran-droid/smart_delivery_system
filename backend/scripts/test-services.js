/**
 * Smart Delivery System — Service Integration Test
 *
 * Tests all microservices both directly and through the API Gateway.
 * Run with: node backend/scripts/test-services.js
 *
 * Requirements: Node.js 18+ (uses native fetch)
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const SERVICES = {
  gateway:      "http://localhost:5000",
  auth:         "http://localhost:5001",
  order:        "http://localhost:5002",
  tracking:     "http://localhost:5003",
  notification: "http://localhost:5004",
  routes:       "http://localhost:5005",
};

const TEST_EMAIL    = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = "Test@1234";
const ADMIN_EMAIL   = `admin_${Date.now()}@example.com`;
const DRIVER_EMAIL  = `driver_${Date.now()}@example.com`;

// Shared state
let customerToken = null;
let adminToken    = null;
let driverToken   = null;
let createdOrderId = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";

let passed = 0;
let failed = 0;

function log(msg)        { console.log(msg); }
function section(title)  { log(`\n${BOLD}${CYAN}━━━ ${title} ━━━${RESET}`); }
function ok(label, info) { passed++; log(`  ${GREEN}✔${RESET}  ${label}${info ? ` ${YELLOW}→ ${info}${RESET}` : ""}`); }
function fail(label, err){ failed++; log(`  ${RED}✘${RESET}  ${label} ${RED}→ ${err}${RESET}`); }

async function request(method, url, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  return { status: res.status, data };
}

async function test(label, fn) {
  try { await fn(); }
  catch (err) { fail(label, err.message); }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function testHealthChecks() {
  section("1. Health Checks — Direct Service Ports");

  const checks = [
    ["API Gateway  :5000  GET /",                          `${SERVICES.gateway}/`,                    "API Gateway Running Successfully"],
    ["Auth Service  :5001  GET /api/auth/test",            `${SERVICES.auth}/api/auth/test`,           "Auth Service Working"],
    ["Order Service  :5002  GET /api/orders/test",         `${SERVICES.order}/api/orders/test`,        "Order Service Working"],
    ["Tracking Service  :5003  GET /api/tracking/test",    `${SERVICES.tracking}/api/tracking/test`,   "Tracking Service Working"],
    ["Notification Service  :5004  GET /api/notifications/test", `${SERVICES.notification}/api/notifications/test`, "Notification Service Working"],
    ["Route Optimization  :5005  GET /api/routes/test",    `${SERVICES.routes}/api/routes/test`,       "Route Optimization Service Working"],
  ];

  for (const [label, url, expectedMsg] of checks) {
    await test(label, async () => {
      const { status, data } = await request("GET", url);
      assert(status === 200, `Expected 200, got ${status}`);
      assert(data.success === true, "Expected success: true");
      ok(label, data.message);
    });
  }
}

async function testGatewayProxy() {
  section("2. API Gateway Proxy Routing  :5000");

  const checks = [
    ["Gateway → Auth Service",                `${SERVICES.gateway}/api/auth/test`],
    ["Gateway → Order Service",               `${SERVICES.gateway}/api/orders/test`],
    ["Gateway → Tracking Service",            `${SERVICES.gateway}/api/tracking/test`],
    ["Gateway → Notification Service",        `${SERVICES.gateway}/api/notifications/test`],
    ["Gateway → Route Optimization Service",  `${SERVICES.gateway}/api/routes/test`],
  ];

  for (const [label, url] of checks) {
    await test(label, async () => {
      const { status, data } = await request("GET", url);
      assert(status === 200, `Expected 200, got ${status}`);
      assert(data.success === true, "Expected success: true");
      ok(label, data.message);
    });
  }

  await test("Gateway 404 for unknown route", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/unknown`);
    assert(status === 404, `Expected 404, got ${status}`);
    ok("Gateway 404 for unknown route", data.message);
  });
}

async function testAuthService() {
  section("3. Auth Service — Register, Login, Profile");

  await test("Register customer", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Test Customer", email: TEST_EMAIL, password: TEST_PASSWORD, role: "customer",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.token, "Expected token");
    customerToken = data.token;
    ok("Register customer", `email: ${data.user?.email}`);
  });

  await test("Register admin", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Test Admin", email: ADMIN_EMAIL, password: TEST_PASSWORD, role: "admin",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    adminToken = data.token;
    ok("Register admin", `email: ${data.user?.email}`);
  });

  await test("Register driver", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Test Driver", email: DRIVER_EMAIL, password: TEST_PASSWORD, role: "driver",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    driverToken = data.token;
    ok("Register driver", `email: ${data.user?.email}`);
  });

  await test("Duplicate email returns 400", async () => {
    const { status } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Dup", email: TEST_EMAIL, password: TEST_PASSWORD, role: "customer",
    });
    assert(status === 400, `Expected 400, got ${status}`);
    ok("Duplicate email returns 400");
  });

  await test("Login — valid credentials", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/login`, {
      email: TEST_EMAIL, password: TEST_PASSWORD,
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.token, "Expected token");
    customerToken = data.token;
    ok("Login — valid credentials");
  });

  await test("Login — wrong password returns 400", async () => {
    const { status } = await request("POST", `${SERVICES.auth}/api/auth/login`, {
      email: TEST_EMAIL, password: "wrongpass",
    });
    assert(status === 400, `Expected 400, got ${status}`);
    ok("Login — wrong password returns 400");
  });

  await test("GET /api/auth/profile — returns full user from DB (no password)", async () => {
    const { status, data } = await request("GET", `${SERVICES.auth}/api/auth/profile`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.user?.email === TEST_EMAIL, `Email mismatch: ${data.user?.email}`);
    assert(data.user?.name, "Expected name");
    assert(data.user?.role === "customer", `Expected role customer, got ${data.user?.role}`);
    assert(!data.user?.password, "Password must NOT be returned");
    ok("GET /api/auth/profile — returns full user from DB (no password)", `role: ${data.user.role}`);
  });

  await test("GET /api/auth/profile — no token returns 401", async () => {
    const { status } = await request("GET", `${SERVICES.auth}/api/auth/profile`);
    assert(status === 401, `Expected 401, got ${status}`);
    ok("GET /api/auth/profile — no token returns 401");
  });
}

async function testOrderService() {
  section("4. Order Service — CRUD + RBAC + Driver Assignment");

  await test("POST /api/orders — create order (public)", async () => {
    const { status, data } = await request("POST", `${SERVICES.order}/api/orders`, {
      customerName: "John Doe",
      customerPhone: "9876543210",
      pickupAddress: "123 Pickup Street, Delhi",
      deliveryAddress: "456 Delivery Avenue, Mumbai",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.order?._id, "Expected order._id");
    createdOrderId = data.order._id;
    ok("POST /api/orders — create order (public)", `id: ${createdOrderId}`);
  });

  await test("GET /api/orders — requires auth (no token → 401)", async () => {
    const { status } = await request("GET", `${SERVICES.order}/api/orders`);
    assert(status === 401, `Expected 401, got ${status}`);
    ok("GET /api/orders — requires auth (no token → 401)");
  });

  await test("GET /api/orders — customer can list orders", async () => {
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.orders), "Expected orders array");
    ok("GET /api/orders — customer can list orders", `count: ${data.count}`);
  });

  await test("GET /api/orders?status=pending — filter by status", async () => {
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders?status=pending`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    ok("GET /api/orders?status=pending — filter by status", `count: ${data.count}`);
  });

  await test("GET /api/orders/:id — get single order", async () => {
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders/${createdOrderId}`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.order._id === createdOrderId, "Order ID mismatch");
    ok("GET /api/orders/:id — get single order", `status: ${data.order.status}`);
  });

  await test("PATCH /api/orders/:id/status — customer cannot update status (403)", async () => {
    const { status } = await request("PATCH", `${SERVICES.order}/api/orders/${createdOrderId}/status`,
      { status: "in_transit" }, customerToken);
    assert(status === 403, `Expected 403, got ${status}`);
    ok("PATCH /api/orders/:id/status — customer cannot update status (403)");
  });

  await test("PATCH /api/orders/:id/status — driver can update status", async () => {
    const { status, data } = await request("PATCH", `${SERVICES.order}/api/orders/${createdOrderId}/status`,
      { status: "picked_up" }, driverToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.order.status === "picked_up", `Expected picked_up, got ${data.order.status}`);
    ok("PATCH /api/orders/:id/status — driver can update status", `new status: ${data.order.status}`);
  });

  await test("PATCH /api/orders/:id/assign — customer cannot assign driver (403)", async () => {
    const { status } = await request("PATCH", `${SERVICES.order}/api/orders/${createdOrderId}/assign`,
      { driverId: "driver123" }, customerToken);
    assert(status === 403, `Expected 403, got ${status}`);
    ok("PATCH /api/orders/:id/assign — customer cannot assign driver (403)");
  });

  await test("PATCH /api/orders/:id/assign — admin can assign driver", async () => {
    // Create a fresh pending order to assign
    const { data: newOrder } = await request("POST", `${SERVICES.order}/api/orders`, {
      customerName: "Assign Test",
      customerPhone: "1111111111",
      pickupAddress: "Pickup X",
      deliveryAddress: "Delivery X",
    });
    const { status, data } = await request("PATCH", `${SERVICES.order}/api/orders/${newOrder.order._id}/assign`,
      { driverId: "driver_abc_123" }, adminToken);
    assert(status === 200, `Expected 200, got ${status} — ${data.message}`);
    assert(data.order.assignedDriver === "driver_abc_123", "Driver ID mismatch");
    assert(data.order.status === "assigned", `Expected assigned, got ${data.order.status}`);
    ok("PATCH /api/orders/:id/assign — admin can assign driver",
      `driver: ${data.order.assignedDriver}, status: ${data.order.status}`);
  });

  await test("PATCH /api/orders/:id/assign — missing driverId returns 400", async () => {
    const { status } = await request("PATCH", `${SERVICES.order}/api/orders/${createdOrderId}/assign`,
      {}, adminToken);
    assert(status === 400, `Expected 400, got ${status}`);
    ok("PATCH /api/orders/:id/assign — missing driverId returns 400");
  });
}

async function testTrackingService() {
  section("5. Tracking Service — REST APIs + RBAC");

  await test("POST /api/tracking — no token returns 401", async () => {
    const { status } = await request("POST", `${SERVICES.tracking}/api/tracking`, {
      orderId: "order1", driverId: "driver1", latitude: 28.6139, longitude: 77.2090,
    });
    assert(status === 401, `Expected 401, got ${status}`);
    ok("POST /api/tracking — no token returns 401");
  });

  await test("POST /api/tracking — customer cannot post location (403)", async () => {
    const { status } = await request("POST", `${SERVICES.tracking}/api/tracking`, {
      orderId: "order1", driverId: "driver1", latitude: 28.6139, longitude: 77.2090,
    }, customerToken);
    assert(status === 403, `Expected 403, got ${status}`);
    ok("POST /api/tracking — customer cannot post location (403)");
  });

  await test("POST /api/tracking — driver can save location", async () => {
    const { status, data } = await request("POST", `${SERVICES.tracking}/api/tracking`, {
      orderId: createdOrderId,
      driverId: "driver_test_001",
      latitude: 28.6139,
      longitude: 77.2090,
      status: "moving",
    }, driverToken);
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.tracking?._id, "Expected tracking._id");
    ok("POST /api/tracking — driver can save location",
      `lat: ${data.tracking.latitude}, lon: ${data.tracking.longitude}`);
  });

  await test("POST /api/tracking — second location update", async () => {
    const { status, data } = await request("POST", `${SERVICES.tracking}/api/tracking`, {
      orderId: createdOrderId,
      driverId: "driver_test_001",
      latitude: 28.7041,
      longitude: 77.1025,
      status: "moving",
    }, driverToken);
    assert(status === 201, `Expected 201, got ${status}`);
    ok("POST /api/tracking — second location update");
  });

  await test("GET /api/tracking/:orderId — get full history", async () => {
    const { status, data } = await request("GET",
      `${SERVICES.tracking}/api/tracking/${createdOrderId}`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.history), "Expected history array");
    assert(data.count >= 2, `Expected at least 2 records, got ${data.count}`);
    ok("GET /api/tracking/:orderId — get full history", `count: ${data.count}`);
  });

  await test("GET /api/tracking/:orderId/latest — get latest location", async () => {
    const { status, data } = await request("GET",
      `${SERVICES.tracking}/api/tracking/${createdOrderId}/latest`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.tracking?.latitude, "Expected latitude");
    assert(data.tracking?.longitude, "Expected longitude");
    ok("GET /api/tracking/:orderId/latest — get latest location",
      `lat: ${data.tracking.latitude}, lon: ${data.tracking.longitude}`);
  });

  await test("GET /api/tracking/:orderId — no token returns 401", async () => {
    const { status } = await request("GET", `${SERVICES.tracking}/api/tracking/${createdOrderId}`);
    assert(status === 401, `Expected 401, got ${status}`);
    ok("GET /api/tracking/:orderId — no token returns 401");
  });

  await test("GET /api/tracking/:orderId — unknown order returns 200 with empty history", async () => {
    const { status, data } = await request("GET",
      `${SERVICES.tracking}/api/tracking/nonexistentorder999`, null, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.count === 0, `Expected 0, got ${data.count}`);
    ok("GET /api/tracking/:orderId — unknown order returns 200 with empty history");
  });
}

async function testRouteOptimization() {
  section("6. Route Optimization Service");

  await test("GET /api/routes/test — health check", async () => {
    const { status, data } = await request("GET", `${SERVICES.routes}/api/routes/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    ok("GET /api/routes/test — health check", data.message);
  });

  await test("POST /api/routes/optimize — no token returns 401", async () => {
    const { status } = await request("POST", `${SERVICES.routes}/api/routes/optimize`, {
      start: { lat: 28.6139, lon: 77.2090 },
      stops: [{ id: "s1", lat: 28.7041, lon: 77.1025, address: "Stop A" }],
    });
    assert(status === 401, `Expected 401, got ${status}`);
    ok("POST /api/routes/optimize — no token returns 401");
  });

  await test("POST /api/routes/optimize — single stop", async () => {
    const { status, data } = await request("POST", `${SERVICES.routes}/api/routes/optimize`, {
      start: { lat: 28.6139, lon: 77.2090 },
      stops: [
        { id: "order1", lat: 28.7041, lon: 77.1025, address: "Connaught Place, Delhi" },
      ],
    }, customerToken);
    assert(status === 200, `Expected 200, got ${status} — ${data.message}`);
    assert(data.result.orderedStops.length === 1, "Expected 1 stop");
    assert(typeof data.result.totalDistanceKm === "number", "Expected totalDistanceKm");
    assert(data.result.estimatedTimeFormatted, "Expected ETA");
    ok("POST /api/routes/optimize — single stop",
      `dist: ${data.result.totalDistanceKm}km, eta: ${data.result.estimatedTimeFormatted}`);
  });

  await test("POST /api/routes/optimize — multi-stop reorders by nearest neighbour", async () => {
    const { status, data } = await request("POST", `${SERVICES.routes}/api/routes/optimize`, {
      start: { lat: 28.6139, lon: 77.2090 },
      stops: [
        { id: "far",   lat: 19.0760, lon: 72.8777, address: "Mumbai" },
        { id: "near",  lat: 28.7041, lon: 77.1025, address: "North Delhi" },
        { id: "mid",   lat: 28.5355, lon: 77.3910, address: "Noida" },
      ],
    }, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.result.orderedStops.length === 3, "Expected 3 stops");
    // Nearest-neighbour should put "near" (North Delhi) first from Delhi origin
    assert(data.result.orderedStops[0].id === "near",
      `Expected 'near' first, got '${data.result.orderedStops[0].id}'`);
    ok("POST /api/routes/optimize — multi-stop reorders by nearest neighbour",
      `order: ${data.result.orderedStops.map(s => s.id).join(" → ")}, total: ${data.result.totalDistanceKm}km, eta: ${data.result.estimatedTimeFormatted}`);
  });

  await test("POST /api/routes/optimize — missing stops returns 400", async () => {
    const { status } = await request("POST", `${SERVICES.routes}/api/routes/optimize`,
      { start: { lat: 28.6139, lon: 77.2090 }, stops: [] }, customerToken);
    assert(status === 400, `Expected 400, got ${status}`);
    ok("POST /api/routes/optimize — missing stops returns 400");
  });

  await test("POST /api/routes/optimize — invalid start returns 400", async () => {
    const { status } = await request("POST", `${SERVICES.routes}/api/routes/optimize`,
      { start: { lat: "bad", lon: 77.2090 }, stops: [{ id: "s1", lat: 28.7, lon: 77.1 }] }, customerToken);
    assert(status === 400, `Expected 400, got ${status}`);
    ok("POST /api/routes/optimize — invalid start returns 400");
  });

  await test("POST /api/routes/distance — calculate distance between two points", async () => {
    const { status, data } = await request("POST", `${SERVICES.routes}/api/routes/distance`, {
      from: { lat: 28.6139, lon: 77.2090 },
      to:   { lat: 19.0760, lon: 72.8777 },
    }, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(typeof data.result.distanceKm === "number", "Expected distanceKm");
    // Delhi to Mumbai is ~1150km
    assert(data.result.distanceKm > 1000 && data.result.distanceKm < 1300,
      `Expected ~1150km, got ${data.result.distanceKm}`);
    ok("POST /api/routes/distance — calculate distance between two points",
      `${data.result.distanceKm}km, eta: ${data.result.estimatedTimeFormatted}`);
  });
}

async function testGatewayE2E() {
  section("7. End-to-End via API Gateway");

  await test("Gateway: POST /api/auth/register", async () => {
    const email = `gw_${Date.now()}@example.com`;
    const { status, data } = await request("POST", `${SERVICES.gateway}/api/auth/register`, {
      name: "GW User", email, password: "GW@12345", role: "customer",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    ok("Gateway: POST /api/auth/register", `token received`);
  });

  await test("Gateway: POST /api/orders — create order", async () => {
    const { status, data } = await request("POST", `${SERVICES.gateway}/api/orders`, {
      customerName: "GW Customer",
      customerPhone: "1234567890",
      pickupAddress: "GW Pickup, Bangalore",
      deliveryAddress: "GW Delivery, Chennai",
    });
    assert(status === 201, `Expected 201, got ${status}`);
    ok("Gateway: POST /api/orders — create order", `id: ${data.order._id}`);
  });

  await test("Gateway: POST /api/routes/optimize", async () => {
    const { status, data } = await request("POST", `${SERVICES.gateway}/api/routes/optimize`, {
      start: { lat: 12.9716, lon: 77.5946 },
      stops: [
        { id: "s1", lat: 13.0827, lon: 80.2707, address: "Chennai" },
        { id: "s2", lat: 17.3850, lon: 78.4867, address: "Hyderabad" },
      ],
    }, customerToken);
    assert(status === 200, `Expected 200, got ${status}`);
    ok("Gateway: POST /api/routes/optimize",
      `${data.result.totalDistanceKm}km, eta: ${data.result.estimatedTimeFormatted}`);
  });
}

// ─── Runner ──────────────────────────────────────────────────────────────────

async function run() {
  log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗`);
  log(`║   Smart Delivery System — Service Tests      ║`);
  log(`╚══════════════════════════════════════════════╝${RESET}`);

  await testHealthChecks();
  await testGatewayProxy();
  await testAuthService();
  await testOrderService();
  await testTrackingService();
  await testRouteOptimization();
  await testGatewayE2E();

  const total = passed + failed;
  log(`\n${BOLD}━━━ Results ━━━${RESET}`);
  log(`  Total:  ${total}`);
  log(`  ${GREEN}Passed: ${passed}${RESET}`);
  if (failed > 0) {
    log(`  ${RED}Failed: ${failed}${RESET}`);
  } else {
    log(`  ${GREEN}Failed: 0${RESET}`);
    log(`\n  ${GREEN}${BOLD}All services are healthy! ✔${RESET}`);
  }
  log("");

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(`\n${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
