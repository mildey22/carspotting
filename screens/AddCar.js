import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";

import { app } from "../firebaseConfig";
import { getDatabase, ref, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
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
    image: null, // Added image field to the car object
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const database = getDatabase(app);

  // Upload image to Firebase
  const uploadImage = async (uri, name) => {
    try {
      const fetchResponse = await fetch(uri);
      const theBlob = await fetchResponse.blob();
      const imageRef = storageRef(getStorage(), `images/${name}`);
      const uploadTask = uploadBytesResumable(imageRef, theBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (error) {
      Alert.alert("Error", `Error uploading image: ${error.message}`);
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
        setUploadedImageUrl(uri);

        // Upload image to Firebase
        const downloadUrl = await uploadImage(uri, fileName);

        // Update the car state with the uploaded image URL
        setCar((prevCar) => ({
          ...prevCar,
          image: downloadUrl,
        }));

        Alert.alert("Success", "Image uploaded successfully and added to the car.");
      }
    } catch (error) {
      Alert.alert("Error", `Error uploading image: ${error.message}`);
    }
  };

  // Save car details to the database
  const handleSave = async () => {
    if (!car.make || !car.model || !car.generation || !car.color) {
      Alert.alert("Error", "Please fill out all car details.");
      return;
    }

    try {
      await push(ref(database, "cars/"), car);
      Alert.alert("Success", "Car details saved successfully.");
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
      Alert.alert("Error", `Error saving car details: ${error.message}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.text}>What did you spot 👀</Text>
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

        <Button title="Choose photo" onPress={pickImage} />

        {uploadedImageUrl && (
          <Image
            source={{ uri: uploadedImageUrl }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}

        <Button
          title={showMap ? "Hide Map" : "Add location"}
          onPress={() => setShowMap(!showMap)}
        />

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
              latitude: 37.78825,
              longitude: -122.4324,
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

        <Button title="Save car" onPress={handleSave} />
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
  },
});
