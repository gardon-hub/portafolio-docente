import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import {
  datosEvidencias,
  evidenciasOrdenadas,
  lineaTiempo,
  perfil,
  proyectos,
  secciones,
} from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import type { Bloque } from '../tipos'

/** Version plana de un bloque: todo desplegado, a una columna, sin interaccion. */
function BloqueImpreso({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo) {
    case 'parrafo':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <p>{bloque.texto}</p>
        </>
      )
    case 'destacado':
      return (
        <div className="my-3 border-l-4 border-acento pl-3">
          <p className="text-xs font-semibold uppercase">{bloque.etiqueta}</p>
          <p>{bloque.texto}</p>
        </div>
      )
    case 'nota':
      return <p className="text-sm italic">Nota: {bloque.texto}</p>
    case 'lista':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {bloque.items.map((i, k) => (
              <li key={k}>{i}</li>
            ))}
          </ul>
        </>
      )
    case 'tabla':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <div className="my-3 overflow-x-auto print:overflow-visible">
            <table className="w-full min-w-[26rem] border border-borde text-sm print:min-w-0">
              <thead>
                <tr>
                  {bloque.columnas.map((c) => (
                    <th key={c} scope="col" className="border border-borde px-2 py-1.5 text-left">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloque.filas.map((f, k) => (
                  <tr key={k}>
                    {f.map((celda, j) => (
                      <td key={j} className="border border-borde px-2 py-1.5 align-top">
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bloque.nota ? <p className="text-xs">{bloque.nota}</p> : null}
        </>
      )
    case 'tarjetas':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {bloque.items.map((i, k) => (
              <li key={k}>
                <strong>{i.titulo}:</strong> {i.texto}
              </li>
            ))}
          </ul>
        </>
      )
    case 'acordeon':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {bloque.items.map((i, k) => (
              <li key={k}>
                <strong>{i.titulo}.</strong> {i.contenido.join(' ')}
              </li>
            ))}
          </ul>
        </>
      )
    case 'indicadores':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {bloque.items.map((i, k) => (
              <li key={k}>
                <strong>{i.valor}</strong> {i.etiqueta}
                {i.nota ? ' — ' + i.nota : ''}
              </li>
            ))}
          </ul>
        </>
      )
    case 'linea-tiempo': {
      const grupo = lineaTiempo[bloque.referencia]
      const hitos = [...grupo.hitos].sort((a, b) => a.orden - b.orden)
      return (
        <>
          <h3>{grupo.titulo}</h3>
          <p className="text-sm">{grupo.nota}</p>
          <ul className="my-2 list-disc space-y-1 pl-6">
            {hitos.map((h, k) => (
              <li key={k}>
                <strong>{h.periodo}</strong> — {h.titulo}. {h.detalle}
              </li>
            ))}
          </ul>
        </>
      )
    }
    case 'publicaciones':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ol className="my-2 list-decimal space-y-1 pl-6">
            {bloque.items.map((i, k) => (
              <li key={k}>
                {i.referencia}
                {i.identificador ? ' ' + i.identificador : ''}
              </li>
            ))}
          </ol>
          {bloque.nota ? <p className="text-xs">{bloque.nota}</p> : null}
        </>
      )
    case 'recursos':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {bloque.items.map((r, k) => (
              <li key={k}>
                <strong>{r.titulo}</strong> ({r.formato}, {r.plataforma}). {r.descripcion}{' '}
                <span className="break-all">{r.enlace}</span>
              </li>
            ))}
          </ul>
          {bloque.nota ? <p className="text-xs">{bloque.nota}</p> : null}
        </>
      )
    case 'proyectos':
      return (
        <>
          {bloque.titulo ? <h3>{bloque.titulo}</h3> : null}
          <ul className="my-2 list-disc space-y-1 pl-6">
            {proyectos.map((p) => (
              <li key={p.id}>
                <strong>{p.nombre}:</strong> {p.descripcion}
              </li>
            ))}
          </ul>
        </>
      )
    case 'enlace-evidencias':
      return <p className="text-sm">{bloque.texto}</p>
  }
}

export function Imprimir() {
  useMetadatos(
    'Versión para imprimir',
    'Portafolio docente ' +
      perfil.anio +
      ' completo, en una sola página, listo para imprimir o guardar como PDF.',
  )

  const [params] = useSearchParams()
  const auto = params.get('auto') === '1'

  useEffect(() => {
    if (!auto) return
    // Un fotograma de margen para que el navegador termine de pintar antes del dialogo.
    const id = window.setTimeout(() => window.print(), 400)
    return () => window.clearTimeout(id)
  }, [auto])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mt-2 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex flex-wrap gap-2 no-imprimir">
        <button type="button" onClick={() => window.print()} className="boton boton-primario">
          <Icono nombre="imprimir" tamano={16} />
          Imprimir o guardar como PDF
        </button>
        <Link to="/descargas" className="boton boton-secundario">
          <Icono nombre="flecha-izquierda" tamano={16} />
          Volver a descargas
        </Link>
      </div>

      <header className="border-b-2 border-acento pb-6">
        <p className="text-sm font-semibold tracking-wide uppercase">{perfil.institucion}</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
          {perfil.tituloPortafolio} {perfil.anio}
        </h1>
        <p className="mt-1 text-lg">{perfil.lemaPortafolio}</p>
        <p className="mt-4 font-serif text-2xl font-semibold">{perfil.nombre}</p>
        <p className="text-sm">
          {perfil.cargo} | {perfil.cargoSecundario}
        </p>
        <p className="text-sm">{perfil.unidadAcademica}</p>
        <p className="mt-2 text-sm">
          {perfil.periodo} &nbsp;|&nbsp; {perfil.version}
        </p>
        <p className="mt-1 text-sm">{perfil.guiaReferencia}</p>
      </header>

      {secciones.map((s) => (
        <section key={s.slug} className="mt-8 break-before-auto">
          <h2 className="border-b border-borde pb-1 font-serif text-2xl font-bold">
            {s.numero >= 1 ? s.numero + '. ' + s.titulo : s.titulo}
          </h2>
          {s.bloques.map((b, i) => (
            <BloqueImpreso key={i} bloque={b} />
          ))}
          {s.evidencias.length > 0 ? (
            <>
              <h3>Evidencias del apartado</h3>
              <ul className="my-2 list-disc space-y-1 pl-6">
                {s.evidencias.map((codigo) => {
                  const e = evidenciasOrdenadas.find((x) => x.codigo === codigo)
                  return e ? (
                    <li key={codigo}>
                      <strong>{e.codigo}</strong> {e.titulo} — {e.estadoTexto}
                    </li>
                  ) : null
                })}
              </ul>
            </>
          ) : null}
        </section>
      ))}

      <section className="mt-8">
        <h2 className="border-b border-borde pb-1 font-serif text-2xl font-bold">
          Matriz de evidencias
        </h2>
        <p className="mt-2 text-sm">{datosEvidencias.notaHistorica}</p>
        <p className="mt-1 text-sm">{datosEvidencias.notaMatriz}</p>
        <div className="my-3 overflow-x-auto print:overflow-visible">
          <table className="w-full min-w-[30rem] border border-borde text-xs print:min-w-0">
            <thead>
              <tr>
                <th scope="col" className="border border-borde px-2 py-1.5 text-left">
                  Código
                </th>
                <th scope="col" className="border border-borde px-2 py-1.5 text-left">
                  Evidencia
                </th>
                <th scope="col" className="border border-borde px-2 py-1.5 text-left">
                  Ap.
                </th>
                <th scope="col" className="border border-borde px-2 py-1.5 text-left">
                  Estado
                </th>
                <th scope="col" className="border border-borde px-2 py-1.5 text-left">
                  Visibilidad
                </th>
              </tr>
            </thead>
            <tbody>
              {evidenciasOrdenadas.map((e) => (
                <tr key={e.codigo}>
                  <td className="border border-borde px-2 py-1.5 font-mono">{e.codigo}</td>
                  <td className="border border-borde px-2 py-1.5">{e.titulo}</td>
                  <td className="border border-borde px-2 py-1.5">{e.apartado}</td>
                  <td className="border border-borde px-2 py-1.5">{e.estadoTexto}</td>
                  <td className="border border-borde px-2 py-1.5">
                    {datosEvidencias.visibilidades[e.visibility].etiqueta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-10 border-t border-borde pt-4 text-sm">
        <p>{perfil.creditos.linea1}</p>
        <p>{perfil.creditos.linea2}</p>
        <p>{perfil.creditos.linea3}</p>
      </footer>
    </div>
  )
}
