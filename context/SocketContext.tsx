// app/context/SocketContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import io from 'socket.io-client';

interface SocketContextProps {
  socket: SocketIOClient.Socket | null;
}

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

// URL of the Socket server (adjust as needed)
const SOCKET_SERVER_URL = "http://127.0.0.1:5000";

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Cleanup: close socket on unmount
    return () => {
      newSocket.close();  // This is the correct cleanup
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
