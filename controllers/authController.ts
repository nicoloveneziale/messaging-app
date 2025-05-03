import { Request, Response } from "express";
import { generateToken } from "../config/passportConfig";
import bcrypt from "bcryptjs";
import { createUser } from "../db/userQueries";
import { createProfile } from "../db/profileQueries";

export const loginController = (req: Request, res: Response) => {
  if (req.user) {
    const token = generateToken(req.user);
    return res.status(200).json({ message: "Login successful", token: token });
  }
};

export const protectedRouteController = (req: Request, res: Response) => {
  if (req.user) {
    return res.status(200).json({
      message: "Protected resource accessed",
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    //hash password for new user
    const hashedPassword = await bcrypt.hash(password, 10);
    //add user details to db
    const newUser = await createUser(username, email, password);
    //create a profile for the new user
    const newProfile = await createProfile(newUser.id);
    //token generation for immidiate login
    const token = generateToken(newUser);

    return res
      .status(201)
      .json({ message: "User created successfully", token });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Username or email already taken" });
    }
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
