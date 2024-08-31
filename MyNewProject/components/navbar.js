import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const NavBar = ({ navigation, isTicketRedeemed }) => {
  const handleMapNavigation = () => {
    if (isTicketRedeemed) {
      navigation.navigate('Map');
    } else {
      Alert.alert('Access Denied', 'You must redeem your ticket to access the map.');
    }
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/pic1.webp')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tickets')}>
        <Image source={require('../assets/pic2.webp')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={handleMapNavigation}>
        <Image source={require('../assets/pic3.webp')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#C3C7CA',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default NavBar;
