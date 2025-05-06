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

export const getProfile = async (profileId: number) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });
    return profile;
  } catch (error: any) {
    console.log("Error retrieving user profile", error);
    throw error;
  }
};

export const updateProfile = async (
  profileId: number,
  bio: string | undefined,
  avatarUrl: string | undefined,
) => {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        bio: bio,
        avatarUrl: avatarUrl,
        updatedAt: new Date(),
      },
    });
    return profile;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
