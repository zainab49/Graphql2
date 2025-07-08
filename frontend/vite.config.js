import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/Graphql2/',
  plugins: [react()],
   build: {
    outDir: 'dist',
    emptyOutDir: true
  },
   server: {
    proxy: {
      '/api': {
        target: 'https://learn.reboot01.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false // Only for development
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
