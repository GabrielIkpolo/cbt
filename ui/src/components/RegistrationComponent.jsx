import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';

const RegistrationComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [department, setDepartment] = useState('');// use an Arrya of depts here
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axiosInstance.post('/api/the-users', {
                name,
                email,
                password,
                registrationNumber,
                department,
            });

            if (data.error) {
                setError(data.error);
                toast.error(data.error);
            } else {
                setRegistrationSuccess(true);
                toast.success("Sucessfully registered")
            }
        } catch (error) {
            setError('Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>User Registration</h1>
            {registrationSuccess ? (
                <div>
                    <p>Registration successful!</p>
                    <button onClick={() => setRegistrationSuccess(false)}>Register another user</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>


                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>


                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>


                    <label>
                        Registration Number:
                        <input
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                        />
                    </label>


                    <label>
                        Department:
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </label>


                    <button type="submit" disabled={loading}>Register</button>
                </form>
            )}
            {error && <p>{error}</p>}
        </div>
    );
}

export default RegistrationComponent;