const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/user.token");
const User = require("../models/user.model");

// sign up
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide name, email & password field in body",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    const user = await User.create(req.body);
    const token = generateToken(user);
    res.status(201).json({
      status: true,
      message: "User Signup successfully",
      data: {
        user: user,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
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

// get all user with filter
exports.getAllUsers = async (req, res, next) => {
  try {
    const { name, email, status, isOnline } = req.query;

    const filter = {};

    if (name) filter.name = name;
    if (email) filter.email = email;
    if (status) filter.status = status;
    if (isOnline !== undefined) filter.isOnline = isOnline === "true"; // string to boolean

    const result = await User.find(filter);

    res.status(200).json({
      success: true,
      message: "Get All User",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
