import React, { useEffect, useState, useContext } from "react";
import "./headerNav.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { AuthContext } from "../utils/AuthContext.jsx";

const HeaderNav = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user } = useContext(AuthContext);
  const { handleLogout } = useContext(AuthContext);

  const logOut = () => {
    handleLogout();
    navigate("/");
  }

  const redirectToHome = () => {
    navigate("/");
  }


  // Function to toggle the menu's state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* <div className="headers">
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
      </div> */}

      <header className="headers">
        <img className="logo" src={logo} alt="logo" />

        {/* Hamburger Icon for mobile */}
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* This is the hamburger icon character */}
        </button>

        {/* Add a class to the nav based on the menu state */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="navListParent">
            <li className="listItems"><NavLink to="/" className="navLink" onClick={toggleMenu}>Home</NavLink></li>
            <li className="listItems"><NavLink to="register" className="navLink" onClick={toggleMenu}>Register</NavLink></li>
            <li className="listItems"><NavLink to="feedback" className="navLink" onClick={toggleMenu}>Feedback</NavLink></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {token ? <button className="logoutBtn" onClick={logOut}>Logout</button> :
            <button className="loginButton" onClick={redirectToHome}> Login</button>}
        </div>
      </header>
    </>
  );
};

export default HeaderNav;
