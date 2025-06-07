import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { socketIOPlugin } from './vite-plugin-socketio.js';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), socketIOPlugin()]
});