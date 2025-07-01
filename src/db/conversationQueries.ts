import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Gets a conversation by userIds
export const getConversationByUsers = async (participantIds: number[]) => {
  if (participantIds.length !== 2) {
    throw new Error(
      "getConversationByUsers requires exactly two participant IDs for a DM.",
    );
  }
  
  const [userId1, userId2] = participantIds;

  const conversation = await prisma.conversation.findFirst({
    where: {
      isGroupChat: false,
      participants: {
        every: {
          userId: { in: [userId1, userId2] },
        },
      },
    },
    include: {
      participants: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (conversation && conversation.participants.length === 2) {
    return conversation;
  }
  return null;
};


//Initially creates a conversation and returns user information
export const createConversation = async (
  participantIds: number[],
  isGroupChat: boolean,
  name?: string,
) => {
  return prisma.conversation.create({
    data: {
      name: name,
      isGroupChat: isGroupChat,
      participants: {
        create: participantIds.map((userId) => ({
          user: {
            connect: {id: userId}
          }
        }))
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  })
};

//Gets all the conversations for user
export const getAllConversations = async (userId: number) => {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      lastMessage: {
        select: {
          content: true,
          createdAt: true,
          sender: {
            select: {username: true}
          }
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileId: true,
              profile: {
                select: {avatarUrl: true}
              }
            }
          }
        }
      },
    },
    orderBy: {
      updatedAt: "desc"
    }
  })
}

//Gets all messages for a conversation
export const getConversationMessages = async (conversationId: number, authenticatedUserId: number) => {
  return prisma.message.findMany({
    where: {
      conversationId: conversationId,
      conversation: {
        participants: {
          some: {
            userId: authenticatedUserId
          }
        }
      }
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          profileId: true,
          profile: {
            select: {avatarUrl: true}
          }
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  })
}

//Checks if a user is a participant of a conversation
export const isUserParticipant = async (userId: number, conversationId: number) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      participants: {
        where: {
          userId: userId
        }
      }
    }
  });

  return conversation && conversation.participants.length > 0;
}

//Creates a message in a conversation 
export const sendMessage = async (conversationId: number, senderId: number, content: string) => {
  return prisma.message.create({
    data: {
      conversationId: conversationId,
      content: content,
      senderId: senderId
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          profile: {
            select: {avatarUrl: true}
          }
        }
      }
    }
  })
}

//Updates last message in a conversation
export const updateLastMessage = async (conversationId: number, messageId: number) => {
  try{
    const conversation = prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageId: messageId
        }
      });
      return conversation;
    } catch (error) {
      console.log(error);
    }
}

//Deletes a message in a conversation
export const deleteMessage = async (messageId: number) => {
  return prisma.message.delete({
    where: {
      id: messageId
    }
  })
}

//Gets a message by id
export const getMessage = async (messageId: number) => {
  return prisma.message.findUnique({
    where: {
      id: messageId
    }
  })
}

//Deletes a conversation 
export const deleteConversation = async (conversationId: number) => {
  return prisma.conversation.delete({
    where: {
      id: conversationId
    }
  })
}

//Marks a conversation as read
export const markAsRead = async (userId: number, conversationId: number) => {
  return prisma.userConversation.upsert({
    where: {
      userId_conversationId: { 
        userId: userId,
        conversationId: conversationId,
      },
    },
    update: { 
      lastReadAt: new Date(),
    },
    create: { 
      userId: userId,
      conversationId: conversationId,
      joinedAt: new Date(),
      lastReadAt: new Date(),
    },
  });
};