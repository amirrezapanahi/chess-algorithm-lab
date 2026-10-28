import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubBase = process.env.GITHUB_ACTIONS && repositoryName && !repositoryName.endsWith('.github.io')
  ? `/${repositoryName}/`
  : '/'

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? githubBase,
  plugins: [react()],
  worker: { format: 'es' },
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 2500,
  },
  test: {
    environment: 'jsdom',
    coverage: { reporter: ['text', 'html'] },
  },
})
