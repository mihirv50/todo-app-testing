import express from "express";
import { json } from "zod";


export const app = express();
app.use(express.json());

let todos: { id: number; title: string; completed: boolean }[] = [];
let id = 1;

app.get("/todos",(req,res)=>{
    res.json({
        todos
    })
})

app.post("/todos",(req,res)=>{
    const {title} = req.body;
     if(!title){
        res.status(400).json({
            msg:"Invalid Data"
        })
        return
     }
     const todo = {
        id: id++,
        title:title,
        completed:false
     }
     todos.push(todo);
     
     res.status(200).json({
        todo
     })
})
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json({ todo });
});
app.delete("/todos/:id", (req, res) => {
  const idx = todos.findIndex((t) => t.id === Number(req.params.id));

  if (idx === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(idx, 1);

  res.json({ message: "Deleted" });
});