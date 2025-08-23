import jwt from "jsonwebtoken";
import  {response}  from "../utils/responseHendel.js";
import dotenv from "dotenv";
dotenv.config()

export const authMiddleware = (req, res, next) => {
  const auth_token = req.cookies.auth_token;
  console.log(auth_token);
  
  if (!auth_token) {
    return response(res, 401, "Token missing || Access  denied");
  }
  try {
    const decode = jwt.verify(auth_token, process.env.JWT_SECRET);
    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    console.error("error in authMiddleware",error);
    return response(res,401,"internal server error")
    
  }
};
