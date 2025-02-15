import { useState } from 'react';
import { Text, Pressable, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';  
import ThemedText from '../../components/ThemedText';

const { width } = Dimensions.get('window');

const ROUTES = {
  online: '/screens/OnlineSelection' as const,
  practice: '/screens/PracticeSelection' as const,
  settings: '/screens/Settings' as const,
};

const Menu = () => {
  const router = useRouter();
  const [pressedButton, setPressedButton] = useState<"signup" | "login" | "settings" | null>(null);
  const [scaleSignup] = useState(new Animated.Value(1));
  const [scaleLogin] = useState(new Animated.Value(1));
  const [scaleSettings] = useState(new Animated.Value(1));

  const handlePressSignup = () => router.push(ROUTES.online);
  const handlePressLogin = () => router.push(ROUTES.practice);
  const handlePressSettings = () => router.push(ROUTES.settings);

  const handlePressIn = (button: "signup" | "login" | "settings") => {
    setPressedButton(button); 
    const scaleValue = button === "signup" ? scaleSignup : button === "login" ? scaleLogin : scaleSettings;
    Animated.spring(scaleValue, { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handlePressOut = (button: "signup" | "login" | "settings") => {
    setPressedButton(null); 
    const scaleValue = button === "signup" ? scaleSignup : button === "login" ? scaleLogin : scaleSettings;
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.menuContainer}>
      <ThemedText style={styles.heading}>Menu</ThemedText>

      <Pressable
        onPress={handlePressSignup}
        onPressIn={() => handlePressIn('signup')}
        onPressOut={() => handlePressOut('signup')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.3 }, pressedButton === 'signup' && styles.buttonPressed, { transform: [{ scale: scaleSignup }] }]}
        >
          <Text style={styles.buttonText}>Online</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressLogin}
        onPressIn={() => handlePressIn('login')}
        onPressOut={() => handlePressOut('login')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.3 }, pressedButton === 'login' && styles.buttonPressed, { transform: [{ scale: scaleLogin }] }]}
        >
          <Text style={styles.buttonText}>Practice</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressSettings}
        onPressIn={() => handlePressIn('settings')}
        onPressOut={() => handlePressOut('settings')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.3 }, pressedButton === 'settings' && styles.buttonPressed, { transform: [{ scale: scaleSettings }] }]}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonPressed: {
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Menu;
