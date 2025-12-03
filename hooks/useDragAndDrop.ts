import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Todo } from '@/types/todo';
import { reorderTodos } from '@/utils/reorder';

export function useDragAndDrop(
  todos: Todo[],
  setTodos: (todos: Todo[]) => void
) {
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

  return { handleDragEnd };
}
