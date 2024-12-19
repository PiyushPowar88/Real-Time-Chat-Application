import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/socketContext";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        console.log("Fetched messages:", data);
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();

    // Listen for real-time messages
    if (socket && selectedConversation?._id) {
      const messageListener = (newMessage) => {
        if (newMessage.conversationId === selectedConversation._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on("newMessage", messageListener);

      return () => {
        socket.off("newMessage", messageListener);
      };
    }
  }, [selectedConversation?._id, setMessages, socket]);

  return { messages, setMessages, loading };
};

export default useGetMessages;
