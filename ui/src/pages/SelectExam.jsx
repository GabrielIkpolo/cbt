import React, { useState, useEffect } from 'react';
import { AuthContext } from "../utils/AuthContext.jsx";
import { useContext } from 'react';
import "./selectExam.css";
import defaultPic from "../assets/img/defaultPic.png";
import axiosInstance from '../utils/AxiosInstance.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebouncedCallback} from 'use-debounce';

const SelectExam = () => {
    const navigate = useNavigate();

    const { user, setSelectedExam, setUser } = useContext(AuthContext); // Access selectedexam from AuthContext.
    const [exams, setExams] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [examInfo, setExamInfo] = useState({ totalQuestions: 0, durationMinutes: 0 });

    const handleExamSelection = (event) => {
        setSelectedValue(event.target.value);
        const selectedExam = exams.find((exam) => exam.id === event.target.value);

        if (selectedExam) {

            setExamInfo({ totalQuestions: selectedExam.questions.length, durationMinutes: selectedExam.durationMinutes });
        } else {
            setExamInfo({ totalQuestions: 0, durationMinutes: 0 });
        }
    }

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const { data } = await axiosInstance.get("/api/exams");

                if (!data) {
                    console.error("Exams could not be fetched");
                }
                setExams(data);
            } catch (error) {
                console.error("Error fetching exams", error);
            }
        }

        fetchExams();

    }, []);

    const startExam = async () => {
        if (selectedValue) {
            setSelectedExam(selectedValue); // updates selectedExam state
            // console.log("This is the selected Exam==>",selectedValue);

            //    Check if the loggedin user have tried to write the exam before 
            try {
                const { data } = await axiosInstance.get(`/api/the-users/${user.id}`);

                if (!data) {
                    console.log("presentUserExamStatus detail not found");
                }

                if (data?.takenExam === 1) {
                    navigate("/contact-server-admin");
                    return;
                }

            } catch (error) {
                console.error(error);
            }


            // Update the user for takenExam to be 1 so we can track them
            try {
                await axiosInstance.put(`/api/the-users/${user.id}`, { takenExam: 1 });
            } catch (error) {
                console.error(error);
            }

            // send a request to create examInprogressRecord
            try {
                const response = await axiosInstance.post("/api/exam-in-progress", {
                    userId: user.id,
                    examId: selectedValue,
                    currentQuestionIndex: 1, // if the initial question index is 0
                });
                console.log(response.data);
            } catch (error) {
                console.log("Error creating Exam in progress", error)
            }

            navigate("/exam");
        } else {
            toast.error("You have to select an exam");
        }
    }

    const debouncedStartExam = useDebouncedCallback(startExam, 1000); 

    // console.log(user.name, "The selected exam");
    return (<>
        <div className='selectExam'>
            <div className='userDetails'>
                Welcome, {user.name}
                <img className='userPassport' src={defaultPic} alt="User passport" />
            </div>

            <div className='examDescription'>
                <div className='examTitle'>{selectedValue ? exams.find(exam => exam.id === selectedValue)?.subject : "Exam Title"}</div>
                <div className='examInstruction'>
                    Answer all questions. Click on the check box the most that appropriately
                    answers the questions. And click on the next button to navigate to the next
                    question. On completion of the exam, click on the "End Exam" button.

                    <p>Note. Once you click on "start Exam" button, you are not allowed to  refresh the page or use the browser's
                        back and forward button. If you do, your scores will be submitted immediately, and you cannot
                        take the exam again untill you contact the Server Admin.
                    </p>
                </div>
            </div>

            <div className='examOptions'>
                <select className='customSelectOptions' defaultValue={selectedValue}
                    onChange={handleExamSelection}
                    placeholder="Select Exam"
                >
                    <option value="">Select Exam</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.subject}
                        </option>
                    ))}
                </select>

                {/* Exam detail notification  */}
                <div className="timeAndNumber">
                    <div>
                        To Take Questions: <span>{examInfo.totalQuestions}</span>
                    </div>
                    <div>
                        Duration in Minutes: <span>{examInfo.durationMinutes}</span>
                    </div>
                </div>

            </div>
        </div>

        <div className='startExam'>
            <button className='startBtn' onClick={debouncedStartExam}>Start Exam</button>
        </div>

    </>
    );
};

export default SelectExam;
