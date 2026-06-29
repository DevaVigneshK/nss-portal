import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Set base URL for backend API requests
axios.defaults.baseURL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("nss_token") || null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Set axios auth token header automatically
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }

    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("/auth/profile");
                setUser({ ...res.data, id: res.data._id || res.data.id });
            } catch (err) {
                console.error("Token verification failed, logging out...", err);
                logout();
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, [token]);

    const login = async (email, password) => {
        setErrorMessage("");
        try {
            const res = await axios.post("/auth/login", { email, password });
            const { token, user: loggedUser } = res.data;
            localStorage.setItem("nss_token", token);
            setToken(token);
            setUser(loggedUser);
            return loggedUser;
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Please check credentials.";
            setErrorMessage(msg);
            throw new Error(msg);
        }
    };

    const register = async (signUpData) => {
        setErrorMessage("");
        try {
            await axios.post("/auth/register", signUpData);
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Try again.";
            setErrorMessage(msg);
            throw new Error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem("nss_token");
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const res = await axios.put("/auth/profile", profileData);
            setUser(res.data.user);
            return res.data.user;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update profile";
            throw new Error(msg);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                errorMessage,
                login,
                register,
                logout,
                updateProfile,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
