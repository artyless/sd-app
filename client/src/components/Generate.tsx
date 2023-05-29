import React, { useState, useEffect } from 'react'

export const Generate = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
            }, 500);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isLoading]);

    const handleClick = () => {
        setIsLoading(true);

        // Здесь вы можете выполнить асинхронную операцию или запрос к серверу

        // Для примера, мы просто задержим выполнение на 3 секунды
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    return (
        <button onClick={handleClick} disabled={isLoading}>
            {isLoading ? (
                <div className="progress-circle">
                    <div className="progress-circle-inner" style={{ transform: `rotate(${progress}deg)` }}></div>
                </div>
            ) : (
                <div className="progress-circle">
                    <div className="progress-circle-inner" style={{ transform: `rotate(${progress}deg)` }}></div>
                </div>
            )}
        </button>
    );
};
