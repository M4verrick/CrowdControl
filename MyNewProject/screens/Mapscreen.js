import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapScreen() {
  // Hardcoded location: A specific seat in Michigan Stadium ("The Big House")
  const [location] = useState({
    latitude: 42.2658, // Approximate center of the stadium
    longitude: -83.7486,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  // Specific seats and exits within Michigan Stadium (approximate coordinates)
  const seats = [
    { latitude: 42.2662, longitude: -83.749, title: "Seat A - Section 1" },
  ];

  // Nearest exits (approximate coordinates)
  const exits = [
    { latitude: 42.26645, longitude: -83.748237, title: "Exit A - Section 1" },
    { latitude: 42.265123, longitude: -83.749998, title: "Exit B - Section 3" },
    { latitude: 42.266016, longitude: -83.750546, title: "Exit C - Section 4" },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={false} // We will add a custom marker instead
        provider={MapView.PROVIDER_GOOGLE} // Use Google Maps
      >
        {/* Mark the specific seat in the stadium */}
        {seats.map((seat, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: seat.latitude, longitude: seat.longitude }}
            title={seat.title}
          >
            <Image
              source={require("../assets/location-icon.png")} // Your custom location icon
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Mark the exits */}
        {exits.map((exit, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: exit.latitude, longitude: exit.longitude }}
            title={exit.title}
          >
            <Image
              source={require("../assets/exit-icon.png")} // Your custom exit icon
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Optionally, draw lines from each seat to its nearest exit */}
        {seats.map((seat, index) => {
          const nearestExit = exits[0]; // Assuming nearest exit is Exit A for simplicity
          return (
            <Polyline
              key={index}
              coordinates={[
                { latitude: seat.latitude, longitude: seat.longitude },
                {
                  latitude: nearestExit.latitude,
                  longitude: nearestExit.longitude,
                },
              ]}
              strokeColor="#FF0000" // Red line
              strokeWidth={2}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
