import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  images: {
    domains: ["https://gateway.pinata.cloud/ipfs/"],
    formats: ["image/webp"],
  },
  plugins: [react()],
})
