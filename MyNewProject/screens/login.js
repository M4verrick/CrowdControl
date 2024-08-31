import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { UserContext } from "../screens/usercontext"; // Import the UserContext

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const { setUser } = useContext(UserContext); // Use the context to set the user

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.126:8000/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setMessage("Login Successful");
        setUser({ username }); // Store the username in context
        navigation.navigate("Home");
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      setMessage("Error Logging In");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.signupContainer}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  searchInput: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    fontSize: 16,
  },
  scrollView: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDate: {
    color: "#888",
    marginTop: 5,
    fontSize: 14,
  },
  eventLocation: {
    color: "#888",
    marginTop: 2,
    fontSize: 14,
  },
  eventDescription: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: 350,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    color: "#888",
    fontSize: 16,
    marginBottom: 5,
  },
  modalLocation: {
    color: "#888",
    fontSize: 16,
    marginBottom: 10,
  },
  modalDescription: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  purchaseButton: {
    backgroundColor: "#ff4500",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default LoginScreen;
