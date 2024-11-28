import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

import AddCar from "./screens/AddCar";
import CarList from "./screens/CarList";
import Settings from "./screens/Settings";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const Tab = createBottomTabNavigator();

// Tried changing App.js into typescript but was met with an error on <Tab.Navigator> that I couldn't resolve

function AppContent() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const newCarLabel = t("newCar");
  const spottedLabel = t("spotted");
  const settingsLabel = t("settings");

  return (
    <>
      <StatusBar style={theme.StatusBarStyle} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === newCarLabel) {
                iconName = focused ? "add" : "add";
              } else if (route.name === spottedLabel) {
                iconName = focused ? "car-sport" : "car-sport-outline";
              } else if (route.name === settingsLabel) {
                iconName = focused ? "settings" : "settings-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.tabBarActiveTintColor,
            tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
            tabBarStyle: {
              backgroundColor: theme.tabBarBackgroundColor, 
              borderTopWidth: 0,
            },
            headerStyle: {
              backgroundColor: theme.headerBackgroundColor,
            },
            headerTintColor: theme.headerTextColor, 
          })}
        >
          <Tab.Screen name={newCarLabel} component={AddCar} />
          <Tab.Screen name={spottedLabel} component={CarList} />
          <Tab.Screen name={settingsLabel} component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}