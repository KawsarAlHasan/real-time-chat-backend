const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/userToken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);
    res.status(201).json({
      status: true,
      message: "User created",
      data: {
        user: user,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("Email already exists", 409));
    }
    if (error.name === "ValidationError") {
      const errors = {};
      for (let key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      return next(new AppError("Validation failed", 400, errors));
    }
    next(error);
  }
};
