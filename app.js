const express = require("express");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

// router
app.use("/api/v1/user", require("./router/userRoute"));

app.get("/", (req, res) => {
  res.status(200).send("Chat Server is working");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
