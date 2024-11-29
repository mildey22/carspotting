import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { app } from "../firebase/firebaseConfig";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={theme.carListContainer}>
        <Text style={theme.title}>{t("loginOrRegister")}</Text>
        <View style={theme.inputContainer}>
        <TextInput
          placeholder={t("email")}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.placeholderTextColor}
          style={theme.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        </View>
        <View style={theme.inputContainer}>
        <TextInput
          placeholder={t("password")}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.placeholderTextColor}
          style={theme.input}
          secureTextEntry
        />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
          <View style={theme.buttonRow}>
            <TouchableOpacity onPress={handleLogin} style={theme.addCarButton}>
              <Text style={theme.buttonText}>{t("loginButton")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister} style={theme.addCarButton}>
              <Text style={theme.buttonText}>{t("registerButton")}</Text>
            </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
