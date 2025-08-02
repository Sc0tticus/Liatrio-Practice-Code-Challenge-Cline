import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "./TodoList";
import { todoApi } from "../services/api";

// Mock the API
jest.mock("../services/api", () => ({
  todoApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

const mockTodoApi = todoApi as jest.Mocked<typeof todoApi>;

describe("TodoList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders todo list with loading state", () => {
    mockTodoApi.getTodos.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TodoList />);

    expect(screen.getByText(/Loading todos.../i)).toBeInTheDocument();
  });

  test("renders empty todo list", async () => {
    mockTodoApi.getTodos.mockResolvedValue([]);

    render(<TodoList />);

    await waitFor(() => {
      expect(
        screen.getByText(/No todos yet. Create your first one!/i)
      ).toBeInTheDocument();
    });
  });

  test("renders todo list with items", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        description: "Test description 1",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Test Todo 2",
        description: "Test description 2",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockTodoApi.getTodos.mockResolvedValue(mockTodos);

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  test("creates a new todo", async () => {
    const newTodo = {
      id: "3",
      title: "New Todo",
      description: "New description",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTodoApi.getTodos.mockResolvedValue([]);
    mockTodoApi.createTodo.mockResolvedValue(newTodo);

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByPlaceholderText("Todo title");
    const descriptionInput = screen.getByPlaceholderText(
      "Description (optional)"
    );
    const submitButton = screen.getByText("Add Todo");

    fireEvent.change(titleInput, { target: { value: "New Todo" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New description" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockTodoApi.createTodo).toHaveBeenCalledWith({
        title: "New Todo",
        description: "New description",
      });
    });
  });

  test("handles API error gracefully", async () => {
    mockTodoApi.getTodos.mockRejectedValue(new Error("API Error"));

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load todos/i)).toBeInTheDocument();
    });
  });
});
