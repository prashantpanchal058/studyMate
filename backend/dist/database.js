"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/studyFinder";
const connectToMongo = async () => {
    await mongoose_1.default.connect(mongoURI)
        .then(() => console.log("database is connected."));
};
exports.default = connectToMongo;
