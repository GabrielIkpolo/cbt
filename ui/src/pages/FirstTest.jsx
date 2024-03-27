import React from 'react'
import axiosInstance from '../utils/AxiosInstance.jsx';
import axios from "axios";
import "./firstTest.css";




const FirstTest = () => {

    const fetchData = async () => {
        try {
            // const res = await axios.get(`http://localhost:3000/api/students`);
            const res = await axiosInstance.get(`/api/students`);
            console.log(res.data);
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="firstTest">
            First Test
            <button onClick={fetchData}>Fetch Data</button>
        </div>
    )
}

export default FirstTest;
