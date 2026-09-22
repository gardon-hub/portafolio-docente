import { Link } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { evidenciasDeApartado, perfil, secciones } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'

export function Portafolio() {
  useMetadatos(
    'Índice del portafolio',
    'Los once apartados del portafolio docente ' +
      perfil.anio +
      ' de ' +
      perfil.nombre +
      ', con su resumen y sus evidencias asociadas.',
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-acento uppercase">
          {perfil.periodo}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-texto sm:text-4xl">
          Índice del portafolio
        </h1>
        <p className="mt-3 text-[0.975rem] text-texto-suave">
          El recorrido sigue el orden de los apartados oficiales. Cada uno reúne su contenido y
          enlaza con las evidencias que lo respaldan.
        </p>
      </header>

      <ol className="mt-8 space-y-3">
        {secciones.map((s) => {
          const cantidad = evidenciasDeApartado(s.numero).length
          return (
            <li key={s.slug}>
              <Link
                to={'/portafolio/' + s.slug}
                className="tarjeta flex items-start gap-4 p-4 no-underline transition-colors hover:border-acento sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-lg bg-acento-suave font-serif text-lg font-bold text-acento"
                >
                  {s.numero >= 1 ? s.numero : <Icono nombre={s.icono} tamano={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg font-semibold text-texto">
                    {s.titulo}
                  </span>
                  <span className="mt-1 block text-sm text-texto-suave">{s.resumen}</span>
                  {cantidad > 0 ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-texto-tenue">
                      <Icono nombre="carpeta" tamano={13} />
                      {cantidad} evidencias asociadas
                    </span>
                  ) : null}
                </span>
                <span aria-hidden="true" className="mt-2 shrink-0 text-texto-tenue">
                  <Icono nombre="flecha-derecha" tamano={18} />
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
