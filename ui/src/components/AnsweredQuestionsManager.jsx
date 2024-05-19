import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';

const AnsweredQuestionsManager = () => {
    const [deleteAllAnsweredQuestions, setDeleteAllAnsweredQuestions] = useState(false);
    const [deleteAnsweredQuestionsById, setDeleteAnsweredQuestionsById] = useState(false);
    const [deleteAllExamInProgress, setDeleteAllExamInProgress] = useState(false);
    const [deleteExamInProgressById, setDeleteExamInProgressById] = useState(false);
    const [deleteAllUserExamResults, setDeleteAllUserExamResults] = useState(false);
    const [deleteUserExamResultById, setDeleteUserExamResultById] = useState(false);

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

    const handleDeleteAnsweredQuestionsById = async () => {
        const examInProgressId = 'your-exam-in-progress-id'; // Replace with actual ID
        try {
            const { data } = await axiosInstance.delete(`/api/answered-questions/${examInProgressId}`);
            setDeleteAnsweredQuestionsById(data.message);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    const handleDeleteAllExamInProgress = async () => {
        try {
            const { data } = await axiosInstance.delete('/api/delete-all-exam-in-progress');
            setDeleteAllExamInProgress(data.message);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    const handleDeleteExamInProgressById = async () => {
        const examInProgressId = 'your-exam-in-progress-id'; // Replace with actual ID
        try {
            const {data} = await axiosInstance.delete(`/api/exam-in-progress/${examInProgressId}`);
            setDeleteExamInProgressById(data.message);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    const handleDeleteAllUserExamResults = async () => {
        try {
            const {data} = await axiosInstance.delete('/api/delete-all-user-exam-results');
            setDeleteAllUserExamResults(data.message);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    const handleDeleteUserExamResultById = async () => {
        const userExamResultId = 'your-user-exam-result-id'; // Replace with actual ID
        try {
            const {data} = await axiosInstance.delete(`/api/user-exam-results/${userExamResultId}`);
            setDeleteUserExamResultById(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    return (
        <div>
            <h1>Answer Questions Operations</h1>
            <button onClick={handleDeleteAllAnsweredQuestions}>Delete All Answered Questions</button>
            <p>{deleteAllAnsweredQuestions}</p>

            <button onClick={handleDeleteAnsweredQuestionsById}>Delete Answered Questions by ID</button>
            <p>{deleteAnsweredQuestionsById}</p>

            <h1>Exam In Progress Operations</h1>
            <button onClick={handleDeleteAllExamInProgress}>Delete All Exam In Progress</button>
            <p>{deleteAllExamInProgress}</p>

            <button onClick={handleDeleteExamInProgressById}>Delete Exam In Progress by ID</button>
            <p>{deleteExamInProgressById}</p>

            <h1>User Exam Result Operations</h1>
            <button onClick={handleDeleteAllUserExamResults}>Delete All User Exam Results</button>
            <p>{deleteAllUserExamResults}</p>

            <button onClick={handleDeleteUserExamResultById}>Delete User Exam Result by ID</button>
            <p>{deleteUserExamResultById}</p>
        </div>
    );
}

export default AnsweredQuestionsManager;