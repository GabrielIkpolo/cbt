import React, { useState, useEffect } from 'react';

const SelectExam = () => {
    const [user, setUser] = useState('');

    useEffect(() => {
        // const token = localStorage.getItem('token');

    }, []);

    return (
        <div className='selectExam'>
            <div className='userdetail'>
                Welcome: {user}
            </div>
            SelectExam
        </div>
    );
};

export default SelectExam;
