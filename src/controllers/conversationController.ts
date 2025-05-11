import { NextFunction, Request, Response } from "express";
import {
  getConversationByUsers,
  createConversation,
  getAllConversations,
  getConversationMessages,
  sendMessage,
  isUserParticipant,
  deleteMessage,
  getMessage,
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
    res.status(401).json({ message: "User not authenticated" });
  }

  //Checks that there are users provided
  if (participantIds.length === 0) {
    res
      .status(400)
      .json({ message: "participantIds must be a non-empty array" });
  }

  //Checks that the group is named
  if (isGroupChat && !name) {
    res.status(400).json({ message: "Group chat requires a name" });
  }

  if (!isGroupChat) {
    //Dms must only have 2 users
    if (participantIds.length !== 2) {
      res.status(400).json({
        message:
          "Direct message must have exactly two participants (including yourself)",
      });
    }
    //Users cant dm themselves
    if (participantIds[0] === participantIds[1]) {
      res
        .status(400)
        .json({ message: "Cannot create a direct message with yourself" });
    }
    return;
  }

  //Checks for existing DM
  if (!isGroupChat) {
    try {
      const existingConversation = await getConversationByUsers(participantIds);
      if (existingConversation) {
        res.status(200).json({
          message: "Direct message conversation already exists",
          conversation: existingConversation,
        });
        return;
      }
    } catch (error) {
      console.error("Error checking for existing conversation:", error);
      res.status(500).json({
        message:
          "Internal server error while checking for existing conversation",
      });
      return;
    }
  }

  //Create amd return conversation
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

//Gets all conversations for current user
export const getAllConversationsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUserId = req.userId;

  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
    return; 
  }
  
  try {
    const conversations = await getAllConversations(authenticatedUserId);

    res.json({ conversations: conversations });
  } catch (error) {
    console.error("Error fetching conversations for user:", error); 
    next(error);
  }
};

//Gets all messages for a conversation
export const getConversationMessagesController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUserId = req.userId;
  const conversationId = parseInt(req.params.id);

  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
    return; 
  }

  try {
    const messages = await getConversationMessages(conversationId, authenticatedUserId);
    res.json({ messages: messages });
  } catch (error) {
    console.error("Error fetching messages for conversation:", error); 
    next(error);
  }
}

//Sends a message in a conversation
export const sendMessageController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUserId = req.userId;
  const conversationId = parseInt(req.params.id);
  const {content} = req.body;

  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
    return; 
  }

  try {
    const isParticipant = await isUserParticipant(authenticatedUserId, conversationId);
    if (!isParticipant) {
      res.status(403).json({ message: "Forbidden - User is not a participant in the conversation" });
      return; 
    } 

    const message = await sendMessage(conversationId, authenticatedUserId, content);
    res.status(201).json({ message: message });
  } catch (error) {
    console.error("Error sending message:", error); 
    next(error);
  }
}

//Deletes a message in a conversation
export const deleteMessageController = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authenticatedUserId = req.userId;
  const conversationId = parseInt(req.params.id);
  const messageId = parseInt(req.params.messageId);

  if (!authenticatedUserId) {
    res.status(401).json({ message: "User not authenticated." });
    return; 
  }
  try {
    const message = await getMessage(messageId);

    if (!message) {
      res.status(404).json({message: "Message not found"});
      return;
    }

    if (message.senderId !== authenticatedUserId) {
      res.status(403).json({ message: "Forbidden - User is not the sender of the message" });
      return; 
    } 

    const deletedMessage = await deleteMessage(messageId);
    res.status(200).json({ message: deletedMessage });
  } catch (error) {
    console.log("Error deleting message:", error);
    next(error)
  }
}