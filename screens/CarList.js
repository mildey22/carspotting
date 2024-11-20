import { StatusBar } from "expo-status-bar";
import  { StyleSheet, Text, View, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { app } from "../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import AddCar from "./AddCar";

export default function CarList() {

    const [cars, setCars] = useState([]);
    const database = getDatabase(app);

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
    <View style={styles.listcontainer}>
      <StatusBar style={styles.container} />
      <FlatList
        data={cars}
        renderItem={({ item }) => (
            <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>
              {item.make}, {item.model}, {item.color}
            </Text>
            {item.location && item.location.latitude && item.location.longitude ? (
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
            ) : (
              <Text style={styles.text}>No location available</Text>
            )}
            </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    card: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 5,
      backgroundColor: "#f9f9f9",
    },
    text: {
      fontSize: 16,
      marginBottom: 5,
    },
    map: {
      width: "100%",
      height: 200,
    },
});