const User = require("../models/userModel");
const twilio = require("twilio");
const { sendOtpEmail, sendOtp } = require("../utils/sendOtp");

require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtpToMobile = async (req, res) => {
  const { fullName, email, phoneNumber, password, termsAccepted, location } =
    req.body;

  if (!termsAccepted) return res.status(400).json({ message: "Accept terms." });
  if (!phoneNumber || !email)
    return res.status(400).json({ message: "Phone or email missing." });

  // Check existing user by email or phone
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingUser)
    return res
      .status(409)
      .json({ message: "User already exists with this email or phone." });

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 5 * 60000); // 5 minutes

  try {
    // await client.messages.create({
    //   body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    //   messagingServiceSid: "MGc3865ad9835efadc04342cd4715fd4bb",
    //   to: "+18777804236",
    // });
    await client.messages.create({
      body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      termsAccepted,
      location,
      otp,
      otpExpires,
      isVerified: false,
    });

    res.status(201).json({ message: "OTP sent to phone", userId: newUser._id });
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password, termsAccepted, location } =
    req.body;

  if (!termsAccepted) return res.status(400).json({ message: "Accept terms." });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email exists." });

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 5 * 60000); // 5 mins

  try {
    // صرف ایک طریقہ استعمال کریں (Brevo یا Nodemailer)
    await sendOtp(email, otp);

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      termsAccepted,
      location,
      otp,
      otpExpires,
      isVerified: false,
    });

    res.status(201).json({ message: "OTP sent to email", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  if (user.otpExpires < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "OTP verified successfully" });
};
