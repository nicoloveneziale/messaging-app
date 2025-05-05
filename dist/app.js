"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
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
app.use("/", indexRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
