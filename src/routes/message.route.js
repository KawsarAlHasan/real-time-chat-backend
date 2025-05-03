const express = require("express");
const {
  getMessages,
  getConversations,
  markAsRead,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/", getMessages);
router.get("/sender/:receiver_id", getConversations);
router.put("/read-message", markAsRead);

module.exports = router;
