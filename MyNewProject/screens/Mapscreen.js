import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { UserContext } from './usercontext';
import axios from 'axios';

// Define sectors
const SMUSectors = {
  economics: [
    { latitude: 1.2984863090170073, longitude: 103.84871824598132 }, // Point 1
    { latitude: 1.297992266646987, longitude: 103.84825258649785 }, // Point 2
    { latitude: 1.2973770887532439, longitude: 103.8489368208409 }, // Point 3
    { latitude: 1.2978402535906288, longitude: 103.84939060125592 }, // Point 4
  ],
  business: [
    { latitude: 1.2951417484837944, longitude: 103.84980223659323 }, // Point 1
    { latitude: 1.29591521865713, longitude: 103.85046741976751 },   // Point 2
    { latitude: 1.295395766389642, longitude: 103.85109548971747 },  // Point 3
    { latitude: 1.2946879411504093, longitude: 103.85047598435774 }, // Point 4
  ],
  psr: [
    { latitude: 1.3020516609734734, longitude: 103.85097766401982 }, // Point 1
    { latitude: 1.3017932632736566, longitude: 103.85127833644991 }, // Point 2
    { latitude: 1.3019135648853428, longitude: 103.85142698270073 }, // Point 3
    { latitude: 1.3021895509139776, longitude: 103.85112792060083 }, // Point 4
  ],
};

// Helper function to check if a point is inside a polygon
const isPointInPolygon = (point, polygon) => {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    const intersect = ((yi > point.longitude) !== (yj > point.longitude)) &&
                      (point.latitude < (xj - xi) * (point.longitude - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
};

export default function MapScreen({ navigation }) {
  const { user, sector, setSector } = useContext(UserContext); // Use UserContext to get user and sector data
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  const notificationIntervalRef = useRef(null);
  const [wellDoneNotificationSent, setWellDoneNotificationSent] = useState(false); // Flag to track if "well done" notification has been sent

  useEffect(() => {
    // Request notification permissions
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to send notifications not granted.');
      }
    };

    requestNotificationPermissions();

    const fetchSector = async () => {
      try {
        const response = await axios.post('http://192.168.1.126:8000/check-redemption-status', { username: user.username });
        if (response.data.sector) {
          setSector(response.data.sector); // Set the sector from the backend response
        } else {
          setSector(null);
        }
      } catch (error) {
        console.error('Error fetching sector:', error.message);
        setSector(null);
      }
    };

    fetchSector();
  }, [user.username, setSector]);

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Track location every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

          // Check if user is inside or outside their assigned sector
          if (sector) {
            if (isPointInPolygon(newLocation.coords, SMUSectors[sector])) {
              // If inside the sector and notification hasn't been sent
              if (!wellDoneNotificationSent) {
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Well done!",
                    body: "You are in your assigned sector.",
                    sound: true,
                    vibrate: true,
                  },
                  trigger: null,
                });
                setWellDoneNotificationSent(true); // Mark the notification as sent
              }
            } else {
              // If outside the sector
              if (!notificationIntervalRef.current) {
                notificationIntervalRef.current = setInterval(() => {
                  Notifications.scheduleNotificationAsync({
                    content: {
                      title: "You are out of your assigned sector!",
                      body: "Please return to your assigned sector immediately.",
                      sound: true,
                      vibrate: true,
                    },
                    trigger: null,
                  });
                }, 20000); // Every 20 seconds
              }
            }
          }
        }
      );
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove(); // Stop location tracking when the component unmounts
      }
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, [sector, wellDoneNotificationSent]);

  const goToLocation = (coords) => {
    mapRef.current.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);
  };

  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          {sector ? (
            <Text style={styles.sectorText}>Assigned Sector: {sector}</Text>
          ) : (
            <Text style={styles.sectorText}>No sector assigned</Text>
          )}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            provider={MapView.PROVIDER_GOOGLE}  // Use Google Maps
          >
            {/* Render the sectors */}
            <Polygon
              coordinates={SMUSectors.economics}
              fillColor="rgba(0, 200, 0, 0.5)" // semi-transparent green
              strokeColor="green"
              strokeWidth={2}
            />
            <Polygon
              coordinates={SMUSectors.business}
              fillColor="rgba(0, 0, 200, 0.5)" // semi-transparent blue
              strokeColor="blue"
              strokeWidth={2}
            />
            <Polygon
              coordinates={SMUSectors.psr}
              fillColor="rgba(200, 0, 200, 0.5)" // semi-transparent purple
              strokeColor="purple"
              strokeWidth={2}
            />
            <Marker
              coordinate={location}
              title={"You are here"}
            />
          </MapView>
          <View style={styles.buttonContainer}>
            <Button title="SOB" onPress={() => goToLocation(SMUSectors.business[0])} />
            <Button title="SOE" onPress={() => goToLocation(SMUSectors.economics[0])} />
            <Button title="PSR" onPress={() => goToLocation(SMUSectors.psr[0])} />
            <Button title="My Location" onPress={() => goToLocation(location)} />
          </View>
        </>
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