import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinners from "./componets/Spinners";
import Protectedroute from "./componets/Protectedroute";
import Publicroute from "./componets/Publicroute";
import Applydoctor from "./pages/Applydoctor";
import Notificationpage from "./pages/Notificationpage";
import Doctor from "./pages/admin/Doctor"; // Correct casing for Doctor.js
import User from "./pages/admin/User"; // Correct casing for User.js
import Profile from "./pages/doctor/Profile";
import Bookingpage from "./pages/Bookingpage";
import Appointmentpage from "./pages/Appointmentpage";
import DoctorAppointment from "./pages/doctor/DoctorAppointment";
import Loginwithotp from "./pages/Loginwithotp";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading ? (
        <Spinners />
      ) : (
        <Routes>
          <Route
            path="/apply-doctor"
            element={
              <Protectedroute>
                <Applydoctor />
              </Protectedroute>
            }
          />
          <Route
            path="/"
            element={
              <Protectedroute>
                <Home />
              </Protectedroute>
            }
          />
          <Route
            path="/login"
            element={
              <Publicroute>
                <Login />
              </Publicroute>
            }
          />
          <Route
            path="/register"
            element={
              <Publicroute>
                <Register />
              </Publicroute>
            }
          />
          <Route
            path="/notification"
            element={
              <Protectedroute>
                <Notificationpage />
              </Protectedroute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <Protectedroute>
                <User />
              </Protectedroute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <Protectedroute>
                <Doctor />
              </Protectedroute>
            }
          />

          <Route
            path="/doctor/profile/:id"
            element={
              <Protectedroute>
                <Profile />
              </Protectedroute>
            }
          />

          <Route
            path="/doctor/booking/:id"
            element={
              <Protectedroute>
                <Bookingpage />
              </Protectedroute>
            }
          />

          <Route
            path="/appointments"
            element={
              <Protectedroute>
                <Appointmentpage />
              </Protectedroute>
            }
          />

          <Route
            path="/doctor-appointments"
            element={
              <Protectedroute>
                <DoctorAppointment />
              </Protectedroute>
            }
          />

          <Route
            path="/login-otp"
            element={
              <Publicroute>
                <Loginwithotp />
              </Publicroute>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
