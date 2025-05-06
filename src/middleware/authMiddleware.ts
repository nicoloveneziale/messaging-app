import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticate = async (
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
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authoriseProfileUpdate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const profileId = parseInt(req.params.id, 10);

  if (req.userId !== profileId) {
    return res.status(403).json({
      message: "Forbidden - You can only update your own profile",
    });
  }
  next();
};
