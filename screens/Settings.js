import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  Appearance,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Settings() {
  const systemTheme = useColorScheme(); // Detects system theme (light/dark)
  const [theme, setTheme] = useState("system"); // "light", "dark", or "system"
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    systemTheme === "dark"
  );

  // Update dark mode when theme changes
  useEffect(() => {
    if (theme === "system") {
      setDarkModeEnabled(systemTheme === "dark");
    } else {
      setDarkModeEnabled(theme === "dark");
    }
  }, [theme, systemTheme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkModeEnabled ? "#000" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: darkModeEnabled ? "#fff" : "#000" },
        ]}
      >
        Dark Mode
      </Text>

      <Picker
  selectedValue={theme}
  style={{
    height: 50,
    width: 200,
    color: darkModeEnabled ? "#fff" : "#000", // Text color
    backgroundColor: darkModeEnabled ? "#333" : "#fff", // Dropdown background color
  }}
  dropdownIconColor={darkModeEnabled ? "#fff" : "#000"} // Adjust dropdown arrow color
  itemStyle={{ color: darkModeEnabled ? "#fff" : "#000" }} // Picker item color
  onValueChange={(itemValue) => setTheme(itemValue)}
>
  <Picker.Item label="Follow System Setting" value="system" />
  <Picker.Item label="On" value="dark" />
  <Picker.Item label="Off" value="light" />
</Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});
