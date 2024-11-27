import React, { useState, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "../i18n";

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
    <ScrollView>
      <Text>{i18n.t("language")}</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Suomi" value="fi" />
      </Picker>
    </ScrollView>
  );
}
