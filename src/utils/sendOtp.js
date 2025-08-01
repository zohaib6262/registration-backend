const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });
};
const sendOtp = async (email, otp) => {
  const apiKey = process.env.BREVO_KEY;
  const url = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: {
      name: "Verify OTP",
      email: "zohaibbinashraaf@gmail.com",
    },
    to: [{ email }],
    subject: "Your OTP Code",
    htmlContent: `
      <html>
        <body>
          <h2>Your OTP is: <strong>${otp}</strong></h2>
          <p>Use this OTP to verify your account. It will expire in 5 minutes.</p>
        </body>
      </html>`,
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });
    console.log("OTP sent :", response.data);
    console.log(`✅ OTP sent to: ${email}`);
  } catch (error) {
    console.error(
      "❌ Error sending OTP email:",
      error.response?.data || error.message
    );
  }
};

module.exports = { sendOtpEmail, sendOtp };
