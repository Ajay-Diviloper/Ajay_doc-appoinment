const usermodel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctormodel = require("../models/doctormodel");
const appointmodel = require("../models/appointmodel");
const sendmailverification = require("../utils/sendmailverification");
// const moment = require("moment");

const registercontroller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(500).send({
        success: false,
        message: "all filed required",
      });
    }
    //check user
    const existing = await usermodel.findOne({ email });
    if (existing)
      return res.status(500).send({
        success: false,
        message: "email already Registered",
      });

    //hashing Password
    const salt = bcrypt.genSaltSync(10);
    const hashpassword = await bcrypt.hash(password, salt);
    //create new user
    const user = await usermodel.create({
      name,
      email,
      password: hashpassword,
    });

    res.status(201).send({
      success: true,
      message: "Successfully Registered",
      user,
    });
  } catch (err) {
    console.log("error", err);
  }
};

const mailotp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "email and pass required",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//login  controller

const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "email and pass required test",
      });
    }
    //check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "user does not exist",
      });
    }

    // check user password
    var ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(501).send({
        success: false,
        message: "password not match",
      });
    }

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successful",
      token,
      user,
    });
  } catch (err) {
    console.log("error 1", err);
  }
};

const loginmailcontroller = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        message: "email required",
        success: false,
      });
    }

    const user = await usermodel.findOne({ email });

    sendmailverification(req, user);

    res.status(200).send({
      success: true,
      message: "otp send",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in opt send api",
    });
  }
};

//auth controller

const authcontroller = async (req, res) => {
  try {
    const user = await usermodel.findOne({ _id: req.body.id });
    console.log(user);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    } else {
      // Ensure only non-sensitive information is sent back
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.error("Error in auth controller:", error.message);
    res.status(500).send({
      message: "Error in auth controller",
      success: false,
    });
  }
};

//apply doctor

const applydoctorcontroller = async (req, res) => {
  try {
    // const {} = req.body;

    const newdoctor = await doctormodel({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminuser = await usermodel.findOne({ isAdmin: true });
    const notification = adminuser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newdoctor.firstname} ${newdoctor.lastname} has applied `,
      data: {
        doctorid: newdoctor._id,
        name: newdoctor.firstname + " " + newdoctor.lastname,
        onClickPath: "/admin/doctors",
      },
    });

    await usermodel.findByIdAndUpdate(
      adminuser._id, // ID of the document to update
      { notification } // The update object
    );

    res.status(200).send({
      success: true,
      message: "doctor acccout applied successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in apply doctor api",
    });
  }
};

//notification controller

const getnotificationcontroller = async (req, res) => {
  try {
    const user = await usermodel.findOne({ _id: req.body.userId });

    // const seennotification = user.seennotification;
    // const notification = user.notification;
    // seennotification.push(...notification);
    // user.notification = [];
    // user.seennotification = notification;

    const seennotification = user.seennotification || [];
    const notification = user.notification || [];
    seennotification.push(...notification);

    user.notification = [];
    user.seennotification = seennotification;

    const updateduser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification read",
      data: updateduser,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleltenotificationcontroller = async (req, res) => {
  try {
    const user = await usermodel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updateuser = await user.save();
    updateuser.password = undefined;

    res.status(200).send({
      success: true,
      message: "notification deleted ",
      data: updateuser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "unable to delete all notification",
    });
  }
};

const getalldoctor = async (req, res) => {
  try {
    const doctors = await doctormodel.find({ status: "approved" });
    res.status(200).send({
      message: "all doctor",
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while fetching doctor",
    });
  }
};

//book appointment
const bookapointmenctr = async (req, res) => {
  try {
    console.log("📥 Received appointment request:", req.body); // Debug request

    // Validate required fields
    const { userid, doctorid, doctorinfo, userinfo, date, time } = req.body;
    if (!userid || !doctorid || !doctorinfo || !userinfo || !date || !time) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Save new appointment
    const newAppointment = new appointmodel({
      userid,
      doctorid,
      doctorinfo,
      userinfo,
      date,
      time,
      status: "pending",
    });

    await newAppointment.save();
    console.log("✅ Appointment successfully saved:", newAppointment);
    // Find user & update notification
    const user = await usermodel.findById(userid);
    console.log("🔍 Retrieved User:", user);
    if (user) {
      // Ensure notification array exists
      if (!Array.isArray(user.notification)) {
        console.warn(
          "⚠️ User notifications array is undefined. Initializing..."
        );
        user.notification = [];
      }
      user.notification.push({
        type: "new-appointment-request",
        message: `A new appointment request from ${userinfo.name}`,
        onClickPath: "/user/appointments",
      });
      await user.save();
      console.log("✅ Notification added to user");
    } else {
      console.error("🚨 User not found in database!");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send response back to frontend
    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// const checkavailbilityctr = async (req, res) => {
//   try {
//     const date = moment(req.body.date, "DD-MM-YY").toISOString();
//     const fromtime = moment(req.body.time, "HH:mm")
//       .subtract(1, "hours")
//       .toISOString();
//     const totime = moment(req.body.time, "HH:mm")
//       .subtract(1, "hours")
//       .toISOString();

//     const appointments = await appointmodel.find({
//       doctorid,
//       date,
//       time: {
//         $gte: fromtime,
//         $lte: totime,
//       },
//     });
//     if (appointments.length > 0) {
//       return res.status(200).send({
//         message: "appointments not available at this time",
//         success: true,
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         message: "appoinment availalbe",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const userappointmetnctr = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    const appointments = await appointmodel.find({ userId: req.body.userid });
    console.log("Appointments:", appointments); // Log the appointments
    res.status(200).send({
      success: true,
      message: "All appointments retrieved",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "All appointment retrieval failed",
      success: false,
    });
  }
};

module.exports = {
  applydoctorcontroller,
  authcontroller,
  registercontroller,
  logincontroller,
  getnotificationcontroller,
  deleltenotificationcontroller,
  getalldoctor,
  bookapointmenctr,
  userappointmetnctr,
  loginmailcontroller,

  mailotp,
};
