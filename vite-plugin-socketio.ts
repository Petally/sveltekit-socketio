import type { Plugin } from 'vite';
import { createSocketIOServer, setupSocketIOHandlers } from './src/lib/server/socketIOUtils.js';

export function socketIOPlugin(): Plugin {
    return {
        name: 'socketio-plugin',
        configureServer(server) {
            if (!server.httpServer) return;
            
            // Type assertion to handle Vite's server type compatibility
            const io = createSocketIOServer(server.httpServer as any);
            setupSocketIOHandlers(io);
        }
    };
}