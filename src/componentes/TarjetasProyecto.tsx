import { Link } from 'react-router-dom'
import { datosProyectos, proyectos } from '../datos/contenido'
import { Icono } from './Icono'
import { Insignia } from './Insignia'

export function TarjetasProyecto({ titulo }: { titulo?: string }) {
  return (
    <section className="my-6">
      {titulo ? (
        <h2 className="mb-3 font-serif text-lg font-semibold text-texto">{titulo}</h2>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2">
        {proyectos.map((p) => (
          <li key={p.id} className="tarjeta flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-base font-semibold text-texto">{p.nombre}</h3>
              <span className="shrink-0 text-acento">
                <Icono nombre="chispa" tamano={18} />
              </span>
            </div>
            <p className="flex-1 text-sm text-texto-suave">{p.descripcion}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Insignia tono="azul" icono="etiqueta">
                {p.area}
              </Insignia>
              {p.evidencias.map((c) => (
                <Link
                  key={c}
                  to={'/evidencias/' + c}
                  className="rounded-md border border-borde px-1.5 py-0.5 text-xs font-semibold no-underline hover:border-acento"
                >
                  {c}
                </Link>
              ))}
            </div>
            {p.enlace ? (
              <a
                href={p.enlace}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                Ver la herramienta
                <Icono nombre="externo" tamano={15} />
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-texto-tenue">{datosProyectos.nota}</p>
    </section>
  )
}
