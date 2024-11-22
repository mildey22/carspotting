import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator, // Add this import
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/CarListStyles";
import { app } from "../firebaseConfig";
import { getDatabase, ref, onValue, remove } from "firebase/database";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [visibleImages, setVisibleImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [loading, setLoading] = useState(true); // Loading state for cars
  const database = getDatabase(app);

  useEffect(() => {
    const carsRef = ref(database, "cars/");
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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

  const toggleImageVisibility = (key) => {
    setVisibleImages((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const deleteCar = (key) => {
    Alert.alert(
      "Confirm remove",
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
                console.error("Error removing car:", error);
              });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        // Use ActivityIndicator for a loading spinner
        <ActivityIndicator size="large" color="#0000ff" />
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

              {/* Button to view the car image */}
              {item.image && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleImageVisibility(item.key)}
                >
                  <Text style={styles.toggleButtonText}>
                    {visibleImages[item.key] ? "Hide photo" : "View photo"}
                  </Text>
                </TouchableOpacity>
              )}

              {visibleImages[item.key] && item.image && (
                <View>
                  {loadingImages[item.key] && (
                    // Use ActivityIndicator while loading image
                    <ActivityIndicator size="small" color="#0000ff" />
                  )}
                  <Image
                    source={{ uri: item.image }}
                    style={styles.carImage}
                    resizeMode="contain"
                    onLoadStart={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [item.key]: true,
                      }))
                    }
                    onLoadEnd={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [item.key]: false,
                      }))
                    }
                  />
                </View>
              )}

              {/* Button to view location */}
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
                <Text style={styles.toggleButtonText}>Remove car</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
