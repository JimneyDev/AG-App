import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Animated, Dimensions, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Get the screen width
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  // Manage the scale animation for the buttons
  const [scaleSignup] = useState(new Animated.Value(1));
  const [scaleLogin] = useState(new Animated.Value(1));

  // Manage button press state for color change
  const [pressedButton, setPressedButton] = useState<"signup" | "login" | null>(null);

  // Handle press in/out for button animation
  const handlePressIn = (button: "signup" | "login") => {
    const scaleValue = button === "signup" ? scaleSignup : scaleLogin;
    Animated.spring(scaleValue, {
      toValue: 1.1, // Grow the button when pressed
      useNativeDriver: true, // Use native driver for better performance
    }).start();
    setPressedButton(button);  // Set pressed state to change color
  };

  const handlePressOut = () => {
    setPressedButton(null);  // Reset pressed state when press ends
    const scaleValue = scaleSignup;  // Reset scale when press ends
    Animated.spring(scaleValue, {
      toValue: 1, // Return the button to its normal size when press ends
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text> {/* Heading */}

      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
          onPress={() => router.push("/screens/Signup")}
          onPressIn={() => handlePressIn("signup")} // Apply animation on press in
          onPressOut={handlePressOut} // Reset animation on press out
        >
          <Animated.View
            style={[
              styles.button,
              { width: width * 0.3 }, // Button takes 30% of the screen width
              { transform: [{ scale: scaleSignup }] }, // Apply scaling to the signup button
              pressedButton === "signup" && styles.buttonPressed, // Change color when pressed
            ]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
          onPress={() => router.push("/screens/Login")}
          onPressIn={() => handlePressIn("login")} // Apply animation on press in
          onPressOut={handlePressOut} // Reset animation on press out
        >
          <Animated.View
            style={[
              styles.button,
              { width: width * 0.3 }, // Button takes 30% of the screen width
              { transform: [{ scale: scaleLogin }] }, // Apply scaling to the login button
              pressedButton === "login" && styles.buttonPressed, // Change color when pressed
            ]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Add padding around the container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Add space between the buttons
    width: "100%", // Use full width of the container for centering
    alignItems: "center", // Center the buttons horizontally
  },
  button: {
    backgroundColor: "#3498db", // Same color as the Menu screen
    paddingVertical: 12, // Vertical padding
    borderRadius: 5, // Rounded corners
    alignItems: "center", // Center the text
    justifyContent: "center", // Ensure text is centered inside the button
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPressed: {
    backgroundColor: "#2980b9", // Darker shade when the button is pressed
  },
});
