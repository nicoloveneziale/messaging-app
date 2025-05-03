import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProfile = async (userId: number) => {
  try {
    const newProfile = prisma.profile.create({
      data: {
        userId: userId,
      },
    });
    return newProfile;
  } catch (error: any) {
    console.log("Error creating user profile", error);
    throw error;
  }
};
