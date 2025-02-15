import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";

// Get screen width
const { width } = Dimensions.get("window");

export default function SignUpScreen() {
  const [username, setUsername] = useState("");  // Changed email to username
  const [password, setPassword] = useState("");

  // Animation for button scale
  const [scale] = useState(new Animated.Value(1));

  // State to manage the button press color
  const [pressed, setPressed] = useState(false);

  // Handle button press animation
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1, // Scale the button up
      useNativeDriver: true,
    }).start();
    setPressed(true);  // Set the button to pressed state to change the color
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1, // Return the button to original size
      useNativeDriver: true,
    }).start();
    setPressed(false); // Reset the pressed state when press ends
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),  // Changed email to username
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert("Signup failed: " + data.message);
      }
    } catch (error) {
      alert("Error signing up");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"  // Changed Email to Username
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Animated SignUp Button */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: width * 0.3 }, // Button takes up 30% of the screen width
            pressed && styles.buttonPressed, // Apply pressed color change
          ]}
          onPress={handleSignUp}
          onPressIn={handlePressIn} // Trigger scale animation and color change
          onPressOut={handlePressOut} // Reset the scale when the press ends
          activeOpacity={1} // Remove any default opacity effect on press
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
    backgroundColor: "#3498db", // Initial button color
    paddingVertical: 12, // Vertical padding for the button
    borderRadius: 5, // Rounded corners
    alignItems: "center", // Center text inside the button
    justifyContent: "center", // Ensure text is centered
  },
  buttonText: {
    color: "white", // Text color inside the button
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPressed: {
    backgroundColor: "#2980b9", // Darker shade for button when pressed
  },
});
