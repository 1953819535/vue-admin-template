import path from 'node:path'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  server: {
    host: true,
    strictPort: false,
  },
  plugins: [
    VueRouter({
      exclude: ['**/components/**', '**/__*', '**/__*/**/*', '**/*.component.vue'],
    }),
    vue(),
    vueJsx(),
    tailwindcss(),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
