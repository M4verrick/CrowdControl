import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

const BackgroundLayout = ({ children }) => {
  return (
    <ImageBackground
      source={require('../tele.jpg')} // or use a URL
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackgroundLayout;
