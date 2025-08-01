import request from "supertest";
import { app } from "../server";

describe("Todo API", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  describe("GET /api/todos", () => {
    it("should return all todos", async () => {
      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("count");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        title: "Test Todo",
        description: "This is a test todo",
      };

      const response = await request(app).post("/api/todos").send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("title", newTodo.title);
      expect(response.body.data).toHaveProperty(
        "description",
        newTodo.description
      );
      expect(response.body.data).toHaveProperty("completed", false);
    });

    it("should return error for missing title", async () => {
      const response = await request(app).post("/api/todos").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should return 404 for non-existent todo", async () => {
      const response = await request(app)
        .put("/api/todos/non-existent-id")
        .send({ title: "Updated Title" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should return 404 for non-existent todo", async () => {
      const response = await request(app).delete("/api/todos/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});
