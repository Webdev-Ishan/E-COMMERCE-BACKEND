import { required } from "joi";
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
  images: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
});

const ProductModel = new mongoose.model("Product", productSchema);

export default ProductModel;
