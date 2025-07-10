import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://chatify.kushagra-chavel.me",
    "https://www.chatify.kushagra-chavel.me"
];

console.log("Server starting with allowed origins:", allowedOrigins);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.use(express.json()); 
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
        console.log("Incoming request from origin:", origin);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log("Origin not allowed:", origin);
            return callback(null, false);
        }
        console.log("Origin allowed:", origin);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});

// Catch-all route for handling 404s
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});
