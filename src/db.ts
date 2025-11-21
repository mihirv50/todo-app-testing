import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv"
import { boolean } from "zod";
dotenv.config();

// mongoose.connect(process.env.MONGO_URI!)

const todoSchema = new Schema({
  title: {type:String, required:true},
  status: { type: Boolean, default: false },
});

export const todoModel = mongoose.model("todo",todoSchema)