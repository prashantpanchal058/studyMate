"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = "mongodb+srv://prashantpanchal058_db_user:pWKSsslkwtew2XVL@cluster0.vzkusa2.mongodb.net/?appName=Cluster0/studymate";
const connectToMongo = async () => {
    await mongoose_1.default.connect(mongoURI)
        .then(() => console.log("database is connected."));
};
exports.default = connectToMongo;
