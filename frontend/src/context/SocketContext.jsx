import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

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
			// Use environment variable for production or localhost for development
			const serverUrl = import.meta.env.PROD 
				? "https://api.chatify.kushagra-chavel.me" 
				: "http://localhost:5000";
			console.log(`Connecting to socket server at ${serverUrl}`);
			
			// Create socket connection
			const newSocket = io(serverUrl, {
				query: {
					userId: authUser._id
				},
				withCredentials: true
			});

			// Set up event handlers
			newSocket.on("connect", () => {
				console.log(`Socket connected with ID: ${newSocket.id}`);
				console.log(`User ID: ${authUser._id}`);
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
			});

			newSocket.on("connect_error", (error) => {
				console.log(`Connection error: ${error.message}`);
			});

			newSocket.on("getOnlineUsers", (users) => {
				console.log("Online users updated:", users);
				setOnlineUsers(users);
			});

			// Store the socket in state
			setSocket(newSocket);

			// Clean up on unmount
			return () => {
				console.log("Closing socket connection");
				newSocket.disconnect();
			};
		} else {
			// No auth user, close any existing socket
			if (socket) {
				console.log("No auth user, closing socket");
				socket.disconnect();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
