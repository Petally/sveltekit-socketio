import { handler } from './build/handler.js';
import express from 'express';
import { createServer } from 'http';
import { createWebSocketServer, setupWebSocketHandlers } from './src/lib/server/webSocketUtils.js';

const app = express();
const server = createServer(app);

// Set up WebSocket server with proper typing
const io = createWebSocketServer(server);
setupWebSocketHandlers(io);

// SvelteKit handler
app.use(handler);

const port: number = parseInt(process.env.PORT || '3000', 10);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});