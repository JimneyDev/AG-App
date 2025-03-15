// app/screens/Login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import ThemedText from '../../components/ThemedText';
import axios from "axios";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setOGUser, setDisplayName } = useUser();
  const { setDarkMode } = useTheme();

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
      const response = await axios.post("http://127.0.0.1:5000/login", { username, password });
      if (response.status === 200) {
        const userData = response.data.user;
        setOGUser(userData.username);
        setDisplayName(userData.display_name);
        setDarkMode(userData.dark_mode);
        alert("Login successful!");
        router.push("/screens/Menu");
      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Error logging in");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Login</ThemedText>

      <TextInput
        style={[styles.input, { width: width * 0.3 }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { width: width * 0.3 }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[styles.button, { width: width * 0.2 }, pressed && styles.buttonPressed]}
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
