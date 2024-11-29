import React, { useState, useEffect } from "react";
import { ScrollView, Text, Switch, View } from "react-native";
import i18n from "../i18n";
import { Picker } from "@react-native-picker/picker";
import { useTheme, ThemeProvider } from "../context/ThemeContext";
import { lightTheme } from "../themes/lightTheme";

export default function Settings() {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const { theme, toggleTheme } = useTheme();

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const handleThemeToggle = (value) => {
    toggleTheme(value ? "light" : "dark");
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <ThemeProvider>
    <ScrollView
      contentContainerStyle={theme.settingsContainer}
      style={{ backgroundColor: theme.backgroundColor }}
    >
       <Text style={theme.settingsTitle}>
        {i18n.t("language")}
      </Text>
      <View style={theme.settingsCard}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
        style={theme.picker}
        itemStyle={{ color: theme.pickerColor }}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Suomi" value="fi" />
        <Picker.Item label="Svenska" value="se" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="Magyar" value="hu" />
      </Picker>
      </View>
      <Text style={theme.settingsTitle}>
        {i18n.t("appearance")}
      </Text>
      <View style={theme.settingsCard}>
      <Switch
        value={theme === lightTheme}
        onValueChange={handleThemeToggle} 
        thumbColor={theme.thumbColor} 
        ios_backgroundColor={theme.trackColor} 
      />
      </View>
    </ScrollView>
    </ThemeProvider>
  );
}
