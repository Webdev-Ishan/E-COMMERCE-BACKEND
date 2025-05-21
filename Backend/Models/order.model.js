import { required } from "joi";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Cancelled"],
  },
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid"],
  },
  created_at: {
    type: Date,
  },
});

const orderModel = new mongoose.model("Order", orderSchema);

export default orderModel;
