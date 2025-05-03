const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    isOnline: { type: Boolean, default: true },

    lastSeen: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
