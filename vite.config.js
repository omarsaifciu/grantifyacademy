import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-index-at-root',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/' || req.url === '') {
            try {
              const htmlPath = path.resolve(__dirname, 'index.html')
              const raw = await server.transformIndexHtml('/', await (await import('node:fs/promises')).readFile(htmlPath, 'utf-8'))
              res.setHeader('Content-Type', 'text/html')
              res.end(raw)
              return
            } catch (e) {
              // fallthrough
            }
          }
          next()
        })
      },
    },
  ],
  appType: 'spa',
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  preview: {
    host: '127.0.0.1',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
