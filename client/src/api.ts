import axios from 'axios';

export interface Todo {
  id: number;
  name: string;
  shortDescription: string;
  dateTime: string;
  isDone: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoCreate {
  name: string;
  shortDescription: string;
  dateTime: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  tags?: string[];
}

export interface TodoUpdate {
  name?: string;
  shortDescription?: string;
  dateTime?: string;
  isDone?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  tags?: string[];
}

export interface TodoFilter {
  filter?: 'all' | 'done' | 'upcoming';
  search?: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

const API_URL = 'http://localhost:4000/api/todos';

export const getTodos = (filters?: TodoFilter) => 
  axios.get<Todo[]>(API_URL, { params: filters });

export const addTodo = (data: TodoCreate) => 
  axios.post<Todo>(API_URL, data);

export const updateTodo = (id: number, data: TodoUpdate) => 
  axios.put<Todo>(`${API_URL}/${id}`, data);

export const deleteTodo = (id: number) => 
  axios.delete<{ success: boolean }>(`${API_URL}/${id}`);

export const getCategories = () => 
  axios.get<string[]>('http://localhost:4000/api/categories'); 