import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index";
import { todoModel } from "../db";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await todoModel.deleteMany({});
});

describe("Todo API Tests", () => {

  test("POST /todos - should create a todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Test Todo", status: false });

    expect(res.status).toBe(200);
    expect(res.body.todo.title).toBe("Test Todo");
  });

  test("GET /todos - should return all todos", async () => {
    await todoModel.create({ title: "Todo 1" });
    await todoModel.create({ title: "Todo 2" });

    const res = await request(app).get("/todos");

    expect(res.status).toBe(200);
    expect(res.body.todos.length).toBe(2);
  });

  test("PUT /todos/:id - should update a todo", async () => {
    const todo = await todoModel.create({ title: "Old Title" });

    const res = await request(app)
      .put(`/todos/${todo._id}`)
      .send({ title: "New Title" });

    expect(res.status).toBe(200);
    expect(res.body.todo.title).toBe("New Title");
  });

  test("DELETE /todos/delete/:id - should delete a todo", async () => {
    const todo = await todoModel.create({ title: "Delete Me" });

    const res = await request(app).delete(`/todos/delete/${todo._id}`);

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Todo deleted successfully");
  });

});
