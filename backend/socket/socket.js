import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Allow your frontend origin
    methods: ["GET", "POST"], // Allow specific HTTP methods
  },
});

// Store mapping between user IDs and their corresponding socket IDs
const userSocketMap = {};

/**
 * Function to get the socket ID of a specific user by their user ID.
 * @param {string} receiverId - The user ID of the message receiver.
 * @returns {string | undefined} - The socket ID of the receiver, or undefined if not connected.
 */
export const getReceiverSocketId = (receiverId) => {
  console.log("Fetching socket ID for receiver:", receiverId);
  return userSocketMap[receiverId];
};

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Extract user ID from query parameters
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    // Map user ID to the socket ID
    userSocketMap[userId] = socket.id;

    // Notify all clients about the currently online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("User connected without a valid userId.");
  }

  // Handle sendMessage event
  socket.on("sendMessage", (message) => {
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    // Optionally broadcast to the sender as well
    io.to(socket.id).emit("newMessage", message);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove the disconnected user's socket ID from the map
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    // Notify remaining clients about updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
