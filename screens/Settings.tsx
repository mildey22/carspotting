import React, { useState, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "../i18n";

import styles from "../styles/SettingsStyles";

export default function Settings() {


  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <ScrollView
    contentContainerStyle={styles.container}
        style={{ backgroundColor: "#000000" }}
    >
      <Text style={styles.title}>{i18n.t("language")}</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
        style={styles.picker}
        itemStyle={{ color: '#ffffff' }}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Suomi" value="fi" />
      </Picker>
    </ScrollView>
  );
}
