import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../database/database";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  todoToResponse,
} from "../models/Todo";
import { AppError, asyncHandler } from "../middleware/errorHandler";

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  const todos = await getAllTodos();
  const todoResponses = todos.map(todoToResponse);

  res.status(200).json({
    success: true,
    data: todoResponses,
    count: todoResponses.length,
  });
});

export const getTodo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Todo ID is required", 400);
  }

  const todo = await getTodoById(id);

  if (!todo) {
    throw new AppError("Todo not found", 404);
  }

  res.status(200).json({
    success: true,
    data: todoToResponse(todo),
  });
});

export const createNewTodo = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description }: CreateTodoRequest = req.body;

    if (!title || title.trim().length === 0) {
      throw new AppError("Title is required", 400);
    }

    if (title.length > 200) {
      throw new AppError("Title must be less than 200 characters", 400);
    }

    if (description && description.length > 1000) {
      throw new AppError("Description must be less than 1000 characters", 400);
    }

    const todoData: Omit<Todo, "createdAt" | "updatedAt"> = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
    };

    if (description?.trim()) {
      todoData.description = description.trim();
    }

    const newTodo = await createTodo(todoData);

    res.status(201).json({
      success: true,
      data: todoToResponse(newTodo),
    });
  }
);

export const updateExistingTodo = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates: UpdateTodoRequest = req.body;

    if (!id) {
      throw new AppError("Todo ID is required", 400);
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError("At least one field must be provided for update", 400);
    }

    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new AppError("Title cannot be empty", 400);
      }
      if (updates.title.length > 200) {
        throw new AppError("Title must be less than 200 characters", 400);
      }
      updates.title = updates.title.trim();
    }

    if (
      updates.description !== undefined &&
      updates.description.length > 1000
    ) {
      throw new AppError("Description must be less than 1000 characters", 400);
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    const updatedTodo = await updateTodo(id, updates);

    if (!updatedTodo) {
      throw new AppError("Todo not found", 404);
    }

    res.status(200).json({
      success: true,
      data: todoToResponse(updatedTodo),
    });
  }
);

export const deleteExistingTodo = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Todo ID is required", 400);
    }

    const deleted = await deleteTodo(id);

    if (!deleted) {
      throw new AppError("Todo not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  }
);
