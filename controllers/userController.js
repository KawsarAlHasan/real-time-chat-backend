const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/userToken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// sign up
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

// user login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide your credentials",
      });
    }

    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, userEmail.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }

    const token = generateToken(userEmail);

    const { password: pwd, ...others } = userEmail.toObject();
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "User login unsuccess",
      error: error.message,
    });
  }
};

// get me user
exports.getMeUser = async (req, res, next) => {
  try {
    const user = req?.decodedUser;
    res.status(200).json({
      success: true,
      message: "My Profile",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
