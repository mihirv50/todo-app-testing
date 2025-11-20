"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, status } = req.body;
    if (!title && !status) {
        res.status(422).json({
            msg: "No entries added"
        });
        return;
    }
    const todo = yield db_1.todoModel.create({
        title, status
    });
    res.status(200).json({
        todo
    });
}));
exports.app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const todo = yield db_1.todoModel.findOne({
        title
    });
    res.json({
        todo
    });
}));
exports.app.put("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const todo = yield db_1.todoModel.updateOne({});
}));
