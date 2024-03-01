import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axiosInstance from "../utils/authenticationContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

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
      const {data} = await axiosInstance.post("/api/login", formData);

      if(data.error){
      console.error(data.error);
      setError(data.error);
      toast.error(data.error);
      return; // Stop execution if there's an error
      }

      // Assuming the server returns a token upon sucessfull login
      const token = data?.token;

      // Store the token in local storage
      localStorage.setItem("token", token);

      toast.success("Login Successful");

      // redirect to the exam page
      navigate("/exam");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <>
      <div className="login">
        <h2>Login</h2>
        {error && <p className="errorMessage">{error}</p>}
        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="inputes">
            <input
              
              type="email"
              name="email"
              placeholder=" Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputes">
            <input
              type="password"
              
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="submitBtn" type="submit">Login</button>
        </form>
        
      </div>
    </>
  );
};

export default Login;
