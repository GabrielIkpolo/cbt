import { useEffect } from "react";
import React, { useState } from 'react'
import "./examPage.css";
import axiosInstance from "../utils/AxiosInstance.jsx";


const ExamPage = () => {
  const [examId, setExamId] = useState("65fecdd493a40342a646f770");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [timer, setTimer] = useState(0);

// Function to start exam  
const StartExam = (examId)=>{
  setExamId(examId);
}  

  useEffect(() => {
    // Fetch exam question from backend API
    const fetchQuestions = async () => {

      try {
        const response = await axiosInstance.get(`/api/exams/${examId}`);
        setQuestions(response.data)

      } catch (error) {
        console.error("Error fetching request", error);
      }

    }

    fetchQuestions();

  }, [examId]);

  

  return (<>
    <div>
      <h1>Welcome to the Exam Page</h1>
      {console.log(questions)}

      <button onClick={()=> StartExam()}>Start Exam</button>
    </div>
  </>)
}

export default ExamPage