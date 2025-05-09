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
      isGroupchat: false,
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

export const createConversation = async (
  participantIds: number[],
  isGroupChat: boolean,
  name?: string,
) => {};
