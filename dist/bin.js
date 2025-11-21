"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conn_1 = __importDefault(require("./conn"));
const index_1 = require("./index");
(0, conn_1.default)().then(() => {
    try {
        index_1.app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }
    catch (error) {
        console.log(error);
    }
}).catch((err) => {
    console.log("Invalid connection");
});
