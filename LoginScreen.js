import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { AuthContext } from "../AuthContext";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");  // Changed email to username
  const [password, setPassword] = useState("");

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />  {/* Changed Email to Username */}
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={() => login(username, password)} />
    </View>
  );
}
