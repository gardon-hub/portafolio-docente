import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` deja rutas relativas: el sitio funciona igual servido desde la raiz
// de un dominio, desde una subcarpeta de GitHub Pages o desde una carpeta local.
// Por eso la navegacion usa HashRouter (ver src/main.tsx).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // El centro de evidencias y el visor se cargan aparte para que la
        // pagina de inicio pese lo menos posible en conexiones moviles lentas.
        manualChunks(id) {
          // El codigo de terceros y el contenido editable van en trozos aparte:
          // al actualizar un texto de content/ el navegador no vuelve a bajar React.
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/content/')) return 'contenido'
          return undefined
        },
      },
    },
  },
})
