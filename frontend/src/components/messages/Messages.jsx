import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages = [], loading } = useGetMessages();
useListenMessages();
const lastMessageRef = useRef();

useEffect(() => {
   if (!loading && messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
   }
}, [messages, loading]);
 // Depend on messages to trigger scroll on new message

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((message, idx) => (
          <div 
            key={message._id} 
            ref={idx === messages.length - 1 ? lastMessageRef : null} // Ref on the last message
          > 
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && Array.isArray(messages) && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
