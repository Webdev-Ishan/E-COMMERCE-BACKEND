import Merchant from '../Models/Merchant.model.js'
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
    let creator = await Merchant.findById(id);
    if (!creator) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }
    if (creator.role !== "Merchant") {
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

    await Merchant.findByIdAndUpdate(
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

export const getAll = async (req, res) => {
  try {
    let allProducts = await ProductModel.find();

    if (!allProducts) {
      return res.json({ success: false, message: "An error occurred." });
    }

    return res.json({ success: true, message: allProducts });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const findproduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      message: "id of the product is required.",
    });
  }

  try {
    let product = await ProductModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.json({
      success: false,
      message: "id of the product is required.",
    });
  }

  try {
    let user = await Merchant.findById(req.creator);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    let product = await ProductModel.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    if (product.creator != req.creator) {
      return res.json({
        success: false,
        message: "Only the authorized admin can delte the products.",
      });
    }

    await ProductModel.findByIdAndDelete(id);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Product is Deleted.",
      text: `Product is removed from website.`,
    };

    await transporter.sendMail(mailOptions);

    await Merchant.findByIdAndUpdate(
      user._id, // Author's ID
      { $pull: { Products: product._id } }, // Add the post ID to the posts array
      { new: true } // Return the updated document
    );

    return res.json({
      success: true,
      message: "Product removed from the website.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  if (!id || !req.creator) {
    return res.json({
      success: false,
      message: "id of the product and creator is required.",
    });
  }

  const { name, description, price, Stock, category, image, created_at } =
    req.body;
  if (
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
    let user = await Merchant.findById(req.creator);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    let product = await ProductModel.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    if (product.creator != req.creator) {
      return res.json({
        success: false,
        message: "Only the authorized admin can delte the products.",
      });
    }

    const imageUpload = await cloudinary.uploader.upload(image, {
      resource_type: "image",
    });

    (product.name = name),
      (product.description = description),
      (product.price = price),
      (product.image = imageUpload.secure_url),
      (product.Stock = Stock),
      (product.category = category),
      (product.created_at = created_at),
      (product.creator = req.creator);

      await product.save();

    return res.json({ success: true, product, message: "Product is updated." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
