"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "prashant";
const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token." });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token." });
    }
};
exports.default = fetchUser;
