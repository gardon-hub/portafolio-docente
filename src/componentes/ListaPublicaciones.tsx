import type { Publicacion } from '../tipos'
import { Icono } from './Icono'
import { Insignia } from './Insignia'

interface Props {
  titulo?: string
  nota?: string
  items: Publicacion[]
}

/**
 * Lista bibliografica normalizada. Cada entrada lleva la referencia completa y,
 * cuando existe, su identificador enlazado: es lo que hace verificable la
 * evidencia E6.2. Las que no tienen DOI lo dicen en lugar de callarlo.
 */
export function ListaPublicaciones({ titulo, nota, items }: Props) {
  const ordenadas = [...items].sort((a, b) => b.anio.localeCompare(a.anio))

  return (
    <section className="my-6">
      {titulo ? (
        <h3 className="mb-3 font-serif text-lg font-semibold text-texto">{titulo}</h3>
      ) : null}

      <ol className="space-y-3">
        {ordenadas.map((p, i) => (
          <li key={i} className="tarjeta p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Insignia tono="azul" icono="etiqueta">
                {p.clase}
              </Insignia>
              <span className="text-xs text-texto-tenue">{p.anio}</span>
            </div>

            {/* La referencia va en <cite> por semantica, pero sin cursiva: una
                referencia entera en cursiva se lee peor que en redonda. */}
            <cite className="mt-2 block text-[0.95rem] not-italic text-texto">{p.referencia}</cite>

            {p.enlace ? (
              <a
                href={p.enlace}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold break-all"
              >
                {p.identificador ?? p.enlace}
                <Icono nombre="externo" tamano={13} />
              </a>
            ) : (
              <p className="mt-2 text-xs text-texto-tenue">
                Sin identificador persistente asignado.
              </p>
            )}

            {p.nota ? <p className="mt-2 text-xs text-texto-suave">{p.nota}</p> : null}
          </li>
        ))}
      </ol>

      {nota ? <p className="mt-3 text-xs text-texto-tenue">{nota}</p> : null}
    </section>
  )
}
