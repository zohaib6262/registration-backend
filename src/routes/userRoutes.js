const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  sendOtpToMobile,
} = require("../controllers/userController");
const { loginUser } = require("../controllers/loginController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp/mobile", sendOtpToMobile);
router.post("/login", loginUser);

module.exports = router;
