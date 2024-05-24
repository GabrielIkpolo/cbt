import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import './registrationComponent.css';

const RegistrationComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([
        'Accounting',
        'Agric Engineering',
        'Anatomy',
        'BCH',
        'Biology',
        'Busssiness Administration',
        'Chemistry',
        'Civil Engineering',
        'Computer Engineering',
        'Computer Information Science',
        'Computer Information Technology',
        'Computer Science',
        'Cyber Security',
        'Economics',
        'Electrical Electronics Engr',
        'Engineering',
        'Law',
        'LIS',
        'Mass Comm.',
        'Mathematics',
        'MCB',
        'Mechanical Engineering',
        'MLS',
        'Nursing',
        'Physics',
        'Physiology',
        'Political Science',
        'Public Admin.',
        'Public Health',
        'Software Engineering'
    ]);// use an Array of depts here
    const [level, setLevel] = useState("");
    const [levels, setLevels] = useState(["100L", "200L", "300L", "400L", "500L", "Other"]);
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
                level,
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
            <h2 className='userRehistration'>User Registration</h2>
            {registrationSuccess ? (
                <div className='sucessfulDivNotification'>
                    <p>Registration successful!</p>
                    <button className="registerAnother" onClick={() => setRegistrationSuccess(false)}>
                        Register another user
                    </button>
                </div>
            ) : (

                <form className='registerForm' onSubmit={handleSubmit}>
                    {error && <p>{error}</p>}

                    <input className='registerInputes'
                        type="text" placeholder='Enter name ...'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input className='registerInputes'
                        type="email" placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input className='registerInputes'
                        type="password" placeholder='Enter password ...'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input className='registerInputes'
                        type="text" placeholder='Enter registration number ...'
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                    />

                    <select className='selectOption' value={department}
                        onChange={e => setDepartment(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}

                    </select>

                    <select className='selectOption' value={level}
                        onChange={e => setLevel(e.target.value)} >
                        <option value="">Select Level</option>
                        {levels.map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>

                    <button className='registerBtn' type="submit" disabled={loading}>
                        Register
                    </button>
                </form>
            )}

        </div>
    );
}

export default RegistrationComponent;