import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://114.55.139.85',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/HuaNeng_kbq_Photo': {
        target: 'http://114.55.139.85',
        changeOrigin: true
      }
    }
  }
})
