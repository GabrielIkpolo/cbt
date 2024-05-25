import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';


const UploadCSV = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('examFile', file);

        try {
            const {data} = await axiosInstance.post('/api/exams/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.error) {
                setError(data.error);
                toast.error(data.error);
                
            } else {
                setUploadSuccess(true);
                toast.success(" File uploaded sucessfully");
            }
        } catch (error) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Questions Upload</h1>

            {uploadSuccess ? (
                <div>
                    <p>File uploaded successfully!</p>
                    <button onClick={() => setUploadSuccess(false)}>Upload another file</button>
                </div>
            ) : 
            
            (
                <form onSubmit={handleSubmit}>
                    <label>
                        Select CSV File:
                        <input
                            type="file"
                            onChange={handleFileChange}
                        />
                    </label>
                    <button type="submit" disabled={loading}>Upload File</button>
                </form>
            )}
            {error && <p>{error}</p>}
        </div>
    );
}

export default UploadCSV;