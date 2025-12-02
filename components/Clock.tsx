'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center p-4">
      <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--clock-gradient-from)] to-[var(--clock-gradient-to)] drop-shadow-[0_0_10px_var(--clock-shadow)] font-mono tracking-widest transition-all duration-300">
        {time.toLocaleTimeString([], { hour12: false })}
      </div>
      <div className="text-[var(--accent-color)] text-sm mt-2 tracking-widest uppercase opacity-80">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
