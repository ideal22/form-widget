import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'FormWidget',
      // Один файл IIFE — просто подключаешь <script src="widget.js">
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    rollupOptions: {
      // Всё bundlим внутрь — клиенту не нужно ничего подключать отдельно
      external: [],
    },
    // Итоговый файл будет в dist/widget.js
    outDir: 'dist',
    // Minify для продакшена
    minify: 'esbuild',
  },
})
