import { useEffect, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	const handleNewMessage = useCallback((newMessage) => {
		// CRITICAL: Always log the full message object for debugging
		console.log("Raw message received:", JSON.stringify(newMessage));
		
		if (!selectedConversation || !authUser || !newMessage) {
			console.log("Missing required data to process message");
			return;
		}
		
		// Convert IDs to strings for safe comparison, handle potential undefined values
		const currentUserId = String(authUser._id || "");
		const selectedUserId = String(selectedConversation._id || "");
		const messageSenderId = String(newMessage.senderId || "");
		const messageReceiverId = String(newMessage.receiverId || "");
		
		console.log("Comparing IDs:");
		console.log("Current user:", currentUserId);
		console.log("Selected user:", selectedUserId);
		console.log("Message sender:", messageSenderId);
		console.log("Message receiver:", messageReceiverId);
		
		// Check if this message is part of the current conversation
		const isPartOfConversation = (
			// Current user sent this message to selected user
			(currentUserId === messageSenderId && selectedUserId === messageReceiverId) ||
			// Selected user sent this message to current user
			(selectedUserId === messageSenderId && currentUserId === messageReceiverId)
		);
		
		console.log("Is part of current conversation:", isPartOfConversation);
		
		if (isPartOfConversation) {
			try {
				// Play notification sound
				const sound = new Audio(notificationSound);
				sound.play().catch(err => console.log("Error playing sound:", err));
				
				// Add animation flag
				const messageWithAnimation = {
					...newMessage,
					shouldShake: true
				};
				
				// Update messages state
				setMessages(prev => {
					// Check if we already have this message (by ID or as a temp message)
					const existingMsg = prev.find(msg => 
						(msg._id && newMessage._id && msg._id === newMessage._id) || 
						(msg.isTemp && msg.message === newMessage.message)
					);
					
					if (existingMsg) {
						// Replace temp message with real one if needed
						if (existingMsg.isTemp) {
							return prev.map(msg => 
								(msg.isTemp && msg.message === newMessage.message) 
									? messageWithAnimation 
									: msg
							);
						}
						return prev; // Don't add duplicates
					}
					
					// Add new message
					return [...prev, messageWithAnimation];
				});
			} catch (error) {
				console.error("Error handling new message:", error);
			}
		}
	}, [selectedConversation, authUser, setMessages]);
	
	// Handle message history updates
	const handleMessageHistory = useCallback((messages) => {
		console.log("Received message history:", messages);
		if (Array.isArray(messages)) {
			setMessages(messages);
		}
	}, [setMessages]);

	useEffect(() => {
		if (!socket) return;
		
		// Listen for new messages and message history
		socket.on("newMessage", handleNewMessage);
		socket.on("messageHistory", handleMessageHistory);
		
		// Request any missed messages when conversation changes
		if (selectedConversation?._id) {
			console.log("Requesting messages for conversation:", selectedConversation._id);
			socket.emit("getMessages", {
				receiverId: selectedConversation._id
			});
		}

		// Clean up the event listeners
		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("messageHistory", handleMessageHistory);
		};
	}, [socket, handleNewMessage, handleMessageHistory, selectedConversation]);
};

export default useListenMessages;
