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

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  }

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


        {/* The main exam section */}
        <div className="mainExam">

          <img className="examImage" src={defaultPic} alt="Exam image if any" />


          {/* Questions and options starts here  */}
          <div className="question">
            <p>What is the capital of Delta State?</p>
            <form>
              <label>
                a)
                <input
                  type="radio"
                  value="Asaba"
                  checked={selectedOption === 'Asaba'}
                  onChange={handleOptionChange}
                />:
                Asaba
              </label>
              <br />

              <label>
                b)
                <input
                  type="radio"
                  value="Awka"
                  checked={selectedOption === 'Awka'}
                  onChange={handleOptionChange}
                />:
                Awka
              </label>
              <br />

              <label>
                c)
                <input
                  type="radio"
                  value="Uyo"
                  checked={selectedOption === 'Uyo'}
                  onChange={handleOptionChange}
                />:
                Uyo
              </label>
              <br />

              <label>
                d)
                <input
                  type="radio"
                  value="Enugu"
                  checked={selectedOption === 'Enugu'}
                  onChange={handleOptionChange}
                />:
                Enugu
              </label>
            </form>
            <p>Selected option: {selectedOption}</p>
          </div>

        </div>


        {/* The Timer section  */}
        <div className="timeNotification">
          Timmer Notification
        </div>

      </div>
    </>)
}

export default ExamPage