const express = require("express");

const {
  sendNotification,
} = require("../controllers/notificationController");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Notification Service Working",
  });
});



router.post("/send", sendNotification);



module.exports = router;