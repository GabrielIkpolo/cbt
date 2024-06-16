import { useEffect, useCallback } from "react";
import React, { useState } from 'react'
import "./examPage.css";
import axiosInstance from "../utils/AxiosInstance.jsx";
import newPic from "../assets/img/newPic.png";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { shuffle } from 'lodash/shuffle';
import { useDebouncedCallback } from 'use-debounce';



const ExamPage = () => {
  const navigate = useNavigate();
  const { user, selectedExam } = useContext(AuthContext);
  const [examDetail, setExamDetail] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch exam questions from backend API
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/exams/${selectedExam}`);
        setExamDetail(data);

        //Shuffle the question array
        // const shuffledQuestions = shuffle(data.questions);
        // setQuestions(shuffledQuestions);

        setQuestions(data.questions);
        setTimeRemaining(data.durationMinutes * 60); // Convert minutes to seconds
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions", error);
      }
    };

    fetchQuestions();
  }, [selectedExam]);

  // Start timer when component mounts
  useEffect(() => {
    if (isLoading) return; // Skip timer setup if still loading

    const storedTimeRemaining = sessionStorage.getItem("timeRemaining");
    if (storedTimeRemaining) {
      setTimeRemaining(parseInt(storedTimeRemaining));
    } else {
      setTimeRemaining(examDetail.durationMinutes * 60 || 0);
    }

    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer); // Stop the timer when time runs out
          endExamWithoutEvent(); // End the exam when time runs out
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

  // Update sessionStorage whenever timeRemaining changes
  useEffect(() => {
    if (!isLoading) {
      sessionStorage.setItem("timeRemaining", timeRemaining);
    }

  }, [timeRemaining, isLoading]);

  // Handle option change
  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
  };

  // Function handling option submission
  const handleAnswerSubmit = async () => {
    const questionId = questions[currentQuestionIndex].id;
    try {
      const response = await axiosInstance.post('/api/save-user-response', {
        userId: user.id,
        examId: selectedExam,
        questionId: questionId,
        selectedOption: selectedOption,
      });

      // toast.success('Answer saved successfully');

      const newScore = response.data.score;
      console.log('Current score:', newScore);

      // Update userResponses state
      setUserResponses({
        ...userResponses,
        [currentQuestionIndex]: selectedOption,
      });
    } catch (error) {
      console.error("Error saving answer", error);
      // toast.error("Failed to save answer");
    }
  };

  // Function to navigate to next question
  const goToNextQuestion = (e) => {
    if (currentQuestionIndex < questions.length - 1) {
      handleAnswerSubmit().then(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption(userResponses[currentQuestionIndex + 1] || "");
        e.target.disabled = false
      });
    }
  };

  // Function to navigate to previous question
  const goToPreviousQuestion = (e) => {
    if (currentQuestionIndex > 0) {
      handleAnswerSubmit().then(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        setSelectedOption(userResponses[currentQuestionIndex - 1] || "");
        e.target.disabled = false
      });
    }
  };

  // Function to end exam without event 
  const endExamWithoutEvent = async () => {
    try {
      const questionId = questions[currentQuestionIndex].id;
      if (selectedOption) {
        //Saves to the examInProgress model (including the last checked option) /api/save-user-response
        const response = await axiosInstance.post('/api/save-user-response', {
          userId: user.id,
          examId: selectedExam,
          questionId,
          selectedOption,
        });
      }

      // Submit the final exam result
      const { data } = await axiosInstance.post('/api/submit-final-exam-result', {
        userId: user.id,
        examId: selectedExam,
        userResponses: Object.values(userResponses), // Pass userResponses to backend
      });

      toast.success('Final result submitted successfully');

      // Redirect to exam result page
      setTimeRemaining(0);
      navigate("/exam-result");
    } catch (error) {
      console.error("Error submitting final result", error);
      toast.error("Failed to submit final result");
    }
  };


  const endExam = async (e) => {
    e.target.disabled = true;

    try {
      const questionId = questions[currentQuestionIndex].id;
      if (selectedOption) {
        //Saves to the examInProgress model (including the last checked option) /api/save-user-response
        const response = await axiosInstance.post('/api/save-user-response', {
          userId: user.id,
          examId: selectedExam,
          questionId,
          selectedOption,
        });
      }

      // Submit the final exam result
      const { data } = await axiosInstance.post('/api/submit-final-exam-result', {
        userId: user.id,
        examId: selectedExam,
        userResponses: Object.values(userResponses), // Pass userResponses to backend
      });

      toast.success('Final result submitted successfully');

      // Redirect to exam result page
      setTimeRemaining(0);
      navigate("/exam-result");

      e.target.disabled = false;
    } catch (error) {
      console.error("Error submitting final result", error);
      toast.error("Failed to submit final result");
      e.target.disabled = false;
    }
  };

  const debouncedEndExam = useDebouncedCallback(endExam, 500);


  const handleQuestionNavigation = (e, direction) => {
    e.target.disabled = true;
    if (direction === "next") {
      goToNextQuestion(e);
    } else if (direction === "previous") {
      goToPreviousQuestion(e);
    }
  };



  // Handle page refresh issue
   useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (timeRemaining > 0) {
        event.preventDefault();
        event.returnValue = "You have already taken your exam. Are you sure you want to leave?"; // Display a warning message
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, [timeRemaining]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        toast.error("Refreshing the page is not allowed during the exam.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  useEffect(() => {
    const handlePopstate = (e) => {
      if (true) {
        navigate("/exam-result");
        return;
      }
    };

    return () => {
      window.addEventListener('popstate', handlePopstate);
    }
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="theExam">
      <div className='userDetails'>
        <div className="totalQInfo">
          {currentQuestionIndex + 1} of {questions.length} Questions
        </div>
        Welcome, {user.name}
        <img className='userPassport' src={newPic} alt="User passport" />
      </div>

      <div className="mainExam">
        {examDetail.subject}
        <img className="examImage"
          src={questions[currentQuestionIndex]?.image ? `/api/images/${questions[currentQuestionIndex].image}` : newPic}
          alt="Exam image if any" />

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
          {/* <p>The Selected Option: {selectedOption}</p> */}
        </div>

        <div className="navigationButtons">
          {currentQuestionIndex > 0 && (
            <button className="prev" onClick={(e) => handleQuestionNavigation(e, "previous")}>Previous</button>
          )}
          {currentQuestionIndex < questions.length - 1 && (
            <button className="next" onClick={(e) => handleQuestionNavigation(e, "next")}>Next</button>
          )}
        </div>

        <div className="endExam">
          <button className="endExamBtn" onClick={(e) => endExam(e)}>End Exam</button>
        </div>
      </div>

      <div className={`timeNotification ${timeRemaining < 300 ? 'redTimer' : ""}`}>
        Time Remaining: {Math.floor(timeRemaining / 60)}:{('0' + (timeRemaining % 60)).slice(-2)}
      </div>
    </div>
  );
};

export default ExamPage;