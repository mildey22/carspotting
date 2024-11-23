import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "../styles/AddCarStyles";
import { app } from "../firebaseConfig";

import { getDatabase, ref, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
  const [isUploading, setIsUploading] = useState(false); // State to track upload progress
  const [isDeleting, setIsDeleting] = useState(false); // State to track deletion progress
  const database = getDatabase(app);

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
      Alert.alert("Error", `Error uploading photo: ${error.message}`);
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
      Alert.alert("Error", `Error uploading photo: ${error.message}`);
    }
  };

  // Function to delete the image from Firebase Storage with confirmation
  const deleteImage = async () => {
    Alert.alert(
      "Confirm remove",
      "Are you sure you want to remove this photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
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
              Alert.alert("Error", `Error removing photo: ${error.message}`);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Save car details to the database
  const handleSave = async () => {
    if (!car.color) {
      Alert.alert("Error", "Please fill in at least the color.");
      return;
    }

    try {
      await push(ref(database, "cars/"), car);
      Alert.alert("Success", "Car Saved!");
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
      Alert.alert("Error", `Error saving car: ${error.message}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headline}>What did you spot today? 👀</Text>
        <TextInput
          value={car.make}
          onChangeText={(text) => setCar({ ...car, make: text })}
          placeholder="Enter make"
          style={styles.input}
        />
        <TextInput
          value={car.model}
          onChangeText={(text) => setCar({ ...car, model: text })}
          placeholder="Enter model"
          style={styles.input}
        />
        <TextInput
          value={car.generation}
          onChangeText={(text) => setCar({ ...car, generation: text })}
          placeholder="Enter generation"
          style={styles.input}
        />
        <TextInput
          value={car.color}
          onChangeText={(text) => setCar({ ...car, color: text })}
          placeholder="Enter color"
          style={styles.input}
        />

        {/* Show the "Choose photo" button only if there's no image uploaded */}
        {!uploadedImageUrl && !isUploading && (
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.iconButtonText}>Choose photo</Text>
          </TouchableOpacity>
        )}

        {uploadedImageUrl && !isUploading && !isDeleting && (
          <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.iconButtonText}>Remove photo</Text>
          </TouchableOpacity>
        )}

        {/* Show ActivityIndicator while uploading*/}
        {isUploading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingThrobber}
          />
        )}

        {/* Display the image only after it finishes uploading */}
        {uploadedImageUrl && !isUploading && (
          <Image
            source={{ uri: uploadedImageUrl }}
            style={{ width: 100, height: 100, marginTop: 10, marginBottom: 10 }}
          />
        )}

        {isDeleting && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingThrobber}
          />
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowMap(!showMap)}
        >
          <Ionicons
            name={showMap ? "close" : "location-outline"}
            size={20}
            color="#fff"
          />
          <Text style={styles.iconButtonText}>
            {showMap ? "Close map" : "Add location"}
          </Text>
        </TouchableOpacity>

        {showMap && (
          <MapView
            style={styles.map}
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
            styles.saveButton,
            (isUploading || isDeleting) && styles.disabledButton,
          ]}
          // Disable the button if uploading or deleting
          disabled={isUploading || isDeleting}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save car</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
