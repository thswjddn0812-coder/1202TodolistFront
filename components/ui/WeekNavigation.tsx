import { useTodoCount } from '@/hooks/useTodoCount';

interface WeekNavigationProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function WeekNavigation({ selectedDate, onSelectDate }: WeekNavigationProps) {
  // 이번 주의 날짜 계산 (일요일 시작)
  const getWeekDates = () => {
    const selected = new Date(selectedDate);
    const day = selected.getDay(); // 0 (일요일) ~ 6 (토요일)
    const diff = selected.getDate() - day; // 이번 주 일요일
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(selected);
      date.setDate(diff + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const { counts } = useTodoCount(weekDates);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <section className="w-full max-w-4xl">
      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 text-center">
          이번 주
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isSelected = date === selectedDate;
            const todoCount = counts[date] || 0;
            const dateObj = new Date(date);
            const dayNum = dateObj.getDate();

            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className={`
                  relative p-3 rounded-lg transition-all
                  ${isSelected 
                    ? 'bg-[var(--accent-color)] text-white shadow-lg scale-105' 
                    : 'bg-[var(--input-bg)] hover:bg-[var(--card-border)] text-[var(--text-primary)]'
                  }
                `}
              >
                <div className="text-xs font-bold mb-1">{dayNames[index]}</div>
                <div className="text-lg font-bold">{dayNum}</div>
                {todoCount > 0 && (
                  <div className={`
                    absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                    ${isSelected ? 'bg-white text-[var(--accent-color)]' : 'bg-[var(--accent-color)] text-white'}
                  `}>
                    {todoCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
