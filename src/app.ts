import express from "express";
import router from "./routes/indexRouter";
import passport from "passport";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import "./config/passportConfig";

//Express setup
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//Server
const PORT = process.env.PORT || 8000;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
