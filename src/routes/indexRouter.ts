import { Request, Response, Router } from "express";
import authRoutes from "./authRoutes";
import profileRoutes from "./profileRoutes";

const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.json("api");
});

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);

export default router;
