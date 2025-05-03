import express from "express";
import authRoutes from "./authRoutes";
import profileRoutes from "./profileRoutes";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("api");
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

export default router;
