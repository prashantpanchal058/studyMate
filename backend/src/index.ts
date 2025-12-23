import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import router from "./routes/auth";
import router_group from "./routes/group";
import router_status from "./routes/groupstatus";

import connectToMongo from "./database";

import dotenv from "dotenv";
import path from "path";

dotenv.config()

connectToMongo();

const app = express();
const port = process.env.PORT || 8007;

const _dirname = path.resolve();

app.use(cors());
app.use(express.json());

app.use("/", router);
app.use("/group", router_group);
app.use("/status", router_status);

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});


// Create HTTP server manually (important for TS + Socket.io)
const server = http.createServer(app);

// Initialize Socket.io in TS way
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
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

        socket.emit("room:join", {id : socket.id});
    });


    socket.on('user:call', ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    })

    socket.on('call:accepted',({ to , ans}) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans});
    })

        socket.on('peer:nego:needed', ({to, offer}) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer});
    })

    socket.on('peer:nego:done', ({to, ans}) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans});
    })
});

// Start serverc
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
