export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
  order_index: number;
}

export interface Todo {
  id: number;
  text: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  order_index: number;
  subtasks?: Subtask[];
}
