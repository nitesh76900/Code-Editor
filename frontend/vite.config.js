import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// import monaco from 'vite-plugin-monaco-editor'; // Note: default import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // monaco.default({
    //   languageWorkers: ['editor', 'typescript', 'javascript'],
    // }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
