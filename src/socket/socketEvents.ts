import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendMessage, isUserParticipant, updateLastMessage } from "../db/conversationQueries";
import { findUserById } from "../db/userQueries";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "secret-key";

const prisma = new PrismaClient();

// Extend Socket type to include userId after authentication
interface AuthenticatedSocket extends Socket {
  userId?: number;
}

//Initialize socket.io event listeners
export const initializeSocketIO = (io: Server) => {

    //Middleware to authenticare the socket connection
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            console.warn("No token provided");
            return next(new Error("Authentication error"));
        } 

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            socket.userId = decoded.sub;
            next();
        } catch (error) {
            console.error("Invalid token", error);
            next(new Error("Authentication error"));
        }
    });

    //Socket connection event
    io.on("connection", (socket: AuthenticatedSocket) => {
        console.log("User connected:", socket.userId, "Socket ID:", socket.id);

        //Client joins a conversation
        socket.on("join_conversation", async (conversationId: number, callback?: (status: 'success' | 'error', message?: string) => void) => {
            if (!socket.userId) {
                if (callback) callback("error", "User not authenticated.");
                    return;
                }
            if (isNaN(conversationId)) {
                if (callback) callback("error", "Invalid conversation ID.");
                return;
            }

            try {
                //Check if the user is a participant in the conversation
                const isParticipant = await isUserParticipant(socket.userId, conversationId);

                if (isParticipant) {
                    socket.join(conversationId.toString());
                     if (callback) callback("success", "Joined conversation.");
                } else {
                     if (callback) callback("error", "Forbidden - Not a participant in this conversation.");
                }
            }catch (error) {
                console.error(`Error joining conversation room ${conversationId} for user ${socket.userId}:`, error);
                if (callback) callback("error", "Server error while joining conversation.");
            }
        })

        //Client sends a message in a conversation
        socket.on("message:send", async (data: { conversationId: number; content: string }, callback?: (status: 'success' | 'error', message?: string, newMessage?: any, newConversation?: any) => void) => { 
            if (!socket.userId) {
                 if (callback) callback("error", "User not authenticated.");
                return;
            }   

            const { conversationId, content } = data;

            if (isNaN(conversationId) || !content || typeof content !== 'string' || content.trim() === '') {
                if (callback) callback("error", "Invalid conversation ID or message content.");
                return;
            }

            try {
                //Check if the user is a participant in the conversation
                const isParticipant = await isUserParticipant(socket.userId, conversationId);
                if (!isParticipant) {
                if (callback) callback("error", "Forbidden - Not a participant in this conversation.");
                return;
                }

                //Send the message to the database
                const newMessage = await sendMessage(conversationId, socket.userId, content);
                const newConversation = await updateLastMessage(conversationId,newMessage.id);
                //Emit the new message to everyone in the conversation room
                io.to(conversationId.toString()).emit("message:new", newMessage, newConversation);
                console.log(`User ${socket.userId} sent message to conversation ${conversationId}: "${content}"`);

                if (callback) callback("success", "Message sent.", newMessage, newConversation);

            } catch (error) {
                console.error(`Error sending message to conversation ${conversationId} for user ${socket.userId}:`, error);
                if (callback) callback("error", "Server error while sending message.");
            }
        })

        //Client is typing
        socket.on("typing:start", async (conversationId: number) => {
            if (!socket.userId) {
                return;
            } 
            const user = await findUserById(socket.userId);
            if (!socket.userId || isNaN(conversationId)) return;
            socket.to(conversationId.toString()).emit("typing:start", {
                conversationId: conversationId,
                userId: socket.userId,
                username: user?.username
            });
        });

        //Client stops typing
        socket.on("typing:stop", (conversationId: number) => {
            if (!socket.userId || isNaN(conversationId)) return;
            socket.to(conversationId.toString()).emit("typing:stop", {
                conversationId: conversationId,
                userId: socket.userId
            });
        });

        //Client disconnects from the socket
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userId} (Socket ID: ${socket.id})`);
        });
    } )
}