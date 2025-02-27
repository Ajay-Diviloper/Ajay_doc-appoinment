import React from "react";
import Layout from "../componets/Layout";
import { Col, Form, Input, message, Row, TimePicker, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertslice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Applydoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlesubmit = async (values) => {
    // Validate fields (your existing validations remain)
    if (!values.firstname) {
      message.error("Name is required and should have at least 3 characters.");
      return;
    }
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      message.error("A valid email address is required.");
      return;
    }
    if (
      !values.experience ||
      isNaN(values.experience) ||
      values.experience <= 0
    ) {
      message.error("Experience must be a positive number.");
      return;
    }
    if (!values.phone || !/^\d{10}$/.test(values.phone)) {
      message.error("Phone number must be exactly 10 digits.");
      return;
    }
    if (!values.speicialization) {
      message.error("Specialization is required");
      return;
    }
    if (!values.feespercunsaltation) {
      message.error("Fee per consultation is required");
      return;
    }
    if (!values.timings) {
      message.error("Timings are required");
      return;
    }

    // Convert TimePicker values (moment objects) to formatted strings
    if (values.timings && Array.isArray(values.timings)) {
      values.timings = values.timings.map((time) => time.format("HH:mm"));
    }

    console.log("Submitting values:", values);

    try {
      dispatch(showLoading());
      // If your API requires an auth token, include it in the headers.
      const res = await axios.post(
        "/api/apply-doctor",
        { ...values, userid: user._id },
        {
          headers: {
            // e.g., Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Doctor application submitted successfully!");
        navigate("/");
      } else {
        message.error("Submission failed. Please try again.");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("API Error:", error);
      message.error("Error in apply doctor API");
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-center mx-5">Apply Doctor</h1>
      </div>
      <Form layout="vertical" onFinish={handlesubmit}>
        <h4>Personal Detail</h4>
        <Row gutter={16}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="First Name"
              name="firstname"
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastname"
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Last Name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Email ID"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input type="email" placeholder="Email ID" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  pattern: /^[0-9]{10,15}$/,
                  message: "Please enter a valid phone number!",
                },
              ]}
            >
              <Input type="text" placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Website"
              name="website"
              rules={[{ type: "url", message: "Please enter a valid URL!" }]}
            >
              <Input type="url" placeholder="Website" />
            </Form.Item>
          </Col>
        </Row>
        <h4>Professional Detail</h4>
        <Row gutter={16}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Specialization"
              name="speicialization"
              rules={[{ required: false }]}
            >
              <Input type="text" placeholder="Specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Experience (Years)"
              name="experience"
              rules={[
                {
                  required: true,
                  pattern: /^[0-9]+$/,
                  message: "Please enter a valid number for experience!",
                },
              ]}
            >
              <Input type="number" placeholder="Experience" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Fee per Consultation"
              name="feespercunsaltation"
              rules={[
                {
                  required: true,
                  pattern: /^[0-9]+$/,
                  message: "Please enter a valid fee!",
                },
              ]}
            >
              <Input type="number" placeholder="Fee per Consultation" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Timing"
              name="timings"
              rules={[{ required: true }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                placeholder={["Start Time", "End Time"]}
              />
            </Form.Item>
          </Col>
        </Row>
        <div>
          {/* Updated submit button */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};

export default Applydoctor;
