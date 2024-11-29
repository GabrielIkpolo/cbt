import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance.jsx';
import './examInProgressComponent.css'

const ExamInProgressComponent = () => {
    const [examsInProgress, setExamsInProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExamsInProgress = async () => {
        try {
            const { data } = await axiosInstance.get('/api/all-exams-in-progress');
            if (Array.isArray(data)) {
                setExamsInProgress(data);
            } else {
                setExamsInProgress([]); // Default to an empty array if the response is not an array
                setError("There is currently no Exam in progress.");
            }
        } catch (error) {
            console.error('Error fetching exams in progress:', error);
            setError("Failed to load exam in progress, please try again later or There is currently No exam in Progress");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExamsInProgress();
    }, []);



    return (
        <div className='examInProgress'>
            <h1>Exams in Progress</h1>
            {isLoading ? (
                <p>Loading Exam in Progress ...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>User Email</th>
                            <th>Exam ID</th>
                            <th>Exam Subject</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examsInProgress.map(exam => (
                            <tr key={exam.id}>
                                <td>{exam.id}</td>
                                <td>{exam.userId}</td>
                                <td>{exam.userEmail}</td>
                                <td>{exam.examId}</td>
                                <td>{exam.examSubject}</td>
                                <td>{exam.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExamInProgressComponent;
