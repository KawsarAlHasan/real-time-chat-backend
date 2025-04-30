const mongoose = require("mongoose");

const ForgotPasswordSchema = mongoose.Schema({
  reset_code: {
    type: String,
    required: true,
    length: 6,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"], // Simple email validation
  },
  reset_code_expire: {
    type: Date,
    required: true,
    index: { expires: "5m" }, // Automatically delete document after 5 minutes
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ForgotPassword", ForgotPasswordSchema);
