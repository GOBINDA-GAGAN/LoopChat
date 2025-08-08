import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      require: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    content: {
      type: String,
    },
    imageOrVideoUrl: {
      type: String,
    },
    contentType: {
      type: String,
      enum: ["image", "video", "text"],
    },
    reaction: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
    massageStatus: { type: String, default: "send" },
  },
  { timestamps: true }
);

const message = mongoose.model("message", messageSchema);
export default message;
