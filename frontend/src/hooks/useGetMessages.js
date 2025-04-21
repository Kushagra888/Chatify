import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				if (!selectedConversation?._id) return;
				
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				
				// Clear existing messages first to prevent duplicates
				setMessages(data || []);
			} catch (error) {
				toast.error(error.message);
				setMessages([]);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
		else setLoading(false);
	}, [selectedConversation?._id, setMessages]);

	return { loading };
};
export default useGetMessages;
