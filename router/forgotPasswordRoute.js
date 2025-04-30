const express = require("express");
const {
  forgotPassword,
  verifyResetCode,
  newPasswordSet,
} = require("../controllers/forgotPasswordController");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/new-password", newPasswordSet);

module.exports = router;
