import userModel, { validateUpdation } from "../Models/user.Model.js";
import Merchant, {
  validateMerchant,
  loginMerchant,
} from "../Models/Merchant.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../Config/nodemailer.config.js";
import { v2 as cloudinary } from "cloudinary";
import { validateUser } from "../Models/user.Model.js";
import { loginUser } from "../Models/user.Model.js";

export const register = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const { name, email, password, bio, profilePicture, created_at } = req.body;

  if (!name || !email | !password || !created_at) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }
  try {
    let existuser = await userModel.findOne({ email });
    if (existuser) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "image",
    });

    let user = new userModel({
      name: name,
      email: email,
      password: hashpassword,
      profilePicture: imageUpload.secure_url,
      bio: bio,

      created_at: created_at,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account is registered",
      text: `Welcome to the E-commerce website.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User created successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { error } = loginUser(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Good",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }

  try {
    let existuser = await userModel.findOne({ email });

    if (!existuser) {
      return res.json({
        success: false,
        message: "user do not exists,Please login first.",
      });
    }

    let decode = await bcrypt.compare(password, existuser.password);

    if (!decode) {
      return res.json({
        success: false,
        message: "Email or password is wrong.",
      });
    }

    const token = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax", // Required for cross-origin cookies
    });

    return res.json({ success: true, message: "User logged insuccessfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const profile = async (req, res) => {
  const { id } = req.body;

  try {
    let userProfile = await userModel.findById(id).populate("");

    if (!userProfile) {
      return res.json({ success: false, message: "something went wrong" });
    }

    return res.json({ success: true, userProfile });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    return res.json({ success: true, message: "Logout" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  const { error } = validateUpdation(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const {
    name,
    email,
    password,
    bio,
    profilePicture,

    created_at,
  } = req.body;

  if (!name || !email | !password || !created_at) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }
  try {
    let existuser = await userModel.findOne({ email });
    if (!existuser) {
      return res.json({
        success: false,
        message: "user do not exists",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "image",
    });

    existuser.name = name;
    existuser.email = email;
    existuser.password = hashpassword;
    existuser.profilePicture = imageUpload.secure_url;
    existuser.bio = bio;

    existuser.created_at = created_at;

    await existuser.save();

    const token = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: existuser.email,
      subject: "Profile info is updated",
      text: `The profile info is updated.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User updated successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const registerMerchant = async (req, res) => {
  const { error } = validateMerchant(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const { name, email, password, bio, profilePicture, address, created_at } =
    req.body;

  if (!name || !email | !password || !address || !created_at) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }
  try {
    let existuser = await Merchant.findOne({ email });
    if (existuser) {
      return res.json({
        success: false,
        message: "Merchant already exists",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "image",
    });

    let user = new Merchant({
      name: name,
      email: email,
      password: hashpassword,
      profilePicture: imageUpload.secure_url,
      bio: bio,
      created_at: created_at,
      address: address,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account is registered",
      text: `Welcome to the E-commerce website.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Merchant account created successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const loginMerch = async (req, res) => {
  const { error } = loginMerchant(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }

  try {
    let existuser = await Merchant.findOne({ email });

    if (!existuser) {
      return res.json({
        success: false,
        message: "user do not exists,Please login first.",
      });
    }

    let decode = await bcrypt.compare(password, existuser.password);

    if (!decode) {
      return res.json({
        success: false,
        message: "Email or password is wrong.",
      });
    }

    const token = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax", // Required for cross-origin cookies
    });

    return res.json({
      success: true,
      message: "Merchant logged insuccessfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const profileMerchant = async (req, res) => {
  const { id } = req.body;

  try {
    let userProfile = await Merchant.findById(id);

    if (!userProfile) {
      return res.json({ success: false, message: "something went wrong" });
    }

    return res.json({ success: true, userProfile });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logoutMerchant = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    return res.json({ success: true, message: "Logout" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const updateMerchant = async (req, res) => {
  const { error } = validateUpdation(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  const { name, email, password, bio, profilePicture, address, created_at } =
    req.body;

  if (!name || !email | !password || !address || !created_at) {
    return res.json({
      success: false,
      message: "Fill all the credentials please!",
    });
  }
  try {
    let existuser = await Merchant.findOne({ email });
    if (!existuser) {
      return res.json({
        success: false,
        message: "Merchant do not exists",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "image",
    });

    existuser.name = name;
    existuser.email = email;
    existuser.password = hashpassword;
    existuser.profilePicture = imageUpload.secure_url;
    existuser.bio = bio;
    existuser.created_at = created_at;
    existuser.address = address;

    await existuser.save();

    const token = jwt.sign({ id: existuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none", // Required for cross-origin cookies
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: existuser.email,
      subject: "Profile info is updated",
      text: `The profile info is updated.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User updated successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
