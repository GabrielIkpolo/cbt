import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext({
    token: null,
    user: null,
    setToken: () => { },
    setUser: () => { }
});

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userData")) || null);


    const handleLogin = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
    }

    const value = { token, user, handleLogin, handleLogout }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// export default {AuthContext, AuthProvider}