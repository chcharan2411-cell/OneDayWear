import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/reviews': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/wishlist': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/inventory': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
