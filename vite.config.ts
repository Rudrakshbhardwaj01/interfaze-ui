import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const registryDevServer = (): Plugin => ({
  name: 'interfaze-registry-dev-server',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url?.startsWith('/r/') || !request.url.endsWith('.json')) {
        next()
        return
      }
      try {
        const file = await readFile(resolve(process.cwd(), 'public', request.url.slice(1)), 'utf8')
        response.statusCode = 200
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(file)
      } catch {
        next()
      }
    })
  },
})

export default defineConfig({
  plugins: [react(), registryDevServer()],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
})
