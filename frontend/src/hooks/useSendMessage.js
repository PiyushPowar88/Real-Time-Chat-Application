import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    if (!selectedConversation) {
      toast.error("No conversation selected");
      return false; // Prevent sending if no conversation is selected
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to send message");
      }

      // Assuming the API returns the new message object
      setMessages((prevMessages) => [...prevMessages, data]);
console.log("new Message sent is:", data)
      return true; // Indicate success
    } catch (error) {
      console.error("SendMessage Error:", error.message);
      toast.error(error.message || "An error occurred");
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
