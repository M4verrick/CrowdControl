import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import NavBar from '../components/navbar';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Horizontal Scroll View for Events */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <Image source={require('../assets/cover1.png')} style={styles.eventImage} />
        <Image source={require('../assets/cover2.png')} style={styles.eventImage} />
        <Image source={require('../assets/cover3.png')} style={styles.eventImage} />
      </ScrollView>

     
      <NavBar navigation={navigation} />  
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
    width: 300,
    height: 200,
    marginHorizontal: 10,
  },
});

export default HomeScreen;
