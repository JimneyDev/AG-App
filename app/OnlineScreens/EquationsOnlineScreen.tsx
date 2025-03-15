import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

// Define your base (light) button colors
const baseColors = {
  elementary: "#3498db", // Blue
  middle: "#02c400",     // Green
  junior: "#e5ec00",     // Yellow
  senior: "#ff1500",     // Red
};

// Define the darker colors to which the buttons should fade when pressed
const pressedColors = {
  elementary: "#1F4F80", // Darker Blue
  middle: "#006400",     // Darker Green
  junior: "#B8860B",     // Darker Yellow
  senior: "#8B0000",     // Darker Red
};

/**
 * darkenColor
 *
 * A utility function that darkens a hex color by a specified percentage.
 * (Not used in this version since we use pre-defined pressedColors.)
 */
function darkenColor(hex: string, percent: number): string {
  let hexValue = hex.charAt(0) === "#" ? hex.slice(1) : hex;
  let num = parseInt(hexValue, 16);
  let amt = Math.round(2.55 * percent);
  let r = Math.max((num >> 16) - amt, 0);
  let g = Math.max(((num >> 8) & 0x00ff) - amt, 0);
  let b = Math.max((num & 0x0000ff) - amt, 0);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * AnimatedButton Component
 *
 * Renders a button that uses Animated interpolation to smoothly transition its background color
 * from the base color to the pressed (darker) color and scales up when pressed.
 */
interface AnimatedButtonProps {
  title: string;
  baseColor: string;
  pressedColor: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ title, baseColor, pressedColor }) => {
  // Animated value for scaling
  const scaleAnim = useState(new Animated.Value(1))[0];
  // Animated value for color interpolation (0 = base, 1 = pressed)
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

  // Interpolate the background color from baseColor to pressedColor
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, pressedColor],
  });

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
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

/**
 * EquationsOnlineScreen Component
 *
 * Uses the global theme from ThemeContext to set the background and text colors.
 * Renders the subtitle, title, and four division buttons using the AnimatedButton component.
 */
export default function EquationsOnlineScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Define container theme colors for light and dark modes
  const lightTheme = { background: "#FFFFFF", text: "#000000" };
  const darkTheme = { background: "#333333", text: "#FFFFFF" };
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>Equations Online</Text>
      <Text style={[styles.title, { color: themeColors.text }]}>Divisions</Text>

      <AnimatedButton title="Elementary" baseColor={baseColors.elementary} pressedColor={pressedColors.elementary} />
      <AnimatedButton title="Middle" baseColor={baseColors.middle} pressedColor={pressedColors.middle} />
      <AnimatedButton title="Junior" baseColor={baseColors.junior} pressedColor={pressedColors.junior} />
      <AnimatedButton title="Senior" baseColor={baseColors.senior} pressedColor={pressedColors.senior} />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});