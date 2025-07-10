import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://chatify.kushagra-chavel.me",
    "https://www.chatify.kushagra-chavel.me"
];

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
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
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
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
        broadcastOnlineUsers();
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
