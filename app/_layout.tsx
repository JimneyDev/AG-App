// app/layout.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <>
      <Slot />
    </>
  );
}

// Optional: Set the header for specific screens using the "options" export.
export function options() {
  return {
    headerTitle: "Sign In", // Change this to whatever title you want
  };
}
