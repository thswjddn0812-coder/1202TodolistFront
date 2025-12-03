import { useState } from 'react';
import { Todo } from '@/types/todo';

interface TodoModalProps {
  todo: Todo;
  onClose: () => void;
  onAddSubtask: (todoId: number, text: string) => void;
  onToggleSubtask: (todoId: number, subtaskId: number, completed: boolean) => void;
  onDeleteSubtask: (todoId: number, subtaskId: number) => void;
}

export default function TodoModal({ todo, onClose, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TodoModalProps) {
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    onAddSubtask(todo.id, newSubtaskText);
    setNewSubtaskText('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div 
            className="bg-[var(--card-bg)] border border-[var(--card-border)] w-full max-w-lg rounded-2xl shadow-[0_0_50px_var(--clock-shadow)] overflow-hidden flex flex-col max-h-[80vh]"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-start bg-white/5">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{todo.text}</h3>
                    <p className="text-sm text-[var(--accent-color)] uppercase tracking-widest">할 일 상세</p>
                </div>
                <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-6 overflow-y-auto">
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">세부 목표</h4>
                    <div className="space-y-2">
                        {todo.subtasks?.map((subtask) => (
                            <div key={subtask.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--card-border)] transition-colors group">
                                <button
                                    onClick={() => onToggleSubtask(todo.id, subtask.id, subtask.completed)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        subtask.completed
                                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]'
                                        : 'border-[var(--text-secondary)] hover:border-[var(--accent-color)]'
                                    }`}
                                >
                                    {subtask.completed && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <span className={`flex-1 text-sm ${subtask.completed ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'}`}>
                                    {subtask.text}
                                </span>
                                <button
                                    onClick={() => onDeleteSubtask(todo.id, subtask.id)}
                                    className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {(!todo.subtasks || todo.subtasks.length === 0) && (
                            <p className="text-[var(--text-secondary)] text-sm italic">하위 목표가 없습니다.</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        placeholder="하위 목표 추가..."
                        className="flex-1 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newSubtaskText.trim()}
                        className="bg-[var(--accent-color)] hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        추가
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}
