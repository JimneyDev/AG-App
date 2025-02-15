// _layout.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function LayoutContent() {
  const { isDarkMode } = useTheme();
  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
});
