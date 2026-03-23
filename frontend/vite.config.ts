import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    allowedHosts: ['lionfish-app-5f4rk.ondigitalocean.app', 'kohack2026.ramaztec.org'],
  },
})