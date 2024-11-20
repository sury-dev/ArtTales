import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
        changeOrigin: true, // Ensures that the proxy target's origin is used
        secure: false,      // If you're using HTTP instead of HTTPS, this should be false
      },
    },
  },
  plugins: [react()],
  base: './'
  
})
