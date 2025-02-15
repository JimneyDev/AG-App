import { useState } from 'react';
import { Text, Pressable, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';  // Correct import for expo-router

// Get the screen width
const { width } = Dimensions.get('window');

// Define valid routes explicitly
const ROUTES = {
  signup: '/screens/Signup' as const,
  login: '/screens/Login' as const,
  settings: '/screens/Settings' as const,
};

const Menu = () => {
  const router = useRouter();

  // Manage individual press states for each button
  const [pressedButton, setPressedButton] = useState<"signup" | "login" | "settings" | null>(null);

  // Define scale animations for each button
  const [scaleSignup] = useState(new Animated.Value(1));
  const [scaleLogin] = useState(new Animated.Value(1));
  const [scaleSettings] = useState(new Animated.Value(1));

  // Handle button press navigation
  const handlePressSignup = () => router.push(ROUTES.signup);
  const handlePressLogin = () => router.push(ROUTES.login);
  const handlePressSettings = () => router.push(ROUTES.settings);

  // Handle press in/out for each button with independent scaling
  const handlePressIn = (button: "signup" | "login" | "settings") => {
    setPressedButton(button); // Set pressed button state

    // Apply scale animation to the button that's being pressed
    const scaleValue = button === "signup" ? scaleSignup : button === "login" ? scaleLogin : scaleSettings;
    Animated.spring(scaleValue, {
      toValue: 1.1, // Grow button to 1.1 scale when clicked
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const handlePressOut = (button: "signup" | "login" | "settings") => {
    setPressedButton(null); // Reset pressed state when press ends

    // Reset the scale of the button that was pressed
    const scaleValue = button === "signup" ? scaleSignup : button === "login" ? scaleLogin : scaleSettings;
    Animated.spring(scaleValue, {
      toValue: 1, // Return button to its normal scale when press ends
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  return (
    <View style={styles.menuContainer}>
      {/* Menu Heading */}
      <Text style={styles.heading}>Menu</Text>

      <Pressable
        onPress={handlePressSignup}
        onPressIn={() => handlePressIn('signup')}  // Apply animation when press starts
        onPressOut={() => handlePressOut('signup')}  // Apply animation when press ends
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.3 },  // Set the width to 30% of the screen width
            pressedButton === 'signup' && styles.buttonPressed,  // Apply pressed style when the button is pressed
            { transform: [{ scale: scaleSignup }] }, // Apply scaling only to the signup button
          ]}
        >
          <Text style={styles.buttonText}>Online</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressLogin}
        onPressIn={() => handlePressIn('login')}  // Apply animation when press starts
        onPressOut={() => handlePressOut('login')}  // Apply animation when press ends
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.3 },  // Set the width to 30% of the screen width
            pressedButton === 'login' && styles.buttonPressed,  // Apply pressed style when the button is pressed
            { transform: [{ scale: scaleLogin }] }, // Apply scaling only to the login button
          ]}
        >
          <Text style={styles.buttonText}>Practice</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressSettings}
        onPressIn={() => handlePressIn('settings')}  // Apply animation when press starts
        onPressOut={() => handlePressOut('settings')}  // Apply animation when press ends
      >
        <Animated.View
          style={[
            styles.button,
            { width: width * 0.3 },  // Set the width to 30% of the screen width
            pressedButton === 'settings' && styles.buttonPressed,  // Apply pressed style when the button is pressed
            { transform: [{ scale: scaleSettings }] }, // Apply scaling only to the settings button
          ]}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20, // Add padding to prevent edges touching
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,  // Space between heading and buttons
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db', // Default button color
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonPressed: {
    backgroundColor: '#2980b9', // Darker shade when button is pressed
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Menu;
