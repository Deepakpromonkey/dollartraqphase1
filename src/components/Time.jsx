import React from 'react';

import Schedule from '@mui/icons-material/Schedule';

const Time = () => {
  
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
    
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date).replace(/am|pm/i, (match) => match.toUpperCase());
    };

    return (
        <div className='align-center c-blue'>
            <Schedule />
            <span className='fs-12 fw-semibold ml-5'>{formatTime(currentTime)}</span>
        </div>
    );
};

export default Time;