import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance.jsx';
import './examInProgressComponent.css';

const ExamInProgressComponent = () => {
    const [examsInProgress, setExamsInProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [total, setTotal] = useState(0);

    const fetchExamsInProgress = async () => {
        try {
            const { data } = await axiosInstance.get('/api/all-exams-in-progress', {
                params: { page, pageSize, search: searchEmail },
            });
            if (Array.isArray(data.data)) {
                setExamsInProgress(data.data);
                setTotal(data.total);
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
    }, [page, pageSize, searchEmail]);

    const handleSearch = (event) => {
        setSearchEmail(event.target.value);
        setPage(1); // Reset to the first page when search changes
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className='examInProgressView'>
            <h1>Exams in Progress</h1>
            <input
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={handleSearch}
                className="searchBox"
            />
            {isLoading ? (
                <p>Loading Exam in Progress ...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <table className="examInProgressTable">
                    <thead className='examInProgressTableHead'>
                        <tr className="examInProgressTr">
                            <th className="examInProgressTh">ID</th>
                            <th className="examInProgressTh">User ID</th>
                            <th className="examInProgressTh">User Email</th>
                            <th className="examInProgressTh">Exam ID</th>
                            <th className="examInProgressTh">Exam Subject</th>
                            <th className="examInProgressTh">Score</th>
                        </tr>
                    </thead>
                    <tbody className='examInProgressTableBody'>
                        {examsInProgress.map(exam => (
                            <tr className="examInProgressTr" key={exam.id}>
                                <td className="examInProgressTd">{exam.id}</td>
                                <td className="examInProgressTd">{exam.userId}</td>
                                <td className="examInProgressTd">{exam.userEmail}</td>
                                <td className="examInProgressTd">{exam.examId}</td>
                                <td className="examInProgressTd">{exam.examSubject}</td>
                                <td className="examInProgressTd">{exam.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={page === index + 1}
                        className={page === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExamInProgressComponent;