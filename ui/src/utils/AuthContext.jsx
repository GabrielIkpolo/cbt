import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext({
    token: null,
    user: null,
    setToken: () => { },
    setUser: () => { },

    handleLogin: () => { },
    handleLogout: () => { },

    // Add more global variables 
    selectedExam: null,
    setSelectedExam: (examId) => { }

});

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userData")) || null);

    const [selectedExam, setSelectedExam] = useState(
        sessionStorage.getItem("selectedExam") ? JSON.parse(sessionStorage.getItem("selectedExam")) : null
    );


    const handleLogin = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        setSelectedExam(null); // added this
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setSelectedExam(null);
        sessionStorage.removeItem("selectedExam");
        sessionStorage.removeItem("timeRemaining");
    }

    useEffect(() => {
        sessionStorage.setItem("selectedExam", JSON.stringify(selectedExam));
    }, [selectedExam]);

    const value = { token, user, handleLogin, handleLogout, selectedExam, setSelectedExam }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
