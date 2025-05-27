import express from "express";
let paymentRouter = express.Router();
import * as paymentController from "../Controllers/payment.controller.js";
import { authAdmin } from "../Middleware/user.middleware.js";

paymentRouter.post("/:id", authAdmin, paymentController.pay);

export default paymentRouter;
