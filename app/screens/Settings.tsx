// app/screens/Settings.tsx
import React, { useEffect } from "react";
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
import { useTheme } from "../../context/ThemeContext"; // Global theme

const { width } = Dimensions.get("window");

const ROUTES = {
  menu: "./Menu" as const,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { OG_user, displayName, setDisplayName } = useUser();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // On mount, if displayName is empty, initialize it to OG_user (optional)
  useEffect(() => {
    if (!displayName) {
      setDisplayName(OG_user);
    }
  }, [OG_user]);

  // Manage press states for the Back button
  const [pressedButton, setPressedButton] = React.useState<"back" | null>(null);
  const [scaleBack] = React.useState(new Animated.Value(1));

  const handlePressBack = () => router.push(ROUTES.menu);

  const handlePressIn = (button: "back") => {
    setPressedButton(button);
    if (button === "back") {
      Animated.spring(scaleBack, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = (button: "back") => {
    setPressedButton(null);
    if (button === "back") {
      Animated.spring(scaleBack, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>

      {/* Display Name */}
      <View style={styles.optionContainer}>
        <Text style={[styles.ogUserText, isDarkMode && styles.darkText]}>
          Username: {OG_user}
        </Text>
        <Text style={[styles.optionText, isDarkMode && styles.darkText]}>
          Display Name
        </Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          value={displayName}
          onChangeText={setDisplayName} // Update global displayName variable
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, isDarkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Back Button */}
      <Pressable
        onPress={handlePressBack}
        onPressIn={() => handlePressIn("back")}
        onPressOut={() => handlePressOut("back")}
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.25 },
            pressedButton === "back" && styles.buttonPressed,
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
    color: "#000", // Light mode text
  },
  darkText: {
    color: "#fff", // Dark mode text: white
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
