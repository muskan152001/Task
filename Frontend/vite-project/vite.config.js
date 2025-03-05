import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,   // Ensure Vite runs on port 5173
    open: true,   // Automatically opens browser
    cors: true,   // Enables CORS
    host: true,   // Allows access from local network
    hmr: false,
  },
})
