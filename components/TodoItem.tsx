import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onClick: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onClick }: TodoItemProps) {
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

  return (
    <div
        ref={setNodeRef}
        style={style}
        className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden
            ${todo.completed 
                ? 'bg-green-900/10 border-green-500/30' 
                : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:bg-[var(--card-bg)]'
            }
        `}
    >
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
                onClick={() => onClick(todo)}
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
  );
}
