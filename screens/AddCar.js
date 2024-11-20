import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

import { app } from "../firebaseConfig";
import { getDatabase, ref, push, onValue } from "firebase/database";

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
  });

  const [showMap, setShowMap] = useState(false);
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
            generation: "",
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text 
          style={styles.text}
        >What did you spot 👀</Text>
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
