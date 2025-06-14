import express from "express";
import passport from "../config/passportConfig";
import {
  loginController,
  protectedRouteController,
  registerUserController,
  verifyTokenController,
} from "../controllers/authController";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  loginController,
);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  protectedRouteController,
);
router.post("/register", registerUserController);
router.get("/verify", passport.authenticate("jwt", { session: false }), verifyTokenController )

export default router;
