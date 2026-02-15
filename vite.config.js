import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fileManagementPlugin from './vite-plugin-file-management.js'
import r2ManagementPlugin from './vite-plugin-r2-management.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/',
    plugins: [
      react(),
      r2ManagementPlugin(env), // Pass env to R2 plugin
      fileManagementPlugin() // Local fallback for development
    ],
  }
})
