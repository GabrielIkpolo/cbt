import React, { useEffect, useState } from 'react'
import "./admin.css";
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import AnsweredQuestionsManager from '../components/AnsweredQuestionsManager.jsx';
import UploadCSV from './UploadCSV.jsx';
import ExamResultsTable from '../components/ExamResultsTable.jsx';
import ImageUpload from '../components/ImageUpload.jsx';

const Admin = () => {

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // fetch all users when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get(`api/the-users`);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, []);

    // Function to handle search input change 
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    // Filter Users based on search query 
    const filterdUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    );

    // Function to reset takenExam value to 0 for a user
    const resetExam = async (userId) => {
        try {
            await axiosInstance.put(`/api/the-users/${userId}`, { takenExam: 0 });
            //Update the users state after resetting takenExam
            setUsers((prevUsers) => prevUsers.map((user) => user.id === userId ? {
                ...user,
                takenExam: 0
            } : user));
            toast.success("Exam resetted for candidate");

        } catch (error) {
            console.error("Error resetting takenExam", error);
        }
    }

    // Function to reset all 
    const resetAllExam = async () => {
        try {

            await axiosInstance.put(`/api/resetAllExam`, { takenExam: 0 });
            // update users state after resetting all exams
            setUsers((prevUsers) => prevUsers.map((user) => ({
                ...user,
                takenExam: 0
            })));
        } catch (error) {
            console.error("Error resseting all exams", error);
        }

        // add toast functionalist
        toast.success("takenExam resetted");
    }

    return (
        <>
            <div className='admin'>

                {/* Selection Section  */}
                <div className="selection">
                    Selection view
                </div>

                {/* User management Section  */}
                <div className="userManagement">
                    <h3>User Management</h3>

                    <input className='searchQuery' type="text" placeholder='Search by email' value={searchQuery}
                        onChange={handleSearchChange}
                    />

                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Registration Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterdUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.name}</td>
                                    <td>{user.registrationNumber}</td>
                                    <td><button className='takenExamBtn' onClick={() => resetExam(user.id)}>
                                        Reset Exam
                                    </button>
                                    </td>
                                </tr>
                            )
                            )
                            }
                        </tbody>
                    </table>
                    <button className="resetAllBtn" onClick={resetAllExam} > Reset All Exam</button>
                </div>
            </div>

            {/* Answerd Questions Reset option  */}
            <div className='answeredQuestionsReset'>
                <h2>Answered Questions Reset Options</h2>
                <AnsweredQuestionsManager />
            </div>

            {/* File Upload here  */}
            <div className="fileUpload">
                <UploadCSV />
            </div>

            {/* The ExamResultsTable here   */}
            <div className='examResultsTable'>
                <ExamResultsTable />
            </div>

            {/* The Image Upload here  */}
            <ImageUpload />

        </>

    )
}

export default Admin