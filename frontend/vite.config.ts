import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/trackuler/',
    server: {
        port: 7776,
    },
    build: {
        outDir: 'build',
        sourcemap: true, // build "*.map" files for JS sources
        manifest: false, // create a manifest.json for further processing of generated assets
    },
});
