import React, { useState, useEffect } from "react";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types/Todo";
import { todoApi } from "../services/api";
import "./TodoList.css";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<CreateTodoRequest>({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<UpdateTodoRequest>({});

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const todosData = await todoApi.getTodos();
      setTodos(todosData);
      setError(null);
    } catch (err) {
      setError("Failed to load todos");
      console.error("Error loading todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const createdTodo = await todoApi.createTodo(newTodo);
      setTodos([createdTodo, ...todos]);
      setNewTodo({ title: "", description: "" });
      setError(null);
    } catch (err) {
      setError("Failed to create todo");
      console.error("Error creating todo:", err);
    }
  };

  const handleUpdateTodo = async (id: string) => {
    if (!editingTodo.title?.trim() && editingTodo.completed === undefined)
      return;

    try {
      const updatedTodo = await todoApi.updateTodo(id, editingTodo);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditingTodo({});
      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = await todoApi.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTodo({ title: todo.title, description: todo.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTodo({});
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-list">
      <h2>Todo List</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleCreateTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Todo title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description (optional)"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
          />
        </div>
        <button type="submit">Add Todo</button>
      </form>

      <div className="todos">
        {todos.length === 0 ? (
          <p className="no-todos">No todos yet. Create your first one!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              {editingId === todo.id ? (
                <div className="todo-edit">
                  <input
                    type="text"
                    value={editingTodo.title || ""}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                  />
                  <textarea
                    value={editingTodo.description || ""}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        description: e.target.value,
                      })
                    }
                  />
                  <div className="todo-actions">
                    <button onClick={() => handleUpdateTodo(todo.id)}>
                      Save
                    </button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="todo-content">
                  <div className="todo-header">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo)}
                    />
                    <h3>{todo.title}</h3>
                  </div>
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                  <div className="todo-meta">
                    <small>
                      Created: {new Date(todo.createdAt).toLocaleDateString()}
                    </small>
                    {todo.updatedAt !== todo.createdAt && (
                      <small>
                        Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => startEditing(todo)}>Edit</button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
