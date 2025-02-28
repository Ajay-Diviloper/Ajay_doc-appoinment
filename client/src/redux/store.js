import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./features/alertslice"; // Adjust path as needed
import userSlice from "./features/userslice";
import doctorSlice from "./features/doctorslice";

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    user: userSlice,
    doctor: doctorSlice, // Ensure 'alerts' matches the key used in `useSelector`
  },
});

export default store;
