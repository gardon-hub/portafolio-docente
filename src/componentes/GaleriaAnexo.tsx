import { useCallback, useEffect, useState } from 'react'
import { recurso } from '../datos/contenido'
import type { PaginaAnexo } from '../tipos'
import { Icono } from './Icono'

interface Props {
  paginas: PaginaAnexo[]
  /** Etiqueta del grupo, para el texto alternativo y el título del visor. */
  contexto: string
}

/**
 * Galeria de paginas escaneadas con visor a pantalla completa.
 *
 * Las miniaturas se cargan de forma diferida y la imagen grande solo se pide
 * cuando se abre el visor: el anexo son 71 escaneos y traerlos todos de golpe
 * haria inservible la pagina con conexion movil.
 */
export function GaleriaAnexo({ paginas, contexto }: Props) {
  const [abierta, setAbierta] = useState<number | null>(null)

  const cerrar = useCallback(() => setAbierta(null), [])
  const mover = useCallback(
    (paso: number) =>
      setAbierta((i) => (i === null ? null : (i + paso + paginas.length) % paginas.length)),
    [paginas.length],
  )

  useEffect(() => {
    if (abierta === null) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    document.addEventListener('keydown', alPulsar)
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.style.overflow = anterior
    }
  }, [abierta, cerrar, mover])

  const actual = abierta === null ? null : paginas[abierta]

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {paginas.map((p, i) => (
          <li key={p.archivo}>
            <button
              type="button"
              onClick={() => setAbierta(i)}
              className="group block w-full cursor-pointer text-left"
            >
              <span className="block overflow-hidden rounded-lg border border-borde bg-superficie transition-colors group-hover:border-acento">
                <img
                  src={recurso(p.carpeta + '/miniaturas/' + p.archivo)}
                  alt={'Página ' + p.pagina + ': ' + p.titulo}
                  loading="lazy"
                  decoding="async"
                  width={360}
                  height={466}
                  className="aspect-[17/22] w-full bg-white object-cover object-top"
                />
              </span>
              <span className="mt-2 block text-sm leading-snug font-medium text-texto group-hover:underline">
                {p.titulo}
              </span>
              {p.fecha ? (
                <span className="mt-0.5 block text-xs text-texto-tenue">{p.fecha}</span>
              ) : null}
              {p.nota ? (
                <span className="mt-1 flex items-start gap-1 text-xs text-ambar">
                  <Icono nombre="info" tamano={12} />
                  {p.nota}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {actual ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={'Visor: ' + actual.titulo}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 no-imprimir"
          onClick={cerrar}
        >
          <div className="flex items-start justify-between gap-4 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{actual.titulo}</p>
              <p className="text-xs text-white/70">
                {contexto} · Página {actual.pagina}
                {actual.fecha ? ' · ' + actual.fecha : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              className="boton shrink-0 bg-white/10 px-3 text-white hover:bg-white/20"
            >
              <Icono nombre="cerrar" tamano={18} />
              <span className="sr-only">Cerrar el visor</span>
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center px-2 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={recurso(actual.carpeta + '/' + actual.archivo)}
              alt={'Página ' + actual.pagina + ': ' + actual.titulo}
              className="max-h-full max-w-full rounded bg-white object-contain"
            />
          </div>

          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => mover(-1)}
              className="boton bg-white/10 text-white hover:bg-white/20"
            >
              <Icono nombre="flecha-izquierda" tamano={18} />
              Anterior
            </button>
            <a
              href={recurso(actual.carpeta + '/' + actual.archivo)}
              download
              className="boton bg-white/10 text-white hover:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Icono nombre="descargar" tamano={16} />
              Descargar
            </a>
            <button
              type="button"
              onClick={() => mover(1)}
              className="boton bg-white/10 text-white hover:bg-white/20"
            >
              Siguiente
              <Icono nombre="flecha-derecha" tamano={18} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
