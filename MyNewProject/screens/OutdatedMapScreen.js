// screens/MapScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          provider={MapView.PROVIDER_GOOGLE} // Use Google Maps
        >
          <Marker coordinate={location} title={"You are here"} />
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
    </View>
  );
}

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