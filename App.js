import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import AddCar from './screens/AddCar';
import CarList from './screens/CarList';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Add Car') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Car list') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Add Car" component={AddCar}/>
        <Tab.Screen name="Car List" component={CarList}/>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
