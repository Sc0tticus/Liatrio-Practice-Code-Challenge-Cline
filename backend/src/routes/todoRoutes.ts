import { Router } from "express";
import {
  getTodos,
  getTodo,
  createNewTodo,
  updateExistingTodo,
  deleteExistingTodo,
} from "../controllers/todoController";

const router = Router();

// GET /api/todos - Get all todos
router.get("/", getTodos);

// GET /api/todos/:id - Get a specific todo
router.get("/:id", getTodo);

// POST /api/todos - Create a new todo
router.post("/", createNewTodo);

// PUT /api/todos/:id - Update a todo
router.put("/:id", updateExistingTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete("/:id", deleteExistingTodo);

export { router as todoRoutes };
