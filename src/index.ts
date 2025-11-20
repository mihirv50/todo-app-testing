import express from "express";
import { todoModel } from "./db";

export const app = express();

app.use(express.json());

app.post("/todos", async (req, res) => {
  const { title, status } = req.body;
  if (!title) {
    res.status(422).json({
      msg: "No entries added",
    });
    return;
  }
  const todo = await todoModel.create({
    title,
    status,
  });
  res.status(200).json({
    todo,
  });
});

app.get("/todos", async (req, res) => {
  const todos = await todoModel.find();
  res.json({
    todos,
  });
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  try {
    const todo = await todoModel.findByIdAndUpdate(
      id,
      { title, status },
      { new: true }
    );
    res.json({
      todo,
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/todos/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await todoModel.findByIdAndDelete(id);
    res.json({ msg: "Todo deleted successfully", todo });
  } catch (error) {
    console.log(error);
  }
});
