const express = require("express");

const {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order Service Working",
  });
});



router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getSingleOrder);

router.patch("/:id/status", updateOrderStatus);



module.exports = router;