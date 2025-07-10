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
			// Remove the /api prefix for socket connection
			const serverUrl = getApiUrl('').replace('/api', '');
			console.log(`Connecting to socket server at ${serverUrl}`);
			
			const newSocket = io(serverUrl, {
				query: {
					userId: authUser._id
				},
				withCredentials: true
			});

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

			setSocket(newSocket);

			return () => {
				console.log("Closing socket connection");
				newSocket.disconnect();
			};
		} else {
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
