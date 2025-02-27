import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  showLoading,
  hideLoading,
  setOtpSent,
} from "../redux/features/alertslice";

const LoginWithOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOtpSent = useSelector((state) => state.alerts.isOtpSent); // ✅ Get Redux state

  const [email, setEmail] = useState(localStorage.getItem("email") || ""); // ✅ Load email from local storage
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("✅ isOtpSent updated:", isOtpSent);
  }, [isOtpSent]);

  // Function to request OTP
  const sendOtp = async () => {
    if (!email) {
      message.error("Please enter your email");
      return;
    }
    try {
      dispatch(showLoading());
      setLoading(true);

      const res = await axios.post("/api/otp/sentotp", { email });
      console.log("Backend Response:", res.data);

      dispatch(hideLoading());
      setLoading(false);

      if (res.data.success) {
        dispatch(setOtpSent(true)); // ✅ Update Redux state
        localStorage.setItem("email", email); // ✅ Store email in local storage
        message.success("OTP sent to your email!");
      } else {
        message.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.error("❌ Error sending OTP:", error);
      message.error("Error sending OTP. Please try again.");
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      message.error("Please enter the OTP");
      return;
    }

    try {
      dispatch(showLoading());
      setLoading(true);

      console.log("📤 Sending OTP verification request...");

      const res = await axios.post("/api/otp/verifyotp", { email, otp });

      console.log("✅ OTP Verification Response:", res.data); // Debugging

      dispatch(hideLoading());
      setLoading(false);

      if (res.data.success) {
        message.success("🎉 Login Successful!");

        // ✅ Store JWT token in localStorage
        localStorage.setItem("token", res.data.token);

        // ✅ Store user data (optional, use Redux if needed)
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Reset OTP state
        dispatch(setOtpSent(false));
        localStorage.removeItem("email");

        // ✅ Redirect user after successful login
        navigate("/dashboard"); // Change to the correct page
      } else {
        message.error(res.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);

      console.error("❌ Error verifying OTP:", error);

      // ✅ Handle Network or Server Errors
      if (error.response) {
        message.error(
          error.response.data.message || "Server error. Try again."
        );
      } else {
        message.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" className="card p-4">
        <h1>Login with OTP</h1>

        {/* Email Input */}
        <Form.Item label="Email" name="email">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              localStorage.setItem("email", e.target.value); // ✅ Update email in local storage
            }}
            required
            disabled={isOtpSent} // ✅ Controlled by Redux
          />
        </Form.Item>

        {/* OTP Input (Visible only after OTP is sent) */}
        {isOtpSent && (
          <Form.Item label="Enter OTP" name="otp">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Item>
        )}

        {/* Buttons */}
        <div className="">
          <button
            type="button"
            className="btn btn-primary"
            onClick={sendOtp}
            disabled={loading || isOtpSent}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {isOtpSent && (
            <>
              <button
                type="button"
                className="btn btn-success ms-2"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP & Login"}
              </button>
            </>
          )}
          <div className="mt-2 mb-4">
            <Link to="/login" className="m-2  text-decoration-none">
              Sign in with password
            </Link>
            <Link to="/register" className="m-2 text-decoration-none">
              Sign up
            </Link>
          </div>
        </div>

        {/* Links */}
      </Form>
    </div>
  );
};

export default LoginWithOTP;
