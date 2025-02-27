const doctormodel = require("../models/doctormodel");
const appointmodel = require("../models/appointmodel");
const Appointment = require("../models/appointmodel");
const userModel = require("../models/usermodel");

// Controller to get doctor information
const getdinfoctr = async (req, res) => {
  try {
    const doctor = await doctormodel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "doctor profile updated",
      data: doctor,
    });
  } catch (error) {
    // Log and send error response
    console.error("Error updating doctor profile:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error. Unable to update doctor profile.",
    });
  }

  //     // Validate input
  //     if (!req.body.userid) {
  //       return res.status(400).send({
  //         success: false,
  //         message: "User ID is required.",
  //       });
  //     }

  //     // Query the database
  //     const doctor = await doctormodel.findOne({ userid: req.body.userid });

  //     if (!doctor) {
  //       return res.status(404).send({
  //         success: false,
  //         message: "Doctor not found.",
  //       });
  //     }

  //     // Send success response
  //     res.status(200).send({
  //       success: true,
  //       message: "Doctor data fetched successfully.",
  //       data: doctor,
  //     });
  //   } catch (error) {
  //     // Log and send error response
  //     console.error("Error fetching doctor details:", error);
  //     res.status(500).send({
  //       success: false,
  //       message: "Internal Server Error. Unable to fetch doctor details.",
  //     });
  //   }
  // };

  // Controller to update doctor profile
};
const updatedocprofile = async (req, res) => {
  try {
    const doctor = await doctormodel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "doctor profile updated",
      data: doctor,
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error); // Debug error details
    res.status(500).send({
      success: false,
      message: "Internal Server Error. Unable to update doctor profile.",
    });
  }
};

const getsingledocbyidctr = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debug request body

    const { id } = req.body; // Extract doctorid

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await doctormodel.findById(id); // Use findById

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single doc info done",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting doctor by ID",
      error: error.message,
    });
  }
};

const doctorapointmetctr = async (req, res) => {
  try {
    // Fetch the doctor based on userId
    const doctor = await doctormodel.findOne({ userId: req.body.userid });

    // Check if the doctor was found
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }

    // Fetch the appointments based on doctorId (assuming the appointment model uses doctorId to reference the doctor)
    const appointments = await appointmodel.find({ doctorid: doctor._id });

    // Send the response with fetched appointments
    res.status(200).send({
      message: "Doctor appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in doctor appointment controller",
      success: false,
    });
  }
};

const updatestatuscontroller = async (req, res) => {
  try {
    const { appoinmentId, status } = req.body;
    const appointment = await appointmodel.findByIdAndUpdate(
      appoinmentId,
      {
        status,
      },
      { new: true }
    );

    const user = await userModel.findOne({ _id: appointment.userid });
    user.notification.push({
      type: "status upated",
      message: `your appointment has been updated ${status}`,
      onClickPath: "/doctor-appoinment",
    });
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in update status",
    });
  }
};
module.exports = {
  getdinfoctr,
  updatedocprofile,
  getsingledocbyidctr,
  doctorapointmetctr,
  updatestatuscontroller,
};
