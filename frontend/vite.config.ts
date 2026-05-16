import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    fs: {
      allow: [
        '.',
        '../backend'
      ]
    },
    
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    
    open: '/' //
  }
});
// src/vite-env.d.ts
declare module '*?raw' {
  const content: string;
  export default content;
}