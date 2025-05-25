import express from "express";
import {
  searchUserController,
} from "../controllers/userController";
import {
  authenticate,
} from "../middleware/authMiddleware";

const router = express.Router();

router.get("/user/:username", authenticate, searchUserController);

export default router;