import Payment from "../Models/Payment.model.js";
import Razorpay from "../Config/Razorpay.js";
import ProductModel from "../Models/product.model.js";
import orderModel from "../Models/order.model.js";

export const pay = async (req, res) => {
  const { amount, currency, status } = req.body;
  const orderId = req.params.id;

  if (!amount || !currency || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!req.creator) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });
  }

  if (!orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required." });
  }
  try {
    let productToorder = await orderModel.findById(orderId);
    if (!productToorder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    let productOwner = await ProductModel.findById(productToorder.product);
    if (!productOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found." });
    }
    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await Razorpay.orders.create(options);

    // Save the order details in the database
    const payment = new Payment({
      orderId: orderId,
      amount: amount,
      currency: currency || "INR",
      userId: req.creator,
      productId: productToorder.product,
      ownerId: productOwner.creator,
      status: status,
    });

    await payment.save();

    let ordernew = await orderModel.findById(orderId);
    ordernew.paymentStatus = "Paid";
    await ordernew.save();

    return res.json({
      success: true,
      message: "Order created successfully.",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Payment error:", error); // Add this line
    return res.json({
      success: false,
      message: error.message || "Unknown error",
    });
  }
};
