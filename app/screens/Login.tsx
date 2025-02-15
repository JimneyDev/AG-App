import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext"; // Import UserContext

// Get screen width
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const userContext = useContext(UserContext); // Ensure context is not undefined

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  
  const { setOG_user } = userContext; // Use context to store username

  // Animation for button scale
  const [scale] = useState(new Animated.Value(1));
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
    setPressed(true);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setPressed(false);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        setOG_user(username); // Store the username in context
        alert("Login successful!");
        router.push("/screens/Menu");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Error logging in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Animated Login Button */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[styles.button, { width: width * 0.3 }, pressed && styles.buttonPressed]}
          onPress={handleLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPressed: {
    backgroundColor: "#2980b9",
  },
});
