import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../Models/user.Model.js";

const googleauthRouter = express.Router();

// Step 1: Trigger Google OAuth login
googleauthRouter.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Step 2: Google OAuth callback
googleauthRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  async (req, res) => {
    try {
      // Ensure the authenticated user is available
      const user = await User.findById(req.user._id);
      console.log(user._id);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      // Create a JWT token with user ID
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ⚠️ Only works on HTTPS
        sameSite: "None", // Required for cross-origin cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Redirect or respond
      res.redirect("http://localhost:3000/api/auth/success");
    } catch (err) {
      console.error("Google OAuth callback error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Authentication failed." });
    }
  }
);

export default googleauthRouter;
