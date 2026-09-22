import type { RecursoEnLinea } from '../tipos'
import { Icono } from './Icono'
import { Insignia } from './Insignia'

interface Props {
  titulo?: string
  nota?: string
  items: RecursoEnLinea[]
}

/**
 * Recursos didacticos que viven fuera del sitio y se consultan con un enlace.
 *
 * A diferencia de las evidencias, aqui no hay archivo que descargar: lo que se
 * ofrece es la direccion del recurso, de modo que el enlace es la evidencia. Por
 * eso se muestra completo y se abre en otra pestana, para no sacar al visitante
 * del portafolio.
 */
export function ListaRecursos({ titulo, nota, items }: Props) {
  return (
    <section className="my-6">
      {titulo ? (
        <h3 className="mb-3 font-serif text-lg font-semibold text-texto">{titulo}</h3>
      ) : null}

      <ul className="space-y-3">
        {items.map((r, i) => (
          <li key={i} className="tarjeta p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Insignia tono="azul" icono="etiqueta">
                {r.formato}
              </Insignia>
              <span className="text-xs text-texto-tenue">{r.plataforma}</span>
            </div>

            <p className="mt-2 font-serif text-base font-semibold text-texto">{r.titulo}</p>
            <p className="mt-1 text-sm text-texto-suave">{r.descripcion}</p>
            {r.detalle ? <p className="mt-1 text-xs text-texto-tenue">{r.detalle}</p> : null}

            <a
              href={r.enlace}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Abrir la actividad
              <Icono nombre="externo" tamano={14} />
            </a>
          </li>
        ))}
      </ul>

      {nota ? <p className="mt-3 text-xs text-texto-tenue">{nota}</p> : null}
    </section>
  )
}
