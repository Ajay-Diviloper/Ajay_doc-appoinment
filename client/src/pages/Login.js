import React from "react";
import "../style/Registerstyles.css";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertslice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishhandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/login", values);
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("login successfully");
        navigate("/");
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("erroe");
    }
  };

  return (
    <>
      <div className=" form-container">
        <Form
          layout="vertical"
          onFinish={onfinishhandler}
          className="card p-4 text-center"
        >
          <h1> Login </h1>

          <Form.Item label="Email" name="email">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>

          <button type="submit" className="btn btn-primary">
            {" "}
            login
          </button>
          <div className="m-4">
            <Link to="/register" className="m-2  text-decoration-none">
              Sign up
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

export default Login;
