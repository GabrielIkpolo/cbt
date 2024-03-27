import React, { useEffect, useState, useContext } from "react";
import "./headerNav.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { AuthContext } from "../utils/AuthContext.jsx";

const HeaderNav = () => {
  const navigate = useNavigate();

  const { token, user } = useContext(AuthContext);
  const { handleLogout } = useContext(AuthContext);

  const logOut = () => {
    handleLogout();
    navigate("/");
  }

  const redirectToHome = () => {
    navigate("/");
  }


  return (
    <>
      <div className="headers">
        <img className="logo" src={logo} alt="log" />
        <nav className="nav">
          <ul className="navListParent">
            <li className="listItems"><NavLink to="/" className="navLink">Home</NavLink></li>
            <li className="listItems"><NavLink to="register" className="navLink">Register</NavLink></li>
            <li className="listItems"><NavLink to="feedback" className="navLink">Feedback</NavLink></li>
          </ul>
        </nav>

        {token ? <button className="logoutBtn" onClick={logOut}>Logout</button> :
          <button className="loginButton" onClick={redirectToHome}> Login</button>}
      </div>
    </>
  );
};

export default HeaderNav;
