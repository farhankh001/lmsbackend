import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../../db/config.js"; // Import Prisma client
import bcrypt from "bcrypt";
import generateJwtToken from "../../utils/jwtTokenGenerate.js";
passport.use(
  "LoginStrategy",
  new LocalStrategy(
    {
      usernameField: "email", // Map the username field to "email"
      passwordField: "password", // Map the password field to "password"
      passReqToCallback: true, // Pass the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        // Validate required fields
        if (!email || !password) {
          return done(null, false, { message: "Email and password are required." });
        }

        // Check if the user exists
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "User not found." });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = generateJwtToken(user.id);

        // Return user and token
        return done(null, { user, token });
      } catch (error) {
        console.error("Error during login:", error);
        return done(error);
      }
    }
  )
);

export const loginUserAuthMiddleware = (req, res, next) => {
  passport.authenticate(
    "LoginStrategy",
    { session: false },
    (err, data, info) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error." });
      }
      if (!data) {
        return res.status(401).json({ error: info.message });
      }
      req.user = data.user; // Attach user to the request object
      req.token = data.token; // Attach token to the request object
      next();
    }
  )(req, res, next);
};