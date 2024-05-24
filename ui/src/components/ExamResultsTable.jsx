import React, { useState, useEffect } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import axiosInstance from '../utils/AxiosInstance.jsx'


const ExamResultsTable = () => {
  const [users, setUsers] = useState([]);
  const [csvData, setCsvData] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/collate-all-users-result');
      setUsers(data);
      console.log("The is the got data ==>", data);
      // Prepare CSV data
      const transformedData = users.map((user) => ({
        'User ID': user.id,
        Name: user.name,
        Email: user.email,
        'Registration Number': user.registrationNumber,
        Department: user.department,
        'Total Exams Taken': user.totalExamsTaken,
        // 'Exam Results': user.examResults.map((result) => `${result.examName} - Score: ${result.score}`).join(', '),
        'Exam': user.examResults.map((result) => result.examName),
        'Score': user.examResults.map((result) => result.score),
      }));
      setCsvData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <h1>Exam Results Table</h1>
      <table>
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
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.registrationNumber}</td>
              <td>{user.department}</td>
              <td>{user.totalExamsTaken}</td>

              <td>{user.examResults.map((result) => (
                <div key={result.id}>
                  {result.examName}
                </div>
              ))}
              </td>

              <td>
                {user.examResults.map((result) => (
                  <div key={result.id}>
                    {result.score}
                  </div>
                ))}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <CSVLink data={csvData} filename="exam_results.csv">
        Export as CSV
      </CSVLink>
    </div>
  );
};

export default ExamResultsTable;