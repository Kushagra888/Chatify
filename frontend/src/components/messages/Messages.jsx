import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
	const { loading } = useGetMessages();
	const { messages, selectedConversation } = useConversation();
	useListenMessages();
	const lastMessageRef = useRef();
	const messagesContainerRef = useRef();

	useEffect(() => {
		console.log("Current messages:", messages);
	}, [messages]);

	useEffect(() => {
		setTimeout(() => {
			if (lastMessageRef.current) {
				lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 100);
	}, [messages, selectedConversation?._id]);

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading &&
				messages.length > 0 &&
				messages.map((message, idx) => (
					<div 
						key={message._id || `msg-${idx}`} 
						ref={idx === messages.length - 1 ? lastMessageRef : null}
					>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;
