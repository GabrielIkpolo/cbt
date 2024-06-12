import React, { useState } from 'react';
import axios from 'axios';

const SimpleButton = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleClick = async () => {
        if (isButtonDisabled) return;

        setIsButtonDisabled(true);

        // try {
        //     // Simulate an API call
        //     const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
        //     console.log('API response:', response.data);
        // } catch (error) {
        //     console.error('API call failed:', error);
        // } finally {
        //     // Re-enable the button after the API call completes
        //     setIsButtonDisabled(false);
        // }

        setTimeout(()=>{
            console.log("Waiting .............");
            setIsButtonDisabled(false);
        }, 5000);

        
    };

    return (
        <button onClick={handleClick} disabled={isButtonDisabled}>
            {isButtonDisabled ? 'Processing...' : 'Click Me'}
        </button>
    );
};

export default SimpleButton;
