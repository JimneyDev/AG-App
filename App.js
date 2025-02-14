import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/index';  // Import the screens
import SignUpScreen from './screens/Signup';
import LoginScreen from './screens/Login';
import MenuScreen from './screens/Menu';

const API_URL = "http://127.0.0.1:5000"; // Use 10.0.2.2 for Android emulator

// Create a Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const [message, setMessage] = useState('');

  // Fetch message from your API
  useEffect(() => {
    axios.get(`${API_URL}/`)  
      .then(response => setMessage(response.data.message))
      .catch(error => console.error(error));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* HomeScreen and other screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
