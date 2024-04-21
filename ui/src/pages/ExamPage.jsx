import { useEffect } from "react";
import React, { useState } from 'react'
import "./examPage.css";
import axiosInstance from "../utils/AxiosInstance.jsx";
import newPic from "../assets/img/newPic.png";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


const ExamPage = () => {

  const navigate = useNavigate();

  const { user, selectedExam } = useContext(AuthContext);
  const [examDetail, setExamDetail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    // Fetch exam question from backend API
    const fetchQuestions = async () => {

      try {
        const { data } = await axiosInstance.get(`/api/exams/${selectedExam}`);
        setExamDetail(data);
        setQuestions(data.questions);
        setTimeRemaining(data.durationMinutes * 60); // Converts minutes to seconds
      } catch (error) {
        console.error("Error fetching request", error);
      }
    }

    fetchQuestions();

  }, [selectedExam]);


  // Start timer when component mounts 
  useEffect(() => {

    const storedTimeRemaining = sessionStorage.getItem("timeRemaining");
    if (storedTimeRemaining) {
      setTimeRemaining(parseInt(storedTimeRemaining));
    } else {
      // Set timeRemaining to the initial duration (minutes * 60)
      setTimeRemaining(examDetail.durationMinutes * 60 || 0);
    }

    const timer = setInterval(() => {

      setTimeRemaining(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer); // Stop the timer when time runs out
          endExam(); // Ends the exam when the time runs to 0.
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    return () => {
      clearInterval(timer);
      sessionStorage.setItem("timeRemaining", timeRemaining.toString()); // Store timeRemaining in sessionStorage
    }; // Cleanup on unmount

  }, [examDetail.durationMinutes]);

  // examDetail.durationMinutes

  // Function handling option selection 
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setUserResponses({
      ...userResponses,
      [currentQuestionIndex]: event.target.value,
    });
  }

  // Function to navigate to next question 
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setSelectedOption("");
  }

  // Function to navigate to previous question 
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
    setSelectedOption("");
  }

  // Function to end exam  
  const endExam = () => {
    console.log("End Exam====>", "Exam Ended")
    setTimeRemaining(0);

    // Add a code to paste to the data base user account that the user has written Exam.{wrttenExam: 1}
    navigate("/exam-result");
  }

  // Update sessionStorage whenever timeRemaining changes
  useEffect(() => {
    sessionStorage.setItem("timeRemaining", timeRemaining);
  }, [timeRemaining]);

  // console.log("This is your Exam ID =>", selectedExam);
  // console.log("Your Questions =>", questions,"Hi", questions[currentQuestionIndex].text);

  // Page refresh issue 
  useEffect(() => {
    const handleBeforeUnload = (event) => {

      if (user.takenExam === 1) {
        console.log("Hi there");
        event.preventDefault();
        event.returnValue = "You have already taken your exam. Are you sure you want to leave?";
      }
    };

      const handlePopstate = () => {
        if (user.takenExam === 1) {
          navigate("/exam-result");
        }
      };

      // const handleKeyDown = (event) => {
      //   if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
      //     event.preventDefault(); // Prevent refresh
      //   }
      // };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopstate);
      // window.addEventListener('keydown', handleKeyDown);

     
  }, []);



  //=============================================================

  return (
    <>
      {/* {ifTakenExam()} { } */}

      <div className="theExam">


        <div className='userDetails'>
          <div className="totalQInfo">
            {currentQuestionIndex + 1} of {questions.length} Questions
          </div>
          Welcome, {user.name}
          <img className='userPassport' src={newPic} alt="User passport" />
        </div>

        {/* The main exam section */}
        <div className="mainExam">
          {examDetail.subject}
          <img className="examImage" src={newPic} alt="Exam image if any" />

          <div className="question">
            <p className="theQuestion">
              {currentQuestionIndex < questions.length &&
                questions[currentQuestionIndex].text}
            </p>
            <form>
              {currentQuestionIndex < questions.length &&
                questions[currentQuestionIndex].options.map((option, index) => (
                  <div className="firstR" key={index}>
                    <input
                      type="radio"
                      value={option}
                      checked={selectedOption === option}
                      onChange={handleOptionChange}
                    />
                    <span>{option}</span>
                  </div>
                ))}
            </form>
            <p>The Selected Option: {selectedOption}</p>
          </div>



          {/* Question Nabigation Button  */}
          <div className="navigationButtons">
            {currentQuestionIndex > 0 && (
              <button className="prev" onClick={goToPreviousQuestion}>Previous</button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button className="next" onClick={goToNextQuestion}>Next</button>
            )}
          </div>

          <div className="endExam">
            <button className="endExamBtn" onClick={endExam}>End Exam</button>
          </div>

        </div>


        {/* The Timer section  */}
        <div className={`timeNotification  ${timeRemaining < 300 ? 'redTimer' : ""}`}>
          Time Remaining: {Math.floor(timeRemaining / 60)}:{('0' + (timeRemaining % 60)).slice(-2)}
        </div>

      </div>


    </>)
}

export default ExamPage