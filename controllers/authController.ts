import { Request, Response } from "express";
import passport, { generateToken } from "../config/passportConfig";

export const loginController = (req: Request, res: Response) => {
  if (req.user) {
    const token = generateToken(req.user);
    return res.status(200).json({ message: "Login successful", token: token });
  }
};

export const protectedRouteController = (req: Request, res: Response) => {
  if (req.user) {
    return res.status(200).json({
      message: "Protected resource accessed",
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
