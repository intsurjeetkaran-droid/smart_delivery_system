const express = require("express");

const {
  saveLocation,
  getTrackingHistory,
  getLatestLocation,
} = require("../controllers/trackingController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Tracking Service Working",
  });
});



// Driver posts their location update
router.post("/", protect, authorize("driver", "admin"), saveLocation);

// Any logged-in user can view tracking for an order
router.get("/:orderId", protect, getTrackingHistory);

// Any logged-in user can get latest position
router.get("/:orderId/latest", protect, getLatestLocation);



module.exports = router;
