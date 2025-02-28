import React from "react";
import "../style/Registerstyles.css";
import { Alert, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertslice";
import { lruMemoize } from "@reduxjs/toolkit";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/register", values);
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());

      if (error.response) {
        // Server responded with a status other than 2xx
        const { status, data } = error.response;

        if (status === 400) {
          message.error("All fields are required");
        } else if (status === 409) {
          message.error("Email already registered");
        } else if (status === 403) {
          message.error("password not fullfill critetria");
        } else {
          message.error(data.message || "Registration failed");
        }
      } else {
        // Network error or server didn't respond
        message.error("Network error. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className=" form-container">
        <Form layout="vertical" onFinish={onFinishHandler} className="card p-4">
          <h1> Register</h1>

          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <button type="submit" className="btn btn-primary">
            {" "}
            Submit
          </button>
          <div className="m-4">
            <Link to="/login" className="m-2  text-decoration-none">
              Sign in
            </Link>
            <Link to="/login-otp" className="m-2 text-decoration-none">
              Login with OTP
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
