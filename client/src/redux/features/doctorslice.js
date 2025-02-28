// src/redux/features/doctorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctor: null,
  },
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload;
    },
    clearDoctor: (state) => {
      state.doctor = null;
    },
  },
});

export const { setDoctor, clearDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
