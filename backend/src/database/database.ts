import sqlite3 from "sqlite3";
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

    return new Promise((resolve, reject) => {
      this.db!.run(
        `
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          completed INTEGER NOT NULL DEFAULT 0,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async getAllTodos(): Promise<Todo[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.all(
        "SELECT * FROM todos ORDER BY created_at DESC",
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows.map(this.rowToTodo));
        }
      );
    });
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row ? this.rowToTodo(row) : null);
      });
    });
  }

  async createTodo(todo: Omit<Todo, "createdAt" | "updatedAt">): Promise<Todo> {
    if (!this.db) throw new Error("Database not initialized");

    const now = new Date();

    return new Promise((resolve, reject) => {
      this.db!.run(
        "INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          todo.id,
          todo.title,
          todo.description || null,
          todo.completed ? 1 : 0,
          now.toISOString(),
          now.toISOString(),
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          // Get the created todo
          database
            .getTodoById(todo.id)
            .then((createdTodo) => {
              if (!createdTodo) {
                reject(new Error("Failed to create todo"));
                return;
              }
              resolve(createdTodo);
            })
            .catch(reject);
        }
      );
    });
  }

  async updateTodo(
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>
  ): Promise<Todo | null> {
    if (!this.db) throw new Error("Database not initialized");

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

    return new Promise((resolve, reject) => {
      this.db!.run(
        `UPDATE todos SET ${setParts.join(", ")} WHERE id = ?`,
        values,
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          if (this.changes === 0) {
            resolve(null);
          } else {
            // Get the updated todo
            database.getTodoById(id).then(resolve).catch(reject);
          }
        }
      );
    });
  }

  async deleteTodo(id: string): Promise<boolean> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
          return;
        }
        // 'this' context contains the changes property
        resolve(this.changes > 0);
      });
    });
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
