import React, { useState, useEffect } from "react";
import { ScrollView, Text, Switch } from "react-native";
import i18n from "../i18n";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/SettingsStyles";
import { lightTheme } from "../themes/light/app";

export default function Settings() {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const { theme, toggleTheme } = useTheme();

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const handleThemeToggle = (value) => {
    toggleTheme(value ? "light" : "dark"); // Toggle between "light" and "dark"
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.backgroundColor }} // Dynamically change backgroundColor
    >
       <Text style={[styles.title, { color: theme.headerTextColor }]}>
        {i18n.t("language")}
      </Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
        style={[styles.picker, { color: theme.headerTextColor }]}
        itemStyle={{ color: theme.headerTextColor }}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Suomi" value="fi" />
        <Picker.Item label="Svenska" value="se" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="Magyar" value="hu" />
      </Picker>

      <Text style={[styles.title, { color: theme.headerTextColor }]}>
        {i18n.t("appearance")}
      </Text>
      <Switch
        value={theme === lightTheme} // Check if the current theme is light
        onValueChange={handleThemeToggle} // Toggle theme on value change
        thumbColor={theme === "light" ? "#fff" : "#000"} // Light/dark thumb color for the switch
        trackColor={{ false: "#767577", true: "#3b82f7" }} // Track color change
      />
    </ScrollView>
  );
}
