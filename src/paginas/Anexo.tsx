import { Link } from 'react-router-dom'
import { AvisoHistorico } from '../componentes/AvisoHistorico'
import { GaleriaAnexo } from '../componentes/GaleriaAnexo'
import { Icono } from '../componentes/Icono'
import { Insignia } from '../componentes/Insignia'
import {
  anexo,
  evidenciaPorCodigo,
  perfil,
  recurso,
  totalPaginasAnexo,
} from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'

const TONO_EXCLUSION = {
  privacidad: { tono: 'ambar' as const, icono: 'candado', etiqueta: 'Privacidad' },
  'sin-contenido': { tono: 'neutro' as const, icono: 'info', etiqueta: 'Sin contenido' },
  pertinencia: { tono: 'neutro' as const, icono: 'info', etiqueta: 'Pertinencia' },
}

export function Anexo() {
  useMetadatos(
    'Anexo documental',
    totalPaginasAnexo +
      ' páginas del expediente digital de enero de 2020 que respaldan la trayectoria de ' +
      perfil.nombre +
      ': títulos, constancias, certificados de capacitación y reconocimientos.',
  )

  const excluidas = anexo.exclusiones.reduce((n, e) => n + e.paginas.length, 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="Ruta" className="mb-4 text-xs text-texto-tenue no-imprimir">
        <Link to="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-1.5">/</span>
        <Link to="/evidencias" className="no-underline hover:underline">
          Evidencias
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-texto-suave">Anexo documental</span>
      </nav>

      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-acento uppercase">
          {anexo.subtitulo}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-texto sm:text-4xl">
          {anexo.titulo}
        </h1>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-texto-suave">
          {anexo.introduccion}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Insignia tono="acento" icono="documento">
            {totalPaginasAnexo} páginas publicadas
          </Insignia>
          <Insignia tono="neutro" icono="carpeta">
            {anexo.totalPaginasExpediente} páginas en el expediente
          </Insignia>
          <Insignia tono="ambar" icono="candado">
            {excluidas} no publicadas
          </Insignia>
        </div>
      </header>

      <AvisoHistorico />

      {/* Indice de grupos */}
      <nav aria-label="Índice del anexo" className="tarjeta my-8 p-5 no-imprimir">
        <h2 className="font-serif text-lg font-semibold text-texto">Contenido del anexo</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {anexo.grupos.map((g) => (
            <li key={g.codigo}>
              <a
                href={'#' + g.codigo}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm no-underline hover:bg-superficie-2"
              >
                <span className="rounded bg-acento px-1.5 py-0.5 font-mono text-xs font-bold text-sobre-acento">
                  {g.codigo}
                </span>
                <span className="min-w-0 flex-1 text-texto">{g.titulo}</span>
                <span className="shrink-0 text-xs text-texto-tenue">{g.paginas.length}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Aquí la advertencia importa más que en ninguna otra página: el PDF no
            lleva ni una sola de estas imágenes, y quien busca el expediente
            escaneado debe saberlo antes de descargarlo. */}
        {perfil.pdfCompleto?.archivo ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-borde pt-4 sm:flex-nowrap">
            <p className="min-w-0 text-sm text-texto-suave">
              Cada página se descarga por separado desde su visor. El PDF del portafolio completo
              reúne los apartados y la matriz de evidencias, pero{' '}
              <strong className="font-semibold text-texto">no incluye estos escaneos</strong>.
            </p>
            <a
              href={recurso('documentos/' + perfil.pdfCompleto.archivo)}
              download
              className="boton boton-secundario shrink-0"
            >
              <Icono nombre="descargar" tamano={16} />
              Descargar el PDF ({perfil.pdfCompleto.paginas} páginas)
            </a>
          </div>
        ) : null}
      </nav>

      {anexo.grupos.map((grupo) => {
        const evidencia = evidenciaPorCodigo(grupo.codigo)
        return (
          <section
            key={grupo.codigo}
            id={grupo.codigo}
            aria-labelledby={'titulo-' + grupo.codigo}
            className="mt-12 scroll-mt-28"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-acento px-2 py-0.5 font-mono text-xs font-bold text-sobre-acento">
                {grupo.codigo}
              </span>
              <span className="text-xs text-texto-tenue">
                {grupo.paginas.length} {grupo.paginas.length === 1 ? 'página' : 'páginas'}
              </span>
            </div>
            <h2
              id={'titulo-' + grupo.codigo}
              className="mt-2 font-serif text-2xl font-semibold text-texto"
            >
              {grupo.titulo}
            </h2>
            <p className="mt-1.5 text-sm text-texto-suave">{grupo.descripcion}</p>
            {evidencia ? (
              <Link
                to={'/evidencias/' + grupo.codigo}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                Ver la ficha de {grupo.codigo}
                <Icono nombre="flecha-derecha" tamano={15} />
              </Link>
            ) : null}

            <div className="mt-5">
              <GaleriaAnexo
                paginas={grupo.paginas}
                contexto={grupo.codigo + ' · ' + grupo.titulo}
              />
            </div>
          </section>
        )
      })}

      {/* Lo que no se publica y por que */}
      <section aria-labelledby="exclusiones" className="mt-14 scroll-mt-28">
        <h2 id="exclusiones" className="font-serif text-2xl font-semibold text-texto">
          Páginas del expediente que no se publican
        </h2>
        <p className="mt-1.5 text-sm text-texto-suave">
          De las {anexo.totalPaginasExpediente} páginas del expediente, {excluidas} quedaron fuera.
          Se detallan aquí para que la selección sea verificable.
        </p>
        <ul className="mt-5 space-y-3">
          {anexo.exclusiones.map((e, i) => {
            const tono = TONO_EXCLUSION[e.categoria]
            return (
              <li key={i} className="tarjeta p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Insignia tono={tono.tono} icono={tono.icono}>
                    {tono.etiqueta}
                  </Insignia>
                  <span className="font-mono text-xs text-texto-tenue">
                    {e.paginas.length} {e.paginas.length === 1 ? 'página' : 'páginas'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-texto-suave">{e.motivo}</p>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-sm text-texto-suave">
          Las reglas que rigen esta selección están en la{' '}
          <Link to="/privacidad">página de privacidad</Link>.
        </p>
      </section>
    </div>
  )
}
