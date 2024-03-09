import React from 'react'
import "./protectedRoute.css";
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Check if user is loggedIn

    if (!token) {
        // redirect to login page
        return navigate("/login");
    }

    // if logged in, render the children component
    return children;
}

export default ProtectedRoute