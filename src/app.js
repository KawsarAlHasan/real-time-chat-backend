const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("./config/socket");
const http = require("http");
const app = express();

const server = http.createServer(app);

const io = socket.init(server);

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// router
app.use("/api/v1/user", require("./routes/user.route"));

app.use("/api/v1/forgot", require("./routes/forgot.password.route"));

app.use("/api/v1/message", require("./routes/message.route"));

app.get("/", (req, res) => {
  res.status(200).send("Task Management is working");
});

module.exports = { app, server };
