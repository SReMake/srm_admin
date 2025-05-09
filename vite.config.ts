import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 配置 /api 开头的请求代理
      '/api': {
        target: 'http://localhost:8080/api', // 替换为实际的 API 服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，移除 /api 前缀
      },
    },
  },
})
