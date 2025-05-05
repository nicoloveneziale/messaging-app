import express from "express";
import { getProfileController } from "../controllers/profileController";

const router = express.Router();

router.get("/:id", getProfileController);

export default router;
