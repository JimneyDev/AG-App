import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Updated API URL to 10.0.2.2 for the Android emulator
const API_URL = "http://127.0.0.1:5000";  // Use 10.0.2.2 for Android emulator

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      setUser(user);
    } catch (error) {
      alert("Login failed!");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
