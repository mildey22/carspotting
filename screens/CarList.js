import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { app } from "../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

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
            {item.photo && (
              <Image
                source={{ uri: item.photo }}
                style={styles.carImage}
              />
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listcontainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  carImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
});
