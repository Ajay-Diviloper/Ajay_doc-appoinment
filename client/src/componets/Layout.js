import React from "react";
import "../style/layoutstyle.css";
import { adminmenu, usermenu } from "../Data/Data";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Badge, message } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userslice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  //doctor menu

  const docmenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },

    {
      name: "profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // Check if the `user` object exists and `isadmin` is a valid property
  // const Sidebarmenu = user?.isAdmin
  //   ? adminmenu
  //   : user?.isdoctor
  //   ? docmenu
  //   : usermenu;

  const Sidebarmenu = user?.isAdmin
    ? adminmenu
    : user?.isDoctor
    ? docmenu
    : usermenu;
  // Logout function

  const handlelogout = () => {
    localStorage.clear();
    dispatch(setUser(null)); // Clear user state in Redux
    message.success("Logout successfully");
    navigate("/login");
  };

  // const handlelogout = () => {
  //   localStorage.clear();
  //   message.success("Logout successfully");
  //   navigate("/login");
  // };

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h4>DOC APP</h4>
          </div>
          <hr className="HR" />
          <div className="menu">
            {Sidebarmenu.map((menu, index) => {
              const isactive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`menu-item ${isactive ? "active" : ""}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}

            <div className="menu-item" onClick={handlelogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span
                style={{
                  color: "#ffff",

                  cursor: "pointer",
                }}
              >
                Logout
              </span>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            <div className="d-flex align-items-center justify-content-end gap-3 p-3 border-bottom bg-light">
              <Badge
                count={user && user.notification.length}
                onClick={() => navigate("/notification")}
              >
                <i
                  className="fa-solid fa-bell fs-4 text-secondary"
                  style={{
                    fontSize: "24px",
                    color: "#555",
                    cursor: "pointer",
                  }}
                ></i>
              </Badge>
              <Link
                to="/profile"
                className="text-decoration-none fw-bold text-secondary"
              >
                {user?.name || "Profile"}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
