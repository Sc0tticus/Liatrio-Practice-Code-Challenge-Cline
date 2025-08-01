import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";
import { Todo } from "../models/Todo";

class Database {
  private db: sqlite3.Database | null = null;

  async initialize(): Promise<void> {
    const dbPath = path.join(process.cwd(), "todos.db");

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.createTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const run = promisify(this.db.run.bind(this.db));

    await run(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getAllTodos(): Promise<Todo[]> {
    if (!this.db) throw new Error("Database not initialized");

    const all = promisify(this.db.all.bind(this.db));

    const rows = (await all(
      "SELECT * FROM todos ORDER BY created_at DESC"
    )) as any[];

    return rows.map(this.rowToTodo);
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!this.db) throw new Error("Database not initialized");

    const get = promisify(this.db.get.bind(this.db));

    const row = (await get("SELECT * FROM todos WHERE id = ?", [id])) as any;

    return row ? this.rowToTodo(row) : null;
  }

  async createTodo(todo: Omit<Todo, "createdAt" | "updatedAt">): Promise<Todo> {
    if (!this.db) throw new Error("Database not initialized");

    const run = promisify(this.db.run.bind(this.db));
    const now = new Date();

    await run(
      "INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        todo.id,
        todo.title,
        todo.description || null,
        todo.completed ? 1 : 0,
        now.toISOString(),
        now.toISOString(),
      ]
    );

    const createdTodo = await this.getTodoById(todo.id);
    if (!createdTodo) {
      throw new Error("Failed to create todo");
    }

    return createdTodo;
  }

  async updateTodo(
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>
  ): Promise<Todo | null> {
    if (!this.db) throw new Error("Database not initialized");

    const run = promisify(this.db.run.bind(this.db));
    const now = new Date();

    const setParts: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      setParts.push("title = ?");
      values.push(updates.title);
    }

    if (updates.description !== undefined) {
      setParts.push("description = ?");
      values.push(updates.description);
    }

    if (updates.completed !== undefined) {
      setParts.push("completed = ?");
      values.push(updates.completed ? 1 : 0);
    }

    setParts.push("updated_at = ?");
    values.push(now.toISOString());
    values.push(id);

    const result = await run(
      `UPDATE todos SET ${setParts.join(", ")} WHERE id = ?`,
      values
    );

    if (result.changes === 0) {
      return null;
    }

    return this.getTodoById(id);
  }

  async deleteTodo(id: string): Promise<boolean> {
    if (!this.db) throw new Error("Database not initialized");

    const run = promisify(this.db.run.bind(this.db));

    const result = await run("DELETE FROM todos WHERE id = ?", [id]);

    return result.changes > 0;
  }

  private rowToTodo(row: any): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      completed: Boolean(row.completed),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async close(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        this.db = null;
        resolve();
      });
    });
  }
}

const database = new Database();

export const initializeDatabase = (): Promise<void> => database.initialize();
export const getAllTodos = (): Promise<Todo[]> => database.getAllTodos();
export const getTodoById = (id: string): Promise<Todo | null> =>
  database.getTodoById(id);
export const createTodo = (
  todo: Omit<Todo, "createdAt" | "updatedAt">
): Promise<Todo> => database.createTodo(todo);
export const updateTodo = (
  id: string,
  updates: Partial<Omit<Todo, "id" | "createdAt">>
): Promise<Todo | null> => database.updateTodo(id, updates);
export const deleteTodo = (id: string): Promise<boolean> =>
  database.deleteTodo(id);
export const closeDatabase = (): Promise<void> => database.close();
