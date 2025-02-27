const express = require("express");
const {
  finalmailotpctr,
  verifyotpcontroller,
} = require("../controllers/finalmailotpctr");

const router = express.Router();

// ✅ This route is now inside `/api/otp/register2`
router.post("/sentotp", finalmailotpctr);
router.post("/verifyotp", verifyotpcontroller);

module.exports = router;
