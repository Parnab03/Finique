import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // "admin" or "viewer"
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const authStatus = localStorage.getItem("finique_auth_status");
        if (authStatus) {
            try {
                const parsed = JSON.parse(authStatus);
                setIsAuthenticated(parsed.isAuthenticated || false);
                setIsGuest(parsed.isGuest || false);
                setCurrentUser(parsed.currentUser || null);
            } catch (err) {
                console.error("Failed to parse auth status:", err);
            }
        }
        setIsLoading(false);
    }, []);

    // Save auth status whenever it changes
    const saveAuthStatus = (authenticated, guest, user) => {
        const status = {
            isAuthenticated: authenticated,
            isGuest: guest,
            currentUser: user,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem("finique_auth_status", JSON.stringify(status));
    };

    const login = (username, role) => {
        setIsAuthenticated(true);
        setIsGuest(false);
        setCurrentUser(role?.toLowerCase()); // "admin" or "viewer"
        saveAuthStatus(true, false, role?.toLowerCase());
    };

    const loginAsGuest = (role) => {
        setIsAuthenticated(true);
        setIsGuest(true);
        setCurrentUser(role?.toLowerCase()); // "admin" or "viewer"
        saveAuthStatus(true, true, role?.toLowerCase());
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsGuest(false);
        setCurrentUser(null);
        localStorage.removeItem("finique_auth_status");
    };

    const signup = (adminUsername, adminPassword) => {
        // Save to auth storage
        const authData = {
            userName: adminUsername,
            userPassword: adminPassword,
            viewerName: "",
            viewerPassword: "",
            profileImage: "",
            viewerProfileImage: "",
            selectedPreset: "no-presets",
        };

        // First check if account already exists
        const existingSettings = localStorage.getItem("finique_settings_v1");
        if (
            existingSettings &&
            existingSettings !== '{"selectedPreset":"no-presets"}'
        ) {
            return { success: false, message: "Admin account already exists" };
        }

        localStorage.setItem("finique_settings_v1", JSON.stringify(authData));

        // Auto-login after signup
        setIsAuthenticated(true);
        setIsGuest(false);
        setCurrentUser("admin");
        saveAuthStatus(true, false, "admin");

        return { success: true };
    };

    const value = {
        isAuthenticated,
        isGuest,
        currentUser,
        isLoading,
        login,
        loginAsGuest,
        logout,
        signup,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
