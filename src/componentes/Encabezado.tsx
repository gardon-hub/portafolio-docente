import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { apartados, perfil, recurso } from '../datos/contenido'
import { useTema } from '../ganchos/useTema'
import { Icono } from './Icono'

const ENLACES = [
  { a: '/', texto: 'Inicio', icono: 'libro', exacto: true },
  { a: '/portafolio', texto: 'Portafolio', icono: 'mapa', exacto: false },
  { a: '/evidencias', texto: 'Evidencias', icono: 'carpeta', exacto: false },
  { a: '/anexo', texto: 'Anexo', icono: 'documento', exacto: false },
  { a: '/buscar', texto: 'Buscar', icono: 'buscar', exacto: false },
  { a: '/descargas', texto: 'Descargas', icono: 'descargar', exacto: false },
]

/** El PDF no es una sección del sitio sino un archivo, así que en la barra va con
 *  aspecto de botón y no de enlace de navegación: el indicador de sección activa
 *  nunca debe encenderse sobre algo que no lleva a ninguna página. */
function BotonPdf({ compacto }: { compacto: boolean }) {
  const pdf = perfil.pdfCompleto
  if (!pdf?.archivo) return null
  const descripcion = 'Descargar el portafolio completo en PDF, ' + pdf.paginas + ' páginas'

  if (compacto) {
    return (
      <a
        href={recurso('documentos/' + pdf.archivo)}
        download
        className="boton boton-tenue px-2.5"
        title={descripcion}
        aria-label={descripcion}
      >
        <Icono nombre="descargar" tamano={18} />
        <span className="text-sm font-semibold">PDF</span>
      </a>
    )
  }

  return (
    <a
      href={recurso('documentos/' + pdf.archivo)}
      download
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-texto no-underline hover:bg-superficie-2"
    >
      <Icono nombre="descargar" tamano={20} />
      <span>
        Portafolio completo en PDF
        <span className="block text-xs font-normal text-texto-tenue">
          {pdf.paginas} páginas · {pdf.actualizado}
        </span>
      </span>
    </a>
  )
}

function ConmutadorTema() {
  const { tema, alternar } = useTema()
  const oscuroActivo =
    tema === 'oscuro' ||
    (tema === 'sistema' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      type="button"
      onClick={alternar}
      className="boton boton-tenue px-2.5"
      aria-pressed={oscuroActivo}
      title={oscuroActivo ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <Icono nombre={oscuroActivo ? 'sol' : 'luna'} tamano={18} />
      <span className="sr-only">{oscuroActivo ? 'Activar modo claro' : 'Activar modo oscuro'}</span>
    </button>
  )
}

export function Encabezado() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const idMenu = useId()
  const botonRef = useRef<HTMLButtonElement>(null)

  // Cerrar al navegar: sin esto el panel queda encima de la pagina nueva.
  useEffect(() => {
    setAbierto(false)
  }, [pathname])

  useEffect(() => {
    if (!abierto) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', alPulsar)
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.style.overflow = anterior
    }
  }, [abierto])

  const claseEnlace = ({ isActive }: { isActive: boolean }) =>
    'relative rounded-lg px-3 py-2 text-sm font-semibold no-underline transition-colors ' +
    (isActive
      ? 'bg-acento-suave text-acento'
      : 'text-texto-suave hover:bg-superficie-2 hover:text-texto')

  return (
    <>
      {/* Franja institucional: se queda arriba y se desplaza con la pagina, para
          que en el telefono la barra fija ocupe una sola linea. */}
      <div className="bg-franja text-sobre-franja no-imprimir">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-4 py-1.5 text-[0.7rem] font-medium tracking-wide sm:text-xs">
          <span className="uppercase">{perfil.institucion}</span>
          <span className="hidden md:inline">{perfil.unidadAcademica}</span>
          <span>{perfil.periodo}</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-borde bg-fondo no-imprimir">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3 no-underline">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-acento-borde bg-acento-suave font-serif text-base font-bold text-acento"
            >
              {perfil.fotografia.iniciales}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-base leading-tight font-semibold text-texto">
                {perfil.tituloPortafolio} {perfil.anio}
              </span>
              <span className="block truncate text-xs text-texto-tenue">{perfil.nombre}</span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {ENLACES.map((e) => (
              <NavLink key={e.a} to={e.a} end={e.exacto} className={claseEnlace}>
                {e.texto}
              </NavLink>
            ))}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-borde" />
            <BotonPdf compacto />
            <ConmutadorTema />
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <ConmutadorTema />
            <button
              ref={botonRef}
              type="button"
              className="boton boton-secundario px-3"
              aria-expanded={abierto}
              aria-controls={idMenu}
              onClick={() => setAbierto((v) => !v)}
            >
              <Icono nombre={abierto ? 'cerrar' : 'menu'} tamano={20} />
              <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
            </button>
          </div>
        </div>

        {abierto ? (
          <div
            id={idMenu}
            className="aparece max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t border-borde bg-fondo px-4 pb-6 lg:hidden"
          >
            <nav aria-label="Navegación principal (móvil)" className="grid gap-1 py-3">
              {ENLACES.map((e) => (
                <NavLink
                  key={e.a}
                  to={e.a}
                  end={e.exacto}
                  className={({ isActive }) =>
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold no-underline ' +
                    (isActive ? 'bg-acento-suave text-acento' : 'text-texto hover:bg-superficie-2')
                  }
                >
                  <Icono nombre={e.icono} tamano={20} />
                  {e.texto}
                </NavLink>
              ))}
              <BotonPdf compacto={false} />
            </nav>

            <p className="mt-2 mb-2 px-3 text-xs font-semibold tracking-wide text-texto-tenue uppercase">
              Apartados
            </p>
            <ul className="grid gap-0.5">
              {apartados.map((s) => (
                <li key={s.slug}>
                  <NavLink
                    to={'/portafolio/' + s.slug}
                    className={({ isActive }) =>
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm no-underline ' +
                      (isActive
                        ? 'bg-acento-suave font-semibold text-acento'
                        : 'text-texto-suave hover:bg-superficie-2')
                    }
                  >
                    <span className="w-5 shrink-0 text-right font-mono text-xs text-texto-tenue">
                      {s.numero}
                    </span>
                    {s.titulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>
    </>
  )
}
