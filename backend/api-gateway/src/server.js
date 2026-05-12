require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();



/*
|--------------------------------------------------------------------------
| GLOBAL MIDDLEWARES
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

// NOTE: express.json() is intentionally NOT registered globally.
// The gateway is a pure reverse proxy — parsing the body here would
// consume the request stream before http-proxy-middleware can forward it,
// causing POST/PUT/PATCH requests to hang with an empty body.



/*
|--------------------------------------------------------------------------
| HEALTH CHECK ROUTE
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway Running Successfully",
  });
});



/*
|--------------------------------------------------------------------------
| AUTH SERVICE PROXY
|--------------------------------------------------------------------------
|
| Forward all auth requests:
| localhost:5000/api/auth/*
|            ↓
| localhost:5001/api/auth/*
|
*/

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,

    changeOrigin: true,

    logLevel: "debug",

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GATEWAY] Forwarding ${req.method} request to AUTH SERVICE: ${req.originalUrl}`
      );
      // Re-stream body if it was buffered (e.g. by other middleware)
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onError: (err, req, res) => {
      console.error("[GATEWAY ERROR - AUTH SERVICE]", err.message);

      res.status(500).json({
        success: false,
        message: "Auth Service Unavailable",
      });
    },
  })
);



/*
|--------------------------------------------------------------------------
| ORDER SERVICE PROXY
|--------------------------------------------------------------------------
*/

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,

    changeOrigin: true,

    logLevel: "debug",

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GATEWAY] Forwarding ${req.method} request to ORDER SERVICE: ${req.originalUrl}`
      );
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onError: (err, req, res) => {
      console.error("[GATEWAY ERROR - ORDER SERVICE]", err.message);

      res.status(500).json({
        success: false,
        message: "Order Service Unavailable",
      });
    },
  })
);



/*
|--------------------------------------------------------------------------
| TRACKING SERVICE PROXY
|--------------------------------------------------------------------------
*/

app.use(
  "/api/tracking",
  createProxyMiddleware({
    target: process.env.TRACKING_SERVICE_URL,

    changeOrigin: true,

    logLevel: "debug",

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GATEWAY] Forwarding ${req.method} request to TRACKING SERVICE: ${req.originalUrl}`
      );
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onError: (err, req, res) => {
      console.error("[GATEWAY ERROR - TRACKING SERVICE]", err.message);

      res.status(500).json({
        success: false,
        message: "Tracking Service Unavailable",
      });
    },
  })
);



/*
|--------------------------------------------------------------------------
| NOTIFICATION SERVICE PROXY
|--------------------------------------------------------------------------
*/

app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,

    changeOrigin: true,

    logLevel: "debug",

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GATEWAY] Forwarding ${req.method} request to NOTIFICATION SERVICE: ${req.originalUrl}`
      );
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onError: (err, req, res) => {
      console.error("[GATEWAY ERROR - NOTIFICATION SERVICE]", err.message);

      res.status(500).json({
        success: false,
        message: "Notification Service Unavailable",
      });
    },
  })
);



/*
|--------------------------------------------------------------------------
| ROUTE OPTIMIZATION SERVICE PROXY
|--------------------------------------------------------------------------
*/

app.use(
  "/api/routes",
  createProxyMiddleware({
    target: process.env.ROUTE_OPTIMIZATION_SERVICE_URL,

    changeOrigin: true,

    logLevel: "debug",

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[GATEWAY] Forwarding ${req.method} request to ROUTE OPTIMIZATION SERVICE: ${req.originalUrl}`
      );
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onError: (err, req, res) => {
      console.error("[GATEWAY ERROR - ROUTE OPTIMIZATION SERVICE]", err.message);

      res.status(500).json({
        success: false,
        message: "Route Optimization Service Unavailable",
      });
    },
  })
);



/*
|--------------------------------------------------------------------------
| 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});



/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=======================================");
  console.log(`🚀 API Gateway Running On Port ${PORT}`);
  console.log("=======================================");
});