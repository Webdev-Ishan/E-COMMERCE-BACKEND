import express from "express";
const reviewRouter = express.Router();
import * as reviewController from "../Controllers/review.controller.js";
import { authAdmin } from '../Middleware/user.middleware.js'

reviewRouter.post("/givereview/:id",authAdmin,reviewController.makereview);
reviewRouter.get("/getall/:id",authAdmin,reviewController.getall);
reviewRouter.post("/remove/:id",authAdmin,reviewController.remove);
export default reviewRouter;