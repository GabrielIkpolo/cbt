import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import './registrationComponent.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RegistrationComponent = () => {
    const navigate = useNavigate();
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
        'Finance',
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

    const [showPassword, setShowPassword] = useState(false);

    const [isRegister, setIsResgister] = useState(true);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                setTimeout(() => {
                    setError(null);
                }, 6000);
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


    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get user ID from email address
            const { data: user } = await axiosInstance.get(`/api/get-the-users/by-email?email=${email}`);

            if (!user || !user.id) {
                toast.error("User not found");
                setError("User not found");
                setTimeout(()=>{ 
                    setError(null)
                }, 5000);
                return;
            }

            if(user.enableUpdate === false){
                toast.error(("Contact Server Admin to enable this operation"));
                setError("Contact Server Admin to enable this operation");
                setTimeout(()=>{
                    setError(null);
                }, 6000);
                return;

            }

            const userId = user.id;

            // Update the user with the supplied details
            const { data } = await axiosInstance.put(`/api/the-users/${userId}`, {
                name,
                email,
                password,
                registrationNumber,
                department,
                level,
                enableUpdate: false,
            });

            if (data.error) {
                setError(data.error);
                toast.error(data.error);
                setTimeout(() => {
                    setError(null);
                }, 6000);
            } else {
                toast.success('User updated successfully redirecting to Login Page');
                setTimeout(() => {
                    navigate('/');
                }, 6000);
            }

        } catch (error) {
            console.error(error);
            setError('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        < div >
            <h2 className='selectionMode'>
                <NavLink className="theNavLink1" onClick={() => setIsResgister(true)}>Register/</NavLink>
                <NavLink className="theNavLink2" onClick={() => setIsResgister(false)}>Update Details</NavLink>
            </h2>

            {
                isRegister ? (
                    <div>
                        {<h2>User Registration</h2>}

                        {
                            registrationSuccess ? (
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
                                        type="text" placeholder='Enter Full name ... Eg. John Smith'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />

                                    <input className='registerInputes'
                                        type="email" placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <input className='registerInputes'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onContextMenu={handleTogglePasswordVisibility} // for rightclick
                                    />

                                    <input className='registerInputes'
                                        type="text" placeholder='Enter Matriculation Number or Registration Number ...'
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
                            )
                        }
                    </div>) : (
                    <div>
                        {
                            <h2>Update Details</h2>
                        }
                        {
                            registrationSuccess ? (
                                <div className='sucessfulDivNotification'>
                                    <p>Update successful!</p>
                                    <button className="registerAnother" onClick={() => setRegistrationSuccess(false)}>
                                        Register another user
                                    </button>
                                </div>
                            ) : (

                                <form className='registerForm' onSubmit={handleUpdate}>
                                    {error && <p>{error}</p>}

                                    <input className='registerInputes'
                                        type="text" placeholder='Enter Full name ... Eg. John Smith'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />

                                    <input className='registerInputes'
                                        type="email" placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <input className='registerInputes'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onContextMenu={handleTogglePasswordVisibility} // for rightclick
                                    />

                                    <input className='registerInputes'
                                        type="text" placeholder='Enter Matriculation Number or Registration Number ...'
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
                                        Update Details
                                    </button>
                                </form>
                            )
                        }
                    </div>)
            }





        </div >
    );
}

export default RegistrationComponent;