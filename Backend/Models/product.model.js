import Joi from "joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  Stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: "default-product.png",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
  },
});

export const validateProduct = (data) => {

  const schema = Joi.object({
    name: Joi.string().required().label("Product Name"),
    description: Joi.string().required().label("Description"),
    price: Joi.number().required().label("Price"),
    Stock: Joi.number().required().label("Stock"),
    category: Joi.string().required().label("Category"),
    image: Joi.string().uri().required().label("Image URL"),
    creator: Joi.string().hex().length(24).optional().label("Creator ID"),
    created_at: Joi.date().optional().label("Created At"),
  });

  return schema.validate(data);
};

const ProductModel = new mongoose.model("Product", productSchema);

export default ProductModel;
