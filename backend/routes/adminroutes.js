const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const {
  getalluserctr,
  getalldocctr,
  changeaccountstatusctr,
} = require("../controllers/admincontroller");
const router = express.Router();

//get all user

router.get("/getalluser", getalluserctr);
router.get("/getalldoctor", getalldocctr);
router.post("/updatedocstatus", changeaccountstatusctr);

module.exports = router;
