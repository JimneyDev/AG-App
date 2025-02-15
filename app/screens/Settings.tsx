// app/screens/Settings.tsx
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Switch, 
  StyleSheet, 
  Pressable, 
  Animated, 
  Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";

const { width } = Dimensions.get("window");

const ROUTES = {
  menu: "./Menu" as const,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { OG_user, displayName, setDisplayName } = useUser();
  const { isDarkMode, setDarkMode } = useTheme();

  // Local state for updated settings values
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);

  useEffect(() => {
    setLocalDisplayName(displayName);
  }, [displayName]);

  useEffect(() => {
    setLocalDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Unique animated values for Save and Back buttons
  const [scaleSave] = useState(new Animated.Value(1));
  const [scaleBack] = useState(new Animated.Value(1));
  const [pressedSave, setPressedSave] = useState(false);
  const [pressedBack, setPressedBack] = useState(false);

  const handlePressSaveIn = () => {
    setPressedSave(true);
    Animated.spring(scaleSave, { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handlePressSaveOut = () => {
    setPressedSave(false);
    Animated.spring(scaleSave, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePressBackIn = () => {
    setPressedBack(true);
    Animated.spring(scaleBack, { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handlePressBackOut = () => {
    setPressedBack(false);
    Animated.spring(scaleBack, { toValue: 1, useNativeDriver: true }).start();
  };

  // Function to save changes to the backend
  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/update_settings", {
        username: OG_user,
        displayName: localDisplayName,
        darkMode: localDarkMode,
      });
      if (response.status === 200) {
        // Update global state so changes persist across sessions
        setDisplayName(localDisplayName);
        setDarkMode(localDarkMode);
        alert("Settings updated successfully!");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  const handlePressBack = () => {
    router.push(ROUTES.menu);
  };

  return (
    <View style={[styles.container, localDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, localDarkMode && styles.darkText]}>Settings</Text>

      {/* Display Name Section */}
      <View style={styles.optionContainer}>
        <Text style={[styles.ogUserText, localDarkMode && styles.darkText]}>
          Username: {OG_user}
        </Text>
        <Text style={[styles.optionText, localDarkMode && styles.darkText]}>
          Display Name
        </Text>
        <TextInput
          style={[styles.input, localDarkMode && styles.darkInput]}
          value={localDisplayName}
          onChangeText={setLocalDisplayName}
        />
      </View>

      {/* Dark Mode Toggle Section */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, localDarkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch
          value={localDarkMode}
          onValueChange={setLocalDarkMode}
        />
      </View>

      {/* Save Changes Button */}
      <Pressable
        onPress={handleSaveChanges}
        onPressIn={handlePressSaveIn}
        onPressOut={handlePressSaveOut}
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.25 },
            pressedSave && styles.buttonPressed,
            { transform: [{ scale: scaleSave }] },
          ]}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </Animated.View>
      </Pressable>

      {/* Back Button */}
      <Pressable
        onPress={handlePressBack}
        onPressIn={handlePressBackIn}
        onPressOut={handlePressBackOut}
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.25 },
            pressedBack && styles.buttonPressed,
            { transform: [{ scale: scaleBack }] },
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
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  ogUserText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
  },
  optionContainer: {
    marginBottom: 20,
    width: "100%",
  },
  optionText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#000",
  },
  darkInput: {
    backgroundColor: "#555",
    borderColor: "#444",
    color: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
    textAlign: "center",
  },
  buttonPressed: {
    backgroundColor: "#2980b9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
