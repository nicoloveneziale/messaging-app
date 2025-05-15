import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { findUserByUsername, findUserById } from "../db/userQueries";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

passport.use(
  new LocalStrategy(async (username: string, password: string, done: any) => {
    try {
      const user = await findUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      console.log(password)
      return done(null, user);
    } catch (error) {
      console.error("Error during login:", error);
      return done(error);
    }
  }),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload: any, done: any) => {
      try {
        const user = await findUserById(jwtPayload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export const generateToken = (user: any) => {
  const payload = {
    sub: user.id,
    username: user.username,
  };
  const options: SignOptions = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export default passport;
