const express = require("express");
const router = require("./routes/indexRouter");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

//Express setup
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passportConfig");

//Server
const PORT = process.env.PORT || 8000;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
