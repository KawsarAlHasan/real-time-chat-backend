const express = require("express");

const varifyToken = require("../middleware/verify.user.token");
const {
  createUser,
  loginUser,
  getMeUser,
  getAllUsers,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", varifyToken, getMeUser);
router.get("/all", getAllUsers);

module.exports = router;
