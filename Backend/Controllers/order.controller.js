import User from "../Models/user.Model.js";
import ProductModel from "../Models/product.model.js";
import orderModel from "../Models/order.model.js";
import transporter from "../Config/nodemailer.config.js";

export const makeorder = async (req, res) => {
  const { id } = req.params;

  if (!req.creator || !id) {
    return res.json({
      success: false,
      message: "id of the product and user is required.",
    });
  }

  const { status, totalAmount, paymentStatus, created_at,address } = req.body;

  if (!status || !totalAmount || !paymentStatus || !created_at || !address) {
    return res.json({
      success: false,
      message: "All credentials are required.",
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

    let order = new orderModel({
      user: req.creator,
      product: id,
      totalAmount: totalAmount,
      status: status,
      paymentStatus: paymentStatus,
      created_at: created_at,
      address:address
    });

    await order.save();

    if (!order) {
      return res.json({
        success: false,
        message: "Something went wrong.",
      });
    }

    await User.findByIdAndUpdate(
      req.creator,
      { $push: { orders: order._id } },
      { new: true }
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Product is Deleted.",
      text: `Product is removed from website.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Order is created", order });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getall = async (req, res) => {
  if (!req.creator) {
    return res.json({
      success: false,
      message: "Id not found.",
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

    let orders = await orderModel.find({ user: req.creator });

    if (!orders) {
      return res.json({
        success: false,
        message: "Something went wrong.",
      });
    }

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getorder = async (req, res) => {
  const { id } = req.params;
  if (!id || !req.creator) {
    return res.json({
      success: false,
      message: "Ids not found.",
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

    let orders = await orderModel.findById(id);

    if (!orders) {
      return res.json({
        success: false,
        message: "Something went wrong.",
      });
    }

    if (orders.user != req.creator) {
      return res.json({
        success: false,
        message: "You can view only your orders.",
      });
    }

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
