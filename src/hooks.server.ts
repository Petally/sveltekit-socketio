import type { Handle } from '@sveltejs/kit';
import { getSocketIOServer } from '$lib/server/socketIOUtils';

export const handle: Handle = async ({ event, resolve }) => {
    // Attach WebSocket server to locals for use in routes
    event.locals.io = getSocketIOServer();
    
    const response = await resolve(event);
    return response;
};