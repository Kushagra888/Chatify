import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { selectedConversation, setMessages } = useConversation();
	const { authUser } = useAuthContext();

	const sendMessage = async (message) => {
		// Don't send empty messages
		if (!message || !message.trim() || !selectedConversation || !authUser) {
			console.log("Cannot send message: missing required data");
			return;
		}
		
		// Create a temporary message to show immediately
		const tempMessage = {
			_id: `temp-${Date.now()}`,
			senderId: authUser._id,
			receiverId: selectedConversation._id,
			message: message,
			createdAt: new Date().toISOString(),
			isTemp: true
		};
		
		// Log the temp message for debugging
		console.log("Adding temporary message:", tempMessage);
		
		// Add temp message to UI
		setMessages(prev => [...prev, tempMessage]);
		
		setLoading(true);
		
		try {
			console.log("Sending message to:", selectedConversation._id);
			
			// Send message to server
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			
			// Check for HTTP errors
			if (!res.ok) {
				throw new Error(`Server returned ${res.status}: ${res.statusText}`);
			}
			
			const data = await res.json();
			
			// Check for API errors
			if (data.error) {
				throw new Error(data.error);
			}
			
			console.log("Message sent successfully, response:", data);
			
			// Replace temp message with real one
			setMessages(prev => 
				prev.map(msg => 
					msg._id === tempMessage._id ? { ...data, shouldShake: true } : msg
				)
			);
		} catch (error) {
			console.error("Failed to send message:", error);
			toast.error("Failed to send message");
			
			// Remove the temp message on error
			setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
