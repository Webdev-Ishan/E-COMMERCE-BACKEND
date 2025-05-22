import express from "express";
const cartRouter = express.Router();
import * as cartController from "../Controllers/cart.controller.js";
import { authAdmin } from '../Middleware/user.middleware.js'

cartRouter.post("/addtocart/:id",authAdmin,cartController.addtocart);
cartRouter.get("/getall",authAdmin,cartController.getCart)
cartRouter.put("/removeitem/:id",authAdmin,cartController.removeitem)

export default cartRouter;