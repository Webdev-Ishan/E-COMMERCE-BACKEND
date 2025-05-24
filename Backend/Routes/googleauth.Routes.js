import express from "express";
const googleauthRouter = express.Router();
import passport from "passport";

googleauthRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);
googleauthRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    res.send("Logged in with Google!");
  }
);
export default googleauthRouter;
