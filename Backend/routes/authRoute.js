import express from "express";
import {
  checkAuthenticate,
  getAllUser,
  logout,
  sendOtp,
  updateProfile,
  verifyOtp,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { multerMiddleware } from "../config/Cloudnary.js";
const router = express();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.put("/update-profile", authMiddleware, multerMiddleware, updateProfile);
router.get("/logout", logout);
router.get("/check-auth", authMiddleware, checkAuthenticate);
router.get("/users", authMiddleware,getAllUser);

export default router;
