const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  if ((!email && !phoneNumber) || !password) {
    return res
      .status(400)
      .json({ message: "Phone or email and password required" });
  }

  try {
    // Find user by email or phone number
    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    console.log("User found:", user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email or phone" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account first" });
    }

    // Use bcrypt for password comparison (recommended if stored hashed)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // make sure it's set in .env
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token, // send token
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
