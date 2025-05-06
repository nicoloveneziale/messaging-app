import express from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/profileController";
import {
  authenticate,
  authoriseProfileUpdate,
} from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:id", getProfileController);
router.patch(
  "/:id",
  authenticate,
  authoriseProfileUpdate,
  updateProfileController,
);

export default router;
