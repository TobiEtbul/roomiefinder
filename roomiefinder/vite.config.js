import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En `npm run dev` las llamadas a /api van al backend deployado.
    // Para usar un backend local: VITE_DEV_API=http://localhost:8000 npm run dev
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API || 'https://roomie-finder-bay.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
