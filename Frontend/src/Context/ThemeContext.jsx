import { createContext, useState, useEffect } from "react";

const THEME_STORAGE_KEY = "finique_theme_preference";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkModeState] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load theme preference from localStorage on mount
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme !== null) {
                setIsDarkModeState(JSON.parse(savedTheme));
            } else {
                // Default to system preference if no saved theme
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches;
                setIsDarkModeState(prefersDark);
            }
        } catch (error) {
            console.error("Failed to load theme preference:", error);
        }
        setIsLoaded(true);
    }, []);

    // Wrapper function to save theme to localStorage when it changes
    const setIsDarkMode = (value) => {
        try {
            const newTheme =
                typeof value === "function" ? value(isDarkMode) : value;
            setIsDarkModeState(newTheme);
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
        } catch (error) {
            console.error("Failed to save theme preference:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, isLoaded }}>
            {children}
        </ThemeContext.Provider>
    );
};
