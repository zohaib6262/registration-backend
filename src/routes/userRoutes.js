const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  sendOtpToMobile,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp/mobile", sendOtpToMobile);

module.exports = router;
