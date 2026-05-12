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
};

// Unique email per run to avoid "user already exists" conflicts
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = "Test@1234";

// Shared state across tests
let authToken = null;
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
  try {
    await fn();
  } catch (err) {
    fail(label, err.message);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function testHealthChecks() {
  section("1. Health Checks — Direct Service Ports");

  await test("API Gateway  :5000  GET /", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("API Gateway  :5000  GET /", data.message);
  });

  await test("Auth Service  :5001  GET /api/auth/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.auth}/api/auth/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Auth Service  :5001  GET /api/auth/test", data.message);
  });

  await test("Order Service  :5002  GET /api/orders/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Order Service  :5002  GET /api/orders/test", data.message);
  });

  await test("Tracking Service  :5003  GET /api/tracking/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.tracking}/api/tracking/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Tracking Service  :5003  GET /api/tracking/test", data.message);
  });

  await test("Notification Service  :5004  GET /api/notifications/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.notification}/api/notifications/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Notification Service  :5004  GET /api/notifications/test", data.message);
  });
}

async function testGatewayProxy() {
  section("2. API Gateway Proxy Routing  :5000");

  await test("Gateway → Auth Service  GET /api/auth/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/auth/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Gateway → Auth Service  GET /api/auth/test", data.message);
  });

  await test("Gateway → Order Service  GET /api/orders/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/orders/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Gateway → Order Service  GET /api/orders/test", data.message);
  });

  await test("Gateway → Tracking Service  GET /api/tracking/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/tracking/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Gateway → Tracking Service  GET /api/tracking/test", data.message);
  });

  await test("Gateway → Notification Service  GET /api/notifications/test", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/notifications/test`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    ok("Gateway → Notification Service  GET /api/notifications/test", data.message);
  });

  await test("Gateway 404 for unknown route", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/unknown`);
    assert(status === 404, `Expected 404, got ${status}`);
    ok("Gateway 404 for unknown route", data.message);
  });
}

async function testAuthService() {
  section("3. Auth Service — Register & Login");

  await test("POST /api/auth/register — new user", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Test User",
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: "customer",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.success === true, "Expected success: true");
    assert(data.token, "Expected JWT token in response");
    authToken = data.token;
    ok("POST /api/auth/register — new user", `token received, user: ${data.user?.email}`);
  });

  await test("POST /api/auth/register — duplicate email returns 400", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/register`, {
      name: "Test User",
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: "customer",
    });
    assert(status === 400, `Expected 400, got ${status}`);
    ok("POST /api/auth/register — duplicate email returns 400", data.message);
  });

  await test("POST /api/auth/login — valid credentials", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    assert(status === 200, `Expected 200, got ${status} — ${data.message}`);
    assert(data.success === true, "Expected success: true");
    assert(data.token, "Expected JWT token in response");
    authToken = data.token; // refresh token
    ok("POST /api/auth/login — valid credentials", `token received`);
  });

  await test("POST /api/auth/login — wrong password returns 400", async () => {
    const { status, data } = await request("POST", `${SERVICES.auth}/api/auth/login`, {
      email: TEST_EMAIL,
      password: "wrongpassword",
    });
    assert(status === 400, `Expected 400, got ${status}`);
    ok("POST /api/auth/login — wrong password returns 400", data.message);
  });

  await test("GET /api/auth/profile — with valid token", async () => {
    const { status, data } = await request("GET", `${SERVICES.auth}/api/auth/profile`, null, authToken);
    assert(status === 200, `Expected 200, got ${status} — ${data.message}`);
    assert(data.success === true, "Expected success: true");
    ok("GET /api/auth/profile — with valid token", `user: ${data.user?.email}`);
  });

  await test("GET /api/auth/profile — without token returns 401", async () => {
    const { status } = await request("GET", `${SERVICES.auth}/api/auth/profile`);
    assert(status === 401, `Expected 401, got ${status}`);
    ok("GET /api/auth/profile — without token returns 401");
  });
}

async function testOrderService() {
  section("4. Order Service — CRUD");

  await test("POST /api/orders — create order", async () => {
    const { status, data } = await request("POST", `${SERVICES.order}/api/orders`, {
      customerName: "John Doe",
      customerPhone: "9876543210",
      pickupAddress: "123 Pickup Street, Delhi",
      deliveryAddress: "456 Delivery Avenue, Mumbai",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.success === true, "Expected success: true");
    assert(data.order?._id, "Expected order._id in response");
    createdOrderId = data.order._id;
    ok("POST /api/orders — create order", `id: ${createdOrderId}`);
  });

  await test("POST /api/orders — missing required fields returns 500", async () => {
    const { status, data } = await request("POST", `${SERVICES.order}/api/orders`, {
      customerName: "Incomplete Order",
    });
    assert(status === 500, `Expected 500, got ${status}`);
    ok("POST /api/orders — missing required fields returns 500", data.message);
  });

  await test("GET /api/orders — list all orders", async () => {
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, "Expected success: true");
    assert(Array.isArray(data.orders), "Expected orders array");
    ok("GET /api/orders — list all orders", `count: ${data.count}`);
  });

  await test("GET /api/orders/:id — get single order", async () => {
    assert(createdOrderId, "No order ID available — create order test may have failed");
    const { status, data } = await request("GET", `${SERVICES.order}/api/orders/${createdOrderId}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.order._id === createdOrderId, "Order ID mismatch");
    ok("GET /api/orders/:id — get single order", `status: ${data.order.status}`);
  });

  await test("GET /api/orders/:id — invalid id returns 500", async () => {
    const { status } = await request("GET", `${SERVICES.order}/api/orders/invalidid123`);
    assert(status === 500, `Expected 500, got ${status}`);
    ok("GET /api/orders/:id — invalid id returns 500");
  });

  await test("PATCH /api/orders/:id/status — update to in_transit", async () => {
    assert(createdOrderId, "No order ID available — create order test may have failed");
    const { status, data } = await request("PATCH", `${SERVICES.order}/api/orders/${createdOrderId}/status`, {
      status: "in_transit",
    });
    assert(status === 200, `Expected 200, got ${status} — ${data.message}`);
    assert(data.order.status === "in_transit", `Expected in_transit, got ${data.order.status}`);
    ok("PATCH /api/orders/:id/status — update to in_transit", `new status: ${data.order.status}`);
  });
}

async function testGatewayOrderFlow() {
  section("5. End-to-End via API Gateway — Auth + Orders");

  let gatewayToken = null;
  const gatewayEmail = `gateway_${Date.now()}@example.com`;

  await test("Gateway: POST /api/auth/register", async () => {
    const { status, data } = await request("POST", `${SERVICES.gateway}/api/auth/register`, {
      name: "Gateway User",
      email: gatewayEmail,
      password: "Gateway@123",
      role: "customer",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    gatewayToken = data.token;
    ok("Gateway: POST /api/auth/register", `token received`);
  });

  await test("Gateway: POST /api/orders — create via gateway", async () => {
    const { status, data } = await request("POST", `${SERVICES.gateway}/api/orders`, {
      customerName: "Gateway Customer",
      customerPhone: "1234567890",
      pickupAddress: "Gateway Pickup, Bangalore",
      deliveryAddress: "Gateway Delivery, Chennai",
    });
    assert(status === 201, `Expected 201, got ${status} — ${data.message}`);
    assert(data.order?._id, "Expected order._id");
    ok("Gateway: POST /api/orders — create via gateway", `id: ${data.order._id}`);
  });

  await test("Gateway: GET /api/orders — list via gateway", async () => {
    const { status, data } = await request("GET", `${SERVICES.gateway}/api/orders`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.orders), "Expected orders array");
    ok("Gateway: GET /api/orders — list via gateway", `count: ${data.count}`);
  });
}

// ─── Runner ──────────────────────────────────────────────────────────────────

async function run() {
  log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗`);
  log(`║   Smart Delivery System — Service Tests      ║`);
  log(`╚══════════════════════════════════════════════╝${RESET}`);
  log(`  Test email: ${YELLOW}${TEST_EMAIL}${RESET}`);

  await testHealthChecks();
  await testGatewayProxy();
  await testAuthService();
  await testOrderService();
  await testGatewayOrderFlow();

  // ─── Summary ───────────────────────────────────────────────────────────────
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
