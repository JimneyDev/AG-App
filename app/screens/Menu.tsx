import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      {/* Add buttons or any features you'd like in the menu */}
      <Button title="Online" onPress={() => alert("Online clicked!")} />
      <Button title="Practice" onPress={() => alert("Practice clicked!")} />
      <Button title="Settings" onPress={() => alert("Settings clicked!")} />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
