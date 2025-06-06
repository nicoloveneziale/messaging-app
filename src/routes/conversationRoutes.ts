import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createConversationController, getAllConversationsController, getConversationMessagesController, sendMessageController, deleteMessageController, deleteConversationController, markAsReadController } from "../controllers/conversationController";

const router = express.Router();

//Crate a new conversation
router.post("/", authenticate, createConversationController);
//Delete a conversation
router.delete("/:id", authenticate, deleteConversationController);
//Get all conversations for the current user
router.get("/", authenticate, getAllConversationsController);
//Get all messages for a conversation
router.get("/:id/messages", authenticate,getConversationMessagesController);
//Create a new message in a conversation
router.post("/:id/messages", authenticate, sendMessageController);
//Delete a message in a conversation
router.delete("/:id/messages/:messageId", authenticate, deleteMessageController)
//Mark conversation as read
router.put("/:id/read", authenticate, markAsReadController);


export default router;
