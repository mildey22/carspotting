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
  TextInput,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

import { app } from "../firebase/firebaseConfig";
import { ICar } from "../types/api";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [visibleImages, setVisibleImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const database = getDatabase(app);
  const { t } = useTranslation();
  const { theme } = useTheme();

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

  // Search filter
  const filteredCars = cars.filter((car) =>
    `${car.make} ${car.model} ${car.color} ${car.generation}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search bar
  const clearSearchQuery = () => setSearchQuery("");

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
    Alert.alert(t("confirmRemove"), t("areYouSureRemoveCar"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("remove"),
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
            Alert.alert(
              t("error"),
              t("errorRemovingCarOrImage", { errorMessage: error.message })
            );
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
    <ThemeProvider>
    <View style={theme.carListContainer}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.activityIndicatorColor}
          style={theme.bigThrobber}
        />
      ) : (
        <>
          <View style={theme.searchContainer}>
            <TextInput
              style={theme.searchInput}
              placeholder={t("search")}
              placeholderTextColor="#98989e"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            {/* If search bar isn't empty, render the clear search bar button */}
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearchQuery}
                style={theme.clearButton}
              >
                <Ionicons name="close-circle" size={21} color="#98989e" />
              </TouchableOpacity>
            )}
          </View>
          {filteredCars.length === 0 ? (
            <Text style={theme.emptyListText}>{t("noCarsFound")}</Text>
          ) : (
            <FlatList
              data={filteredCars}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={theme.card}>
                  <Text>
                    <Text style={theme.carText}>
                      {item.make} {item.model}{" "}
                    </Text>
                    <Text style={theme.carListText}>
                      {item.generation ? `(${item.generation})` : ""}
                    </Text>
                  </Text>
                  <Text style={theme.carListText}>
                    {t("displayColor")}
                    {item.color}
                  </Text>
                  <View style={theme.buttonRow}>
                    {item.image && (
                      <TouchableOpacity
                        style={theme.carListButton}
                        onPress={() => toggleImageVisibility(item.key)}
                      >
                        <Ionicons
                          name={
                            visibleImages[item.key] ? "close" : "image-outline"
                          }
                          size={20}
                          color="#3b82f7"
                        />
                        <Text style={theme.buttonText}>
                          {visibleImages[item.key]
                            ? t("hidePhoto")
                            : t("viewPhoto")}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {item.location?.latitude && item.location?.longitude && (
                      <TouchableOpacity
                        style={theme.carListButton}
                        onPress={() => toggleMap(index)}
                      >
                        <Ionicons
                          name={
                            expandedIndex === index
                              ? "close"
                              : "location-outline"
                          }
                          size={20}
                          color="#3b82f7"
                        />
                        <Text style={theme.buttonText}>
                          {expandedIndex === index
                            ? t("hideLocation")
                            : t("viewLocation")}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={theme.deleteCarButton}
                      onPress={() => deleteCar(item.key, item.image)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff3b30"
                      />
                    </TouchableOpacity>
                  </View>
                  {visibleImages[item.key] && item.image && (
                    <View>
                      {loadingImages[item.key] && (
                        <ActivityIndicator
                          size="small"
                          color="#007aff"
                          style={theme.loadingThrobber}
                        />
                      )}
                      <TouchableOpacity
                        onPress={() => handleImagePress(item.image)}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={theme.carImage}
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
                      <Text style={theme.imageText}>{t("imageFullSize")}</Text>
                    </View>
                  )}
                  {expandedIndex === index && item.location && (
                    <MapView
                      style={theme.carListMap}
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
            />
          )}
        </>
      )}
    </View>
    </ThemeProvider>
  );
}
