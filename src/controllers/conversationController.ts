import { NextFunction, Request, Response } from "express";
import {
  getConversationByUsers,
  createConversation,
} from "../db/conversationQueries";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const createConversationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { participantIds, isGroupChat, name } = req.body;
  const authenticatedUserId = req.userId;

  //Checks if user creating the conversation is authorised
  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
  }

  //Checks that there are users provided
  if (participantIds.length === 0) {
    res
      .status(400)
      .json({ message: "participantIds must be a non-empty array." });
  }

  //Checks that the group is named
  if (isGroupChat && !name) {
    res.status(400).json({ message: "Group chat requires a name." });
  }

  if (!isGroupChat) {
    //Dms must only have 2 users
    if (participantIds.length !== 2) {
      res.status(400).json({
        message:
          "Direct message must have exactly two participants (including yourself).",
      });
    }
    //Users cant dm themselves
    if (participantIds[0] === participantIds[1]) {
      res
        .status(400)
        .json({ message: "Cannot create a direct message with yourself." });
    }
    return;
  }

  //Checks for existing DM
  if (!isGroupChat) {
    try {
      const existingConversation = await getConversationByUsers(participantIds);
      if (existingConversation) {
        res.status(200).json({
          message: "Direct message conversation already exists.",
          conversation: existingConversation,
        });
        return;
      }
    } catch (error) {
      console.error("Error checking for existing conversation:", error);
      res.status(500).json({
        message:
          "Internal server error while checking for existing conversation.",
      });
      return;
    }
  }

  try {
    const conversation = await createConversation(
      participantIds,
      isGroupChat,
      name,
    );
    res.status(201).json({ conversation: conversation });
    return;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};
