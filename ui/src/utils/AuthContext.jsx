import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext({
    token: null,
    user: null,
    setToken: () => { },
    setUser: () => { },

    handleLogin: ()=>{},
    handleLogout: ()=>{},

    // Add more global variables 
    selectedExam: null,
    setSelectedExam: ()=>{}

});

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userData")) || null);

    const [selectedExam, setSelectedExam] = useState(null);


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
    }

    const value = { token, user, handleLogin, handleLogout, selectedExam, setSelectedExam }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// export default {AuthContext, AuthProvider}