import express from "express";
const orderRouter = express.Router();
import * as orderController from "../Controllers/order.controller.js";
import { authAdmin } from '../Middleware/user.middleware.js'

orderRouter.post("/makeorder/:id",authAdmin,orderController.makeorder);
orderRouter.get("/getall",authAdmin,orderController.getall);
orderRouter.get("/getorder/:id",authAdmin,orderController.getorder);
export default orderRouter;