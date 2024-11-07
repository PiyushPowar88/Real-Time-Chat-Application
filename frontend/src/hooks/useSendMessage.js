import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    if (!selectedConversation) {
      toast.error("No conversation selected");
      return; // Prevent sending if no conversation is selected
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Corrected header casing
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      console.log("API Response:", data); // Debug log

      if (data.error) throw new Error(data.error);

      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, data]); // Assuming data contains the new message
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
