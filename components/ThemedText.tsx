import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ThemedText(props: TextProps) {
  const { isDarkMode } = useTheme();
  return (
    <Text
      {...props}
      style={[
        { color: isDarkMode ? "#fff" : "#000" },
        props.style,
      ]}
    />
  );
}
