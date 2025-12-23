import React, { createContext, useMemo, useContext } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socket = useMemo(
        () =>
            io(import.meta.env.VITE_BACKEND_URL, {
                transports: ["websocket"],
            }),
        []
    );

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};