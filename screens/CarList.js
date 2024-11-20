import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { app } from "../firebaseConfig";
import { getDatabase, ref, onValue, remove } from "firebase/database";

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
        // Convert entries to an array of objects with keys
        const carsArray = Object.entries(data).map(([key, value]) => ({
          key,
          ...value,
        }));
        setCars(carsArray);
      } else {
        setCars([]);
      }
      setLoading(false);
    });
  }, [database]);

  const toggleMap = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const deleteCar = (key) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this car?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const carRef = ref(database, `cars/${key}`);
            remove(carRef)
              .then(() => {
                setCars((prevCars) => prevCars.filter((car) => car.key !== key));
              })
              .catch((error) => {
                console.error("Error deleting car:", error);
              });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading cars...</Text>
      ) : cars.length === 0 ? (
        <Text style={styles.loadingText}>No cars found! Time to go spotting? 👀</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.text}>
                {item.make} {item.model}
                {" ("}
                {item.generation}
                {")"}
              </Text>
              <Text style={styles.text}>Color: {item.color}</Text>
              <TouchableOpacity
                style={styles.toggleButton}
              >
                <Text style={styles.toggleButtonText}>View image</Text>
              </TouchableOpacity>
              {/* Check if latitude and longitude exist before showing the button */}
              {item.location?.latitude && item.location?.longitude && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleMap(index)}
                >
                  <Text style={styles.toggleButtonText}>
                    {expandedIndex === index
                      ? "Hide location"
                      : "Show location"}
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
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCar(item.key)}
              >
                <Text style={styles.toggleButtonText}>Delete car</Text>
              </TouchableOpacity>
            </View>
          )}
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
  deleteButton: {
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#DC3545",
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
