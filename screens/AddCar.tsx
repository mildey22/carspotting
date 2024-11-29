import { useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { app } from "../firebase/firebaseConfig";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

import { getDatabase, ref, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Plan was to seperate the different functions into their own files but couldn't unfortunately get this to work. Looks a bit messy right now but it is what it is.

export default function AddCar() {
  const [car, setCar] = useState({
    make: "",
    model: "",
    generation: "",
    color: "",
    location: {
      latitude: null,
      longitude: null,
    },
    image: null,
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const database = getDatabase(app);
  const scrollViewRef = useRef(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Upload image to Firebase
  const uploadImage = async (uri, name) => {
    try {
      setIsUploading(true);
      const fetchResponse = await fetch(uri);
      const theBlob = await fetchResponse.blob();
      const imageRef = storageRef(getStorage(), `images/${name}`);
      const uploadTask = uploadBytesResumable(imageRef, theBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            reject(error);
            setIsUploading(false);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
            setIsUploading(false);
          }
        );
      });
    } catch (error) {
      Alert.alert(
        t("error"),
        t("errorUploadingPhoto", { errorMessage: error.message })
      );
      setIsUploading(false);
      throw error;
    }
  };

  // Function to pick an image and upload it
  const pickImage = async () => {
    try {
      const imageResponse = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!imageResponse.canceled) {
        const { uri } = imageResponse.assets[0];
        const fileName = uri.split("/").pop();

        // Display selected image immediately
        setUploadedImageUrl(null);

        // Upload image to Firebase
        const downloadUrl = await uploadImage(uri, fileName);

        // Update the car state with the uploaded image URL
        setCar((prevCar) => ({
          ...prevCar,
          image: downloadUrl,
        }));
        setUploadedImageUrl(downloadUrl);
      }
    } catch (error) {
      Alert.alert(
        t("error"),
        t("errorUploadingPhoto", { errorMessage: error.message })
      );
    }
  };

  // Function to delete the image from Firebase Storage with confirmation
  const deleteImage = async () => {
    Alert.alert(t("confirmRemove"), t("areYouSureRemoveImage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("remove"),
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);

            // Extract the image path from the full URL
            const imagePath = car.image.split("?")[0]; // Split off the query part

            // Create a reference to the image in Firebase Storage
            const imageRef = storageRef(getStorage(), imagePath);

            // Delete the image from storage
            await deleteObject(imageRef);

            // Remove image URL from car object
            setCar((prevCar) => ({
              ...prevCar,
              image: null,
            }));
            setUploadedImageUrl(null); // Clear the image preview
          } catch (error) {
            Alert.alert(
              t("error"),
              t("errorRemovingPhoto", { errorMessage: error.message })
            );
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const handleAddLocation = () => {
    setShowMap(!showMap);
    if (!showMap && scrollViewRef.current) {
      // Tried to make page scroll to the bottom once the add location button is pressed to display map nicely but couldn't get this to work
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Save car details to the database
  const handleSave = async () => {
    if (!car.color) {
      Alert.alert(t("error"), t("colorRequired"));
      return;
    }

    try {
      await push(ref(database, "cars/"), car);
      Alert.alert(t("success"), t("carSaved"));
      Keyboard.dismiss();
      setCar({
        make: "",
        model: "",
        generation: "",
        color: "",
        location: {
          latitude: null,
          longitude: null,
        },
        image: null,
      });
      setUploadedImageUrl(null);
    } catch (error) {
      Alert.alert(
        t("error"),
        t("errorSavingCar", { errorMessage: error.message })
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemeProvider>
      <ScrollView
        contentContainerStyle={theme.addCarContainer}
        ref={scrollViewRef}
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <Text style={theme.title}>{t("whatDidYouSpot")}</Text>
        <TextInput
          value={car.make}
          onChangeText={(text) => setCar({ ...car, make: text })}
          placeholder={t("make")}
          placeholderTextColor="#98989e"
          style={theme.input}
        />
        <TextInput
          value={car.model}
          onChangeText={(text) => setCar({ ...car, model: text })}
          placeholder={t("model")}
          placeholderTextColor="#98989e"
          style={theme.input}
        />
        <TextInput
          value={car.generation}
          onChangeText={(text) => setCar({ ...car, generation: text })}
          placeholder={t("generation")}
          placeholderTextColor="#98989e"
          style={theme.input}
        />
        <TextInput
          value={car.color}
          onChangeText={(text) => setCar({ ...car, color: text })}
          placeholder={t("color")}
          placeholderTextColor="#98989e"
          style={theme.input}
        />
        <View style={theme.buttonRow}>
          {/* Add photo button only visible when no photo is uploaded and uploading */}
          {!uploadedImageUrl && (
            <TouchableOpacity
              style={theme.addCarButton}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Ionicons
                name={"images-outline"}
                size={20}
                color={isUploading ? "#818181" : "#007aff"}
              />
              <Text
                style={[
                  theme.buttonText,
                  isUploading && theme.disabledButtonText,
                ]}
              >
                {t("addPhoto")}
              </Text>
            </TouchableOpacity>
          )}

          {/* Show "Remove photo" button when a photo is uploaded, not uploading or deleting */}
          {uploadedImageUrl && (
            <TouchableOpacity
              style={theme.deleteImageButton}
              onPress={deleteImage}
              disabled={isDeleting}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={isDeleting ? "#818181" : "#ff3b30"}
              />
              <Text
                style={[
                  theme.deleteButtonText,
                  isDeleting && theme.disabledButtonText,
                ]}
              >
                {t("removePhoto")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={theme.addCarButton}
            onPress={handleAddLocation}
          >
            <Ionicons
              name={showMap ? "close" : "location-outline"}
              size={20}
              color="#3b82f7"
            />
            <Text style={theme.buttonText}>
              {showMap ? t("closeMap") : t("addLocation")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show ActivityIndicator while uploading*/}
        {isUploading && (
          <ActivityIndicator
            size="large"
            color={theme.activityIndicatorColor}
            style={theme.loadingThrobber}
          />
        )}

        {/* Display the image only after it finishes uploading */}
        {uploadedImageUrl && !isUploading && (
          <Image
            source={{ uri: uploadedImageUrl }}
            style={{ width: 100, height: 100, marginTop: 10, marginBottom: 10 }}
          />
        )}

        {/* Show ActivityIndicator while deleting*/}
        {isDeleting && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={theme.loadingThrobber}
          />
        )}

        {showMap && (
          <MapView
            style={theme.map}
            onPress={(e) =>
              setCar({
                ...car,
                location: {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                },
              })
            }
            initialRegion={{
              latitude: 60.1699,
              longitude: 24.9384,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {car.location.latitude && car.location.longitude && (
              <Marker
                coordinate={{
                  latitude: car.location.latitude,
                  longitude: car.location.longitude,
                }}
              />
            )}
          </MapView>
        )}

        <TouchableOpacity
          onPress={handleSave}
          style={[
            theme.saveButton,
            (isUploading || isDeleting || !car.color) &&
              theme.disabledButton,
          ]}
          // Disable the button if uploading or deleting
          disabled={isUploading || isDeleting || !car.color}
        >
          <Ionicons
            name="download-outline"
            size={20}
            color={
              isUploading || isDeleting || !car.color ? "#818181" : "#007aff"
            }
          />
          <Text
            style={[
              theme.saveButtonText,
              (isUploading || isDeleting || !car.color) &&
                theme.disabledButtonText,
            ]}
          >
            {t("saveCar")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </ThemeProvider>
    </TouchableWithoutFeedback>
  );
}
