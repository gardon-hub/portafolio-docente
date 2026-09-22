import { Link } from 'react-router-dom'
import { datosEvidencias, evidenciasDeApartado } from '../datos/contenido'
import { Icono } from './Icono'
import { InsigniaEstado } from './Insignia'

/**
 * Cierre de cada apartado: enlaza sus evidencias sin traerse el centro de
 * evidencias entero, para que la pagina del apartado siga siendo ligera.
 */
export function ZonaEvidencias({ apartado }: { apartado: number }) {
  const lista = evidenciasDeApartado(apartado)
  if (lista.length === 0) return null

  return (
    <section
      aria-labelledby={'evidencias-apartado-' + apartado}
      className="mt-10 rounded-xl border border-borde bg-superficie-2 p-5"
    >
      <h2
        id={'evidencias-apartado-' + apartado}
        className="flex items-center gap-2 font-serif text-lg font-semibold text-texto"
      >
        <Icono nombre="carpeta" tamano={20} />
        Evidencias de este apartado
      </h2>
      <p className="mt-1 text-sm text-texto-suave">
        {lista.length} códigos definidos. La ficha completa de cada uno está en el Centro de
        evidencias.
      </p>

      <ul className="mt-4 space-y-2">
        {lista.map((e) => {
          const estado = datosEvidencias.estados[e.estado]
          return (
            <li key={e.codigo}>
              <Link
                to={'/evidencias/' + e.codigo}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-borde bg-superficie px-3 py-2.5 no-underline transition-colors hover:border-acento"
              >
                <span className="rounded-md bg-acento px-2 py-0.5 font-mono text-xs font-bold text-sobre-acento">
                  {e.codigo}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium text-texto">{e.titulo}</span>
                <InsigniaEstado
                  estado={e.estado}
                  etiqueta={estado.etiqueta}
                  descripcion={estado.descripcion}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
