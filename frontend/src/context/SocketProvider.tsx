import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("useSocket must be used inside SocketProvider");
    }
    return socket;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const socket = useMemo(
        () =>
            io("https://studymate-p7sk.onrender.com", {
                withCredentials: true,
                transports: ["polling", "websocket"], // ✅ Render-safe
            }),
        []
    );

    useEffect(() => {
        return () => {
            socket.disconnect(); // ✅ prevent ghost connections
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
