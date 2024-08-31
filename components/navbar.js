import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NavBar = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/home.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tickets')}>
        <Image source={require('../assets/Vector.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Map')}>
        <Image source={require('../assets/map.png')} style={styles.icon} />
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
    backgroundColor: '#fff',
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
