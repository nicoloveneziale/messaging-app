import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByUsername = async (username: string) => {
  try {
    return await prisma.user.findUnique({ where: { username } });
  } catch (error) {
    console.log("Error finding user by username: ", error);
    throw error;
  }
};

export const findUserById = async (id: number) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.log("Error finding user by id: ", error);
    throw error;
  }
};

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return newUser;
  } catch (error: any) {
    console.log("Error creating user: ", error);
    throw error;
  }
};
