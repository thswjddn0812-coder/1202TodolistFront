import { Todo, Subtask } from '../types/todo';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// 공통 fetch 유틸리티 - 에러 처리 자동화
async function fetchClient<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  // DELETE 요청은 body가 없을 수 있음
  if (response.status === 204 || options.method === 'DELETE') {
    return undefined as T;
  }

  return response.json();
}

// ===== Todo API =====
export const getTodos = async (date?: string): Promise<Todo[]> => {
  const endpoint = date ? `/todos?date=${date}` : '/todos';
  return fetchClient<Todo[]>(endpoint);
};

export const createTodo = async (text: string, date?: string): Promise<Todo> => {
  return fetchClient<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ text, date }),
  });
};

export const updateTodo = async (id: number, completed: boolean): Promise<Todo> => {
  return fetchClient<Todo>(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
};

export const deleteTodo = async (id: number): Promise<void> => {
  return fetchClient<void>(`/todos/${id}`, {
    method: 'DELETE',
  });
};

// ===== Subtask API =====
export const createSubtask = async (todoId: number, text: string): Promise<Subtask> => {
  return fetchClient<Subtask>(`/todos/${todoId}/subtasks`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

export const updateSubtask = async (
  todoId: number, 
  subtaskId: number, 
  updates: { completed?: boolean; text?: string }
): Promise<Subtask> => {
  return fetchClient<Subtask>(`/todos/${todoId}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteSubtask = async (todoId: number, subtaskId: number): Promise<void> => {
  return fetchClient<void>(`/todos/${todoId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
};
