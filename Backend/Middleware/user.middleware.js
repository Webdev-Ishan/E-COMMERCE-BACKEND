import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authAdmin = async (req, res, next) => {
  console.log(req.cookies);
  // if (!req.cookies.token) {
  //   return res.json({ success: false, message: "User is not logged in." });
  // }

  let token = req.cookies.token;
  try {
    let decodetoken = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzJlNTQ2YmZkYzA2YWMxMzljMzczMyIsImlhdCI6MTc0ODE2NzQ3NSwiZXhwIjoxNzQ4MjUzODc1fQ.IXSrr6Px90FXpgsvjyb-nMF2hHW8qHx9pToXa3i-dnM" , process.env.JWT_SECRET);
    if (decodetoken.id) {
      console.log(decodetoken.id)
      req.user = { id: decodetoken.id }; // ✅ attach properly here
      console.log("Decoded User ID:", decodetoken.id);

    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};