import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    let locationSubscription;
    let notificationInterval;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Track location every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          const userPoint = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          if (sector && !isPointInPolygon(userPoint, SMUSectors[sector])) {
            if (!notificationInterval) {
              notificationInterval = setInterval(() => {
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Out of Sector Alert",
                    body: "You are out of your assigned sector! Please return.",
                  },
                  trigger: null,
                });
              }, 20000); // Notify every 20 seconds
            }
          } else {
            if (notificationInterval) {
              clearInterval(notificationInterval);
              notificationInterval = null;
            }
          }
        }
      );
    };

    if (sector) {
      startLocationTracking();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [sector]);

  return (
    <UserContext.Provider value={{ user, setUser, sector, setSector }}>
      {children}
    </UserContext.Provider>
  );
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

const SMUSectors = {
  economics: [
    { latitude: 1.2984863090170073, longitude: 103.84871824598132 },
    { latitude: 1.297992266646987, longitude: 103.84825258649785 },
    { latitude: 1.2973770887532439, longitude: 103.8489368208409 },
    { latitude: 1.2978402535906288, longitude: 103.84939060125592 },
  ],
  business: [
    { latitude: 1.2951417484837944, longitude: 103.84980223659323 },
    { latitude: 1.29591521865713, longitude: 103.85046741976751 },
    { latitude: 1.295395766389642, longitude: 103.85109548971747 },
    { latitude: 1.2946879411504093, longitude: 103.85047598435774 },
  ],
  psr: [
    { latitude: 1.3020516609734734, longitude: 103.85097766401982 },
    { latitude: 1.3017932632736566, longitude: 103.85127833644991 },
    { latitude: 1.3019135648853428, longitude: 103.85142698270073 },
    { latitude: 1.3021895509139776, longitude: 103.85112792060083 },
  ],
};
