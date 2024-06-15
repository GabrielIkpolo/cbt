import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LockPng from "../assets/img/lock.png";
import "./login.css";
import axiosInstance from "../utils/AxiosInstance.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin } = useContext(AuthContext); // I added this

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/api/login", formData);

      if (data.error) {
        console.error(data.error);
        setError(data.error);
        toast.error(data.error);
        return; // Stop execution if there's an error
      }

      // Destructure the user token and user detail from data 
      const { token, user } = data;

      // Ommit password from User Object before storing in local Storage
      delete user.password;

      handleLogin(token, user);

      toast.success("Login Successful");

      // redirect to the exam page
      navigate("/select-exam");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="lock">
          <img src={LockPng} alt="log" width="60" height="60"/>
        </div>
        <div className="login-inputs">
          {error && <p className="errorMessage">{error}</p>}
          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="inputes">
              <input
                type="email"
                name="email"
                placeholder="Student Id"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="inputes">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-btn-wrapper">
              <div style={{paddingLeft: 20,flex: 1,fontSize:14}}>
                <a href="#"><span style={{color: "#1E1EE8"}}>Forgot my password?</span></a>
              </div>
              <button class="login-button" role="button">Sign In</button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default Login;
