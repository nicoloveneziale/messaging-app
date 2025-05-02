import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
