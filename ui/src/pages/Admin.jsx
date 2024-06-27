import React, { useEffect, useState } from 'react'
import "./admin.css";
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import AnsweredQuestionsManager from '../components/AnsweredQuestionsManager.jsx';
import UploadCSV from './UploadCSV.jsx';
import ExamResultsTable from '../components/ExamResultsTable.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import DeleteUploadedExam from '../components/DeleteUploadedExam.jsx';
import DeleteUserComponent from '../components/DeleteUserComponent.jsx';
import SimpleButton from '../components/SimpleButton.jsx';
import ExamInProgressComponent from '../components/ExamInProgressComponent.jsx';

const Admin = () => {

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeComponent, setActiveComponent] = useState(" User Management");

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
            setUsers((prevUsers) =>
                prevUsers.map((user) => user.id === userId ? {
                    ...user,
                    takenExam: 0
                }
                    : user)
            );
            toast.success("Exam resetted for candidate");

        } catch (error) {
            console.error("Error resetting takenExam", error);
        }
    }

    // function to enable user update 
    const enableUserUpdate = async (userId) => {
        try {
            await axiosInstance.put(`/api/the-users/${userId}`, { enableUpdate: true });

            // Updates the users state by mapping over the previous users (prevUsers) and 
            // replacing the user with the matching id with an updated object that sets enableUpdate to true.

            setUsers((prevUsers) =>
                prevUsers.map((user) => user.id === userId ? { ...user, enableUpdate: true } : user)
            );

            toast.success("User is enabled for update.");
        } catch (error) {
            console.error("Error enabling user for update", error);
            toast.error("Could not enable user for update");
        }
    }


    // Function to reset all 
    const resetAllExam = async () => {
        try {

            await axiosInstance.put(`/api/resetAllExam`, { takenExam: 0 });
            // update users state after resetting all exams
            setUsers((prevUsers) => prevUsers.map((user) => ({
                ...user,
                takenExam: 0,
                totalExamsTaken: 0,
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
                    <h2>Menu</h2>
                    <ul>
                        <li>
                            <a className={`menuItem ${activeComponent === 'User management' && 'active'}`} onClick={() => setActiveComponent("User Management")}>
                                User Management
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'answeredQuestionsReset' && 'active'}`} onClick={() => setActiveComponent("answeredQuestionsReset")}>
                                Reset Answered Questions
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'fileUpload' && 'active'}`} onClick={() => setActiveComponent("fileUpload")}>
                                Upload Exam
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'examInProgress' && 'active'}`} onClick={() => setActiveComponent("examInProgress")}>
                                Check Exam in Progress
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'examResultsTable' && 'active'}`} onClick={() => setActiveComponent("examResultsTable")}>
                                Check Exam Results
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'imageUpload' && 'active'}`} onClick={() => setActiveComponent("imageUpload")}>
                                Upload Image for Exam Questions
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'delUploadedExam' && 'active'}`} onClick={() => setActiveComponent("delUploadedExam")}>
                                Delete Uploaded Exam
                            </a>
                        </li>

                        <li>
                            <a className={`menuItem ${activeComponent === 'delUser' && 'active'}`} onClick={() => setActiveComponent("delUser")}>
                                Delete User
                            </a>
                        </li>

                    </ul>

                </div>

                <div className="mainContent">

                    {/* User management Section  */}
                    {activeComponent === 'User Management' && (
                        <div>
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
                                            <th>Enable Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterdUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.email}</td>
                                                <td>{user.name}</td>
                                                <td>{user.registrationNumber}</td>
                                                <td>
                                                    <button className='takenExamBtn' onClick={() => resetExam(user.id)}>
                                                        Reset Exam
                                                    </button>
                                                </td>

                                                <td>
                                                    <button className="takenExamBtn" onClick={() => enableUserUpdate(user.id)} >
                                                        Enable User Update
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
                    )}


                    {/*======== Answered Questions Reset option==========  */}
                    {activeComponent === 'answeredQuestionsReset' && (
                        <div className='answeredQuestionsReset'>
                            <h2>Answered Questions Reset Options</h2>
                            <AnsweredQuestionsManager />
                        </div>)
                    }


                    {/*=========== File Upload here========  */}

                    {activeComponent === 'fileUpload' &&
                        <div className="fileUpload">
                            <UploadCSV />
                        </div>
                    }

                    {/* ======The ExamResultsTable here =========   */}

                    {activeComponent === 'examResultsTable' &&
                        <div className='examResultsTable'>
                            <ExamResultsTable />
                        </div>
                    }

                    {/* ====The Image Upload here ===== */}

                    {activeComponent === 'imageUpload' &&
                        <div className="imageUpload">
                            <ImageUpload />
                        </div>
                    }

                    {/*==== Delete Uploaded Exam ========= */}

                    {activeComponent === 'delUploadedExam' &&
                        <div className="delUploadedExam">
                            <DeleteUploadedExam />
                        </div>
                    }

                    {/*==== Delete User ====== */}

                    {activeComponent === 'delUser' &&
                        <div className="delUser">
                            <DeleteUserComponent />
                        </div>
                    }

                    {/* =========Exam in Progress ====== */}

                    { activeComponent === 'examInProgress' &&
                        <div className='examInProgress'>
                            <ExamInProgressComponent />
                        </div>
                    }


                </div>

                {/* Testing the disable button functionality */}
                {/* <SimpleButton /> */}

            </div>

        </>
    )
}

export default Admin