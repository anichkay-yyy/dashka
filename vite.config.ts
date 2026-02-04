import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/dashka/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/wg': {
        target: 'http://172.23.114.229:51821',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/wg/, ''),
      },
    },
  },
})
