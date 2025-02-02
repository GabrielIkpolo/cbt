import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';
import "./deleteUploadedExam.css";


const DeleteUploadedExam = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [exams, setExams] = useState([]);
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const { data } = await axiosInstance.get('/api/exams');
            if (Array.isArray(data)) {
                setExams(data);
            } else {
                setExams([]);
                console.error('Exams could not be fetched or no exam exist');
                setError("There is cauurently no exam available");
            }
        } catch (error) {
            console.log(error, 'Could not fetch exams');
            toast.error('Error fetching exams');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExamSelection = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleDeleteExam = async () => {
        try {
            if (selectedValue) {
                const selectedExam = exams.find((exam) => exam.id === selectedValue);
                if (selectedExam) {
                    await axiosInstance.delete(`/api/exams/${selectedValue}`);
                    toast.success('Exam deleted successfully');
                    setSelectedValue('');
                    fetchExams();
                } else {
                    toast.error('Selected exam not found');
                }
            } else {
                toast.error('Please select an exam to delete');
            }
        } catch (error) {
            console.log(error, 'Error deleting exam');
            toast.error('Error deleting exam');
        }
    };

    return (
        <>
            <div className='deleteUploadedExamView'>
                <h2>Delete Uploaded Exam</h2>
                <div className="examOptions">
                    <select value={selectedValue} onChange={handleExamSelection}>
                        <option>Select Exam</option>
                        {exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                                {exam.subject}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleDeleteExam} disabled={!selectedValue}
                        className='deleteUploadedExamBtn'
                    >
                        Delete Exam
                    </button>
                </div>
            </div>
        </>
    );
};

export default DeleteUploadedExam;