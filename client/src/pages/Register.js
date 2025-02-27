import React from "react";
import "../style/Registerstyles.css";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertslice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onfinishhandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Register successfully");

        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  return (
    <>
      <div className=" form-container">
        <Form layout="vertical" onFinish={onfinishhandler} className="card p-4">
          <h1> Register</h1>

          <Form.Item label="name" name="name">
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
