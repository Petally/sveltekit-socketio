import { handler } from './build/handler.js';
import express from 'express';
import { createServer } from 'http';
import { createSocketIOServer, setupSocketIOHandlers } from './src/lib/server/socketIOUtils.js';

const app = express();
const server = createServer(app);

// Set up Socket.IO server with proper typing
const io = createSocketIOServer(server);
setupSocketIOHandlers(io);

// SvelteKit handler
app.use(handler);

const port: number = parseInt(process.env.PORT || '3000', 10);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});