const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const {
  getdinfoctr,
  updatedocprofile,
  getsingledocbyidctr,
  doctorapointmetctr,
  updatestatuscontroller,
} = require("../controllers/doctorctr"); // Destructuring controllers

const router = express.Router();

// Route to get doctor information
router.post("/getdocinfor", authmiddleware, getdinfoctr);

// Route to update doctor profile
router.post("/updatedocprofile", authmiddleware, updatedocprofile);

//post get single doc info

router.post("/getsingledocbyid", getsingledocbyidctr);

//get appointemtns

router.get("/doctor-appointments", doctorapointmetctr);

//post update status
router.post("/update-status", updatestatuscontroller);

module.exports = router;
