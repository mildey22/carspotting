import { useState, useEffect } from "react";
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
import { getDatabase, ref, push, onValue } from "firebase/database";
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
    image: null,
    location: {
      latitude: null,
      longitude: null,
    },
  });

  const [showMap, setShowMap] = useState(false);
  const database = getDatabase(app);

  const uploadImage = async (uri, name, onProgress) => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();

    const imageRef = storageRef(getStorage(), `images/${name}`);

    const uploadTask = uploadBytesResumable(imageRef, theBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.storageRef);
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  };

  // Function to pick an image and save URI to state
  const pickImage = async () => {
    try {
      const imageResponse = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!imageResponse.canceled) {
        const { uri, fileName } = imageResponse.assets[0];
        setCar((prevCar) => ({
          ...prevCar,
          image: { uri, name: fileName },
        }));
      }
    } catch (error) {
      Alert.alert("Error uploading image: " + error.message);
    }
  };

  // Save car and upload image if needed
  const handleSave = async () => {
    if (car.image) {
      // Upload image first
      try {
        const { uri, name } = car.image;
        const uploadResponse = await uploadImage(uri, name);
        const carWithImage = {
          ...car,
          image: uploadResponse.downloadUrl, // Save image URL
        };

        // Save car data with image URL
        push(ref(database, "cars/"), carWithImage)
          .then(() => {
            Alert.alert("Success", "Car successfully saved.");
            Keyboard.dismiss();
            setCar({
              make: "",
              model: "",
              generation: "",
              color: "",
              image: null,
              location: {
                latitude: null,
                longitude: null,
              },
            });
          })
          .catch((error) => {
            Alert.alert("Error", `Error while saving new car: ${error.message}`);
          });
      } catch (error) {
        Alert.alert("Error", `Error uploading image: ${error.message}`);
      }
    } else {
      Alert.alert("Error", "Please input at least an image of the car.");
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

        {car.image && (
          <Image
            source={{ uri: car.image.uri }}
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
