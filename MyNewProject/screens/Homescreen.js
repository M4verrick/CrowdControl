import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Horizontal Scroll View for Events */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <Image source={require('../assets/cover1.png')} style={styles.eventImage} />
        <Image source={require('../assets/cover2.png')} style={styles.eventImage} />
        <Image source={require('../assets/cover3.png')} style={styles.eventImage} />
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Other Tab')}>
          {/* Placeholder for other tabs */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tickets')}>
          <Image source={require('../assets/Vector.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Other Tab')}>
          {/* Placeholder for other tabs */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    marginTop: 50,
    marginBottom: 20,
  },
  eventImage: {
    marginHorizontal: 10,
    width: 300,
    height: 200,
  },
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
});

export default HomeScreen;
