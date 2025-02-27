import React, { useEffect, useState } from "react";
import Layout from "../componets/Layout";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import { message } from "antd";

const BookingPage = () => {
  const [date, setdate] = useState();
  const [time, settimings] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  const getSingleDoc = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/doctor/getsingledocbyid", {
        id: params.id, // Ensure this value is correc     getsingledocbyid
      });

      console.log("Response received:", response.data);

      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        setError("Doctor details not found");
      }
    } catch (error) {
      setError("Failed to fetch doctor details");
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!date || !time) {
      message.error("Please select a date and time");
      return;
    }

    console.log("📅 Selected Date:", date);
    console.log("⏰ Selected Time:", time);
    console.log("👤 User Info:", user);
    console.log("🩺 Doctor Info:", doctor);

    if (!user?._id || !doctor?._id) {
      console.error("🚨 Missing user or doctor ID!");
      message.error("User or Doctor information is missing.");
      return;
    }

    try {
      console.log("📤 Sending appointment request...");

      const requestData = {
        userid: user._id,
        doctorid: doctor._id,
        doctorinfo: doctor,
        userinfo: user,
        date: date,
        time: time,
      };

      console.log("📦 Request Payload:", requestData);

      const response = await axios.post("/api/book-appointment", requestData);

      console.log("✅ Booking Response:", response.data);

      if (response.data.success) {
        message.success(response.data.message);
      } else {
        console.error("❌ Booking failed. Server response:", response.data);
        message.error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("❌ Error booking appointment:", error);

      if (error.response) {
        console.error("📩 Response Data:", error.response.data);
        console.error("🔢 Response Status:", error.response.status);
        console.error("📄 Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error(
          "🚫 No Response Received. Request Details:",
          error.request
        );
      } else {
        console.error("❗ Error Message:", error.message);
      }

      message.error(
        "An error occurred while booking the appointment. Please try again."
      );
    }
  };

  // const hanldeavailbiity = async () => {
  //   try {
  //     const res = await axios.post("/api/booking-availbiloty", {
  //       doctorid: params.doctorid,
  //     });

  //     // if(res.data.success){

  //     // }
  //   } catch (error) {}
  // };

  useEffect(() => {
    getSingleDoc();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Booking Page</h2>
        {loading && <p>Loading doctor details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {doctor && (
          <div className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">
              Dr. {doctor.firstname} {doctor.lastname}
            </h3>
            <p>
              <strong>Specialization:</strong> {doctor.speicialization}
            </p>
            <p>
              <strong>Experience:</strong> {doctor.experience} years
            </p>
            <p>
              <strong>Fee:</strong> {doctor.feespercunsaltation}
            </p>
            <p>
              <strong>Timmings:</strong> {doctor.timings[0]}-{doctor.timings[1]}
            </p>
            <div>
              <DatePicker
                format="DD-MM-YYYY"
                onChange={(value) => {
                  if (value) {
                    setdate(value); // Store raw moment object
                    console.log(
                      "📅 Selected Date:",
                      value.format("DD-MM-YYYY")
                    );
                  }
                }}
              />
              <TimePicker.RangePicker
                format="HH:mm"
                onChange={(values) =>
                  settimings([
                    moment(values[0]).format("HH:mm"),
                    moment(values[1]).format("HH:mm"),
                  ])
                }
              />
            </div>
            <button
              className="mt-4 bg-blue-500 text-success px-4 py-2 rounded"
              onClick={() =>
                alert("check avialbility functonality coming soon!")
              }
            >
              Check Availbility
            </button>
            <button
              className="mt-4 bg-blue-500 text-success px-4 py-2 rounded"
              onClick={handleBooking}
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
