import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createConversationController } from "../controllers/conversationController";

const router = express.Router();

router.post("/", authenticate, createConversationController);
router.get("/", authenticate);
router.get("/:id/messages", authenticate);

export default router;
