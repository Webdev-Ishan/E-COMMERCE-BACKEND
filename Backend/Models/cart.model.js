import mongoose from "mongoose";

const cartSchma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
});

const Cartmodel = new mongoose.Model("Cart", cartSchma);

export default Cartmodel;
