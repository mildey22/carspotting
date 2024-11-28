import React, { createContext, useState, useContext } from "react";
import { lightTheme } from "../themes/lightTheme";
import { darkTheme } from "../themes/darkTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = (themeValue) => {
    setTheme(themeValue);
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
