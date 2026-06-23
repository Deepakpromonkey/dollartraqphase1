import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },

  server: {
    port: 3000,
    strictPort: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "actions": path.resolve(__dirname, "./src/actions"),
      "api": path.resolve(__dirname, "./src/api"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "assets": path.resolve(__dirname, "./src/assets"),
      "components": path.resolve(__dirname, "./src/components"),
      "helpers": path.resolve(__dirname, "./src/helpers"),
    },
  },
})