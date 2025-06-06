import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { 
    ServerToClientEvents, 
    ClientToServerEvents, 
    InterServerEvents, 
    SocketData 
} from '../../app.d.ts';

type TypedServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

const WEBSOCKET_SERVER_KEY = Symbol.for('sveltekit.websocket.server');

interface GlobalWithWebSocket {
    [WEBSOCKET_SERVER_KEY]?: TypedServer;
}

export function createWebSocketServer(server: HTTPServer): TypedServer {
    const globalWithWS = globalThis as GlobalWithWebSocket;
    
    if (!globalWithWS[WEBSOCKET_SERVER_KEY]) {
        const io: TypedServer = new Server(server, {
            cors: {
                origin: "http://localhost:5173", // Your dev server URL
                methods: ["GET", "POST"]
            }
        });
        
        globalWithWS[WEBSOCKET_SERVER_KEY] = io;
    }
    
    return globalWithWS[WEBSOCKET_SERVER_KEY]!;
}

export function getWebSocketServer(): TypedServer | null {
    const globalWithWS = globalThis as GlobalWithWebSocket;
    return globalWithWS[WEBSOCKET_SERVER_KEY] || null;
}

export function setupWebSocketHandlers(io: TypedServer): void {
    io.on('connection', (socket) => {
        socket.data.username = 'Anonymous';

        io.emit('userJoined', socket.data.username);

        socket.on('message', (data: string) => {
            console.log('Received message:', data);
            // Echo message back to all clients with proper typing
            io.emit('message', data, socket.data.username);
        });

        socket.on('updateUsername', (username: string) => {
            const previousUsername = socket.data.username;
            socket.data.username = username;
            io.emit('updateUsername', previousUsername, username);
        });

        socket.on('disconnect', () => {
            io.emit('userLeft', socket.data.username);
            console.log('Client disconnected:', socket.id);
        });
    });
}