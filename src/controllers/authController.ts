import { NextFunction, Request, Response } from "express";
import { generateToken } from "../config/passportConfig";
import bcrypt from "bcryptjs";
import { createUser, updateUserProfile } from "../db/userQueries";
import { createProfile } from "../db/profileQueries";

//Login controller, used for local strategy
export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user) {
    const token = generateToken(req.user);
    res
      .status(200)
      .json({ message: "Login successful", token: token, user: req.user });
  }
};

//Checks of a user is logged in
export const protectedRouteController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user) {
    res.status(200).json({
      message: "Protected resource accessed",
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//Register a new user and log them in
export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
  
    const { username, email, password } = req.body;
    //hash password for new user
    const hashedPassword = await bcrypt.hash(password, 10);
    //add user details to db
    const newUser = await createUser(username, email, hashedPassword);
    //create a profile for the new user
    const newProfile = await createProfile(newUser.id);
    //Updates the users profile
    const user = await updateUserProfile(newUser.id, newProfile.id);
    //token generation for immidiate login
    const token = generateToken(newUser);

    res.status(201).json({ message: "User created successfully", token, newProfile, newUser });
    return;
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "Username or email already taken" });
      return;
    }
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
      return;
  }
};

export const verifyTokenController = (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as any; 
        res.status(200).json({
            message: 'Token is valid',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });
        return;
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
        return;
    }
};
