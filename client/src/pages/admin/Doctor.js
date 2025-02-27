import { Layout as AntLayout, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../componets/Layout"; // Your custom Layout component
import axios from "axios";

const Doctor = () => {
  const [doctor, setdoctor] = useState([]);

  const getalldoctor = async () => {
    try {
      const doctor = await axios.get("/api/admin/getalldoctor");
      if (doctor.data.success) {
        console.log(doctor.data.data); // Debugging
        setdoctor(doctor.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      message.error("Failed to fetch doctor data.");
    }
  };

  const handleaccountstatus = async (record, status) => {
    try {
      const res = await axios.post("/api/admin/updatedocstatus", {
        doctorid: record._id,
        userid: record.userid,
        status: status,
      });

      if (res.data.success) {
        message.success(res.data.message);

        getalldoctor(); // Refresh data after status update
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      message.error("Failed to update account status. Please try again.");
    }
  };

  useEffect(() => {
    getalldoctor();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {record.firstname} {record.lastname}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleaccountstatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleaccountstatus(record, "rejected")}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h3 className="text-center">Doctor List</h3>
      <Table
        columns={columns}
        dataSource={doctor}
        rowKey="_id" // Unique key for each row
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Doctor;
