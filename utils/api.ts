import { Todo, Subtask } from '../types/todo';

export const API_BASE_URL = 'http://localhost:4000';

export const getTodos = async (date?: string): Promise<Todo[]> => {
  const url = date ? `${API_BASE_URL}/todos?date=${date}` : `${API_BASE_URL}/todos`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

export const createTodo = async (text: string, date?: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, date }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
};

export const updateTodo = async (id: number, completed: boolean): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const createSubtask = async (todoId: number, text: string): Promise<Subtask> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error('Failed to create subtask');
  }
  return response.json();
};

export const updateSubtask = async (todoId: number, subtaskId: number, updates: { completed?: boolean; text?: string }): Promise<Subtask> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update subtask');
  }
  return response.json();
};

export const deleteSubtask = async (todoId: number, subtaskId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete subtask');
  }
};
