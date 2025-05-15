"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const whitelist = [
    "http://localhost:3000",
    "https://www.luckylevel.io",
    "https://luckylevel.io"
];
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)({ origin: whitelist }));
        this.middlewares();
        this.router();
    }
    middlewares() {
        this.app.use(express_1.default.json());
    }
    router() {
        this.app.use(router_1.default);
    }
}
exports.default = new App().app;
