import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const Signup = ({ navigation }) => { 
  // ... (Similar structure to Login.js, but for signup logic)

  const handleSignup = () => {
    // ... your signup logic ...
    navigation.navigate('Login'); // Navigate back to Login after signup
  };

  return (
    <View style={styles.container}>
      {/* ... your signup form ... */}
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default Signup;