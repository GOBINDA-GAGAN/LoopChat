import { OtpGenerator } from "../utils/OtpGenerator.js";
import { response } from "../utils/responseHendel.js";
import User from "../models/usermodel.js";
import { sendOtpEmail } from "../services/emailService.js";
import { generateToken } from "../services/generatedToken.js";
import { uploadFileToCloudinary } from "../config/Cloudnary.js";
import { assign } from "nodemailer/lib/shared/index.js";
import Conversation from "../models/conversation_model.js";

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

      return response(res, 200, "OTP sent to your email", { email });
    }

    // ✅ PHONE-BASED OTP
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Phone number and suffix are required");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;

    user = await User.findOne({ phoneNumber, phoneSuffix });

    if (!user) {
      user = new User({ phoneNumber, phoneSuffix });
    }

    user.phoneOtp = otp;
    user.phoneOtpExpiry = expiry;
    await user.save();

    console.log("Sending OTP to:", fullPhoneNumber);
    return response(res, 200, "OTP sent to your mobile", {
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

export const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;

  const userId = req.user.userId;
  console.log(userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "User not found");
    }
    const file = req.file;
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.profilePic = uploadResult.secure_url;
    } else if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }
    if (username) {
      user.username = username;
    }
    if (agreed) {
      user.agreed = agreed;
    }
    if (about) {
      user.about = about;
    }
    await user.save();

    return response(res, 200, "user profile update successfully", user);
  } catch (error) {
    console.error("update profile Error:", error);
    return response(res, 500, "Internal server error");
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth_token", "", {
      expiry: Date.now(0),
    });
    return response(res, 200, "Logout successfully");
  } catch (error) {
    console.error("logout:", error);
    return response(res, 500, "Internal server error");
  }
};

export const checkAuthenticate = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return response(res, 404, "Please login before access our LoopChart");
    }

    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "User retrieved successfully", user);
  } catch (error) {
    console.error("checkAuthenticate:", error);
    return response(res, 500, "Internal server error");
  }
};

export const getAllUser = async (req, res) => {
  try {
    const currentUse_or_me = req.user.userId;
    const users = await User.find({ _id: { $ne: currentUse_or_me } })
      .select(
        "username profilePic lastSeen isOnline phoneNumber phoneSuffix about"
      )
      .lean();
    const userConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [currentUse_or_me, user._id] },
        })
          .populate({
            path: "lastMassage",
            select: "content createdAt sender receiver",
          })
          .lean();
        return {
          ...user,
          conversation: conversation || null,
        };
      })
    );

    return response(res, 200, "User retrieved successfully", userConversation);
  } catch (error) {
    console.error("getAllUser;", error);
    return response(res, 500, "Internal server error");
  }
};
