import type { Server } from 'socket.io';

declare global {
    namespace App {
        interface Locals {
            io: Server | null;
        }
        // Add custom event types if needed
        interface Platform {}
    }
}

// Define custom Socket.IO event types
export interface ServerToClientEvents {
    message: (data: string, username: string) => void;
    userJoined: (username: string) => void;
    userLeft: (username: string) => void;
    updateUsername: (previousUsername: string, username: string) => void;
}

export interface ClientToServerEvents {
    message: (data: string) => void;
    updateUsername: (username: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username: string;
}

export {};