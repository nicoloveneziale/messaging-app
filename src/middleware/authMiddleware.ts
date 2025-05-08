import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getProfile } from "../db/profileQueries";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "secret-key";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticate: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.sub;
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const authoriseProfileUpdate: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const profileId = parseInt(req.params.id, 10);

  if (req.userId === undefined) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const profile = await getProfile(profileId);

  if (profile == null) {
    res.status(401).json("Error finding profile");
    return;
  }

  if (req.userId !== profile.userId) {
    res.status(403).json({
      message: "Forbidden - You can only update your own profile",
    });
    return;
  }
  next();
  return;
};
