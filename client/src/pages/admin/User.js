import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../componets/Layout";
import { Table, message } from "antd";

const User = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [error, setError] = useState(null); // State to manage error messages

  // Function to fetch all users
  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/admin/getalluser"); // Replace with your backend URL
      if (res.data.success) {
        setUsers(res.data.data); // Set the fetched users in state
        console.log("Fetched users:", res.data.data);
      } else {
        setError("Failed to fetch users");
        console.error("Failed to fetch users:", res.data.message);
      }
    } catch (error) {
      setError("An error occurred while fetching users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Function to handle user blocking
  const blockUser = async (userId) => {
    try {
      const res = await axios.post("/api/admin/blockuser", { userId });
      if (res.data.success) {
        message.success("User blocked successfully");
        getAllUsers(); // Refresh user list
      } else {
        message.error("Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("An error occurred while blocking the user");
    }
  };

  // Ant Design table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name", // Corrected: dataIndex (case-sensitive)
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email", // Corrected: dataIndex (case-sensitive)
      key: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor", // Corrected: dataIndex (case-sensitive)
      key: "doctor",
      render: (text, record) => <span> {record.isDoctor ? "yes" : "No"}</span>, // Format the date
    },
    {
      title: "Action",
      dataIndex: "actions", // Corrected: dataIndex (case-sensitive)
      key: "actions",
      render: (_, record) => (
        <div className="d-flex">
          <button
            className="btn btn-danger"
            onClick={() => blockUser(record._id)}
          >
            Block
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>User List</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}{" "}
      {/* Display error message */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id" // Use the unique _id field as the row key
        bordered
        pagination={{ pageSize: 10 }} // Add pagination
      />
    </Layout>
  );
};

export default User;
