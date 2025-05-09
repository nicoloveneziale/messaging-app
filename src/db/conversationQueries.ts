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
