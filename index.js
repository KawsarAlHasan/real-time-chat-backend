const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { dbConnect } = require("./src/config/db.connect");
const cors = require("cors");
dotenv.config();
const app = require("./src/app");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// database connection
dbConnect();

// server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Task Management Server is running on port ${port}`);
});
