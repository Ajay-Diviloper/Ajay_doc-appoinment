import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
import Layout from "../../componets/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm(); // Create Ant Design form instance
  const params = useParams();
  const Navigate = useNavigate();

  // Fetch doctor details
  const getDoctorInfo = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.post(
        "/api/doctor/getdocinfor",
        { userid: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
        form.setFieldsValue(res.data.data); // Dynamically set form values
      } else {
        message.error("Failed to fetch doctor details");
      }
    } catch (error) {
      message.error("An error occurred while fetching the data.");
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, [params.id]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(
        "/api/doctor/updatedocprofile",
        {
          ...values,
          userid: params.id,
          timings: [
            moment(values.timings[0], "HH : mm"),
            moment(values.timings[1], "HH : mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Doctor details updated successfully!");
      } else {
        message.error("Failed to update doctor details.");
      }
      Navigate("/");
    } catch (error) {
      message.error("An error occurred while updating the data.");
      console.error(error);
    }
  };

  return (
    <Layout>
      {doctor && (
        <Form
          layout="vertical"
          initialValues={{
            ...doctor,
            timings: [
              moment(doctor.timings[0], "HH : mm"),
              moment(doctor.timings[1], "HH : mm"),
            ],
          }}
          onFinish={handleSubmit}
        >
          <h4>Personal Details</h4>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="First Name"
                name="firstname"
                rules={[
                  { required: true, message: "Please enter the first name" },
                ]}
              >
                <Input type="text" placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastname"
                rules={[
                  { required: true, message: "Please enter the last name" },
                ]}
              >
                <Input type="text" placeholder="Last Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Email ID"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input type="email" placeholder="Email ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]{10,15}$/,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input type="text" placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter the address" },
                ]}
              >
                <Input type="text" placeholder="Address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Website"
                name="website"
                rules={[{ type: "url", message: "Please enter a valid URL" }]}
              >
                <Input type="url" placeholder="Website" />
              </Form.Item>
            </Col>
          </Row>

          <h4>Professional Details</h4>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Specialization" name="speicialization">
                <Input type="text" placeholder="Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Experience (Years)"
                name="experience"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]+$/,
                    message: "Please enter a valid number for experience",
                  },
                ]}
              >
                <Input type="number" placeholder="Experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Fee per Consultation"
                name="feespercunsaltation"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]+$/,
                    message: "Please enter a valid fee",
                  },
                ]}
              >
                <Input type="number" placeholder="Fee per Consultation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Timing"
                name="timings"
                rules={[{ required: true, message: "Please select timings" }]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  placeholder={["Start Time", "End Time"]}
                />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
