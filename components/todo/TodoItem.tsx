import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onAddSubtask: (todoId: number, text: string) => void;
  onToggleSubtask: (todoId: number, subtaskId: number, completed: boolean) => void;
  onDeleteSubtask: (todoId: number, subtaskId: number) => void;
}

export default function TodoItem({ 
  todo, 
  onToggle, 
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask
}: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    onAddSubtask(todo.id, newSubtaskText);
    setNewSubtaskText('');
  };

  return (
    <div
        ref={setNodeRef}
        style={style}
        className={`group relative rounded-xl border transition-all duration-300 overflow-hidden
            ${todo.completed 
                ? 'bg-green-900/10 border-green-500/30' 
                : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:bg-[var(--card-bg)]'
            }
        `}
    >
        <div className="p-4">
            <div className="flex items-center gap-4 relative z-10">
                {/* Drag Handle */}
                <div 
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(todo.id, todo.completed);
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${todo.completed
                            ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                            : 'border-[var(--text-secondary)] group-hover:border-[var(--accent-color)]'
                        }
                    `}
                >
                    {todo.completed && (
                        <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                
                <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <p className={`truncate transition-colors ${todo.completed ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'}`}>
                        {todo.text}
                    </p>
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 w-20 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--accent-color)]" 
                                    style={{ width: `${(todo.subtasks.filter(s => s.completed).length / todo.subtasks.length) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-[var(--text-secondary)]">
                                {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all"
                >
                    <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(todo.id);
                    }}
                    className="text-[var(--text-secondary)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Expandable Subtasks Section */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-4 pb-4 pt-2 border-t border-[var(--card-border)]">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">세부 목표</h4>
                
                {/* Subtasks List */}
                <div className="space-y-2 mb-3">
                    {todo.subtasks?.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--input-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors group/subtask">
                            <button
                                onClick={() => onToggleSubtask(todo.id, subtask.id, subtask.completed)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                    ${subtask.completed
                                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]'
                                        : 'border-[var(--text-secondary)]'
                                    }
                                `}
                            >
                                {subtask.completed && (
                                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                            <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                                {subtask.text}
                            </span>
                            <button
                                onClick={() => onDeleteSubtask(todo.id, subtask.id)}
                                className="text-[var(--text-secondary)] hover:text-red-400 transition-colors opacity-0 group-hover/subtask:opacity-100"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Subtask Form */}
                <form onSubmit={handleAddSubtask} className="flex gap-2">
                    <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        placeholder="새 세부 목표 추가..."
                        className="flex-1 bg-[var(--input-bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-3 py-2 rounded-lg border border-[var(--card-border)] outline-none focus:border-[var(--accent-color)] text-sm"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-80 transition-opacity text-sm font-bold"
                    >
                        추가
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}
