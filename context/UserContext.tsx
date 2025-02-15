import React, { createContext, useState, useContext, ReactNode } from "react";

export type UserContextType = {
  OG_user: string;
  setOG_user: (user: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [OG_user, setOG_user] = useState(""); // Manage OG_user state

  return (
    <UserContext.Provider value={{ OG_user, setOG_user }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
