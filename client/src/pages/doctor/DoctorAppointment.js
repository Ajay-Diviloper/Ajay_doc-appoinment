import React, { useEffect, useState } from "react";
import Layout from "../../componets/Layout";
import { Table, message } from "antd";
import axios from "axios";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAppointment = async () => {
    setLoading(true);
    try {
      // Pass token in headers if required:
      const res = await axios.get(
        "/api/doctor/doctor-appointments"
        //      {
        //     headers: {
        //       Authorization: user?.token ? `Bearer ${user.token}` : "",
        //     },
        //   }
      );
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
        <div className="d-flex">
          <button
            className="btn btn-primary"
            onClick={() => {
              handlestatus(record, "approved");
            }}
          >
            approved
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              handlestatus(record, "rejected");
            }}
          >
            Rejected
          </button>
        </div>
      ),
    },
  ];

  const handlestatus = async (record, status) => {
    try {
      const res = await axios.post("/api/doctor/update-status", {
        appoinmentId: record._id,
        status,
      });
      if (res.data.success) {
        message.success(res.data.message);
        getAppointment();
      }
    } catch (error) {
      message.error("something went wrong");
    }
  };
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

export default DoctorAppointment;
