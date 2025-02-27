import React, { useEffect, useState } from "react";
import Layout from "../componets/Layout";
import axios from "axios";
import { Table, message } from "antd";
import { useSelector } from "react-redux";

const Appointmentpage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Assume your Redux store has the user details (including token)
  const { user } = useSelector((state) => state.user);

  const getAppointment = async () => {
    setLoading(true);
    try {
      // Pass token in headers if required:
      const res = await axios.get("/api/user-appointment", {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      console.log("API Response:", res.data); // Debug log the response

      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        message.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Something went wrong while fetching appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAppointment();
  }, []);

  // Customize columns based on the structure of your appointment data.
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorinfo", // adjust if your API key is different
      render: (doctorinfo) =>
        doctorinfo ? `${doctorinfo.firstname} ${doctorinfo.lastname}` : "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time) => time || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <span>{status}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log("Viewing details for appointment:", record);
          }}
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1>Your Appointments</h1>
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </Layout>
  );
};

export default Appointmentpage;
