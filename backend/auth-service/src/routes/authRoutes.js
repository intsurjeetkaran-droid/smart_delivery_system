const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Service Working",
  });
});



router.post("/register", register);

router.post("/login", login);



router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});



module.exports = router;