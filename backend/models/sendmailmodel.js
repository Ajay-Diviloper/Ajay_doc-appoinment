const mongoose = require("mongoose");

const emailverificationschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "15m",
  },
});

const emailverionmodel = mongoose.model(
  "emailverification",
  emailverificationschema
);

module.exports = emailverionmodel;
