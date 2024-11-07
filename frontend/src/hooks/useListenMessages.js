import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext"
import useConversation from '../zustand/useConversation'

const useListenMessages = () => {
 const {socket} = useSocketContext();
 const {messages,setMessages} = useConversation();


 useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
       setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
 
    return () => socket?.off("newMessage"); // Ensure "newMessage" is correctly referenced
 }, [socket, setMessages]);
 
}

export default useListenMessages;
