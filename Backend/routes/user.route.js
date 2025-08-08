import express  from "express"
import { sendOtp } from "../controllers/authController.js";
const router=express();

router.post("/register",sendOtp)










export default router;