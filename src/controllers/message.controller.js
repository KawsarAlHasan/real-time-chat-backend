const Message = require("../models/message.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and receiverId are required",
      });
    }

    // Validate if users exist
    const usersExist = await User.find({
      _id: { $in: [senderId, receiverId] },
    }).select("_id");

    if (usersExist.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or both users not found",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email status isOnline lastSeen")
      .populate("receiverId", "name email status isOnline lastSeen");

    res.status(200).json({
      success: true,
      data: messages,
      message: "Messages retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get conversation list for a user
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get distinct conversation partners with last message details
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: mongoose.Types.ObjectId(userId) },
            { receiverId: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    // Populate user details for each conversation
    const populatedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const user = await User.findById(conversation._id).select(
          "name email status isOnline lastSeen"
        );

        return {
          user,
          lastMessage: conversation.lastMessage,
          unreadCount: conversation.unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedConversations,
      message: "Conversations retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const { userId } = req.params;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message IDs array is required",
      });
    }

    // Validate all messages belong to this user as receiver
    const updateResult = await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: userId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No unread messages found to update",
      });
    }

    res.status(200).json({
      success: true,
      message: `${updateResult.modifiedCount} messages marked as read`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
