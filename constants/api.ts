export const API_ENDPOINTS = {
  TODOS: '/todos',
  TODO_BY_ID: (id: number) => `/todos/${id}`,
  SUBTASKS: (todoId: number) => `/todos/${todoId}/subtasks`,
  SUBTASK_BY_ID: (todoId: number, subtaskId: number) => `/todos/${todoId}/subtasks/${subtaskId}`,
  REORDER_TODOS: '/todos/reorder',
  REORDER_SUBTASKS: (todoId: number) => `/todos/${todoId}/subtasks/reorder`,
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;
