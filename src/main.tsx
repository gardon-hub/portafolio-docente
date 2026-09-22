import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './estilos/index.css'

/**
 * HashRouter y no BrowserRouter: asi el sitio funciona igual publicado en la raiz
 * de un dominio, en una subcarpeta de GitHub Pages o abierto desde una carpeta
 * local, sin necesitar reglas de reescritura en el servidor. Las direcciones
 * quedan legibles: .../#/portafolio/investigacion, .../#/evidencias/E6.4
 */
createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
