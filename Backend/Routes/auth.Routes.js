import express from "express";
const authRouter = express.Router();
import * as authController from "../Controllers/auth.controller.js";
import { authUser } from '../Middleware/auth.middleware.js'
import multer from "../Middleware/multer.js";

authRouter.post("/register", multer.single("profilePicture"),authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/profile", authUser, authController.profile);
authRouter.put("/update",authUser,authController.update)
authRouter.post("/logout", authController.logout);
authRouter.post("/registerMerchant", multer.single("profilePicture"),authController.registerMerchant);
authRouter.post("/loginMerchant", authController.loginMerch);
authRouter.get("/profileMerchant", authUser, authController.profileMerchant);
authRouter.put("/updateMerchant",authUser,authController.updateMerchant);
authRouter.post("/logoutMerchant", authController.logoutMerchant);

export default authRouter;