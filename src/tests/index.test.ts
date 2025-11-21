import request from "supertest";
import { app } from "../index";
import connectToDatabase, { disconnectDatabase, clearDatabase } from "../conn";
import { todoModel } from "../db";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectToDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe("Todo API Tests", () => {
  
  describe("POST /todos", () => {
    it("should create a new todo with title and status", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Test todo", status: false });

      expect(response.status).toBe(201);
      expect(response.body.todo).toHaveProperty("_id");
      expect(response.body.todo.title).toBe("Test todo");
      expect(response.body.todo.status).toBe(false);
    });

    it("should create a todo with default status when not provided", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Test todo" });

      expect(response.status).toBe(201);
      expect(response.body.todo.status).toBe(false); 
    });

    it("should return 422 when title is missing", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ status: false });

      expect(response.status).toBe(422);
      expect(response.body.msg).toBe("Title is required");
    });

    it("should return 422 when title is empty string", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "", status: false });

      expect(response.status).toBe(422);
      expect(response.body.msg).toBe("Title is required");
    });
  });

  describe("GET /todos", () => {
    it("should return all todos", async () => {

      await todoModel.create({ title: "Todo 1", status: false });
      await todoModel.create({ title: "Todo 2", status: true });

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body.todos).toHaveLength(2);
      expect(response.body.todos[0].title).toBe("Todo 1");
      expect(response.body.todos[1].title).toBe("Todo 2");
    });

    it("should return empty array when no todos exist", async () => {
      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body.todos).toHaveLength(0);
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update an existing todo", async () => {
      const todo = await todoModel.create({ title: "Original", status: false });

      const response = await request(app)
        .put(`/todos/${todo._id}`)
        .send({ title: "Updated", status: true });

      expect(response.status).toBe(200);
      expect(response.body.todo.title).toBe("Updated");
      expect(response.body.todo.status).toBe(true);
    });

    it("should update only title when status not provided", async () => {
      const todo = await todoModel.create({ title: "Original", status: false });

      const response = await request(app)
        .put(`/todos/${todo._id}`)
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body.todo.title).toBe("Updated Title");
    });

    it("should return 404 for non-existent todo", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/todos/${fakeId}`)
        .send({ title: "Updated", status: true });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Todo not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app)
        .put("/todos/invalid-id-123")
        .send({ title: "Updated" });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Invalid todo ID");
    });
  });

  describe("DELETE /todos/delete/:id", () => {
    it("should delete an existing todo", async () => {
      const todo = await todoModel.create({ title: "To delete", status: false });

      const response = await request(app)
        .delete(`/todos/delete/${todo._id}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe("Todo deleted successfully");
      expect(response.body.todo._id).toBe(todo._id.toString());

      // Verify it's actually deleted from database
      const deletedTodo = await todoModel.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });

    it("should return 404 for non-existent todo", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/todos/delete/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Todo not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app)
        .delete("/todos/delete/not-a-valid-id");

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Invalid todo ID");
    });
  });

  describe("Integration: Full CRUD Flow", () => {
    it("should complete a full todo lifecycle", async () => {
      // 1. Create a todo
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Integration test todo", status: false });
      
      expect(createResponse.status).toBe(201);
      const todoId = createResponse.body.todo._id;

      // 2. Get all todos
      const getAllResponse = await request(app).get("/todos");
      expect(getAllResponse.body.todos).toHaveLength(1);
      expect(getAllResponse.body.todos[0]._id).toBe(todoId);

      // 3. Update the todo
      const updateResponse = await request(app)
        .put(`/todos/${todoId}`)
        .send({ title: "Updated todo", status: true });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.todo.title).toBe("Updated todo");
      expect(updateResponse.body.todo.status).toBe(true);

      // 4. Delete the todo
      const deleteResponse = await request(app)
        .delete(`/todos/delete/${todoId}`);
      
      expect(deleteResponse.status).toBe(200);

      const finalGetResponse = await request(app).get("/todos");
      expect(finalGetResponse.body.todos).toHaveLength(0);
    });
  });
});