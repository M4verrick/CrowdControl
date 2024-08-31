import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { UserContext } from './usercontext'; // Import UserContext to get the username

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

export default function MapScreen({ navigation }) {
  const { user } = useContext(UserContext); // Get the username from context
  const [sector, setSector] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

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
            {/* Render SMU School of Economics Polygon */}
            <Polygon
              coordinates={SMUSectors.economics}
              fillColor="rgba(0, 200, 0, 0.5)" // semi-transparent green
              strokeColor="green"
              strokeWidth={2}
            />
            
            {/* Render SMU School of Business Polygon */}
            <Polygon
              coordinates={SMUSectors.business}
              fillColor="rgba(0, 0, 200, 0.5)" // semi-transparent blue
              strokeColor="blue"
              strokeWidth={2}
            />

            {/* Render SMU PSR Polygon */}
            <Polygon
              coordinates={SMUSectors.psr}
              fillColor="rgba(200, 0, 200, 0.5)" // semi-transparent purple
              strokeColor="purple"
              strokeWidth={2}
            />
            
            {/* User Location Marker */}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  sectorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
