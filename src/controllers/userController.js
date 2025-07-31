const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password, termsAccepted } = req.body;

  if (!termsAccepted) {
    return res.status(400).json({ message: "You must accept the terms." });
  }

  if (!fullName || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      termsAccepted,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
