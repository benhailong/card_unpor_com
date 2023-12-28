import { defineConfig } from 'vite'
import { resolve } from "path"
import vue from '@vitejs/plugin-vue'
import { createSvg } from './src/icons/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      createSvg('./src/icons/svg/')
  ],
  resolve:{
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias:{
      "@": resolve(__dirname,"./src")
    }
  },
  server: {
    proxy: {
      '/admin': {
        target: 'http://test.com/', // api 位置
        changeOrigin: true
      },
    }
  },
  define: {
    'process.env':{}
  }
})
