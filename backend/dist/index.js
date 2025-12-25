"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./database"));
const auth_1 = __importDefault(require("./routes/auth"));
const group_1 = __importDefault(require("./routes/group"));
const groupstatus_1 = __importDefault(require("./routes/groupstatus"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8007;
/* ------------------- MIDDLEWARE ------------------- */
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
/* ------------------- ROUTES ------------------- */
app.use("/", auth_1.default);
app.use("/group", group_1.default);
app.use("/status", groupstatus_1.default);
/* ------------------- STATIC FRONTEND ------------------- */
const __dirnameResolved = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(__dirnameResolved, "frontend", "dist")));
app.get(/^\/(?!socket\.io).*/, (_, res) => {
    res.sendFile(path_1.default.join(__dirnameResolved, "frontend", "dist", "index.html"));
});
/* ------------------- HTTP + SOCKET ------------------- */
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling", "websocket"], // ✅ DO NOT force websocket only
});
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("room:join", ({ userId, friendId }) => {
        const roomId = [userId, friendId].sort().join("_");
        socket.join(roomId);
        socket.to(roomId).emit("user:joined", {
            id: socket.id,
            roomId,
        });
        socket.emit("room:joined", {
            id: socket.id,
            roomId,
        });
    });
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", {
            from: socket.id,
            offer,
        });
    });
    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", {
            from: socket.id,
            ans,
        });
    });
    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", {
            from: socket.id,
            offer,
        });
    });
    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", {
            from: socket.id,
            ans,
        });
    });
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});
/* ------------------- START SERVER ------------------- */
(async () => {
    try {
        await (0, database_1.default)();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup error:", err);
    }
})();
