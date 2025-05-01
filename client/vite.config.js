import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   '/api' : {
    //     target: 'http://localhost:7000',
    //     changeOrigin: true, // Ensures that the proxy target's origin is used
    //     secure: false,   
    //   }
    // },
    proxy: {
      '/api': {
        target: 'http://backend:7000',
        changeOrigin: true,
        secure: false,
      },
    },
    port: 5000, // Port for the Vite server
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  base: '/',
})
