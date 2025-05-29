import { NextFunction, Request, Response } from "express";
import { findUserByUsername } from "../db/userQueries";
interface AuthenticatedRequest extends Request {
  userId?: number;
}

//Searches for a user by username
export const searchUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUserId = req.userId;
  const username = req.params.username;

  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
    return; 
  }

  try {
    const user = await findUserByUsername(username);
    res.json( user );
  } catch (error) {
    console.error("Error fetching messages for conversation:", error); 
    next(error);
  }
}
