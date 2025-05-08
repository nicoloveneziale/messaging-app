import { Request, Response, Router } from "express";
import authRoutes from "./authRoutes";
import profileRoutes from "./profileRoutes";
import conversationRoutes from "./conversationRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/conversations", conversationRoutes);

export default router;
