import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./features/alertslice"; // Adjust path as needed
import userSlice from "./features/userslice";

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    user: userSlice, // Ensure 'alerts' matches the key used in `useSelector`
  },
});

export default store;
