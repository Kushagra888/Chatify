import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://chatify.kushagra-chavel.me",
    "https://www.chatify.kushagra-chavel.me"
];

console.log("Setting up socket server with allowed origins:", allowedOrigins);

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            console.log("Socket connection attempt from origin:", origin);
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("Origin not allowed:", origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const broadcastOnlineUsers = () => {
    const users = Object.keys(userSocketMap);
    console.log("Broadcasting online users:", users);
    io.emit("getOnlineUsers", users);
};

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        console.log(`User ${userId} connected with socket ${socket.id}`);
        userSocketMap[userId] = socket.id;
        console.log("Connected users:", userSocketMap);
        broadcastOnlineUsers();
    }

    // Handle explicit request for online users
    socket.on("getOnlineUsers", () => {
        console.log("Received request for online users");
        broadcastOnlineUsers();
    });

    // Handle request for messages
    socket.on("getMessages", async ({ receiverId }) => {
        try {
            if (!userId || !receiverId) {
                console.log("Missing userId or receiverId for getMessages");
                return;
            }
            
            console.log(`Fetching messages between ${userId} and ${receiverId}`);
            
            // Find conversation
            const conversation = await Conversation.findOne({
                participants: { $all: [userId, receiverId] },
            });
            
            if (!conversation) {
                console.log("No conversation found");
                socket.emit("messageHistory", []);
                return;
            }
            
            // Get messages
            const messages = await Message.find({
                conversationId: conversation._id
            }).sort({ createdAt: 1 });
            
            // Format messages
            const formattedMessages = messages.map(msg => ({
                _id: msg._id.toString(),
                senderId: msg.senderId.toString(),
                receiverId: msg.receiverId.toString(),
                message: msg.message,
                conversationId: msg.conversationId.toString(),
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt
            }));
            
            console.log(`Sending ${formattedMessages.length} messages to socket ${socket.id}`);
            
            // Send messages to the requesting user
            socket.emit("messageHistory", formattedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        
        if (userId && userId !== "undefined") {
            console.log(`User ${userId} disconnected`);
            delete userSocketMap[userId];
            broadcastOnlineUsers();
        }
    });
});

export { app, io, server };
