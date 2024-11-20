import {
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";  // Import ImagePicker
import { app } from "../firebaseConfig";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage imports

export default function AddCar() {
  const [car, setCar] = useState({
    make: "",
    model: "",
    color: "",
    photo: null,
    location: {
      latitude: null,
      longitude: null,
    },
  });

  const [cars, setCars] = useState([]);

  const database = getDatabase(app);
  const storage = getStorage(app); // Firebase storage reference

  const handleSave = () => {
    if (car.make && car.photo) {
      const storageReference = storageRef(storage, `car_images/${car.photo.name}`);
      
      const imageUploadTask = uploadBytesResumable(storageReference, car.photo);

      imageUploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          Alert.alert("Error", `Error while uploading image: ${error.message}`);
        },
        () => {
          getDownloadURL(imageUploadTask.snapshot.ref).then((downloadURL) => {
            const carData = { ...car, photo: downloadURL };
            push(ref(database, "cars/"), carData)
              .then(() => {
                Alert.alert("Success", "Car successfully saved.");
                Keyboard.dismiss();
                setCar({
                  make: "",
                  model: "",
                  color: "",
                  photo: null,
                  location: {
                    latitude: null,
                    longitude: null,
                  },
                });
              })
              .catch((error) => {
                Alert.alert("Error", `Error while saving new car: ${error.message}`);
              });
          });
        }
      );
    } else {
      Alert.alert("Error", "Please input at least the make of the car and select an image.");
    }
  };

  useEffect(() => {
    const carsRef = ref(database, "cars/");
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCars(Object.values(data));
      } else {
        setCars([]);
      }
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCar({ ...car, photo: result.assets[0] }); // Save the picked image
    } else {
      Alert.alert("Image selection canceled.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          value={car.make}
          onChangeText={(text) => setCar({ ...car, make: text })}
          placeholder="Enter make"
        />
        <TextInput
          value={car.model}
          onChangeText={(text) => setCar({ ...car, model: text })}
          placeholder="Enter model"
        />
        <TextInput
          value={car.color}
          onChangeText={(text) => setCar({ ...car, color: text })}
          placeholder="Enter color"
        />
        <Button title="Pick an image" onPress={pickImage} />
        <Button title="Save" onPress={handleSave} />
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
  },
});
