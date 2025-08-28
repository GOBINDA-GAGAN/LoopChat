import { response } from "../utils/responseHendel.js";
import Conversation from "../models/conversation_model.js";
import Message from "../models/message_model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js"; 

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, messageStatus } = req.body;
    const file = req.file;

    // Ensure both sender and receiver exist
    if (!senderId || !receiverId) {
      return response(res, 400, "Sender and Receiver are required");
    }

    // Find or create conversation
    const participants = [senderId, receiverId].sort();
    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      conversation = new Conversation({ participants, unreadCount: 0 });
      await conversation.save();
    }

    // Handle file upload
    let imageOrVideo = null;
    let contentType = "text"; // default
    if (file) {
      const uploadfile = await uploadFileToCloudinary(file);
      if (!uploadfile?.secure_url) {
        return response(res, 400, "Fail to upload media");
      }
      imageOrVideo = uploadfile.secure_url;

      if (file.mimetype.startsWith("image")) {
        contentType = "image";
      } else if (file.mimetype.startsWith("video")) {
        contentType = "video";
      } else {
        return response(res, 400, "Unsupported file type");
      }
    } else if (!content || !content.trim()) {
      return response(res, 400, "Message content required");
    }

    // Create new message
    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content,
      imageOrVideoUrl: imageOrVideo,
      messageStatus,
      contentType,
    });

    await message.save();

    // Update conversation
    if (message.content || message.imageOrVideoUrl) {
      conversation.lastMessage = message._id;
    }
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    await conversation.save();

    // Populate sender & receiver
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    return response(res, 201, "Message sent successfully", populatedMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    return response(res, 500, "Internal server error");
  }
};


export const getAllConversation = async (req, res) => {
  try {
    const  userId = req.user.userId; 

    if (!userId) {
      return response(res, 400, "User ID required");
    }

    // Fetch all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username profilePicture isOnline lastSeen") 
      .populate({
        path: "lastMessage",
        select: "content imageOrVideoUrl contentType sender receiver createdAt",
        populate: {
          path: "sender receiver",
          select: "username profilePicture",
        },
      })
      .sort({ updatedAt: -1 }); // latest first

    return response(res, 201, "Conversations fetched successfully", conversations);
  } catch (error) {
    console.error("Get Conversations Error:", error);
    return response(res, 500, "Internal server error");
  }
};

export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return response(res, 400, "Conversation ID required");
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return response(res, 404, "Conversation not found");
    }

    // Fetch messages of the conversation
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture")
      .sort({ createdAt: 1 }); // oldest → newest

      await Message.updateMany
    return response(res, 200, "Messages fetched successfully", messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    return response(res, 500, "Internal server error");
  }
};

