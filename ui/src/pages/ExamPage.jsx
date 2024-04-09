import { useEffect } from "react";
import React, { useState } from 'react'
import "./examPage.css";
import axiosInstance from "../utils/AxiosInstance.jsx";
import defaultPic from "../assets/img/defaultPic.png";


const ExamPage = () => {
  const [examId, setExamId] = useState("65fecdd493a40342a646f770");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [timer, setTimer] = useState(0);

  // Function to end exam  
  const endExam = (examId) => {

  }

  useEffect(() => {
    // Fetch exam question from backend API
    const fetchExam = async () => {

      try {
        const { data } = await axiosInstance.get(`/api/exams/${examId}`);
        setQuestions(data)

      } catch (error) {
        console.error("Error fetching request", error);
      }

    }



  }, []);



  return (
    <>
      <div className="theExam">

        <div className='userDetails'>Welcome,
          {/* Welcome, {user.user.name} */}
          <img className='userPassport' src={defaultPic} alt="User passport" />
        </div>


        <div className="mainExam">
          Exam main
        </div>

        <div className="timeNotification">
          Timmer Notification
        </div>

      </div>
    </>)
}

export default ExamPage