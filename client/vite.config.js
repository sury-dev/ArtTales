import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: process.env.VITE_PORT,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
        // target: 'https://arttales.onrender.com',
        changeOrigin: true, // Ensures that the proxy target's origin is used
        secure: false,      // If you're using HTTP instead of HTTPS, this should be false
      },
    },
  },
  plugins: [react()],
  base: './'
})
