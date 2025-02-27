const doctormodel = require("../models/doctormodel");
const usermodel = require("../models/usermodel");

const getalluserctr = async (req, res) => {
  try {
    const user = await usermodel.find({});
    res.status(200).send({
      success: true,
      message: "user data",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in getalluserctr api",
      error,
    });
  }
};

const getalldocctr = async (req, res) => {
  try {
    const doctor = await doctormodel.find({});
    res.status(200).send({
      success: true,
      message: "all doctor list",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in getdoctcr",
      error,
    });
  }
};

//doctor account staus

const changeaccountstatusctr = async (req, res) => {
  try {
    const { doctorid, status } = req.body;

    // Validate input
    if (!doctorid || !status) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID and status are required.",
      });
    }

    // Update doctor's status
    const doctor = await doctormodel.findByIdAndUpdate(
      doctorid,
      { status },
      { new: true } // Return the updated document
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Find associated user
    const user = await usermodel.findById(doctor.userid);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User associated with the doctor not found.",
      });
    }

    // Add notification
    user.notification.push({
      type: "doctor-account-request-updated",
      message: `Your doctor account request has been ${status}.`,
      onClickPath: "/notification",
    });

    // Update isDoctor status
    user.isDoctor = status === "approved" ? true : false;

    await user.save();

    // Send success response
    res.status(201).send({
      success: true,
      message: "Account status updated successfully.",
      data: doctor,
    });
  } catch (error) {
    console.error("Error updating account status:", error); // Log error
    res.status(500).send({
      success: false,
      message: "An error occurred while updating the account status.",
      error: error.message,
    });
  }
};

module.exports = {
  getalluserctr,
  getalldocctr,
  changeaccountstatusctr,
};
