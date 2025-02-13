import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

// Updated API URL to 10.0.2.2 for the Android emulator
const API_URL = "http://127.0.0.1:5000"; // Use 10.0.2.2 for Android emulator

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/`)  
      .then(response => setMessage(response.data.message))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}
