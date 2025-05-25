import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import DbConnect from "./Config/mongodb.js";
import cors from "cors";
import authRoutes from "./Routes/auth.Routes.js";
import productRoutes from "./Routes/product.Routes.js";
import cartRoutes from "./Routes/cart.Routes.js";
import orderRoutes from "./Routes/order.Routes.js";
import reviewRoutes from "./Routes/review.Routes.js";
import googleauthRoutes from "./Routes/googleauth.Routes.js";
import cloudConfig from "./Config/cloudinary.js";
import passport from "passport";
import expressSession from "express-session";
import "./Config/passport.js";

const port = process.env.PORT || 3000;

const app = express();

DbConnect();
cloudConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // Use true in production (HTTPS)
      sameSite: "None", // Allow cross-origin requests
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/googleauth", googleauthRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
