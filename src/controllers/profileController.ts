import { NextFunction, Request, Response } from "express";
import { getProfile } from "../db/profileQueries";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const profileId: number = parseInt(req.params.id);
  try {
    const profile = await getProfile(profileId);
    res.json({ profile: profile });
  } catch (error) {
    console.log("Error retrieving user profile", error);
    throw error;
  }
};
