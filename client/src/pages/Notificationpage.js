import React from "react";
import Layout from "./../componets/Layout";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertslice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notificationpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleMarkReadAll = async () => {
    if (!user || !user.notification || user.notification.length === 0) {
      return message.info("No new notifications to mark as read.");
    }
    try {
      dispatch(showLoading());

      const res = await axios.post(
        "/api/get-all-notification",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error marking notifications as read:", error);
      message.error("Something went wrong.");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/delete-all-notification",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/notification");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting read notifications:", error);
      message.error("Failed to delete notifications.");
    }
  };

  return (
    <Layout>
      <h4 className="m-3 text-center p-3">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="unread" key={1}>
          <div
            style={{ cursor: "pointer", border: "none", background: "none" }}
          >
            <h4 className="p-2" onClick={handleMarkReadAll}>
              Mark All Read
            </h4>
          </div>

          {user?.notification?.length > 0 ? (
            user.notification.map((notimsg) => (
              <div
                className="card"
                key={notimsg.id} // Replace with actual unique identifier
                onClick={() =>
                  notimsg.onClickPath && navigate(notimsg.onClickPath)
                }
              >
                <div className="card-text">{notimsg.message}</div>
              </div>
            ))
          ) : (
            <p>No notifications available</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="read" key={2}>
          <div>
            <h4 className="p-2" onClick={handleDeleteAllRead}>
              Delete All Read
            </h4>
          </div>

          {user?.seennotification?.length > 0 ? (
            user.seennotification.map((notimsg) => (
              <div
                className="card"
                key={notimsg.id} // Replace with actual unique identifier
                onClick={() =>
                  notimsg.onClickPath && navigate(notimsg.onClickPath)
                }
              >
                <div className="card-text">{notimsg.message}</div>
              </div>
            ))
          ) : (
            <p>No notifications available</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default Notificationpage;
