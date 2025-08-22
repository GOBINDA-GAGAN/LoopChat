import { OtpGenerator } from "../utils/OtpGenerator.js";
import { response } from "../utils/responseHendel.js";
import User from "../models/usermodel.js";
import { sendOtpEmail } from "../services/emailService.js";
import { generateToken } from "../services/generatedToken.js";

export const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;

  const otp = OtpGenerator();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  try {
    let user;

    // ✅ EMAIL-BASED OTP
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }

      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();

      await sendOtpEmail(email, otp);

      return response(res, 200, "OTP sent successfully to your email", {
        email,
      });
    }

    // ✅ PHONE-BASED OTP
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Phone number and phone suffix are required");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber, phoneSuffix });

    if (!user) {
      user = new User({ phoneNumber, phoneSuffix });
    }

    user.phoneOtp = otp;
    user.phoneOtpExpiry = expiry;

    console.log("Sending OTP to:", fullPhoneNumber);

    await user.save();

    return response(res, 200, "OTP sent successfully to your mobile", {
      phoneNumber: fullPhoneNumber,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return response(res, 500, "Internal server error");
  }
};

export const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;
  try {
    let user;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return response(res, 404, "User not found");
      }
      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        response(res, 400, "Invalid or expired  otp");
      }
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "Phone number and phone suffix are required");
      }
      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return response(res, 404, "User not found");
      }
      const result = await verifyOtp(fullPhoneNumber, otp);

      if (result.status !== "approved") {
        return response(res, 400, "Invalid otp");
      }
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return response(res, 200, "opt verify successfully", { token, user });
  } catch (error) {
    console.error("verify OTP Error:", error);
    return response(res, 500, "Internal server error");
  }
};
