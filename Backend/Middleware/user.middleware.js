import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authAdmin = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.json({ success: false, message: "User is not logged in." });
  }

  let token = req.cookies.token;
  try {
    let decodetoken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodetoken.id) {
      req.body = req.body || {};
      req.creator = decodetoken.id;
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
