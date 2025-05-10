import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createConversationController, getAllConversationsController, getConversationMessagesController } from "../controllers/conversationController";

const router = express.Router();

router.post("/", authenticate, createConversationController);
router.get("/", authenticate, getAllConversationsController);
router.get("/:id/messages", authenticate,getConversationMessagesController);

export default router;
