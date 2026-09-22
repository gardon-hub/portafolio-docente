import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BotonArriba } from './componentes/BotonArriba'
import { Encabezado } from './componentes/Encabezado'
import { PieDePagina } from './componentes/PieDePagina'
import { Apartado } from './paginas/Apartado'
import { Inicio } from './paginas/Inicio'
import { NoEncontrada } from './paginas/NoEncontrada'
import { Portafolio } from './paginas/Portafolio'

// El centro de evidencias, el buscador y la version para imprimir se descargan
// solo cuando se visitan: la pagina de inicio no tiene por que cargar con ellos.
const Evidencias = lazy(() =>
  import('./paginas/Evidencias').then((m) => ({ default: m.Evidencias })),
)
const EvidenciaDetalle = lazy(() =>
  import('./paginas/EvidenciaDetalle').then((m) => ({ default: m.EvidenciaDetalle })),
)
const Anexo = lazy(() => import('./paginas/Anexo').then((m) => ({ default: m.Anexo })))
const Buscar = lazy(() => import('./paginas/Buscar').then((m) => ({ default: m.Buscar })))
const Descargas = lazy(() => import('./paginas/Descargas').then((m) => ({ default: m.Descargas })))
const Imprimir = lazy(() => import('./paginas/Imprimir').then((m) => ({ default: m.Imprimir })))
const Privacidad = lazy(() =>
  import('./paginas/Privacidad').then((m) => ({ default: m.Privacidad })),
)
const Accesibilidad = lazy(() =>
  import('./paginas/Accesibilidad').then((m) => ({ default: m.Accesibilidad })),
)

/** Al cambiar de pagina el navegador conserva la posicion; aqui se sube al principio. */
function AlPrincipio() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Cargando() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-texto-tenue">
      <p role="status">Cargando…</p>
    </div>
  )
}

/** Un fallo al dibujar no debe dejar la pagina en blanco sin explicacion. */
class LimiteDeError extends Component<{ children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  render() {
    if (this.state.fallo) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold text-texto">
            No se pudo mostrar esta sección
          </h1>
          <p className="mt-3 text-sm text-texto-suave">
            Ocurrió un error al dibujar el contenido. Vuelva a cargar la página; si el problema
            continúa, revise que los archivos de la carpeta content/ tengan un formato válido.
          </p>
          <button
            type="button"
            className="boton boton-primario mt-6"
            onClick={() => window.location.reload()}
          >
            Volver a cargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-acento focus:px-4 focus:py-2.5 focus:font-semibold focus:text-sobre-acento focus:no-underline"
      >
        Ir al contenido
      </a>

      <AlPrincipio />
      <Encabezado />

      <main id="contenido" className="min-h-[60vh]">
        <LimiteDeError>
          <Suspense fallback={<Cargando />}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/portafolio" element={<Portafolio />} />
              <Route path="/portafolio/:slug" element={<Apartado />} />
              <Route path="/evidencias" element={<Evidencias />} />
              <Route path="/evidencias/:codigo" element={<EvidenciaDetalle />} />
              <Route path="/anexo" element={<Anexo />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/descargas" element={<Descargas />} />
              <Route path="/imprimir" element={<Imprimir />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/accesibilidad" element={<Accesibilidad />} />
              <Route path="*" element={<NoEncontrada />} />
            </Routes>
          </Suspense>
        </LimiteDeError>
      </main>

      <PieDePagina />
      <BotonArriba />
    </>
  )
}
