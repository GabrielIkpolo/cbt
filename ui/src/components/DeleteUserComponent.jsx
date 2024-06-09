import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import "./deleteUserComponent.css";
import toast from 'react-hot-toast';

const DeleteUserComponent = () => {
    const [users, setUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('api/the-users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`api/the-users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            toast.success("User Sucessfully deleted");
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchEmail(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    return (
        <div className="deleteUserComponent">
            <h2>Delete Users</h2>
            <input
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={handleSearch}
                className="searchBox"
            />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registration Number</th>
                        <th>Department</th>
                        {/* <th>Role</th> */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.registrationNumber}</td>
                            <td>{user.department}</td>
                            {/* <td>{user.role}</td> */}
                            <td>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="deleteButton"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteUserComponent;
