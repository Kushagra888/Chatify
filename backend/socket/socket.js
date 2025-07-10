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
    transports: ['websocket', 'polling']
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        console.log(`User ${userId} connected with socket ${socket.id}`);
        userSocketMap[userId] = socket.id;
        console.log("Connected users:", userSocketMap);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        
        if (userId && userId !== "undefined") {
            console.log(`User ${userId} disconnected`);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { app, io, server };
