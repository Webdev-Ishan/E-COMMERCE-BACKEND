import User from "../Models/user.Model.js";
import ProductModel from "../Models/product.model.js";
import { validateProduct } from "../Models/product.model.js";
import transporter from "../Config/nodemailer.config.js";
import { v2 as cloudinary } from "cloudinary";
export const create = async (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const { id } = req.params;
  const { name, description, price, Stock, category, image, created_at } =
    req.body;
  if (
    !id ||
    !name ||
    !description ||
    !price ||
    !Stock ||
    !category ||
    !image ||
    !created_at
  ) {
    return res.json({
      success: false,
      message: "Fill all the credentials including id.",
    });
  }
  try {
    let creator = await User.findById(id);
    if (!creator || !creator.role == "Merchant") {
      return res.json({
        success: false,
        message: "Only Merchants can create a product.",
      });
    }

    let productexist = await ProductModel.findOne({ name: name });
    if (productexist) {
      return res.json({
        success: false,
        message: "Product with this name already exists.",
      });
    }

    const imageUpload = await cloudinary.uploader.upload(image, {
      resource_type: "image",
    });

    let product = new ProductModel({
      name: name,
      description: description,
      price: price,
      image: imageUpload.secure_url,
      Stock: Stock,
      category: category,
      created_at: created_at,
      creator: id,
    });

    await product.save();

    await User.findByIdAndUpdate(
      id, // Author's ID
      { $push: { Products: product._id } }, // Add the post ID to the posts array
      { new: true } // Return the updated document
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: creator.email,
      subject: "Product is created.",
      text: `Product is created on website, ${product}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Product created successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
