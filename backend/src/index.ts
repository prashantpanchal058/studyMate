import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";

import connectToMongo from "./database";
import router from "./routes/auth";
import router_group from "./routes/group";
import router_status from "./routes/groupstatus";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8007;

/* ------------------- MIDDLEWARE ------------------- */
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());

/* ------------------- ROUTES ------------------- */
app.use("/", router);
app.use("/group", router_group);
app.use("/status", router_status);

/* ------------------- STATIC FRONTEND ------------------- */
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, "frontend", "dist")));

app.get(/^\/(?!socket\.io).*/, (_, res) => {
    res.sendFile(
        path.join(__dirnameResolved, "frontend", "dist", "index.html")
    );
});

/* ------------------- HTTP + SOCKET ------------------- */
const server = http.createServer(app);

const io = new Server(server, {
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
        await connectToMongo();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
    }
})();
