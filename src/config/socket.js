const socketIo = require("socket.io");
const User = require("../models/user.model");
const Message = require("../models/message.model");

let io;
const users = {}; // userId to socketId mapping

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
      },
    });

    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      socket.on("userConnected", async (userId) => {
        try {
          users[userId] = socket.id;
          await User.findByIdAndUpdate(userId, { isOnline: true });
          console.log(`User ${userId} connected`);
        } catch (error) {
          console.error("User connection error:", error);
        }
      });

      socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        try {
          const newMessage = new Message({ senderId, receiverId, message });
          const savedMessage = await newMessage.save();

          const messageToSend = savedMessage.toObject();

          // Send to receiver
          if (users[receiverId]) {
            io.to(users[receiverId]).emit("receiveMessage", messageToSend);
          }

          // Send to sender
          if (users[senderId]) {
            io.to(users[senderId]).emit("receiveMessage", messageToSend);
          }
        } catch (error) {
          console.error("Message send error:", error);
          if (users[senderId]) {
            io.to(users[senderId]).emit("messageError", error.message);
          }
        }
      });

      socket.on("disconnect", async () => {
        for (const userId in users) {
          if (users[userId] === socket.id) {
            delete users[userId];
            await User.findByIdAndUpdate(userId, { isOnline: false });
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });

    return io;
  },

  getIo: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  },
};
