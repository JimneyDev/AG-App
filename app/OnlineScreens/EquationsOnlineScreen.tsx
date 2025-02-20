import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Animated, 
  Dimensions, 
  Button 
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext"; // Assuming user context for username
import { useSocket } from "../../context/SocketContext"; // Socket.io context for socket management

// Define the type for division keys
type Division = "Elementary" | "Middle" | "Junior" | "Senior";

const EquationsOnlineScreen = () => {
  const router = useRouter();
  const { OG_user } = useUser();
  const { socket } = useSocket();

  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [inviteUsername, setInviteUsername] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedDivision, setPressedDivision] = useState<Division | null>(null);
  const [pressedButton, setPressedButton] = useState<"Send Invite" | "Cancel" | null>(null);

  // Create animated values for each division button
  const [scaleButtons] = useState<Record<Division | "Send Invite" | "Cancel", Animated.Value>>({
    Elementary: new Animated.Value(1),
    Middle: new Animated.Value(1),
    Junior: new Animated.Value(1),
    Senior: new Animated.Value(1),
    "Send Invite": new Animated.Value(1),
    Cancel: new Animated.Value(1),
  });
  
  // Get screen width; division buttons should be 30% of the screen width
  const screenWidth = Dimensions.get("window").width;

  // Define button colors for each division and the invite/cancel buttons
  const buttonColors: Record<Division | "Send Invite" | "Cancel", string> = {
    Elementary: "#3498db",
    Middle: "#2ecc71",
    Junior: "#f39c12",
    Senior: "#e74c3c",
    "Send Invite": "#2ecc71", // Green for Send Invite
    Cancel: "#e74c3c", // Red for Cancel
  };

  // Function to get a darker version of the color
  const getDarkerColor = (color: string): string => {
    // Remove '#' if present
    const hex = color.replace("#", "");
    // Parse channels
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    // Subtract 30 from each, clamping at 0
    r = Math.max(0, r - 30);
    g = Math.max(0, g - 30);
    b = Math.max(0, b - 30);
    // Convert back to hex string
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Handle division selection
  const handleSelectDivision = (division: Division) => {
    setSelectedDivision(division);
    setModalVisible(true);
  };

  // Handle button press animations (scale outward)
  const handleDivisionPressIn = (division: Division) => {
    setPressedDivision(division);
    Animated.spring(scaleButtons[division], { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handleDivisionPressOut = (division: Division) => {
    setPressedDivision(null);
    Animated.spring(scaleButtons[division], { toValue: 1, useNativeDriver: true }).start();
  };

  // Handle the press on the Send Invite and Cancel buttons
  const handleButtonPressIn = (button: "Send Invite" | "Cancel") => {
    setPressedButton(button);
    Animated.spring(scaleButtons[button], { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handleButtonPressOut = (button: "Send Invite" | "Cancel") => {
    setPressedButton(null);
    Animated.spring(scaleButtons[button], { toValue: 1, useNativeDriver: true }).start();
  };

  // Handle sending the invitation
  const handleInviteFriend = () => {
    if (inviteUsername && socket) {
      socket.emit("send_invite", { from: OG_user, to: inviteUsername, division: selectedDivision });
      setInviteUsername("");
      setModalVisible(false);
    } else {
      alert("Please enter a valid username to invite, or ensure the socket connection is available.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Division</Text>

      <View style={styles.divisions}>
        {(["Elementary", "Middle", "Junior", "Senior"] as Division[]).map((division) => (
          <Pressable
            key={division}
            onPress={() => handleSelectDivision(division)}
            onPressIn={() => handleDivisionPressIn(division)}
            onPressOut={() => handleDivisionPressOut(division)}
          >
            <Animated.View
              style={[
                styles.divisionButton,
                {
                  width: screenWidth * 0.3, // Division buttons should be 30% of screen width
                  backgroundColor: pressedDivision === division
                    ? getDarkerColor(buttonColors[division])
                    : buttonColors[division],
                  transform: [{ scale: scaleButtons[division] }],
                },
              ]}
            >
              <Text style={styles.divisionButtonText}>{division}</Text>
            </Animated.View>
          </Pressable>
        ))}
      </View>

      {selectedDivision && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Invite a Friend to {selectedDivision} Division</Text>
              <TextInput
                style={styles.input}
                value={inviteUsername}
                onChangeText={setInviteUsername}
                placeholder="Enter friend's username"
              />
              <Pressable
                onPressIn={() => handleButtonPressIn("Send Invite")}
                onPressOut={() => handleButtonPressOut("Send Invite")}
                onPress={handleInviteFriend}
              >
                <Animated.View
                  style={[
                    styles.button,
                    {
                      backgroundColor: pressedButton === "Send Invite" 
                        ? getDarkerColor(buttonColors["Send Invite"]) 
                        : buttonColors["Send Invite"],
                      transform: [{ scale: scaleButtons["Send Invite"] }],
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>Send Invite</Text>
                </Animated.View>
              </Pressable>

              <Pressable
                onPressIn={() => handleButtonPressIn("Cancel")}
                onPressOut={() => handleButtonPressOut("Cancel")}
                onPress={() => setModalVisible(false)}
              >
                <Animated.View
                  style={[
                    styles.button,
                    {
                      backgroundColor: pressedButton === "Cancel" 
                        ? getDarkerColor(buttonColors["Cancel"]) 
                        : buttonColors["Cancel"],
                      transform: [{ scale: scaleButtons["Cancel"] }],
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Animated.View>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  divisions: {
    marginBottom: 20,
    flexDirection: "column", // Stack vertically
    alignItems: "center",
  },
  divisionButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  divisionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: 200, // Fixed width for Send Invite and Cancel buttons
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EquationsOnlineScreen;
