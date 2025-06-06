import type { Handle } from '@sveltejs/kit';
import { getWebSocketServer } from '$lib/server/webSocketUtils.js';

export const handle: Handle = async ({ event, resolve }) => {
    // Attach WebSocket server to locals for use in routes
    event.locals.io = getWebSocketServer();
    
    const response = await resolve(event);
    return response;
};