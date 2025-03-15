import { useState } from 'react';
import { Text, Pressable, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';  
import ThemedText from '../../components/ThemedText';

const { width } = Dimensions.get('window');

const ROUTES = {
  equations: '../OnlineScreens/EquationsOnlineScreen' as const,
  onsets: './OnlineScreens/OnSetsOnlineScreen' as const,
  linguistics: './OnlineScreens/LinguisticsOnlineScreen' as const,
  menu: './Menu' as const,
};

const Menu = () => {
  const router = useRouter();
  const [pressedButton, setPressedButton] = useState<"signup" | "login" | "settings" | null>(null);
  const [scaleSignup] = useState(new Animated.Value(1));
  const [scaleLogin] = useState(new Animated.Value(1));
  const [scaleSettings] = useState(new Animated.Value(1));
  const [scaleBack] = useState(new Animated.Value(1));
  const [pressedBack, setPressedBack] = useState(false);

  const handlePressEquations = () => router.push(ROUTES.equations);
  const handlePressOnSets = () => router.push(ROUTES.onsets);
  const handlePressLinguistics = () => router.push(ROUTES.linguistics);
  const handlePressBack = () => router.push(ROUTES.menu);

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

  const handlePressBackIn = () => {
    setPressedBack(true);
    Animated.spring(scaleBack, { toValue: 1.1, useNativeDriver: true }).start();
  };
  
  const handlePressBackOut = () => {
    setPressedBack(false);
    Animated.spring(scaleBack, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.menuContainer}>
      <ThemedText style={styles.subheading}>Online</ThemedText>
      <ThemedText style={styles.heading}>Game Select</ThemedText>

      <Pressable
        onPress={handlePressEquations}
        onPressIn={() => handlePressIn('signup')}
        onPressOut={() => handlePressOut('signup')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.35 }, pressedButton === 'signup' && styles.buttonPressed, { transform: [{ scale: scaleSignup }] }]}
        >
          <Text style={styles.buttonText}>Equations</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressOnSets}
        onPressIn={() => handlePressIn('login')}
        onPressOut={() => handlePressOut('login')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.35 }, pressedButton === 'login' && styles.buttonPressed, { transform: [{ scale: scaleLogin }] }]}
        >
          <Text style={styles.buttonText}>OnSets</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressLinguistics}
        onPressIn={() => handlePressIn('settings')}
        onPressOut={() => handlePressOut('settings')}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        <Animated.View
          style={[styles.button, { width: width * 0.35 }, pressedButton === 'settings' && styles.buttonPressed, { transform: [{ scale: scaleSettings }] }]}
        >
          <Text style={styles.buttonText}>Linguistics</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={handlePressBack}
        onPressIn={handlePressBackIn}
        onPressOut={handlePressBackOut}
        >
        <Animated.View
            style={[styles.button, { width: width * 0.35 }, pressedBack && styles.buttonPressed, { transform: [{ scale: scaleBack }] }]}
        >
            <Text style={styles.buttonText}>Back</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    width: "35%",
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
