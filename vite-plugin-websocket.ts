import type { Plugin } from 'vite';
import { createWebSocketServer, setupWebSocketHandlers } from './src/lib/server/webSocketUtils.js';

export function webSocketPlugin(): Plugin {
    return {
        name: 'websocket-plugin',
        configureServer(server) {
            if (!server.httpServer) return;
            
            // Type assertion to handle Vite's server type compatibility
            const io = createWebSocketServer(server.httpServer as any);
            setupWebSocketHandlers(io);
        }
    };
}