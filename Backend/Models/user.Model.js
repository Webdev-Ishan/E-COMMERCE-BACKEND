import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: "default-profile.png",
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  Reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  CartOrder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  role: {
    type: String,
    default: "User",
  },
  bio: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

// Export both model and validation function
export const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]*$/)
      .required()
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must be at most 50 characters",
        "string.pattern": "Name must contain only letters and spaces",
        "any.required": "Name is required",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(128).messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 128 characters",
      "string.pattern":
        "Password must contain at least one lowercase letter, uppercase letter, number and special character",
      "any.required": "Password is required",
    }),
    googleId: Joi.string().min(8).max(128),

    bio: Joi.string().allow("").max(500).messages({
      "string.max": "Bio must be at most 500 characters",
    }),

    profilePicture: Joi.string().uri().allow("").messages({
      "string.uri": "Profile picture must be a valid URI",
    }),

    address: Joi.string().allow("").messages({
      "string.uri": "Address is required",
    }),
    created_at: Joi.string().allow("").messages({
      "string.uri": "Creation date is required",
    }),
  });

  return schema.validate(data);
};

export const loginUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(128).required().messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 128 characters",
      "string.pattern":
        "Password must contain at least one lowercase letter, uppercase letter, number and special character",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data);
};

export const validateUpdation = (data) => {
  const schema = Joi.object({
    id: Joi.string(),
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]*$/)
      .required()
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must be at most 50 characters",
        "string.pattern": "Name must contain only letters and spaces",
        "any.required": "Name is required",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(128).required().messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 128 characters",
      "string.pattern":
        "Password must contain at least one lowercase letter, uppercase letter, number and special character",
      "any.required": "Password is required",
    }),

    bio: Joi.string().allow("").max(500).messages({
      "string.max": "Bio must be at most 500 characters",
    }),

    profilePicture: Joi.string().uri().allow("").messages({
      "string.uri": "Profile picture must be a valid URI",
    }),

    address: Joi.string().allow("").messages({
      "string.uri": "Address is required",
    }),
    created_at: Joi.string().allow("").messages({
      "string.uri": "Creation date is required",
    }),
  });

  return schema.validate(data);
};

export default User;
