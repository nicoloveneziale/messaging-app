import express from "express";
import { createServer } from "http";
import {Server as SocketIOServer} from "socket.io";
import router from "./routes/indexRouter";
import passport from "passport";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import "./config/passportConfig";

import {initializeSocketIO} from "./socket/socketEvents"

//Express setup
const app = express();

//Create a HTTP server
const httpServer = createServer(app);

//Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: {
  origin: "hhtps://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
  }
})

initializeSocketIO(io);

//Express middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//Routes
app.use("/", router);

//Server port
const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {io};