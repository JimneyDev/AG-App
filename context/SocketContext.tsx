import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import io from 'socket.io-client'; // Default import for io
import { API_URL } from "../app/config";

// Define the type of the socket connection
interface SocketContextProps {
  socket: SocketIOClient.Socket | null; // Correct type for socket
}

interface SocketProviderProps {
  children: ReactNode;
}
const socket = io.connect(`http://${API_URL}`);

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

// Full URL for your WebSocket server
const SOCKET_SERVER_URL = `${API_URL}/socket.io`; // Full path including /socket.io

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    setSocket(newSocket);

    // Cleanup: close socket on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
