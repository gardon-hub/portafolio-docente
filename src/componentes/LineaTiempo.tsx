import { Link } from 'react-router-dom'
import { lineaTiempo } from '../datos/contenido'
import { Icono } from './Icono'

interface Props {
  referencia: 'trayectoria' | 'formacion'
}

export function LineaTiempo({ referencia }: Props) {
  const grupo = lineaTiempo[referencia]
  const hitos = [...grupo.hitos].sort((a, b) => a.orden - b.orden)

  return (
    <section className="my-8">
      <h2 className="mb-2 font-serif text-lg font-semibold text-texto">{grupo.titulo}</h2>
      <p className="mb-5 text-sm text-texto-suave">{grupo.nota}</p>

      <ol className="relative space-y-5 border-l-2 border-borde pl-6 sm:pl-8">
        {hitos.map((hito, i) => (
          <li key={i} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-acento bg-fondo sm:-left-[2.4rem]"
            />
            <p className="text-xs font-semibold tracking-wide text-acento uppercase">
              {hito.periodo}
            </p>
            <h3 className="mt-0.5 font-serif text-base font-semibold text-texto">{hito.titulo}</h3>
            <p className="mt-1 text-sm text-texto-suave">{hito.detalle}</p>
            {hito.evidencias.length > 0 ? (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-texto-tenue">
                <span className="inline-flex items-center gap-1">
                  <Icono nombre="etiqueta" tamano={13} />
                  Respaldo:
                </span>
                {hito.evidencias.map((c) => (
                  <Link
                    key={c}
                    to={'/evidencias/' + c}
                    className="rounded-md border border-borde px-1.5 py-0.5 font-semibold no-underline hover:border-acento"
                  >
                    {c}
                  </Link>
                ))}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
