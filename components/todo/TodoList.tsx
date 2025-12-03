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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TodoItem from '@/components/todo/TodoItem';
import { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onSelect: (todo: Todo) => void;
}

export default function TodoList({ 
  todos, 
  isLoading, 
  onDragEnd, 
  onToggle, 
  onDelete, 
  onSelect 
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
      {isLoading ? (
        <div className="text-center text-gray-500 py-10 animate-pulse">섹터 스캔 중...</div>
      ) : todos.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <p>이번 주기에 감지된 할 일이 없습니다.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={todos.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map((todo) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onClick={onSelect} 
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
