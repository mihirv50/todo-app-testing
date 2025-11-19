import { app } from "../index";
import request from "supertest";

describe("Test the get todo ep", () => {
  it("should create a todo", async () => {
    const res = await request(app).post("/todos").send({
      title: "Go to the gym",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.todo.title).toBe("Go to the gym");
  });
  it("should return all todos", async () => {
    await request(app).post("/todos").send({ title: "Task1" });
    await request(app).post("/todos").send({ title: "Task2" });

    const res = await request(app).get("/todos");

    expect(res.statusCode).toBe(200);
    expect(res.body.todos.length).toBe(3);
  });

  it("should update a todo", async () => {
    const create = await request(app)
      .post("/todos")
      .send({ title: "Update me" });
    const id = create.body.todo.id;

    const res = await request(app)
      .put(`/todos/${id}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.todo.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    const create = await request(app)
      .post("/todos")
      .send({ title: "Delete me" });
    const id = create.body.todo.id;

    const res = await request(app).delete(`/todos/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });
});
