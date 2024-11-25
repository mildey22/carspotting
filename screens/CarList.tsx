import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "../styles/CarListStyles";
import buttonStyles from "../styles/ButtonStyles";
import { app } from "../firebaseConfig";
import { ICar } from "../types/api";

import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [visibleImages, setVisibleImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [loading, setLoading] = useState(true);
  const database = getDatabase(app);

  useEffect(() => {
    const carsRef = ref(database, "cars/");
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, ICar>;
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

  const deleteCar = (key, imageUrl) => {
    Alert.alert("Confirm remove", "Are you sure you want to remove this car?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            // Delete the car from the database
            const carRef = ref(database, `cars/${key}`);
            await remove(carRef); // Ensure the reference is correct
  
            // If an image exists, delete it from Firebase Storage
            if (imageUrl) {
              // Extract the image path from the URL
              const imagePath = imageUrl.split("?")[0];
  
              // Create a reference to the image in Firebase Storage
              const imageRef = storageRef(getStorage(), imagePath);
  
              // Delete the image from Firebase Storage
              await deleteObject(imageRef);
            }
  
            // Remove the car from the local state
            setCars((prevCars) => prevCars.filter((car) => car.key !== key));
          } catch (error) {
            Alert.alert("Error", `Error removing car or image: ${error.message}`);
          }
        },
      },
    ]);
  };

  // Open the image URL in the browser
  const handleImagePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL", err)
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.bigThrobber}
        />
      ) : cars.length === 0 ? (
        <Text style={styles.loadingText}>
          No cars found! Time to go spotting? 👀
        </Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text>
                <Text style={styles.carText}>
                  {item.make} {item.model}{" "}
                </Text>
                <Text style={styles.text}>
                  {item.generation ? `(${item.generation})` : ""}
                </Text>
              </Text>
              <Text style={styles.text}>Color: {item.color}</Text>

              {item.image && (
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => toggleImageVisibility(item.key)}
                >
                  <Ionicons
                    name={visibleImages[item.key] ? "close" : "image-outline"}
                    size={20}
                    color="#fff"
                  />
                  <Text style={buttonStyles.buttonText}>
                    {visibleImages[item.key] ? "Hide photo" : "View photo"}
                  </Text>
                </TouchableOpacity>
              )}

              {visibleImages[item.key] && item.image && (
                <View>
                  {loadingImages[item.key] && (
                    <ActivityIndicator
                      size="small"
                      color="#0000ff"
                      style={styles.loadingThrobber}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => handleImagePress(item.image)}
                  >
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
                  </TouchableOpacity>
                  <Text style={styles.imageText}>
                    Tap to the image to view full size.
                  </Text>
                </View>
              )}

              {/* Button to view location */}
              {item.location?.latitude && item.location?.longitude && (
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => toggleMap(index)}
                >
                  <Ionicons
                    name={
                      expandedIndex === index ? "close" : "location-outline"
                    }
                    size={20}
                    color="#fff"
                  />
                  <Text style={buttonStyles.buttonText}>
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
                style={buttonStyles.deleteButton}
                onPress={() => deleteCar(item.key, item.image)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={buttonStyles.buttonText}>Remove car</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
