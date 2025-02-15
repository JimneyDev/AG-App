import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router"; // Correct import for expo-router
import { useUser } from "../../context/UserContext"; // Import UserContext

// Get the screen width
const { width } = Dimensions.get("window");

// Define valid routes explicitly
const ROUTES = {
  menu: "/" as const, // Menu screen route
};

export default function SettingsScreen() {
  const router = useRouter(); // Use the router for navigation
  const { OG_user } = useUser(); // Get the username from context
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setDisplayName(OG_user); // Automatically set display name
  }, [OG_user]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Manage individual press states for each button
  const [pressedButton, setPressedButton] = useState<"back" | null>(null);

  // Define scale animations for each button
  const [scaleBack] = useState(new Animated.Value(1));

  // Handle button press navigation
  const handlePressBack = () => router.push(ROUTES.menu);

  // Handle press in/out for the Back button with independent scaling
  const handlePressIn = (button: "back") => {
    setPressedButton(button); // Set pressed button state

    // Apply scale animation to the button that's being pressed
    const scaleValue = button === "back" ? scaleBack : null;
    if (scaleValue) {
      Animated.spring(scaleValue, {
        toValue: 1.1, // Grow button to 1.1 scale when clicked
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }
  };

  const handlePressOut = (button: "back") => {
    setPressedButton(null); // Reset pressed state when press ends

    // Reset the scale of the button that was pressed
    const scaleValue = button === "back" ? scaleBack : null;
    if (scaleValue) {
      Animated.spring(scaleValue, {
        toValue: 1, // Return button to its normal scale when press ends
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>

      {/* Display OG_user */}
      <Text style={[styles.ogUserText, isDarkMode && styles.darkText]}>
        Username: {OG_user}
      </Text>

      {/* Option 1: Display Name */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Display Name</Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          value={displayName}
          onChangeText={setDisplayName} // Allow editing if needed
        />
      </View>

      {/* Option 2: Dark Mode */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Back Button */}
      <Pressable
        onPress={handlePressBack}
        onPressIn={() => handlePressIn("back")} // Apply animation when press starts
        onPressOut={() => handlePressOut("back")} // Apply animation when press ends
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.3 }, // Set the width to 30% of the screen width
            pressedButton === "back" && styles.buttonPressed, // Apply pressed style when the button is pressed
            { transform: [{ scale: scaleBack }] }, // Apply scaling only to the back button
          ]}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Animated.View>
      </Pressable>
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
  darkContainer: {
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ogUserText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  darkText: {
    color: "white",
  },
  optionContainer: {
    marginBottom: 20,
    width: "100%",
  },
  optionText: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  darkInput: {
    backgroundColor: "#555",
    borderColor: "#444",
    color: "white",
  },
  button: {
    padding: 10,
    backgroundColor: "#3498db", // Default button color
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
    textAlign: "center",
  },
  buttonPressed: {
    backgroundColor: "#2980b9", // Darker shade when button is pressed
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
