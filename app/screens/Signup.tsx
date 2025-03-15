import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import ThemedText from '../../components/ThemedText';

// Get screen width
const { width } = Dimensions.get("window");

export default function SignUpScreen() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [scale] = useState(new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const router = useRouter();  // For navigation

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

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        router.push('/screens/Login');  // Navigate to the Login screen
      } else {
        alert("Signup failed: " + data.message);
      }
    } catch (error) {
      alert("Error signing up");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Sign Up</ThemedText>

      <TextInput
        style={[styles.input, { width: width * 0.3 }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
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
          onPress={handleSignUp}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
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
