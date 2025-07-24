
import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(now.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-1 font-mono text-sm">
      <span className="bg-red-100 text-red-800 px-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
      <span className="bg-red-100 text-red-800 px-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
      <span className="bg-red-100 text-red-800 px-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};
