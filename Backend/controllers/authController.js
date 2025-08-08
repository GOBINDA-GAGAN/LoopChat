import { OtpGenerator } from "../utils/OtpGenerator.js";
import { response } from "../utils/responseHendel.js";
import User from "../models/usermodel.js";
import { sendOtpEmail } from "../services/emailService.js";

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

      // Uncomment if you're ready to send actual emails
      await sendOtpEmail(email, otp);

      return response(res, 200, "OTP sent successfully to your email", { email });
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
