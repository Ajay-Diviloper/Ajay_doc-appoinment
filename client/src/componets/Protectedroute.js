import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertslice";
import { setUser } from "../redux/features/userslice";

const Protectedroute = ({ children }) => {
  const navigate = useNavigate(); // Renamed to avoid conflict
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/getuserdata",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        navigate("/login");
        //localStorage.clear(); // Use navigate function for programmatic navigation
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching user data:", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    }
  }, [user]); // No need to include getUser in the dependency array

  if (localStorage.getItem("token") && user) {
    return children;
  } else if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  } else {
    return null; // Return null while loading
  }
};

export default Protectedroute;
