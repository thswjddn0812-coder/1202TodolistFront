import { useState } from 'react';

interface TodoInputProps {
  onAddTodo: (text: string) => Promise<any>;
}

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      await onAddTodo(newTodoText);
      setNewTodoText('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div className="relative flex bg-[var(--input-bg)] rounded-lg overflow-hidden border border-[var(--card-border)]">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="새로운 할 일 추가..."
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-4 py-3 outline-none"
        />
        <button
          type="submit"
          className="px-6 bg-white/5 hover:bg-white/10 text-[var(--accent-color)] font-bold transition-colors border-l border-[var(--card-border)]"
        >
          추가
        </button>
      </div>
    </form>
  );
}
