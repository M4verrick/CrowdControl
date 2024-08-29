import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const Login = ({ navigation }) => { // Access navigation prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For your MVP, just simulate a successful login
    console.log('Logging in with:', username, password); 
    // In a real app, you'd send data to your backend here for authentication.

    // Navigate to the next screen (assuming you have one)
    navigation.navigate('Home'); // Replace 'Home' with your actual screen name
  };

  return (
    <View style={styles.container}>
      {/* ... your login form with TextInput and Button ... */}
      <Button title="Login" onPress={handleLogin} />

      {/* Add a button to navigate to Signup */}
      <Button 
        title="Don't have an account? Sign Up" 
        onPress={() => navigation.navigate('Signup')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your styles ...
});

export default Login;