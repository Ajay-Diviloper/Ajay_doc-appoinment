const mongoose = require("mongoose");

const doctorschema = new mongoose.Schema(
  {
    userid: {
      type: String,
    },
    firstname: {
      type: String,
      required: [true, "first name is required"],
    },
    lastname: {
      type: String,
      required: [true, "last name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    speicialization: {
      type: String,
      required: [true, "specialization"],
    },
    experience: {
      type: String,
      required: [true, "experience is required "],
    },
    feespercunsaltation: {
      type: Number,
      required: [true, "fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "timings is required"],
    },
  },
  { timestamps: true }
);

const doctormodel = mongoose.model("doctor", doctorschema);

module.exports = doctormodel;
