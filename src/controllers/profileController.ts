import { NextFunction, Request, Response } from "express";
import { getProfile, updateProfile } from "../db/profileQueries";

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

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const profileId: number = parseInt(req.params.id);
  const { bio, avatarUrl } = req.body;
  try {
    const profile = await updateProfile(profileId, bio, avatarUrl);
    res.json({ profile: profile });
  } catch (error) {
    console.log("Error updating user profile", error);
    throw error;
  }
};
