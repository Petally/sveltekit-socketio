// TODO: simplify some of this stuff. A lot of it is just not necessary.
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

const SOCKETIO_SERVER_KEY = Symbol.for('sveltekit.socketIO.server');

interface GlobalWithSocketIO {
    [SOCKETIO_SERVER_KEY]?: TypedServer;
}

export function createSocketIOServer(server: HTTPServer): TypedServer {
    const globalWithSocketIO = globalThis as GlobalWithSocketIO;
    
    if (!globalWithSocketIO[SOCKETIO_SERVER_KEY]) {
        const io: TypedServer = new Server(server, {
            cors: {
                origin: "http://localhost:5173", // Your dev server URL
                methods: ["GET", "POST"]
            }
        });
        
        globalWithSocketIO[SOCKETIO_SERVER_KEY] = io;
    }
    
    return globalWithSocketIO[SOCKETIO_SERVER_KEY]!;
}

export function getSocketIOServer(): TypedServer | null {
    const globalWithSocketIO = globalThis as GlobalWithSocketIO;
    return globalWithSocketIO[SOCKETIO_SERVER_KEY] || null;
}

export function setupSocketIOHandlers(io: TypedServer): void {
    io.on('connection', (socket) => {
        socket.data.username = socket.handshake.auth.username || 'Anonymous';

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