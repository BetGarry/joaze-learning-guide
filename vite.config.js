import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import rollupJson from '@rollup/plugin-json'

/** Vite plugin to import .vjson files as JSON modules */
const vjsonPlugin = {
  name: 'vite:vjson',
  enforce: 'pre',
  configResolved() {
    console.log('[vite:vjson] plugin loaded');
  },
  transform(code, id) {
    if (id.endsWith('.vjson')) {
      console.log('[vite:vjson] processing', id);
      return {
        code: `export default ${code}`,
        map: null
      }
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      vjsonPlugin,
      rollupJson({
        include: '**/*.vjson',
        preferConst: true,
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_SHAPEDIVER_TICKET': JSON.stringify(env.VITE_SHAPEDIVER_TICKET)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  }
})
