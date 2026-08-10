import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv rather than process.env: this file is linted with browser globals,
  // and it also picks up TOKEN_SERVER_PORT from a .env file, not just the shell.
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      // Pinned so this project always lands on 5175 and never drifts onto
      // 5173/5174, which are other projects' dev servers. strictPort makes a
      // clash fail loudly instead of silently grabbing the next free port.
      port: 5175,
      strictPort: true,
      // In production Vercel rewrites /api to the Flask function (vercel.json).
      // Locally nothing served that path, so `npm run dev` 404'd on the token
      // fetch unless you knew to set VITE_TOKEN_SERVER_URL by hand. Proxying to
      // the local token server makes the documented three-terminal setup work
      // as written. VITE_TOKEN_SERVER_URL still overrides this when set.
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${env.TOKEN_SERVER_PORT || 5005}`,
          changeOrigin: true,
        },
      },
    },
  }
})
