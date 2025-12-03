import { useState, useEffect, useCallback } from 'react';
import { Todo, Subtask } from '@/types/todo';
import { getTodos, createTodo, updateTodo, deleteTodo, createSubtask, updateSubtask, deleteSubtask } from '@/utils/api';

export function useTodos(date: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTodos(date);
      setTodos(data);
      if (selectedTodo) {
        // Refresh selected todo if it exists in the new list
        const updatedSelected = data.find(t => t.id === selectedTodo.id);
        // If not found (e.g. date changed), we might want to keep it or clear it.
        // For now, if we are just refreshing data for the same date, it should be there.
        // If date changed, this runs.
        if (updatedSelected) {
            setSelectedTodo(updatedSelected);
        }
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date, selectedTodo?.id]); // Depend on selectedTodo.id to know which one to refresh

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
    if (selectedTodo?.id === id) {
      setSelectedTodo(prev => prev ? { ...prev, completed: !completed } : null);
    }

    try {
      const updatedTodo = await updateTodo(id, !completed);
      // 서버 응답으로 최종 업데이트
      setTodos(prev => prev.map((t) => (t.id === id ? updatedTodo : t)));
      if (selectedTodo?.id === id) setSelectedTodo(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      // 실패 시 롤백
      setTodos(prev => prev.map((t) => t.id === id ? { ...t, completed } : t));
      if (selectedTodo?.id === id) {
        setSelectedTodo(prev => prev ? { ...prev, completed } : null);
      }
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter((t) => t.id !== id));
      if (selectedTodo?.id === id) setSelectedTodo(null);
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
          if (selectedTodo?.id === todoId) setSelectedTodo(newTodo);
      }
    } catch (error) {
      console.error('Error creating subtask:', error);
    }
  };

  const toggleSubtask = async (todoId: number, subtaskId: number, completed: boolean) => {
    // 낙관적 업데이트 - 즉시 UI 변경
    const optimisticUpdate = (prev: Todo[]) => 
      prev.map(t => t.id === todoId ? {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === subtaskId ? { ...s, completed: !completed } : s)
      } : t);
    
    setTodos(optimisticUpdate);
    if (selectedTodo?.id === todoId) {
      setSelectedTodo(prev => prev ? {
        ...prev,
        subtasks: prev.subtasks?.map(s => s.id === subtaskId ? { ...s, completed: !completed } : s)
      } : null);
    }

    try {
      const updatedSubtask = await updateSubtask(todoId, subtaskId, { completed: !completed });
      const updatedTodo = todos.find(t => t.id === todoId);
      if (updatedTodo) {
          const newTodo = {
            ...updatedTodo,
            subtasks: updatedTodo.subtasks?.map(s => s.id === subtaskId ? updatedSubtask : s)
          };
          setTodos(prev => prev.map(t => t.id === todoId ? newTodo : t));
          if (selectedTodo?.id === todoId) setSelectedTodo(newTodo);
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      // 실패 시 롤백
      setTodos(prev => prev.map(t => t.id === todoId ? {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === subtaskId ? { ...s, completed } : s)
      } : t));
      if (selectedTodo?.id === todoId) {
        setSelectedTodo(prev => prev ? {
          ...prev,
          subtasks: prev.subtasks?.map(s => s.id === subtaskId ? { ...s, completed } : s)
        } : null);
      }
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
          if (selectedTodo?.id === todoId) setSelectedTodo(newTodo);
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  return {
    todos,
    selectedTodo,
    isLoading,
    setSelectedTodo,
    setTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    addSubtask,
    toggleSubtask,
    removeSubtask
  };
}
