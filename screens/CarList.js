import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { app } from "../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which map is toggled
  const database = getDatabase(app);
  const [loading, setLoading] = useState(true);

  // Fetch cars from Firebase Realtime Database
  useEffect(() => {
    const carsRef = ref(database, "cars/");
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCars(Object.values(data));
      } else {
        setCars([]);
      }
      setLoading(false);
    });
  }, []);

  const toggleMap = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <View style={styles.container}>
       {loading ? (
        <Text style={styles.loadingText}>Loading cars...</Text>
      ) : (
      <FlatList
        data={cars}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              {item.make}
            </Text>
            <Text style={styles.text}>
              {item.model}{" ("}{item.generation}{")"}
            </Text>
            <Text style={styles.text}>
              {item.color}
            </Text>
            {/* Check if latitude and longitude exist before showing the button */}
            {item.location?.latitude && item.location?.longitude && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleMap(index)}
              >
                <Text style={styles.toggleButtonText}>
                  {expandedIndex === index ? "Hide location" : "Show location"}
                </Text>
              </TouchableOpacity>
            )}
            {expandedIndex === index && item.location && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                  }}
                  title={`${item.make} ${item.model}`}
                />
              </MapView>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  toggleButton: {
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});
