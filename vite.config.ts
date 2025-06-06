import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketPlugin } from './vite-plugin-websocket.js';

export default defineConfig({
    plugins: [sveltekit(), webSocketPlugin()]
});