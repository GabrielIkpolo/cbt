import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import './answeredQuestionsManager.css';

const AnsweredQuestionsManager = () => {
    const [deleteAllAnsweredQuestions, setDeleteAllAnsweredQuestions] = useState(false);
    const [deleteAnsweredQuestionsById, setDeleteAnsweredQuestionsById] = useState(false);
    const [deleteAllExamInProgress, setDeleteAllExamInProgress] = useState(false);
    const [deleteExamInProgressById, setDeleteExamInProgressById] = useState(false);
    const [deleteAllUserExamResults, setDeleteAllUserExamResults] = useState(false);
    const [deleteUserExamResultById, setDeleteUserExamResultById] = useState(false);

    const [userId, setUserId] = useState("");
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isPending, setIsPending] = useState(false);

    const removeSingleUserDetails = async () => {
        setIsPending(true);

        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        try {
            const { data } = await axiosInstance.delete(`/api/remove-user-exam-details/${userId}`);
            setIsPending(false);
            setDeleteMessage(data.message);
            toast.success("User Exam record deleted");

        } catch (error) {
            console.error(error);
            toast.error("failed to delete data", error);
        }

    }


    const handleDeleteAllAnsweredQuestions = async () => {
        try {
            const { data } = await axiosInstance.delete('/api/delete-all-answered-questions');
            setDeleteAllAnsweredQuestions(data.message);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    
    return (
        <div className='qoperations'>
            <h3>Answer Questions Operations</h3>
            <div className='textFieldDiv'>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                />

                <button className='singleUserDetails' onClick={removeSingleUserDetails} >Remove UserExamDetails</button>
            </div>

            <div className='warning'>
                <span className='theSpan'>Use with caution as this will delete all exam results</span>
                <button className='allUserDetails' onClick={handleDeleteAllAnsweredQuestions}>Delete All Answered Questions</button>
            </div>

        </div>
    );
}

export default AnsweredQuestionsManager;