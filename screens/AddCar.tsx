import { useState } from "react";
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

import styles from "../styles/AddCarStyles";
import buttonStyles from "../styles/ButtonStyles";
import { app } from "../firebase/firebaseConfig";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
        <Text style={styles.title}>What did you spot today? 👀</Text>
        <TextInput
          value={car.make}
          onChangeText={(text) => setCar({ ...car, make: text })}
          placeholder="Make"
          placeholderTextColor="#98989e"
          style={styles.input}
        />
        <TextInput
          value={car.model}
          onChangeText={(text) => setCar({ ...car, model: text })}
          placeholder="Model"
          placeholderTextColor="#98989e"
          style={styles.input}
        />
        <TextInput
          value={car.generation}
          onChangeText={(text) => setCar({ ...car, generation: text })}
          placeholder="Generation"
          placeholderTextColor="#98989e"
          style={styles.input}
        />
        <TextInput
          value={car.color}
          onChangeText={(text) => setCar({ ...car, color: text })}
          placeholder="Color (required)"
          placeholderTextColor="#98989e"
          style={styles.input}
        />
        <View style={buttonStyles.buttonRow}>
        {/* Add photo button only visible when no photo is uploaded and uploading */}
        {!uploadedImageUrl && (
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Ionicons name={"images-outline"} size={20} color={
              isUploading
                ? "#818181" 
                : "#007aff"
            }/>
              <Text
            style={[
              buttonStyles.buttonText,
              (isUploading) &&
                buttonStyles.disabledButtonText,
            ]}
          >Add photo</Text>
            </TouchableOpacity>
          )}

          {/* Show "Remove photo" button when a photo is uploaded, not uploading or deleting */}
          {uploadedImageUrl && (
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={deleteImage}
              disabled={isDeleting}
            >
              <Ionicons name="trash-outline" size={20} color={
              isDeleting
                ? "#818181" 
                : "#ff3b30"
            } />
              <Text style={[
              buttonStyles.deleteButtonText,
              (isDeleting) &&
                buttonStyles.disabledButtonText,
            ]}>Remove photo</Text>
            </TouchableOpacity>
          )}
        <TouchableOpacity
          style={buttonStyles.button}
          onPress={() => setShowMap(!showMap)}
        >
          <Ionicons
            name={showMap ? "close" : "location-outline"}
            size={20}
            color="#3b82f7"
          />
          <Text style={buttonStyles.buttonText}>
            {showMap ? "Close map" : "Add location"}
          </Text>
        </TouchableOpacity>
        </View>

        {/* Show ActivityIndicator while uploading*/}
        {isUploading && (
          <ActivityIndicator
            size="large"
            color="#007aff"
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

        {/* Show ActivityIndicator while deleting*/}
        {isDeleting && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingThrobber}
          />
        )}

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
            buttonStyles.saveButton,
            (isUploading || isDeleting || !car.color) &&
              buttonStyles.disabledButton,
          ]}
          // Disable the button if uploading or deleting
          disabled={isUploading || isDeleting || !car.color}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={
              isUploading || isDeleting || !car.color
                ? "#818181" 
                : "#007aff"
            }
          />
          <Text
            style={[
              buttonStyles.saveButtonText,
              (isUploading || isDeleting || !car.color) &&
                buttonStyles.disabledButtonText,
            ]}
          >
            Save car
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
