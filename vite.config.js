import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173, 
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@coinbase/wallet-sdk', 'cbw-sdk']
  },
  build: {
    rollupOptions: {
      external: (id) => {
        if (id.includes('@coinbase/wallet-sdk') || id.includes('cbw-sdk')) {
          return false;
        }
        return false;
      }
    }
  }
})
