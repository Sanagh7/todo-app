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

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You could add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to a network issue and we haven't retried yet
    if (error.message.includes('Network Error') && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait a moment before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retry the request
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export const getTodos = (filters?: TodoFilter) => {
  console.log("API getTodos called with filters:", filters);
  // Don't send undefined or empty filter values to avoid confusing the server
  const cleanFilters: Record<string, any> = { ...filters };
  
  // Remove undefined or null values
  Object.keys(cleanFilters).forEach(key => {
    if (cleanFilters[key] === undefined || cleanFilters[key] === null) {
      delete cleanFilters[key];
    }
  });
  
  return api.get<Todo[]>('/todos', { params: cleanFilters });
};

export const addTodo = (data: TodoCreate) => 
  api.post<Todo>('/todos', data);

export const updateTodo = (id: number, data: TodoUpdate) => 
  api.put<Todo>(`/todos/${id}`, data);

export const deleteTodo = (id: number) => 
  api.delete<{ success: boolean }>(`/todos/${id}`);

export const getCategories = () => 
  api.get<string[]>('/categories'); 