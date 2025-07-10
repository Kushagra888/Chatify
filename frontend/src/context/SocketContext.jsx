import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { getApiUrl } from "../config";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			// Get the correct server URL for socket connection
			const isProd = import.meta.env.PROD;
			const serverUrl = isProd 
				? "https://api.chatify.kushagra-chavel.me"
				: "http://localhost:5000";
				
			console.log(`Connecting to socket server at ${serverUrl}`);
			
			const newSocket = io(serverUrl, {
				query: {
					userId: authUser._id
				},
				withCredentials: true,
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000
			});

			newSocket.on("connect", () => {
				console.log(`Socket connected with ID: ${newSocket.id}`);
				console.log(`User ID: ${authUser._id}`);
				// Request online users immediately after connection
				newSocket.emit("getOnlineUsers");
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
				setOnlineUsers([]); // Clear online users on disconnect
			});

			newSocket.on("connect_error", (error) => {
				console.log(`Connection error: ${error.message}`);
				// Try to reconnect on error
				setTimeout(() => {
					newSocket.connect();
				}, 1000);
			});

			newSocket.on("getOnlineUsers", (users) => {
				console.log("Online users updated:", users);
				setOnlineUsers(users || []); // Ensure we always have an array
			});

			// Request online users periodically
			const interval = setInterval(() => {
				if (newSocket.connected) {
					newSocket.emit("getOnlineUsers");
				}
			}, 5000);

			setSocket(newSocket);

			return () => {
				console.log("Cleaning up socket connection");
				clearInterval(interval);
				newSocket.disconnect();
			};
		} else {
			if (socket) {
				console.log("No auth user, closing socket");
				socket.disconnect();
				setSocket(null);
				setOnlineUsers([]); // Clear online users when logged out
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
