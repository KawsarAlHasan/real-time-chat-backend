const express = require("express");

const varifyToken = require("../middleware/verify.user.token");
const {
  createUser,
  loginUser,
  getMeUser,
  getAllUsers,
  getUserById,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", varifyToken, getMeUser);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
