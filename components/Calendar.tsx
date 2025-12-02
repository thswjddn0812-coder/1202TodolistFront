'use client';

import { useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={day}
          onClick={() => onSelectDate(dateStr)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 relative
            ${isSelected 
              ? 'bg-[var(--accent-color)] text-white font-bold shadow-[0_0_15px_var(--clock-shadow)] scale-110' 
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }
            ${isToday && !isSelected ? 'border border-[var(--accent-color)] text-[var(--accent-color)]' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="w-full max-w-md bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-4 shadow-2xl transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={handlePrevMonth} className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-wider">
          {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {generateDays()}
      </div>
    </div>
  );
}
