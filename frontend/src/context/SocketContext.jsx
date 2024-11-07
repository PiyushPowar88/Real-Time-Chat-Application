import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
       const newSocket = io("http://localhost:1000", {
          query: { userId: authUser._id },
       });
 
       newSocket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
       });
 
       setSocket(newSocket);
 
       newSocket.on("getOnlineUsers", (users) => {
          setOnlineUsers(users);
       });
 
       return () => {
          newSocket.close();
          setSocket(null);
       };
    }
 }, [authUser]);
  // Ensure socket re-initializes only when authUser changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
