import { Link, useParams } from 'react-router-dom'
import { BloqueContenido } from '../componentes/BloqueContenido'
import { Icono } from '../componentes/Icono'
import { ZonaEvidencias } from '../componentes/ZonaEvidencias'
import { perfil, secciones, seccionPorSlug } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import { NoEncontrada } from './NoEncontrada'

export function Apartado() {
  const { slug } = useParams<{ slug: string }>()
  const seccion = seccionPorSlug(slug)

  useMetadatos(
    seccion
      ? seccion.numero >= 1
        ? seccion.numero + '. ' + seccion.titulo
        : seccion.titulo
      : null,
    seccion ? seccion.resumen : 'Apartado no encontrado en el portafolio docente.',
  )

  if (!seccion) return <NoEncontrada />

  const indice = secciones.findIndex((s) => s.slug === seccion.slug)
  const anterior = indice > 0 ? secciones[indice - 1] : null
  const siguiente = indice < secciones.length - 1 ? secciones[indice + 1] : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10 lg:py-10">
      {/* Indice lateral con el apartado consultado resaltado */}
      <nav
        aria-label="Apartados del portafolio"
        className="sticky top-20 mb-8 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto lg:block no-imprimir"
      >
        <p className="mb-3 text-xs font-semibold tracking-wide text-texto-tenue uppercase">
          Apartados
        </p>
        <ol className="space-y-0.5">
          {secciones.map((s) => {
            const activo = s.slug === seccion.slug
            return (
              <li key={s.slug}>
                <Link
                  to={'/portafolio/' + s.slug}
                  aria-current={activo ? 'page' : undefined}
                  className={
                    'flex gap-2.5 rounded-lg px-3 py-2 text-sm no-underline transition-colors ' +
                    (activo
                      ? 'bg-acento-suave font-semibold text-acento'
                      : 'text-texto-suave hover:bg-superficie-2 hover:text-texto')
                  }
                >
                  <span className="w-4 shrink-0 text-right font-mono text-xs opacity-70">
                    {s.numero >= 1 ? s.numero : '·'}
                  </span>
                  <span>{s.titulo}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>

      <article className="min-w-0">
        <nav aria-label="Ruta" className="mb-4 text-xs text-texto-tenue no-imprimir">
          <Link to="/" className="no-underline hover:underline">
            Inicio
          </Link>
          <span className="mx-1.5">/</span>
          <Link to="/portafolio" className="no-underline hover:underline">
            Portafolio
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-texto-suave">{seccion.titulo}</span>
        </nav>

        <header className="border-b border-borde pb-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento"
            >
              <Icono nombre={seccion.icono} tamano={22} />
            </span>
            <p className="text-xs font-semibold tracking-[0.16em] text-acento uppercase">
              {seccion.numero >= 1
                ? 'Apartado ' + seccion.numero + ' de 11'
                : perfil.tituloPortafolio}
            </p>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-texto sm:text-4xl">
            {seccion.titulo}
          </h1>
          <p className="mt-3 text-[0.975rem] text-texto-suave">{seccion.resumen}</p>
        </header>

        <div className="mt-2">
          {seccion.bloques.map((bloque, i) => (
            <BloqueContenido key={i} bloque={bloque} />
          ))}
        </div>

        <ZonaEvidencias apartado={seccion.numero} />

        <nav
          aria-label="Apartado anterior y siguiente"
          className="mt-10 grid gap-3 border-t border-borde pt-6 sm:grid-cols-2 no-imprimir"
        >
          {anterior ? (
            <Link
              to={'/portafolio/' + anterior.slug}
              className="tarjeta flex items-center gap-3 p-4 no-underline hover:border-acento"
            >
              <Icono nombre="flecha-izquierda" tamano={18} />
              <span className="min-w-0">
                <span className="block text-xs text-texto-tenue">Anterior</span>
                <span className="block truncate text-sm font-semibold text-texto">
                  {anterior.titulo}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              to={'/portafolio/' + siguiente.slug}
              className="tarjeta flex items-center justify-end gap-3 p-4 text-right no-underline hover:border-acento"
            >
              <span className="min-w-0">
                <span className="block text-xs text-texto-tenue">Siguiente</span>
                <span className="block truncate text-sm font-semibold text-texto">
                  {siguiente.titulo}
                </span>
              </span>
              <Icono nombre="flecha-derecha" tamano={18} />
            </Link>
          ) : (
            <Link
              to="/evidencias"
              className="tarjeta flex items-center justify-end gap-3 p-4 text-right no-underline hover:border-acento"
            >
              <span>
                <span className="block text-xs text-texto-tenue">Siguiente</span>
                <span className="block text-sm font-semibold text-texto">Centro de evidencias</span>
              </span>
              <Icono nombre="flecha-derecha" tamano={18} />
            </Link>
          )}
        </nav>
      </article>
    </div>
  )
}
