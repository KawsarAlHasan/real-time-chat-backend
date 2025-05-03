const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { dbConnect } = require("./src/config/db.connect");
const cors = require("cors");
dotenv.config();
const { app, server } = require("./src/app");

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

// database connection
dbConnect();

// server
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Task Management Server is running on port ${port}`);
});
