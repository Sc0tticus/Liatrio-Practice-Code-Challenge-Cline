import axios from "axios";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../types/Todo";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const todoApi = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    const response = await api.get<ApiResponse<Todo[]>>("/todos");
    return response.data.data;
  },

  // Get a specific todo
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data.data;
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post<ApiResponse<Todo>>("/todos", todo);
    return response.data.data;
  },

  // Update a todo
  updateTodo: async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, updates);
    return response.data.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export const healthApi = {
  // Check API health
  checkHealth: async (): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
