import User from "../Models/user.Model.js";
import ProductModel from "../Models/product.model.js";
import Cartmodel from "../Models/cart.model.js";

export const addtocart = async (req, res) => {
  const { id } = req.params;

  if (!req.creator || !id) {
    return res.json({
      success: false,
      message: "id of the product and user is required.",
    });
  }

  try {
    let user = await User.findById(req.creator);

    if (!user) {
      return res.json({
        success: false,
        message: "user is not present.",
      });
    }

    let product = await ProductModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product is not present.",
      });
    }

    if (user.CartOrder.length > 0) {
      await Cartmodel.findByIdAndUpdate(
        user.CartOrder,
        { $push: { items: id } },
        { new: true }
      );

      return res.json({ success: true, message: "Itmes added to the cart." });
    }

    let cart = new Cartmodel({
      user: req.creator,
      items: id,
    });

    await cart.save();

    await User.findByIdAndUpdate(
      req.creator, // Author's ID
      { $push: { CartOrder: cart._id } }, // Add the post ID to the posts array
      { new: true } // Return the updated document
    );

    if (!cart) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    return res.json({ success: true, cart });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  const id = req.creator;

  if (!id) {
    return res.json({
      success: false,
      message: "id of the  user is required.",
    });
  }

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user._id != id) {
      return res.json({ success: false, message: "Only view your own cart." });
    }

    let cart = await Cartmodel.findById(user.CartOrder);

    if (!cart) {
      return res.json({ success: false, message: "Something went wrong." });
    }

    return res.json({ success: true, cart });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const removeitem = async (req, res) => {
  const { id } = req.params;

  if (!req.creator || !id) {
    return res.json({
      success: false,
      message: "id of the  user and product is required.",
    });
  }

  try {
    let user = await User.findById(req.creator);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user._id != req.creator) {
      return res.json({ success: false, message: "Only view your own cart." });
    }

    let product = await ProductModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product is not found." });
    }

    let cart = await Cartmodel.findById(user.CartOrder);

    if (!cart) {
      return res.json({ success: false, message: "Something went wrong." });
    }

    await Cartmodel.findByIdAndUpdate(
      cart._id,
      { $pull: { items: product._id } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "product is removed form the cart",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
