import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
			conversationId: conversation._id,
		});

		conversation.messages.push(newMessage._id);

		await Promise.all([conversation.save(), newMessage.save()]);

		const messageToSend = {
			_id: newMessage._id.toString(),
			senderId: senderId.toString(),
			receiverId: receiverId.toString(),
			message: message,
			conversationId: conversation._id.toString(),
			createdAt: newMessage.createdAt,
			updatedAt: newMessage.updatedAt
		};

		// Get the socket ID of the receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		
		// Send to the specific receiver if they're online
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", messageToSend);
		}
		
		// Also send back to the sender's socket to handle multiple tabs/windows
		const senderSocketId = getReceiverSocketId(senderId);
		if (senderSocketId) {
			io.to(senderSocketId).emit("newMessage", messageToSend);
		}

		res.status(201).json(messageToSend);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		});

		if (!conversation) {
			return res.status(200).json([]);
		}

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

		res.status(200).json(formattedMessages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
