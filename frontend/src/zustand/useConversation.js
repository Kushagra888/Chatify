import { create } from "zustand";

const useConversation = create((set, get) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => {
		set({ selectedConversation, messages: [] });
	},
	messages: [],
	setMessages: (messages) => {
		if (typeof messages === 'function') {
			set({ messages: messages(get().messages) });
		} else {
			set({ messages });
		}
	},
}));

export default useConversation;
