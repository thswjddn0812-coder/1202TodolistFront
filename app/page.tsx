'use client';

import { useState } from 'react';
import Clock from '@/components/ui/Clock';
import Calendar from '@/components/ui/Calendar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import StarryBackground from '@/components/ui/StarryBackground';
import WeekNavigation from '@/components/ui/WeekNavigation';
import TodoInput from '@/components/todo/TodoInput';
import TodoList from '@/components/todo/TodoList';
import TodoModal from '@/components/todo/TodoModal';
import { useTodos } from '@/hooks/useTodos';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { 
    todos, 
    selectedTodo, 
    isLoading, 
    setSelectedTodo, 
    addTodo, 
    toggleTodo, 
    removeTodo, 
    addSubtask, 
    toggleSubtask, 
    removeSubtask,
    setTodos,
  } = useTodos(selectedDate);

  const { handleDragEnd } = useDragAndDrop(todos, setTodos);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-space text-white' : 'bg-[var(--bg-primary)] text-[var(--text-primary)]'} flex flex-col items-center p-4 md:p-8 relative overflow-hidden font-sans`}>
      <StarryBackground isDarkMode={isDarkMode} />

      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />

      <div className="z-10 w-full max-w-4xl flex flex-col gap-8">
        
        {/* Top Section: Clock */}
        <section className="flex justify-center">
          <Clock />
        </section>

        {/* Week Navigation */}
        <WeekNavigation selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <div className="flex flex-col md:flex-row gap-8 items-start">{/* Left Column: Calendar */}
            {/* Left Column: Calendar */}
            <section className="w-full md:w-auto flex-shrink-0 flex justify-center md:justify-start">
                <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </section>

            {/* Right Column: Todo List */}
            <section className="flex-1 w-full bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-6 shadow-2xl min-h-[500px] flex flex-col transition-colors duration-300">
                <div className="flex justify-between items-center mb-6 border-b border-[var(--card-border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--accent-color)] tracking-wider uppercase">
                        {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}의 할 일
                    </h2>
                    <span className="text-[var(--text-secondary)] text-sm">{todos.length}개의 할 일</span>
                </div>

                <TodoInput onAddTodo={addTodo} />

                <TodoList 
                  todos={todos}
                  isLoading={isLoading}
                  onDragEnd={handleDragEnd}
                  onToggle={toggleTodo}
                  onDelete={removeTodo}
                  onSelect={setSelectedTodo}
                />
            </section>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedTodo && (
        <TodoModal 
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={removeSubtask}
        />
      )}
    </main>
  );
}
