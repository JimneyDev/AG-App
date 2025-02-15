import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextProps {
  OG_user: string;
  setOGUser: (user: string) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [OG_user, setOGUser] = useState("defaultUser"); // Your original username
  const [displayName, setDisplayName] = useState(""); // New global display name

  return (
    <UserContext.Provider value={{ OG_user, setOGUser, displayName, setDisplayName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
