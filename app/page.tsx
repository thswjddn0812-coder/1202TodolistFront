'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Clock from '@/components/Clock';
import Calendar from '@/components/Calendar';
import TodoItem from '@/components/TodoItem';
import TodoModal from '@/components/TodoModal';
import { useTodos } from '@/hooks/useTodos';
import { reorderTodos } from '@/utils/reorder';

export default function Home() {
  const [newTodoText, setNewTodoText] = useState('');
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      await addTodo(newTodoText);
      setNewTodoText('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);

    const reorderedTodos = arrayMove(todos, oldIndex, newIndex);
    
    // 낙관적 업데이트
    setTodos(reorderedTodos);

    // 서버에 순서 업데이트
    try {
      const updates = reorderedTodos.map((todo, index) => ({
        id: todo.id,
        order_index: index,
      }));
      await reorderTodos(updates);
    } catch (error) {
      console.error('Error reordering todos:', error);
      // 실패 시 원래 순서로 복구
      setTodos(todos);
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-space text-white' : 'bg-[var(--bg-primary)] text-[var(--text-primary)]'} flex flex-col items-center p-4 md:p-8 relative overflow-hidden font-sans`}>
      {/* Starry Background Effect (Dark Mode Only) */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-40 right-40 w-2 h-2 bg-cyan-400 rounded-full opacity-50 animate-pulse delay-75"></div>
            <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse delay-150"></div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all shadow-lg"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      <div className="z-10 w-full max-w-4xl flex flex-col gap-8">
        
        {/* Top Section: Clock */}
        <section className="flex justify-center">
          <Clock />
        </section>

        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Column: Calendar */}
            <section className="w-full md:w-auto flex-shrink-0 flex justify-center md:justify-start">
                <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </section>

            {/* Right Column: Todo List */}
            <section className="flex-1 w-full bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl p-6 shadow-2xl min-h-[500px] flex flex-col transition-colors duration-300">
                <div className="flex justify-between items-center mb-6 border-b border-[var(--card-border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--accent-color)] tracking-wider uppercase">
                        Tasks for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </h2>
                    <span className="text-[var(--text-secondary)] text-sm">{todos.length} tasks</span>
                </div>

                {/* Add Todo Input */}
                <form onSubmit={handleAddTodo} className="mb-6 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative flex bg-[var(--input-bg)] rounded-lg overflow-hidden border border-[var(--card-border)]">
                        <input
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="Add a new mission..."
                            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-4 py-3 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 bg-white/5 hover:bg-white/10 text-[var(--accent-color)] font-bold transition-colors border-l border-[var(--card-border)]"
                        >
                            ADD
                        </button>
                    </div>
                </form>

                {/* Todo List with Drag and Drop */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {isLoading ? (
                        <div className="text-center text-gray-500 py-10 animate-pulse">Scanning sector...</div>
                    ) : todos.length === 0 ? (
                        <div className="text-center text-gray-600 py-10">
                            <p>No missions detected for this cycle.</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={todos.map(t => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {todos.map((todo) => (
                                    <TodoItem 
                                        key={todo.id} 
                                        todo={todo} 
                                        onToggle={toggleTodo} 
                                        onDelete={removeTodo} 
                                        onClick={setSelectedTodo} 
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
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
