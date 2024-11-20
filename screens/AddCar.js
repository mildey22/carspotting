import {
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
    FlatList,
    Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import { Alert } from "react-native";
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

  const handleSave = () => {
    if (car.color) {
      push(ref(database, "cars/"), car)
        .then(() => {
          Alert.alert("Success", "Car successfully saved.");
          Keyboard.dismiss();
          setCar({
            make: "",
            model: "",
            color: "",
            location: {
              latitude: null,
              longitude: null,
            },
          });
        })
        .catch((error) => {
          Alert.alert("Error", `Error while saving new car: ${error.message}`);
        });
    } else {
      Alert.alert("Error", "Please input at least the color of the car.");
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
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
});
