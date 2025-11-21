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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
const db_1 = require("../db");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URI);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.dropDatabase();
    yield mongoose_1.default.connection.close();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.todoModel.deleteMany({});
}));
describe("Todo API Tests", () => {
    test("POST /todos - should create a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/todos")
            .send({ title: "Test Todo", status: false });
        expect(res.status).toBe(200);
        expect(res.body.todo.title).toBe("Test Todo");
    }));
    test("GET /todos - should return all todos", () => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.todoModel.create({ title: "Todo 1" });
        yield db_1.todoModel.create({ title: "Todo 2" });
        const res = yield (0, supertest_1.default)(index_1.app).get("/todos");
        expect(res.status).toBe(200);
        expect(res.body.todos.length).toBe(2);
    }));
    test("PUT /todos/:id - should update a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = yield db_1.todoModel.create({ title: "Old Title" });
        const res = yield (0, supertest_1.default)(index_1.app)
            .put(`/todos/${todo._id}`)
            .send({ title: "New Title" });
        expect(res.status).toBe(200);
        expect(res.body.todo.title).toBe("New Title");
    }));
    test("DELETE /todos/delete/:id - should delete a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = yield db_1.todoModel.create({ title: "Delete Me" });
        const res = yield (0, supertest_1.default)(index_1.app).delete(`/todos/delete/${todo._id}`);
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("Todo deleted successfully");
    }));
});
