const nodemailer = require("nodemailer");
const EmailVerificationModel = require("../models/sendmailmodel");

const sendmailverification = async (user) => {
  try {
    if (!user || !user.email) {
      throw new Error("User or email is missing.");
    }

    const email = user.email;
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate OTP

    // Save OTP in database
    try {
      await new EmailVerificationModel({
        userId: user._id,
        otp: otp,
        createdAt: new Date(), // Store creation timestamp
      }).save();
    } catch (dbError) {
      console.error("❌ Database Error:", dbError.message);
      throw new Error("Failed to save OTP.");
    }

    // Email verification link
    const otpVerificationLink = `${process.env.HOST_URL}/account/verify`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10), // Convert to number
      secure: process.env.EMAIL_PORT === "465", // Secure for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Nodemailer Error:", error);
      } else {
        console.log("✅ Email transporter is ready!");
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify Your Account - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Verify Your Account</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your OTP code is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
          <p>Click <a href="${otpVerificationLink}" style="color: #28a745; text-decoration: none;">here</a> to verify your account.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <p style="color: #888; font-size: 12px;">This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    return otp;
  } catch (error) {
    console.error("❌ Error in sendmailverification:", error.message);
    throw new Error("Failed to send OTP email.");
  }
};

module.exports = sendmailverification;
