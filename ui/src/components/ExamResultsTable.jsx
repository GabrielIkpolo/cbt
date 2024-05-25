import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import axiosInstance from '../utils/AxiosInstance.jsx';

const ExamResultsTable = () => {
  const [users, setUsers] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/collate-all-users-result');
        setUsers(data);

        // Prepare CSV data
        const transformedData = data.map((user) => ({
          'User ID': user.id,
          Name: user.name,
          Email: user.email,
          'Registration Number': user.registrationNumber,
          Department: user.department,
          'Total Exams Taken': user.totalExamsTaken,
          'Exam': user.examResults.map((result) => result.examName).join(', '), // Convert array to string
          'Score': user.examResults.map((result) => result.score).join(', '), // Convert array to string
        }));
        setCsvData(transformedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  return (
    <div>
      <h1>Exam Results Table</h1>
      <table>
        {/* Table Header */}
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Number</th>
            <th>Department</th>
            <th>Total Exams Taken</th>
            <th>Exam</th>
            <th>Score</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.registrationNumber}</td>
              <td>{user.department}</td>
              <td>{user.totalExamsTaken}</td>
              <td>{user.examResults.map((result) => result.examName).join(', ')}</td>
              <td>{user.examResults.map((result) => result.score).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* CSV Export */}
      <CSVLink data={csvData} filename="exam_results.csv">
        Export as CSV
      </CSVLink>
    </div>
  );
};

export default ExamResultsTable;
