import React from "react";
import "./headerNav.css";
import {NavLink} from "react-router-dom";
import logo from "../assets/img/logo.png";

const HeaderNav = () => {
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
        <button className="loginButton"> Login</button>
      </div>
    </>
  );
};

export default HeaderNav;
