import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isOtpSent: false, // ✅ Store OTP state globally
};

export const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    setOtpSent: (state, action) => {
      state.isOtpSent = action.payload;
    },
  },
});

export const { showLoading, hideLoading, setOtpSent } = alertSlice.actions;
export default alertSlice.reducer;
