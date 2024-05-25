import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./examResult.css";
import axiosInstance from '../utils/AxiosInstance';
import { AuthContext } from '../utils/AuthContext.jsx';

const ExamResult = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [data, setData] = useState({});
  const [theExamSubject, setTheExamSubject] = useState("");

  const { user, selectedExam } = useContext(AuthContext);


  // console.log("The user info ==>", user);
  // console.log("The user info ==>", user.name, "took", selectedExam);

  const fetchExamResult = async () => {
    try {
      const { data } = await axiosInstance.post('/api/user-exam-result', {
        userId: user.id,
        selectedExam: selectedExam,
      }
      );
      console.log("THis is the user==>", data);

      setData(data);
      setScore(data.userExamResult.score);
    } catch (error) {
      console.error("Error fetching exam result", error);
    }
  };


  //fetchSelectedExam from the server by selectedExam id 
  const fetchSelectedExam = async () => {
    try {
      const {data} = await axiosInstance.get(`/api/exams/${selectedExam}`);
      if(data.subject){
        setTheExamSubject(data.subject);
      }
    } catch (error) {
      console.error("Error fetching selectedExam", error);
    }
  }

  useEffect(() => {
    fetchExamResult();
    fetchSelectedExam();
  }, []);

  return (
    <div className='examResult'>
      <h1>Exam result</h1>
      <p>{user.name}</p>
      <p>Exam: {theExamSubject}</p>
      <p>Your score: {score}%</p>
      <p>Your score: {score}</p>

      <div className="progress-bar-container">
        <div className={`progress-bar ${score < 50 ? 'red' : 'green'}`}
          style={{ width: `${score}%` }}>

          <span>{score}%</span>
        </div>
      </div>

      {/* <p>Status: {data.userExamResult.status}</p> */}
    </div>
  );
};

export default ExamResult;
