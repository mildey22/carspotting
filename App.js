import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import AddCar from "./screens/AddCar";
import CarList from "./screens/CarList";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

// Tried changing App.js into typescript but was met with an error on <Tab.Navigator> that I couldn't resolve

export default function App() {
  return (
    <>
    <StatusBar style="light" />
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "New car") {
              iconName = focused ? "add" : "add";
            } else if (route.name === "Spotted") {
              iconName = focused ? "car-sport" : "car-sport-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#3b82f7", // Active tab icon and label color
          tabBarInactiveTintColor: "#979797", // Inactive tab icon and label color
          tabBarStyle: {
            backgroundColor: "#212124", // Background color of the tab bar
            borderTopWidth: 0,
          },
          headerStyle: {
            backgroundColor: "#212124", // Header background color
          },
          headerTintColor: "#FFFFFF", // Header text color
        })}
      >
        <Tab.Screen name="New car" component={AddCar} />
        <Tab.Screen name="Spotted" component={CarList} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
    </>
  );
}
