"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const group_1 = __importDefault(require("./routes/group"));
const groupstatus_1 = __importDefault(require("./routes/groupstatus"));
const database_1 = __importDefault(require("./database"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8007;
const _dirname = path_1.default.resolve();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", auth_1.default);
app.use("/group", group_1.default);
app.use("/status", groupstatus_1.default);
app.use(express_1.default.static(path_1.default.join(_dirname, "/frontend/dist")));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path_1.default.join(_dirname, "frontend", "dist", "index.html"));
});
// Create HTTP server manually (important for TS + Socket.io)
const server = http_1.default.createServer(app);
// Initialize Socket.io in TS way
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: [process.env.FRONTEND_URL || "https://studymate-p7sk.onrender.com"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
io.on("connection", (socket) => {
    socket.on("room:join", (data) => {
        const { userId, friendId } = data;
        const roomId = [userId, friendId].sort().join("_");
        socket.join(roomId);
        // Notify other users in room that someone joined
        socket.to(roomId).emit("user:joined", {
            id: socket.id,
            roomId
        });
        socket.emit("room:join", { id: socket.id });
    });
    socket.on('user:call', ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });
    socket.on('call:accepted', ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
    socket.on('peer:nego:needed', ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });
    socket.on('peer:nego:done', ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
});
// Start serverc
const startServer = async () => {
    try {
        await (0, database_1.default)();
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (err) {
        console.error("Mongo connection failed:", err);
    }
};
startServer();
