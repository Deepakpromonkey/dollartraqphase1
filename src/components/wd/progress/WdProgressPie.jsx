
import React, { useState, useEffect } from 'react';

const WdProgressPie = ({ size = 120, progress = 0, duration = 1.5, with_num = false, style = {}, backgroundColor = '#00bfff', fillColor = '#e6e6e6' }) => {
  
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
    
        let start = 0;
        const step = (progress / duration) / 60;

        const animate = () => {
        
            start += step;
            
            if(start >= progress){
        
                setAnimatedProgress(progress);
            }else{
        
                setAnimatedProgress(start);
                requestAnimationFrame(animate);
            }
        };

        animate();

        return () => setAnimatedProgress(0);
    }, [progress, duration]);

    const circleStyle = {
        width: size,
        height: size,
        background: `conic-gradient(${fillColor} ${animatedProgress * 3.6}deg, ${backgroundColor} 0deg)`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={{...circleStyle, ...style}}>

            {with_num &&
            
                <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>
                    {`${Math.round(animatedProgress)}%`}
                </span>
            }
        </div>
    );
};

export default WdProgressPie;
