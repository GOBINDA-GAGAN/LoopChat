import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
    },
    phoneSuffix: { type: String, unique: false },

    email: {
      type: String,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    username: { type: String },

    emailOtp: {
      type: String,
    },
    emailOtpExpiry: { type: Date },
    profilePic: {
      type: String,
    },
    about: {
      type: String,
    },
    lastSeen: {
      type: Date,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    agreed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
