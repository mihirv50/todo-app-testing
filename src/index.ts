import express from "express";
import { todoModel } from "./db";
import mongoose from "mongoose";

export const app = express();

app.use(express.json());

app.post("/todos", async (req, res) => {
  const { title, status } = req.body;
  if (!title) {
    res.status(422).json({
      msg: "Title is required",
    });
    return;
  }
  
  try {
    const todo = await todoModel.create({
      title,
      status,
    });
    res.status(201).json({
      todo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error creating todo" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json({
      todos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching todos" });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "Invalid todo ID" });
    return;
  }
  
  try {
    const todo = await todoModel.findByIdAndUpdate(
      id,
      { title, status },
      { new: true }
    );
    
    if (!todo) {
      res.status(404).json({ msg: "Todo not found" });
      return;
    }
    
    res.json({
      todo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error updating todo" });
  }
});

app.delete("/todos/delete/:id", async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "Invalid todo ID" });
    return;
  }
  
  try {
    const todo = await todoModel.findByIdAndDelete(id);
    
    if (!todo) {
      res.status(404).json({ msg: "Todo not found" });
      return;
    }
    
    res.json({ msg: "Todo deleted successfully", todo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error deleting todo" });
  }
});