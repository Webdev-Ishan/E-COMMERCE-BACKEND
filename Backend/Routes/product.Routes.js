import express from "express";
const productRouter = express.Router();
import * as productController from "../Controllers/product.controller.js";
import { authAdmin } from '../Middleware/user.middleware.js'
import upload from "../Middleware/multer.js";

productRouter.post("/create/:id", upload.single("image"),productController.create);
// productRouter.post("/getAll", productController.getall);
// productRouter.get("/find/:id", productController.findone);
// productRouter.put("/update/:id",authAdmin,productController.update)
// productRouter.post("/delete/:id", authAdmin,productController.remove);

export default productRouter;