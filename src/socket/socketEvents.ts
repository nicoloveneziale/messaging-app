import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendMessage, isUserParticipant } from "../db/conversationQueries";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "secret-key";

// Extend Socket type to include userId after authentication
interface AuthenticatedSocket extends Socket {
  userId?: number;
}

