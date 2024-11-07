import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // Get receiverId from URL params
    const senderId = req.user._id; // Assuming req.user._id is populated after authentication

    // Find the conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId, // Ensure you're using receiverId here
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id); // Add message ID to the conversation
      await conversation.save(); // Save the updated conversation
    }

    // await conversation.save();
    // await newMessage.save();


    //this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

//SOCKET IO FUNCTIONALITY WILL GO HERE 



// Then in the sendMessage function
const receiverSocketId = getReceiverSocketId(receiverId);
if (receiverSocketId) {
   io.to(receiverSocketId).emit("newMessage", newMessage);
}






    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Extract the userToChatId from URL params
    const senderId = req.user._id; // Assuming req.user._id is populated after authentication

    // Find the conversation between the sender and the receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // Populate the messages field

    // If no conversation is found, return an empty array
    if (!conversation) return res.status(200).json([]);

    // Get the messages from the conversation
    const message = conversation.messages; // Correctly refer to the messages array

    // Return the messages
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
