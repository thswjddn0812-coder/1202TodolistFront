import { useState, useEffect, useCallback } from 'react';
import { Todo, Subtask } from '@/types/todo';
import { getTodos, createTodo, updateTodo, deleteTodo, createSubtask, updateSubtask, deleteSubtask } from '@/utils/api';

export function useTodos(date: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTodos(date);
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text: string) => {
    try {
      const newTodo = await createTodo(text, date);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    // 낙관적 업데이트 - 즉시 UI 변경
    const optimisticUpdate = (prev: Todo[]) => 
      prev.map((t) => t.id === id ? { ...t, completed: !completed } : t);
    
    setTodos(optimisticUpdate);

    try {
      const updatedTodo = await updateTodo(id, !completed);
      // 서버 응답으로 최종 업데이트
      setTodos(prev => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
      // 실패 시 롤백
      setTodos(prev => prev.map((t) => t.id === id ? { ...t, completed } : t));
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const addSubtask = async (todoId: number, text: string) => {
    try {
      const newSubtask = await createSubtask(todoId, text);
      const updatedTodo = todos.find(t => t.id === todoId);
      if (updatedTodo) {
          const newTodo = {
            ...updatedTodo,
            subtasks: [...(updatedTodo.subtasks || []), newSubtask]
          };
          setTodos(prev => prev.map(t => t.id === todoId ? newTodo : t));
      }
    } catch (error) {
      console.error('Error creating subtask:', error);
    }
  };

  const toggleSubtask = async (todoId: number, subtaskId: number, completed: boolean) => {
    // 낙관적 업데이트 - 즉시 UI 변경
    const optimisticUpdate = (prev: Todo[]) => 
      prev.map(t => {
        if (t.id !== todoId) return t;
        
        const updatedSubtasks = t.subtasks?.map(s => 
          s.id === subtaskId ? { ...s, completed: !completed } : s
        );
        
        // 모든 서브태스크가 완료되었는지 확인
        const allSubtasksCompleted = updatedSubtasks?.every(s => s.completed) ?? false;
        const hasSubtasks = (updatedSubtasks?.length ?? 0) > 0;
        
        return {
          ...t,
          subtasks: updatedSubtasks,
          // 서브태스크가 있고 모두 완료되면 Todo도 완료
          completed: hasSubtasks && allSubtasksCompleted ? true : t.completed
        };
      });
    
    setTodos(optimisticUpdate);

    try {
      const updatedSubtask = await updateSubtask(todoId, subtaskId, { completed: !completed });
      const updatedTodo = todos.find(t => t.id === todoId);
      if (updatedTodo) {
          const newSubtasks = updatedTodo.subtasks?.map(s => s.id === subtaskId ? updatedSubtask : s);
          const allSubtasksCompleted = newSubtasks?.every(s => s.completed) ?? false;
          const hasSubtasks = (newSubtasks?.length ?? 0) > 0;
          
          let newTodo = {
            ...updatedTodo,
            subtasks: newSubtasks
          };

          // 모든 서브태스크가 완료되면 Todo도 완료 처리
          if (hasSubtasks && allSubtasksCompleted && !newTodo.completed) {
            const completedTodo = await updateTodo(todoId, true);
            newTodo = { ...completedTodo, subtasks: newSubtasks };
          }
          
          setTodos(prev => prev.map(t => t.id === todoId ? newTodo : t));
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      // 실패 시 롤백
      setTodos(prev => prev.map(t => t.id === todoId ? {
        ...t,
        subtasks: t.subtasks?.map((s: Subtask) => s.id === subtaskId ? { ...s, completed } : s)
      } : t));
    }
  };

  const removeSubtask = async (todoId: number, subtaskId: number) => {
    try {
      await deleteSubtask(todoId, subtaskId);
      const updatedTodo = todos.find(t => t.id === todoId);
      if (updatedTodo) {
          const newTodo = {
            ...updatedTodo,
            subtasks: updatedTodo.subtasks?.filter(s => s.id !== subtaskId)
          };
          setTodos(prev => prev.map(t => t.id === todoId ? newTodo : t));
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  return {
    todos,
    isLoading,
    setTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    addSubtask,
    toggleSubtask,
    removeSubtask
  };
}
