const express = require("express");

const {
  registercontroller,
  logincontroller,
  authcontroller,
  applydoctorcontroller,
  getnotificationcontroller,
  deleltenotificationcontroller,
  getalldoctor,
  bookapointmenctr,
  userappointmetnctr,

  mailotp,
  logincontroller2,
} = require("../controllers/usercontroller");
const authmiddleware = require("../middleware/authmiddleware");
const { finalmailotpctr } = require("../controllers/finalmailotpctr");

const router = express.Router();

router.post("/register", registercontroller);

router.post("/login", logincontroller);

//auth || post
router.post("/getuserdata", authmiddleware, authcontroller);

//auth || post
router.post("/apply-doctor", applydoctorcontroller);

//notification
router.post("/get-all-notification", authmiddleware, getnotificationcontroller);

//notification
router.post(
  "/delete-all-notification",
  authmiddleware,
  deleltenotificationcontroller
);

//get all doctor
router.get("/getalldoctor", getalldoctor);

//book appointment
router.post("/book-appointment", bookapointmenctr);

//booking availbility
// router.post("/booking-availbiloty", checkavailbilityctr);

//user appointment
router.get("/user-appointment", userappointmetnctr);

module.exports = router;
