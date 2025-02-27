const usermodel = require("../models/usermodel");
const sendmailverification = require("../utils/sendmailverification");
const emailverionmodel = require("../models/sendmailmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const finalmailotpctr = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received Email:", email); // Debugging

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await usermodel.findOne({ email });
    console.log("User Found:", user); // Debugging

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found 222 33", success: false });
    }

    await sendmailverification(user);
    console.log("OTP Sent"); // Debugging

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in OTP send API:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in OTP send API" });
  }
};

const verifyotpcontroller = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Received OTP verification request:", req.body);

    if (!email || !otp) {
      console.log("❌ Missing email or OTP");
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // ✅ Find the user by email
    const user = await usermodel.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Find the latest OTP for this user
    const userOtpRecord = await emailverionmodel
      .findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    console.log("User OTP Record from DB:", userOtpRecord);

    if (!userOtpRecord) {
      console.log("❌ No OTP found for this user");
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    console.log("Stored OTP:", userOtpRecord.otp, "Entered OTP:", otp);

    // ✅ Convert both OTPs to string before comparing
    if (userOtpRecord.otp.toString() !== otp.toString()) {
      console.log("❌ OTP does not match");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    console.log("✔️ OTP Matched!");

    // ✅ Delete OTP after verification (for security)
    await emailverionmodel.deleteOne({ _id: userOtpRecord._id });

    console.log("✔️ User marked as verified");

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Remove password from user data before sending response
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token, // ✅ Send token like login with password
      user, // ✅ Send user details
    });
  } catch (error) {
    console.error("❌ Error in OTP verification API:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

module.exports = { finalmailotpctr, verifyotpcontroller };
