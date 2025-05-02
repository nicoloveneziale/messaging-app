import express from "express";
import authRoutes from "./authRoutes";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("api");
});

router.use("/auth", authRoutes);

export default router;
