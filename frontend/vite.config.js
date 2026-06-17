import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/incident': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/departments': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/notifications': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/media': {
        target: 'http://127.0.0.1:8004',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
    }
  }
})
