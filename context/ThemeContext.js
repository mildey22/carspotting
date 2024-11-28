import React, { createContext, useState, useContext } from "react";
import { lightTheme } from "../themes/light/app"; // Assuming these are defined as objects with specific colors
import { darkTheme } from "../themes/dark/app";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // Set initial theme as string ("dark" or "light")

  const toggleTheme = (themeValue) => {
    setTheme(themeValue); // Just set the theme to light or dark string
  };

  // Return theme object based on current theme
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
