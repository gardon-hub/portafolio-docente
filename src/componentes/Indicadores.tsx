import type { Indicador } from '../tipos'

interface Props {
  titulo?: string
  items: Indicador[]
  compacto?: boolean
}

export function Indicadores({ titulo, items, compacto = false }: Props) {
  return (
    <section className="my-6">
      {titulo ? (
        <h2 className="mb-3 font-serif text-lg font-semibold text-texto">{titulo}</h2>
      ) : null}
      <ul
        className={
          'grid gap-3 ' +
          (compacto ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
        }
      >
        {items.map((ind, i) => (
          <li key={i} className="tarjeta p-4">
            <p className="font-serif text-3xl leading-none font-semibold text-acento">
              {ind.valor}
            </p>
            <p className="mt-1.5 text-sm font-medium text-texto">{ind.etiqueta}</p>
            {ind.nota ? <p className="mt-1 text-xs text-texto-tenue">{ind.nota}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
