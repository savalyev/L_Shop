import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    // 1. ДОБАВЛЯЕМ ВОТ ЭТОТ БЛОК (чтобы Vite мог импортировать из бэка)
    fs: {
      allow: [
        '.', // Разрешаем папку frontend
        '../backend' // Разрешаем папку backend (проверь, чтобы папка бэкенда называлась именно так относительно фронтенда)
      ]
    },
    
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    
    // open: '/main.html' - закомментировали
    open: '/' // В SPA лучше открывать корень, а роутер сам кинет на /login
  }
});