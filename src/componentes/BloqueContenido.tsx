import { Link } from 'react-router-dom'
import type { Bloque } from '../tipos'
import { Acordeon } from './Acordeon'
import { Icono } from './Icono'
import { Indicadores } from './Indicadores'
import { LineaTiempo } from './LineaTiempo'
import { ListaPublicaciones } from './ListaPublicaciones'
import { ListaRecursos } from './ListaRecursos'
import { TablaResponsiva } from './TablaResponsiva'
import { TarjetasProyecto } from './TarjetasProyecto'

/** Traduce un bloque del JSON de contenido al componente que le corresponde. */
export function BloqueContenido({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo) {
    case 'parrafo':
      return (
        <div className="my-5">
          {bloque.titulo ? (
            <h2 className="mb-2 font-serif text-lg font-semibold text-texto">{bloque.titulo}</h2>
          ) : null}
          <p className="text-[0.975rem] leading-relaxed text-texto-suave">{bloque.texto}</p>
        </div>
      )

    case 'destacado':
      return (
        <blockquote className="my-6 rounded-xl border border-acento-borde bg-acento-suave p-5">
          <p className="text-xs font-semibold tracking-wide text-acento uppercase">
            {bloque.etiqueta}
          </p>
          <p className="mt-2 font-serif text-lg leading-snug text-texto">{bloque.texto}</p>
        </blockquote>
      )

    case 'nota':
      return (
        <aside className="my-6 flex gap-3 rounded-xl border border-ambar-borde bg-ambar-suave p-4">
          <span className="mt-0.5 shrink-0 text-ambar">
            <Icono nombre="candado" tamano={18} />
          </span>
          <p className="text-sm text-texto-suave">{bloque.texto}</p>
        </aside>
      )

    case 'lista':
      return (
        <div className="my-6">
          {bloque.titulo ? (
            <h2 className="mb-3 font-serif text-lg font-semibold text-texto">{bloque.titulo}</h2>
          ) : null}
          <ul className="space-y-2">
            {bloque.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-[0.975rem] text-texto-suave">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-acento"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'tabla':
      return (
        <TablaResponsiva
          titulo={bloque.titulo}
          nota={bloque.nota}
          columnas={bloque.columnas}
          filas={bloque.filas}
        />
      )

    case 'tarjetas':
      return (
        <div className="my-6">
          {bloque.titulo ? (
            <h2 className="mb-3 font-serif text-lg font-semibold text-texto">{bloque.titulo}</h2>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bloque.items.map((item, i) => (
              <li key={i} className="tarjeta p-4">
                <h3 className="font-serif text-base font-semibold text-texto">{item.titulo}</h3>
                <p className="mt-1.5 text-sm text-texto-suave">{item.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'acordeon':
      return <Acordeon titulo={bloque.titulo} items={bloque.items} />

    case 'indicadores':
      return <Indicadores titulo={bloque.titulo} items={bloque.items} />

    case 'linea-tiempo':
      return <LineaTiempo referencia={bloque.referencia} />

    case 'publicaciones':
      return <ListaPublicaciones titulo={bloque.titulo} nota={bloque.nota} items={bloque.items} />

    case 'recursos':
      return <ListaRecursos titulo={bloque.titulo} nota={bloque.nota} items={bloque.items} />

    case 'proyectos':
      return <TarjetasProyecto titulo={bloque.titulo} />

    case 'enlace-evidencias':
      return (
        <p className="my-6 flex flex-wrap items-center gap-2 rounded-xl border border-borde bg-superficie-2 p-4 text-sm text-texto-suave">
          <Icono nombre="carpeta" tamano={18} />
          {bloque.texto}
          <Link to="/evidencias" className="font-semibold no-underline hover:underline">
            Ir al Centro de evidencias
          </Link>
        </p>
      )
  }
}
