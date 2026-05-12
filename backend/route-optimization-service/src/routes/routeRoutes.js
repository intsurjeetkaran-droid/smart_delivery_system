const express = require("express");

const { optimizeRoute, calculateDistance } = require("../controllers/routeController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Route Optimization Service Working",
  });
});



// Optimize a multi-stop delivery route — any logged-in user
router.post("/optimize", protect, optimizeRoute);

// Calculate distance between two points — any logged-in user
router.post("/distance", protect, calculateDistance);



module.exports = router;
