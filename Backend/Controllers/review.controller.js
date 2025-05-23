import User from "../Models/user.Model.js";
import ProductModel from "../Models/product.model.js";
import Reviewmodel from "../Models/review.model.js";
import transporter from "../Config/nodemailer.config.js";

export const makereview = async (req, res) => {
  const { id } = req.params;
  if (!id || !req.creator) {
    return res.json({
      success: false,
      message: "id of the product and user is required.",
    });
  }
  const { rating, comment } = req.body;

  if (!rating || !comment) {
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

    let review = new Reviewmodel({
      user: user._id,
      product: product,
      rating: rating,
      comment: comment,
    });

    await review.save();

    if (!review) {
      return res.json({
        success: false,
        message: "Somethign went wrong.",
      });
    }

    await User.findByIdAndUpdate(
      user._id,
      { $push: { Reviews: review._id } },
      { new: true }
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Product is Deleted.",
      text: `Product is removed from website.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, review });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getall = async (req, res) => {
  const { id } = req.params;
  if (!req.creator || !id) {
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

    let product = await ProductModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product is not present.",
      });
    }

    let reviews = await Reviewmodel.find({ product: id });

    if (!reviews) {
      return res.json({
        success: false,
        message: "Something went wrong.",
      });
    }

    return res.json({ success: true, reviews });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  if (!req.creator || !id) {
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

    let review = await Reviewmodel.findById(id);

    if (!review) {
      return res.json({
        success: false,
        message: "Review is not present.",
      });
    }

    let removed = await Reviewmodel.findByIdAndDelete(id);

    await User.findByIdAndUpdate(
        user._id,
        {$pull:{Reviews:review._id}},
        {new:true}
    )

    if(!removed){
        return res.json({
        success: false,
        message: "Something went wrong.",
      });
    }
    return res.json({Success:true,message:"Review is removed."})
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
