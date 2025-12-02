import { API_BASE_URL } from './api';

// Todo 순서 변경
export async function reorderTodos(todos: { id: number; order_index: number }[]) {
  const response = await fetch(`${API_BASE_URL}/todos/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todos }),
  });
  if (!response.ok) throw new Error('Failed to reorder todos');
  return response.json();
}

// Subtask 순서 변경
export async function reorderSubtasks(todoId: number, subtasks: { id: number; order_index: number }[]) {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subtasks }),
  });
  if (!response.ok) throw new Error('Failed to reorder subtasks');
  return response.json();
}
