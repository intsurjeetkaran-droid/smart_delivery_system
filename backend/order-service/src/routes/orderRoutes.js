const express = require("express");

const {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  assignDriver,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order Service Working",
  });
});



// Public — customer creates an order (auth optional for MVP, can tighten later)
router.post("/", createOrder);

// Protected — any logged-in user can list/view orders
router.get("/", protect, getOrders);

router.get("/:id", protect, getSingleOrder);

// Protected — admin or driver can update status
router.patch("/:id/status", protect, authorize("admin", "driver"), updateOrderStatus);

// Protected — admin only can assign a driver
router.patch("/:id/assign", protect, authorize("admin"), assignDriver);



module.exports = router;
