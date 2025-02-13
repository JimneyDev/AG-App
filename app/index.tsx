import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {/* Container for buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={() => router.push("/Signup")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => router.push("/Login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Add space between the buttons
    width: "30%", // Optional, adjust the button size
  },
});
