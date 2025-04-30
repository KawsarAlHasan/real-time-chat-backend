const express = require("express");
const {
  createUser,
  loginUser,
  getMeUser,
} = require("../controllers/userController");

const varifyToken = require("../middleware/verifyUserToken");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", varifyToken, getMeUser);

module.exports = router;
