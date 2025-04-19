import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://localhost:3001"],
		methods: ["GET", "POST"],
	},
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
