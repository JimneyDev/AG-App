import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

// Base (light) button colors
const baseColors = {
  elementary: "#3498db", // Blue
  middle: "#02c400",     // Green
  junior: "#eada0f",     // Yellow
  senior: "#e21d25",     // Red
};

// Darker colors for pressed state
const pressedColors = {
  elementary: "#3059d2", // Darker Blue
  middle: "#168b2c",     // Darker Green
  junior: "#c8b227",     // Darker Yellow
  senior: "#bd191f",     // Darker Red
};

interface AnimatedButtonProps {
  title: string;
  baseColor: string;
  pressedColor: string;
  onPress: () => void;
  isActive: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  baseColor,
  pressedColor,
  onPress,
  isActive,
}) => {
  const scaleAnim = useState(new Animated.Value(1))[0];
  const colorAnim = useState(new Animated.Value(0))[0];

  const onPressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // If this button's dropdown is active, force the pressedColor; otherwise, interpolate.
  const backgroundColor = isActive
    ? pressedColor
    : colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [baseColor, pressedColor],
      });

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.button,
          { backgroundColor, width: width * 0.35, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default function EquationsOnlineScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Global theme for container, text, input background, and placeholder
  const themeColors = isDarkMode
    ? { background: "#333333", text: "#FFFFFF", inputBackground: "#555555", placeholder: "#AAAAAA" }
    : { background: "#FFFFFF", text: "#000000", inputBackground: "#EEEEEE", placeholder: "#666666" };

  // State for tracking which division's dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // State for the invite username input
  const [inviteUsername, setInviteUsername] = useState<string>("");

  const handlePressDivision = (division: string) => {
    // Toggle the dropdown: close if already open; otherwise, open this one
    setActiveDropdown((prev) => (prev === division ? null : division));
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>Equations Online</Text>
      <Text style={[styles.title, { color: themeColors.text }]}>Divisions</Text>

      {Object.entries(baseColors).map(([division, color]) => (
        <View key={division} style={styles.divisionContainer}>
          <AnimatedButton
            title={division.charAt(0).toUpperCase() + division.slice(1)}
            baseColor={color}
            pressedColor={pressedColors[division as keyof typeof pressedColors] ?? color}
            onPress={() => handlePressDivision(division)}
            isActive={activeDropdown === division}
          />

          {activeDropdown === division && (
            <View style={[styles.dropdown, { backgroundColor: themeColors.inputBackground }]}>
              <TextInput
                style={[
                  styles.input,
                  { color: themeColors.text, backgroundColor: themeColors.inputBackground },
                ]}
                placeholder="Enter Player's Username"
                placeholderTextColor={isDarkMode ? "#FFFFFF" : themeColors.placeholder}
                value={inviteUsername}
                onChangeText={setInviteUsername}
              />
              <AnimatedButton
                title="Invite Friend"
                baseColor={baseColors.middle} // Invite Friend button matches the unpressed Middle button color
                pressedColor={pressedColors.middle}
                onPress={() => console.log(`Inviting ${inviteUsername}`)} // Replace with your invite logic
                isActive={false}
              />
              <Text style={[styles.noteText, { color: themeColors.text }]}>
                Check the Settings to see your Username
              </Text>
              <Text style={[styles.noteText, { color: themeColors.text }]}>
                Not the Display Name
              </Text>
            </View>
          )}
        </View>
      ))}
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  divisionContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  dropdown: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    width: width * 0.6,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noteText: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
});
