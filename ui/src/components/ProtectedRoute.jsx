import React, { useContext } from 'react'
import "./protectedRoute.css";
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext.jsx";

const ProtectedRoute = ({ role, children }) => {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);

    if (!token || !user) {
        return < Navigate to="/" replace />;
    }

    // console.log(user.user.role);

    if (!role.includes(user.user.role)) {
        return <p>Unauthorized: Insufficient permission</p>;
    }

    return children;
}

export default ProtectedRoute