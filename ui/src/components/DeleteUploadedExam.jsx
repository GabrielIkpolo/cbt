import React, { useEffect, useState } from 'react'
import "./deleteUploadedExam.css";
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';


const DeleteUploadedExam = () => {


    const [selectedValue, setSelectedvalue] = useState("");
    const [exams, setExams] = useState({});


    const fetchExams = async () => {
        try {

            const { data } = await axiosInstance.get('/api/exams');

            if (!data) {
                console.error("Exams could not be fetched");
            }
            setExams(data);
            console.log(exams)
        } catch (error) {
            console.log(error, "Could not fetch exams");
            toast.error(error);
        }
    }


    const handleExamSelection = (event) => {
        setSelectedvalue(event.target.value);
        const selectedExam = exams.find((exam) => exam.id === event.target.value);

    }

    useEffect(() => {
        fetchExams();
    }, []);



    return (
        <>
            <div className='deleteUploadedExam'>
                <h2>Delete Uploaded Exam</h2>
                <div className="examOptions">
                    <select defaultValue={selectedValue} placeholder="Select Exam"
                        onChange={handleExamSelection}
                    >
                        {
                            Object.entries(exams).map(([key, value]) => (
                                <option key={key}>
                                    {exams[key].subject}
                                </option>
                            ))
                        }

                    </select>
                </div>

            </div>
        </>

    )
}

export default DeleteUploadedExam