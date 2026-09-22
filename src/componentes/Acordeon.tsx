import { Icono } from './Icono'

interface Props {
  titulo?: string
  items: { titulo: string; contenido: string[] }[]
}

/**
 * Usa <details>/<summary> nativos: se abren con teclado sin codigo propio y, al
 * imprimir, los forzamos abiertos para que el papel no pierda contenido.
 */
export function Acordeon({ titulo, items }: Props) {
  return (
    <div className="my-6">
      {titulo ? (
        <h2 className="mb-3 font-serif text-lg font-semibold text-texto">{titulo}</h2>
      ) : null}
      <div className="divide-y divide-borde overflow-hidden rounded-xl border border-borde bg-superficie">
        {items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 text-sm font-medium text-texto hover:bg-superficie-2 [&::-webkit-details-marker]:hidden">
              <span className="mt-0.5 shrink-0 text-acento transition-transform duration-200 group-open:rotate-45">
                <Icono nombre="mas-menos" tamano={18} />
              </span>
              <span className="flex-1">{item.titulo}</span>
            </summary>
            <div className="space-y-2 px-4 pb-4 pl-12 text-sm text-texto-suave">
              {item.contenido.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
